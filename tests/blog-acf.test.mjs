import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extname } from 'node:path';
import { articleContentFields } from '../src/lib/blog.mjs';

async function assertMinimumFontSize(page) {
  const violations = await page.locator('body *').evaluateAll(elements => elements.flatMap(element => {
    if (element.matches('script,style,noscript,template')) return [];
    const hasText = [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (!hasText && !element.matches('input:not([type=checkbox],[type=radio],[type=hidden]),textarea,select')) return [];
    const size = Number.parseFloat(getComputedStyle(element).fontSize);
    return size < 16 ? [{ tag: element.tagName, class: element.className, size }] : [];
  }));
  assert.deepEqual(violations, [], `${page.viewportSize().width}px ${new URL(page.url()).pathname} 字号至少为 16px`);
}

// 同时比较视口和容器内的取样，区分视差、固定背景与普通滚动。
async function assertBackgroundScroll(page) {
  const motion = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'enabled');
  const widget = page.locator('.fixed-background').first();
  const content = widget.locator('.fixed-background__content');
  await content.evaluate(element => { element.style.visibility = 'hidden'; });
  const top = await widget.evaluate(element => element.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top - 200);
  const settle = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await settle();
  const bounds = await widget.boundingBox();
  const offsetBefore = await widget.evaluate(element => Number.parseFloat(element.style.getPropertyValue('--background-offset')));
  const clip = { x: bounds.x + 8, y: 260, width: Math.min(120, bounds.width - 16), height: 60 };
  // 先截取视口再裁剪，避免 screenshot.clip 使用文档坐标而改变固定背景的取样位置。
  const sample = async (region = clip) => {
    const screenshot = await page.screenshot();
    return page.evaluate(async ({ data, clip }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = clip.width;
      canvas.height = clip.height;
      const scale = image.naturalWidth / innerWidth;
      canvas.getContext('2d').drawImage(image, clip.x * scale, clip.y * scale, clip.width * scale, clip.height * scale, 0, 0, clip.width, clip.height);
      return canvas.toDataURL();
    }, { data: screenshot.toString('base64'), clip: region });
  };
  const before = await sample();
  const containerBefore = await sample({ ...clip, y: bounds.y + 140 });
  if (process.env.BLOG_SCREENSHOT_DIR) {
    await content.evaluate(element => { element.style.removeProperty('visibility'); });
    await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, `parallax-${page.viewportSize().width}-${motion}-before.png`) });
    await content.evaluate(element => { element.style.visibility = 'hidden'; });
  }
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top - 100);
  await settle();
  const afterBounds = await widget.boundingBox();
  assert.ok(Math.abs(bounds.y - afterBounds.y - 100) < 1, '模块随页面滚动 100px');
  const offsetAfter = await widget.evaluate(element => Number.parseFloat(element.style.getPropertyValue('--background-offset')));
  assert.ok(Math.abs(offsetAfter - offsetBefore - 50) < 1, `${motion} 模式下背景相对容器仍产生 50px 视差位移`);
  const renderedOffset = await widget.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element, '::before').transform).m42);
  assert.ok(Math.abs(renderedOffset - offsetAfter) < 1, '实际背景位移与脚本计算一致，未被媒体查询关闭');
  const after = await sample();
  assert.ok(after !== before, '背景实际移动，不是固定在屏幕上');
  const containerAfter = await sample({ ...clip, y: afterBounds.y + 140 });
  assert.notEqual(containerAfter, containerBefore, `${page.viewportSize().width}px ${motion} 模式下容器内图片裁切随滚动改变`);
  const image = await widget.evaluate(element => {
    const value = element.style.getPropertyValue('--fixed-background-image');
    element.style.setProperty('--fixed-background-image', 'none');
    return value;
  });
  assert.ok(await sample() !== after, '截图中确实存在背景图片');
  await widget.evaluate((element, value) => element.style.setProperty('--fixed-background-image', value), image);
  await content.evaluate(element => { element.style.removeProperty('visibility'); });
  if (process.env.BLOG_SCREENSHOT_DIR) {
    await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, `parallax-${page.viewportSize().width}-${motion}-after.png`) });
  }
  for (const y of [top - page.viewportSize().height + 40, top + bounds.height - 40]) {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y);
    await settle();
    assert.equal(await widget.evaluate(element => {
      const style = getComputedStyle(element, '::before');
      const offset = style.transform === 'none' ? 0 : new DOMMatrixReadOnly(style.transform).m42;
      return parseFloat(style.top) + offset <= 1 && parseFloat(style.bottom) - offset <= 1;
    }), true, '进入和离开视口时背景仍覆盖整个模块');
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
}

test('ACF 模块构建为静态页面，旧文章回退正文并清理不安全内容', { timeout: 180_000 }, async t => {
  const type = name => `ArticleContentContentBlocks${name}Layout`;
  const widthCases = ['content', 'wide', 'full_width', ['wide'], ['full_width'], undefined, 'invalid'];
  const widthLayouts = ['RichText', 'Heading', 'MediaText', 'Callout', 'SpecTable', 'CallToAction'];
  const widthBlocks = widthLayouts.flatMap(layout => widthCases.map((width, index) => {
    const label = `Layout width: ${layout} ${index}`;
    return {
      __typename: type(layout), width, heading: label, text: label, level: index % 2 ? 'h2' : 'h3',
      content: layout === 'Callout' ? label : `<p>${label}</p><p>${'LongWord'.repeat(60)}</p>`,
      variant: index % 2 ? 'quote' : 'note', attribution: 'Width test author',
      image: { node: { sourceUrl: '/images/machined-parts/machined-block-main.webp', altText: label } },
      imagePosition: 'right', rows: [{ label: 'Material', value: 'Aluminum' }],
      description: 'Width test description', link: { url: '/contact/', title: 'Width test action' },
    };
  }));
  const posts = [
    { databaseId: 1, slug: 'acf-test', title: 'ACF article', content: '<p>Legacy content</p>', excerpt: 'Example', date: '2026-01-01T00:00:00Z', categories: { nodes: [] }, articleContent: { contentBlocks: [
      { __typename: type('RichText'), content: '<p>Rich content</p><script>bad()</script>' },
      { __typename: type('Heading'), text: 'Section heading', level: 'h3' },
      { __typename: type('Image'), image: { node: { sourceUrl: 'https://example.com/image.jpg', altText: 'Machined part' } }, caption: 'Image caption', width: 'wide' },
      { __typename: type('MediaText'), heading: 'Media heading', content: '<p>Media content</p>', image: { node: { sourceUrl: 'https://example.com/media.jpg', altText: 'Media image' } }, imagePosition: 'right' },
      { __typename: type('Callout'), variant: 'quote', content: 'A quotation', attribution: 'Author' },
      { __typename: type('SpecTable'), heading: 'Specifications', rows: [{ label: 'Material', value: 'Aluminum' }] },
      { __typename: type('CallToAction'), heading: 'Get a quote', description: 'Contact us', link: { title: 'Request quote', url: '/contact/', target: '_blank' } },
      { __typename: type('CallToAction'), heading: 'Unsafe', link: { title: 'Bad link', url: 'javascript:alert(1)' } },
      { __typename: type('FixedBackground'), heading: 'Fixed background link', description: 'Drawing review\nFor your next project', buttonType: ['link'], buttonLabel: 'Discuss a project', link: { title: 'Contact', url: '/contact/', target: '_blank' }, backgroundImage: { node: { sourceUrl: '/images/machined-parts/machined-block-main.webp' } }, minHeight: 560, width: ['wide'] },
      { __typename: type('FixedBackground'), heading: 'Fixed background document', buttonType: 'document', buttonLabel: 'Read the specification', document: { node: { mediaItemUrl: 'https://example.com/specification.pdf' } }, link: { url: '/must-not-use/' }, minHeight: 320, width: 'content' },
      { __typename: type('FixedBackground'), heading: 'Invalid widget data', buttonType: 'document', document: { node: { mediaItemUrl: 'javascript:alert(2)' } }, backgroundImage: { node: { sourceUrl: 'javascript:alert(3)' } }, minHeight: '480px; color:red', width: 'invalid' },
      { __typename: type('FixedBackground'), heading: 'Unsafe widget link', buttonType: 'link', buttonLabel: 'Unsafe widget button', link: { url: 'data:text/html,bad' }, minHeight: -20 },
      { __typename: type('FixedBackground'), heading: 'Long widget content', description: 'LongWord'.repeat(70), buttonType: 'document', document: { node: { mediaItemUrl: '/specification.pdf' } }, minHeight: 100, width: 'wide' },
      ...['full_width', ['full_width']].map(width => ({ __typename: type('FixedBackground'), heading: 'Full width background', backgroundImage: { node: { sourceUrl: '/images/machined-parts/machined-block-main.webp' } }, width })),
      ...['content', 'full_width', ['full_width'], 'invalid'].map(width => ({ __typename: type('Image'), image: { node: { sourceUrl: '/images/machined-parts/machined-block-main.webp', altText: 'Width test image' } }, caption: 'Width test caption', width })),
      ...widthBlocks,
    ] } },
    { databaseId: 2, slug: 'legacy-test', title: 'Legacy', content: '<p>Old article content</p>', excerpt: '', date: '2026-01-01T00:00:00Z', categories: { nodes: [] }, articleContent: null },
  ];
  const server = createServer((req, res) => {
    if (req.method !== 'POST') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
      }).end();
      return;
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { query } = JSON.parse(body);
      const data = query.includes('BlogStaticPosts')
        ? { posts: { nodes: posts, pageInfo: { hasNextPage: false, endCursor: null } } }
        : { posts: { nodes: posts }, categories: { nodes: [] } };
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ data }));
    });
  });
  const categorySlugs = ['dfm-engineering', 'cnc-machining'];
  posts.forEach((post, index) => { post.categories.nodes.push({ databaseId: index + 3, name: `Category ${index + 1}`, slug: categorySlugs[index] }); });
  posts[0].categories.nodes.unshift({ databaseId: 8, name: 'Z category', slug: 'z-category' });
  const output = await mkdtemp(join(tmpdir(), 'belaro-acf-test-'));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const child = spawn(process.execPath, ['node_modules/astro/astro.js', 'build', '--outDir', output], {
      cwd: process.cwd(), env: { ...process.env, PUBLIC_GRAPHQL_URL: `http://127.0.0.1:${server.address().port}/graphql` },
    });
    let log = '';
    child.stdout.on('data', chunk => { log += chunk; });
    child.stderr.on('data', chunk => { log += chunk; });
    const code = await new Promise((resolve, reject) => { child.on('error', reject); child.on('close', resolve); });
    assert.equal(code, 0, log);
    // 使用同一模拟构建检查全站，覆盖真实后台无文章或不可用时遗漏的页面。
    const typographyEnv = { ...process.env, TYPOGRAPHY_DIST: output };
    delete typographyEnv.NODE_TEST_CONTEXT;
    const typography = spawn(process.execPath, ['--test', 'tests/site-typography.test.mjs'], {
      cwd: process.cwd(), env: typographyEnv,
    });
    let typographyLog = '';
    typography.stdout.on('data', chunk => { typographyLog += chunk; });
    typography.stderr.on('data', chunk => { typographyLog += chunk; });
    const typographyCode = await new Promise((resolve, reject) => { typography.on('error', reject); typography.on('close', resolve); });
    assert.equal(typographyCode, 0, typographyLog);
    t.diagnostic(typographyLog);
    const html = await readFile(join(output, 'post/acf-test/index.html'), 'utf8');
    assert.match(html, /rel="canonical" href="https:\/\/belaroprecision.com\/post\/acf-test\/"/);
    assert.match(html, /href="\/category\/dfm-engineering\/"[^>]*>Category 1<\/a>/);
    for (const text of ['Rich content', 'Section heading', 'Machined part', 'Image caption', 'Media heading', 'Media content', 'A quotation', 'Author', 'Specifications', 'Material', 'Aluminum', 'Get a quote', 'Request quote']) assert.ok(html.includes(text), text);
    assert.match(html, /<h3[^>]*>Section heading<\/h3>/);
    assert.match(html, /href="\/contact\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
    assert.match(articleContentFields, /on ArticleContentContentBlocksFixedBackgroundLayout/);
    for (const layout of widthLayouts) {
      const fragment = articleContentFields.match(new RegExp(`on ${type(layout)} \\{([^\n]+)`));
      assert.ok(fragment && /\bwidth\b/.test(fragment[1]), `${layout} 的 GraphQL 查询包含 width`);
    }
    for (const field of ['buttonType', 'buttonLabel', 'document { node { mediaItemUrl } }', 'backgroundImage { node { sourceUrl altText } }', 'minHeight width']) assert.ok(articleContentFields.includes(field), field);
    assert.match(html, /href="https:\/\/example.com\/specification.pdf"/);
    assert.match(html, /class="fixed-background fixed-background--full-width"/);
    assert.match(html, /class="article-image article-image--full-width"/);
    assert.doesNotMatch(html, /Legacy content|bad\(\)|javascript:alert|Bad link|Unsafe widget button|must-not-use|480px; color:red/);
    const legacy = await readFile(join(output, 'post/legacy-test/index.html'), 'utf8');
    assert.ok(legacy.includes('Old article content'));
    const categoryHtml = await readFile(join(output, 'category/dfm-engineering/index.html'), 'utf8');
    assert.match(categoryHtml, /rel="canonical" href="https:\/\/belaroprecision.com\/category\/dfm-engineering\/"/);
    assert.match(categoryHtml, /ACF article/);
    assert.doesNotMatch(categoryHtml, />Legacy<\/a>/);
    const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8');
    assert.match(sitemap, /\/category\/dfm-engineering\//);
    assert.match(sitemap, /\/post\/acf-test\//);
    assert.doesNotMatch(sitemap, /\/blog\/article\//);
    let chromium;
    try { ({ chromium } = await import('playwright')); } catch {
      t.diagnostic('未安装 Playwright，跳过浏览器验证；静态 HTML 检查已执行。');
      return;
    }
    const staticServer = createServer(async (req, res) => {
      try {
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        const file = join(output, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
        const body = await readFile(file);
        res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.webp': 'image/webp' })[extname(file)] || 'application/octet-stream');
        res.end(body);
      } catch { res.writeHead(404).end(); }
    });
    await new Promise(resolve => staticServer.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      const baseUrl = `http://127.0.0.1:${staticServer.address().port}`;
      const errors = [];
      const graphqlRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      // 隔离外部客服等脚本，避免第三方界面影响本地模块布局验证。
      await page.route('**/*', route => {
        const { hostname } = new URL(route.request().url());
        return ['127.0.0.1', 'localhost'].includes(hostname) ? route.continue() : route.abort();
      });
      await page.route('**/graphql', route => {
        const { query } = JSON.parse(route.request().postData());
        graphqlRequests.push(query);
        const data = query.includes('BlogVotes')
          ? { post: { belaroCommentVotes: [] } }
          : { post: { ...posts[0], content: '<p>Runtime replacement</p>', comments: { nodes: [
            { databaseId: 21, content: '<p>Typography test comment.</p>', date: '2026-11-28T09:00:00Z', parentDatabaseId: 0, author: { node: { name: 'Reader' } } },
          ] } } };
        return route.fulfill({ json: { data } });
      });
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${baseUrl}/blog/`);
        const selected = page.locator('[data-category-filter][aria-current="page"]');
        const firstCategory = page.getByRole('link', { name: 'Category 1', exact: true });
        assert.equal(await firstCategory.getAttribute('href'), '/category/dfm-engineering/');
        await firstCategory.click();
        assert.equal(new URL(page.url()).pathname, '/category/dfm-engineering/');
        assert.equal(await selected.textContent(), 'Category 1');
        assert.equal(await page.locator('[data-blog-card]:visible h2').textContent(), 'ACF article');
        assert.equal(await page.locator('[data-blog-count]').textContent(), '1 article');
        await page.reload();
        await selected.filter({ hasText: 'Category 1' }).waitFor();
        await page.getByRole('link', { name: 'Category 2', exact: true }).click();
        assert.equal(await page.locator('[data-blog-card]:visible h2').textContent(), 'Legacy');
        await page.goBack();
        await selected.filter({ hasText: 'Category 1' }).waitFor();
        assert.equal(await page.locator('[data-blog-card]:visible h2').textContent(), 'ACF article');
        await page.goForward();
        await selected.filter({ hasText: 'Category 2' }).waitFor();
        await page.getByRole('link', { name: 'All articles', exact: true }).click();
        assert.equal(new URL(page.url()).pathname, '/blog/');
        assert.equal(await page.locator('[data-blog-card]:visible').count(), 2);
        await page.goto(`${baseUrl}/category/${categorySlugs[1]}/`);
        await selected.filter({ hasText: 'Category 2' }).waitFor();
        assert.equal(await page.locator('[data-blog-card]:visible h2').textContent(), 'Legacy');
        await page.goto(`${baseUrl}/blog/?category=${categorySlugs[0]}&utm_source=test`);
        await page.waitForURL(`**/category/${categorySlugs[0]}/?utm_source=test`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
      assert.deepEqual(graphqlRequests, [], '类目切换不请求 GraphQL');
      const noJs = await browser.newContext({ javaScriptEnabled: false });
      const noJsPage = await noJs.newPage();
      await noJsPage.goto(`${baseUrl}/category/dfm-engineering/`);
      assert.equal(await noJsPage.locator('[data-blog-card]:visible h2').textContent(), 'ACF article');
      assert.equal(await noJsPage.locator('[data-blog-filters]').isVisible(), true);
      await noJsPage.goto(`${baseUrl}/post/acf-test/`);
      assert.equal(await noJsPage.locator('.fixed-background').first().evaluate(element => getComputedStyle(element, '::before').transform), 'matrix(1, 0, 0, 1, 0, 0)');
      await noJs.close();
      for (const width of [320, 390, 768, 1440, 2560]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`http://127.0.0.1:${staticServer.address().port}/blog/`);
        await assertMinimumFontSize(page);
        const listBounds = await page.locator('.blog-grid').boundingBox();
        const listBreadcrumb = await page.locator('.blog-breadcrumb').boundingBox();
        const listEyebrow = await page.locator('.blog-eyebrow').boundingBox();
        const listTitle = await page.locator('.blog-heading h1').boundingBox();
        const listHeadingStyle = await page.locator('.blog-heading h1').evaluate(element => ({ fontSize: getComputedStyle(element).fontSize, lineHeight: getComputedStyle(element).lineHeight }));
        await page.goto(`http://127.0.0.1:${staticServer.address().port}/post/acf-test/`);
        await page.locator('[data-comments-section]:visible').waitFor();
        await page.locator('.comment').waitFor();
        await assertMinimumFontSize(page);
        assert.equal(await page.getByText('Rich content').count(), 1);
        assert.equal(await page.getByText('Runtime replacement').count(), 0);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        const articleBounds = await page.locator('.article-content').boundingBox();
        const layoutBlocks = page.locator('.article-block').filter({ hasText: 'Layout width:' });
        assert.equal(await layoutBlocks.count(), widthBlocks.length);
        for (let index = 0; index < widthBlocks.length; index++) {
          const block = layoutBlocks.nth(index);
          const data = widthBlocks[index];
          const value = Array.isArray(data.width) ? data.width[0] : data.width;
          const pageWidth = await page.evaluate(() => document.documentElement.clientWidth);
          const expectedWidth = value === 'full_width' ? pageWidth : value === 'wide' ? Math.min(1440, pageWidth - 48) : articleBounds.width;
          const bounds = await block.boundingBox();
          assert.ok(Math.abs(bounds.width - expectedWidth) < 1 && Math.abs(bounds.x - (pageWidth - expectedWidth) / 2) < 1, `${width}px ${data.__typename} ${JSON.stringify(data.width)} 宽度及居中正确`);
          assert.ok(await block.evaluate(element => element.scrollWidth <= element.clientWidth + 1), '模块内容不溢出');
          if (data.__typename === type('Heading')) assert.equal(await block.evaluate(element => element.tagName.toLowerCase()), data.level, '保留标题语义');
          if (data.__typename === type('MediaText')) {
            const image = block.locator('img');
            await image.evaluate(element => element.decode());
            const imageBounds = await image.boundingBox();
            const textBounds = await block.locator('div').first().boundingBox();
            if (width <= 620) assert.ok(imageBounds.y + imageBounds.height <= textBounds.y + 1, '移动端图文单列且图片在前');
            else assert.ok(textBounds.x + textBounds.width <= imageBounds.x + 1, '桌面端保留右图排列');
          }
        }
        if (process.env.BLOG_SCREENSHOT_DIR) {
          for (const layout of widthLayouts) {
            await layoutBlocks.filter({ hasText: `Layout width: ${layout} 2` }).scrollIntoViewIfNeeded();
            await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, `layout-${layout}-${width}.png`) });
          }
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        }
        const widgets = page.locator('.fixed-background');
        assert.equal(await widgets.count(), 7);
        const wideBounds = await widgets.nth(0).boundingBox();
        const contentBounds = await widgets.nth(1).boundingBox();
        assert.equal(wideBounds.height, 560);
        assert.equal(contentBounds.height, 320);
        assert.ok(Math.abs(contentBounds.width - articleBounds.width) < 1, `${width}px 正文宽度`);
        assert.ok(wideBounds.width >= contentBounds.width, `${width}px 宽幅不窄于正文`);
        if (width > 1208) assert.ok(wideBounds.width > contentBounds.width, `${width}px 宽幅超出正文`);
        const pageWidth = await page.evaluate(() => document.documentElement.clientWidth);
        for (const fullWidth of [widgets.nth(5), widgets.nth(6), ...await page.locator('.article-image--full-width').all()]) {
          const bounds = await fullWidth.boundingBox();
          assert.ok(Math.abs(bounds.x) < 1 && Math.abs(bounds.width - pageWidth) < 1, `${width}px 全宽模块左右贴合页面，无横向溢出`);
          assert.equal(await fullWidth.evaluate(element => element.scrollWidth <= element.clientWidth), true);
          if (process.env.BLOG_SCREENSHOT_DIR) {
            await fullWidth.scrollIntoViewIfNeeded();
            await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, `full-width-${width}-${await fullWidth.evaluate(element => element.tagName)}.png`) });
          }
        }
        const images = page.locator('.article-image').filter({ hasText: 'Width test caption' });
        for (const index of [0, 3]) {
          const bounds = await images.nth(index).boundingBox();
          assert.ok(Math.abs(bounds.x - articleBounds.x) < 1 && Math.abs(bounds.width - articleBounds.width) < 1, '正文及无效宽度仍使用正文布局');
        }
        for (const image of await images.locator('img').all()) {
          await image.evaluate(element => element.decode());
          assert.ok(await image.evaluate(element => Math.abs(element.clientWidth / element.clientHeight - element.naturalWidth / element.naturalHeight) < 0.02), '图片保持原始宽高比');
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        assert.equal(await widgets.nth(2).evaluate(element => getComputedStyle(element).minHeight), '480px');
        assert.equal(await widgets.nth(2).evaluate(element => getComputedStyle(element, '::before').backgroundImage), 'none');
        assert.equal(await widgets.nth(3).locator('a').count(), 0);
        assert.equal((await widgets.nth(4).locator('a').textContent()).trim(), 'Download document');
        assert.equal(await widgets.nth(0).locator('h2').evaluate(element => getComputedStyle(element).color), 'rgb(255, 255, 255)');
        assert.equal(await widgets.nth(0).locator('a').evaluate(element => getComputedStyle(element).color), 'rgb(255, 255, 255)');
        assert.equal(await widgets.nth(0).evaluate(element => getComputedStyle(element, '::before').position), 'absolute');
        const imageLoaded = await widgets.nth(0).evaluate(async element => {
          const url = getComputedStyle(element, '::before').backgroundImage.slice(5, -2);
          const image = new Image();
          image.src = url;
          await image.decode();
          return image.naturalWidth > 0;
        });
        assert.equal(imageLoaded, true, '背景图成功解码');
        const longBounds = await widgets.nth(4).boundingBox();
        assert.ok(longBounds.height >= 100);
        assert.equal(await widgets.nth(4).evaluate(element => element.scrollWidth <= element.clientWidth), true, '长内容不溢出');
        assert.ok(Math.abs(articleBounds.x - listBounds.x) < 1, `${width}px 左侧对齐`);
        assert.ok(Math.abs(articleBounds.width - listBounds.width) < 1, `${width}px 内容宽度一致`);
        const articleBreadcrumb = await page.locator('.blog-breadcrumb').boundingBox();
        const articleTitle = await page.locator('.blog-heading h1').boundingBox();
        assert.ok(Math.abs(articleBreadcrumb.x - listBreadcrumb.x) < 1 && Math.abs(articleBreadcrumb.y - listBreadcrumb.y) < 1, `${width}px 面包屑位置一致`);
        // 面包屑与栏目名可自然换行；标题对齐且与前文保持相同间距，不固定绝对高度。
        const articleEyebrow = await page.locator('.blog-eyebrow').boundingBox();
        assert.ok(articleEyebrow.y >= articleBreadcrumb.y + articleBreadcrumb.height && listEyebrow.y >= listBreadcrumb.y + listBreadcrumb.height, `${width}px 面包屑与栏目名无重叠`);
        const articleTitleGap = articleTitle.y - articleEyebrow.y - articleEyebrow.height;
        const listTitleGap = listTitle.y - listEyebrow.y - listEyebrow.height;
        assert.ok(articleTitleGap >= 0 && listTitleGap >= 0 && Math.abs(articleTitle.x - listTitle.x) < 1 && Math.abs(articleTitleGap - listTitleGap) < 1, `${width}px 标题左侧及栏目名后间距一致`);
        assert.deepEqual(await page.locator('.blog-heading h1').evaluate(element => ({ fontSize: getComputedStyle(element).fontSize, lineHeight: getComputedStyle(element).lineHeight })), listHeadingStyle);
        await assertBackgroundScroll(page);
        if (process.env.BLOG_SCREENSHOT_DIR) await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, `article-width-${width}.png`), fullPage: true });
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('.fixed-background').first().evaluate(element => getComputedStyle(element, '::before').position), 'absolute');
      await assertBackgroundScroll(page);
      await page.reload();
      await assertBackgroundScroll(page);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await assertBackgroundScroll(page);
      const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
      const touchPage = await touch.newPage();
      await touchPage.goto(`${baseUrl}/post/acf-test/`);
      assert.equal(await touchPage.locator('.fixed-background').first().evaluate(element => getComputedStyle(element, '::before').position), 'absolute');
      await touchPage.locator('.fixed-background').first().evaluate(async element => {
        const image = new Image();
        image.src = getComputedStyle(element, '::before').backgroundImage.slice(5, -2);
        await image.decode();
      });
      await assertBackgroundScroll(touchPage);
      assert.equal(await touchPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await touch.close();
      assert.deepEqual(errors, []);
    } finally {
      await browser?.close();
      staticServer.close();
    }
  } finally {
    server.close();
    await rm(output, { recursive: true, force: true });
  }
});

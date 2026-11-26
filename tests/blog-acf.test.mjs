import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extname } from 'node:path';
import { articleContentFields } from '../src/lib/blog.mjs';

test('ACF 模块构建为静态页面，旧文章回退正文并清理不安全内容', { timeout: 180_000 }, async t => {
  const type = name => `ArticleContentContentBlocks${name}Layout`;
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
    const html = await readFile(join(output, 'post/acf-test/index.html'), 'utf8');
    assert.match(html, /rel="canonical" href="https:\/\/belaroprecision.com\/post\/acf-test\/"/);
    assert.match(html, /href="\/category\/dfm-engineering\/"[^>]*>Category 1<\/a>/);
    for (const text of ['Rich content', 'Section heading', 'Machined part', 'Image caption', 'Media heading', 'Media content', 'A quotation', 'Author', 'Specifications', 'Material', 'Aluminum', 'Get a quote', 'Request quote']) assert.ok(html.includes(text), text);
    assert.match(html, /<h3[^>]*>Section heading<\/h3>/);
    assert.match(html, /href="\/contact\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
    assert.match(articleContentFields, /on ArticleContentContentBlocksFixedBackgroundLayout/);
    for (const field of ['buttonType', 'buttonLabel', 'document { node { mediaItemUrl } }', 'backgroundImage { node { sourceUrl altText } }', 'minHeight width']) assert.ok(articleContentFields.includes(field), field);
    assert.match(html, /href="https:\/\/example.com\/specification.pdf"/);
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
          : { post: { ...posts[0], content: '<p>Runtime replacement</p>', comments: { nodes: [] } } };
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
      await noJs.close();
      for (const width of [320, 390, 768, 1440, 2560]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`http://127.0.0.1:${staticServer.address().port}/blog/`);
        const listBounds = await page.locator('.blog-grid').boundingBox();
        const listBreadcrumb = await page.locator('.blog-breadcrumb').boundingBox();
        const listTitle = await page.locator('.blog-heading h1').boundingBox();
        const listHeadingStyle = await page.locator('.blog-heading h1').evaluate(element => ({ fontSize: getComputedStyle(element).fontSize, lineHeight: getComputedStyle(element).lineHeight }));
        await page.goto(`http://127.0.0.1:${staticServer.address().port}/post/acf-test/`);
        await page.locator('[data-comments-section]:visible').waitFor();
        assert.equal(await page.getByText('Rich content').count(), 1);
        assert.equal(await page.getByText('Runtime replacement').count(), 0);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        const articleBounds = await page.locator('.article-content').boundingBox();
        const widgets = page.locator('.fixed-background');
        assert.equal(await widgets.count(), 5);
        const wideBounds = await widgets.nth(0).boundingBox();
        const contentBounds = await widgets.nth(1).boundingBox();
        assert.equal(wideBounds.height, 560);
        assert.equal(contentBounds.height, 320);
        assert.ok(Math.abs(contentBounds.width - articleBounds.width) < 1, `${width}px 正文宽度`);
        assert.ok(wideBounds.width >= contentBounds.width, `${width}px 宽幅不窄于正文`);
        if (width > 1208) assert.ok(wideBounds.width > contentBounds.width, `${width}px 宽幅超出正文`);
        assert.equal(await widgets.nth(2).evaluate(element => getComputedStyle(element).minHeight), '480px');
        assert.equal(await widgets.nth(2).evaluate(element => getComputedStyle(element).backgroundImage), 'none');
        assert.equal(await widgets.nth(3).locator('a').count(), 0);
        assert.equal((await widgets.nth(4).locator('a').textContent()).trim(), 'Download document');
        assert.equal(await widgets.nth(0).locator('h2').evaluate(element => getComputedStyle(element).color), 'rgb(255, 255, 255)');
        assert.equal(await widgets.nth(0).locator('a').evaluate(element => getComputedStyle(element).color), 'rgb(255, 255, 255)');
        assert.equal(await widgets.nth(0).evaluate(element => getComputedStyle(element).backgroundAttachment), 'fixed');
        const imageLoaded = await widgets.nth(0).evaluate(async element => {
          const url = getComputedStyle(element).backgroundImage.slice(5, -2);
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
        assert.ok(Math.abs(articleTitle.x - listTitle.x) < 1 && Math.abs(articleTitle.y - listTitle.y) < 1, `${width}px 标题位置一致`);
        assert.deepEqual(await page.locator('.blog-heading h1').evaluate(element => ({ fontSize: getComputedStyle(element).fontSize, lineHeight: getComputedStyle(element).lineHeight })), listHeadingStyle);
        if (process.env.BLOG_SCREENSHOT_DIR) await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, `article-width-${width}.png`), fullPage: true });
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('.fixed-background').first().evaluate(element => getComputedStyle(element).backgroundAttachment), 'scroll');
      const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      const touchPage = await touch.newPage();
      await touchPage.goto(`${baseUrl}/post/acf-test/`);
      assert.equal(await touchPage.locator('.fixed-background').first().evaluate(element => getComputedStyle(element).backgroundAttachment), 'scroll');
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

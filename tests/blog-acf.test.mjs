import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extname } from 'node:path';

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
    ] } },
    { databaseId: 2, slug: 'legacy-test', title: 'Legacy', content: '<p>Old article content</p>', excerpt: '', date: '2026-01-01T00:00:00Z', categories: { nodes: [] }, articleContent: null },
  ];
  const server = createServer((req, res) => {
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
    for (const text of ['Rich content', 'Section heading', 'Machined part', 'Image caption', 'Media heading', 'Media content', 'A quotation', 'Author', 'Specifications', 'Material', 'Aluminum', 'Get a quote', 'Request quote']) assert.ok(html.includes(text), text);
    assert.match(html, /<h3[^>]*>Section heading<\/h3>/);
    assert.match(html, /href="\/contact\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
    assert.doesNotMatch(html, /Legacy content|bad\(\)|javascript:alert|Bad link/);
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
        res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html' })[extname(file)] || 'application/octet-stream');
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
      for (const width of [390, 768, 1440, 2560]) {
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
        assert.ok(Math.abs(articleBounds.x - listBounds.x) < 1, `${width}px 左侧对齐`);
        assert.ok(Math.abs(articleBounds.width - listBounds.width) < 1, `${width}px 内容宽度一致`);
        const articleBreadcrumb = await page.locator('.blog-breadcrumb').boundingBox();
        const articleTitle = await page.locator('.blog-heading h1').boundingBox();
        assert.ok(Math.abs(articleBreadcrumb.x - listBreadcrumb.x) < 1 && Math.abs(articleBreadcrumb.y - listBreadcrumb.y) < 1, `${width}px 面包屑位置一致`);
        assert.ok(Math.abs(articleTitle.x - listTitle.x) < 1 && Math.abs(articleTitle.y - listTitle.y) < 1, `${width}px 标题位置一致`);
        assert.deepEqual(await page.locator('.blog-heading h1').evaluate(element => ({ fontSize: getComputedStyle(element).fontSize, lineHeight: getComputedStyle(element).lineHeight })), listHeadingStyle);
        if (process.env.BLOG_SCREENSHOT_DIR) await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, `article-width-${width}.png`), fullPage: true });
      }
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

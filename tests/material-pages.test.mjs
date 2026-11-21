import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const materials = [
  ['brass', 'Brass', /leaded free-cutting brass/, /Plating, Appearance/],
  ['carbon-alloy-steel', 'Carbon & Alloy Steel', /1018/, /Plan Machining Around Heat Treatment/],
  ['titanium', 'Titanium', /Grade 5/, /does not claim aerospace certification/],
  ['engineering-plastics', 'Engineering Plastics', /POM/, /Dimensional Stability & Functional Tolerances/],
];

test('四种材料独立页面：差异内容、SEO、菜单、响应式、FAQ 与 RFQ', async () => {
  const server = createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      const file = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
      const body = await readFile(new URL(`../dist${file}`, import.meta.url));
      const types = { html: 'text/html', css: 'text/css', js: 'text/javascript', webp: 'image/webp' };
      res.setHeader('Content-Type', types[file.split('.').pop()] ?? 'application/octet-stream');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const screenshots = await mkdtemp(join(tmpdir(), 'belaro-materials-'));
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    for (const [slug, name, grade, difference] of materials) {
      const path = `/materials/${slug}-cnc-machining/`;
      await page.goto(`${base}${path}`);
      assert.ok((await page.title()).includes(`${name} CNC Machining`));
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok((await page.locator('h1').innerText()).includes(name));
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://belaroprecision.com${path}`);
      assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 80);
      assert.match(await page.locator('main').innerText(), grade);
      assert.match(await page.locator('main').innerText(), difference);
      assert.equal(await page.locator('main h2').count(), 8);
      assert.equal(await page.locator('#rfq-form').count(), 1);
      assert.equal(await page.locator('#drawing-file').getAttribute('type'), 'file');
      assert.ok((await readFile('dist/sitemap.xml', 'utf8')).includes(path));
      const links = await page.locator('main a').evaluateAll(nodes => [...new Set(nodes.map(node => node.href))]);
      for (const href of links) {
        assert.equal((await page.request.get(href)).status(), 200, href);
        await page.goto(href);
        const hash = new URL(href).hash;
        if (hash) assert.equal(await page.locator(hash).count(), 1, href);
      }
      for (const width of [320, 390, 700, 701, 1024, 1100, 1101, 1280, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${base}${path}`);
        await page.locator('main img').evaluateAll(nodes => Promise.all(nodes.map(node => { node.loading = 'eager'; return node.decode(); })));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${slug} ${width}px 横向溢出`);
        if (width > 1100) {
          await page.locator('.nav-material-trigger').focus();
          const menu = page.locator('.materials-dropdown .nav-dropdown-menu');
          assert.equal(await menu.isVisible(), true);
          assert.equal(await menu.locator('a').count(), 6);
          const box = await menu.boundingBox();
          assert.ok(box.x >= 0 && box.x + box.width <= width, '菜单不应超出视窗');
          await menu.locator(`a[href="${path}"]`).click();
        } else {
          await page.locator('[data-menu-toggle]').click();
          await page.locator('.mobile-material-toggle').click();
          assert.equal(await page.locator('.mobile-material-group a').count(), 6);
          await page.locator(`.mobile-material-group a[href="${path}"]`).click();
          assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'false');
          await page.locator('[data-menu-toggle]').click();
          assert.equal(await page.locator('.mobile-material-group').evaluate(el => el.open), false);
          await page.keyboard.press('Escape');
        }
        await page.locator('.material-hero .button').click();
        assert.equal(new URL(page.url()).hash, '#rfq-form');
        assert.ok(await page.locator('#rfq-form').evaluate(el => el.getBoundingClientRect().top) >= await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().bottom));
        await page.locator('.faq-list summary').first().focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.faq-list details').first().getAttribute('open'), '');
        if ([390, 1440].includes(width)) {
          await page.goto(`${base}${path}`);
          await page.locator('main img').evaluateAll(nodes => Promise.all(nodes.map(node => { node.loading = 'eager'; return node.decode(); })));
          await page.screenshot({ path: join(screenshots, `${slug}-${width}.png`), fullPage: true });
        }
      }
      const staticPage = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
      await staticPage.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
      await staticPage.goto(`${base}${path}`);
      await staticPage.locator('.faq-list summary').first().click();
      assert.equal(await staticPage.locator('.faq-list details').first().getAttribute('open'), '');
      assert.equal(await staticPage.locator('#rfq-form noscript').isVisible(), true);
      await staticPage.close();
    }
    assert.deepEqual(errors, []);
    console.log(`材料页面截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

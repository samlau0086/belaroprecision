import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('政策页面：SEO、互链、表单披露、全站页脚与响应式', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const file = path.endsWith('/') ? `${path}index.html` : path;
      const body = await readFile(new URL(`../dist${file}`, import.meta.url));
      res.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/html');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-legal-'));
    const routes = ['/privacy-policy/', '/cookie-policy/', '/terms-of-use/'];
    for (const path of routes) {
      await page.goto(`${base}${path}`);
      assert.equal(await page.locator('h1').count(), 1);
      const heading = await page.locator('h1').innerText();
      assert.ok((await page.title()).includes(heading));
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://belaroprecision.com${path}`);
      assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 50);
      assert.equal(await page.locator('aside nav a[aria-current="page"]').count(), 1);
      assert.equal(await page.locator('time').getAttribute('datetime'), '2026-11-05');
      for (const width of [320, 390, 700, 701, 900, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${path} ${width}px 溢出`);
        if ([390, 1440].includes(width)) await page.screenshot({ path: join(screenshots, `${path.split('/')[1]}-${width}.png`), fullPage: true });
      }
      const links = await page.locator('main a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.href))]);
      for (const href of links) assert.equal((await page.request.get(href)).status(), 200, href);
    }
    for (const path of ['/', '/services/', '/services/cnc-milling/', '/services/cnc-turning/', '/services/production/', '/services/secondary-processes/', '/machined-parts/', '/industries/', '/quality/', '/about/', '/contact/', ...routes]) {
      await page.goto(`${base}${path}`);
      for (const policy of routes) assert.equal(await page.locator(`footer nav a[href="${policy}"]`).count(), 1, `${path} → ${policy}`);
    }
    await page.goto(`${base}/contact/`);
    assert.equal(await page.locator('[name="consent"]').isChecked(), false);
    assert.equal(await page.locator('[name="consent"]').getAttribute('required'), '');
    assert.equal(await page.locator('#enquiry-privacy a[href="/privacy-policy/"]').count(), 1);
    assert.equal(await page.locator('#enquiry-privacy a[href="/terms-of-use/"]').count(), 1);
    assert.match(await page.locator('#enquiry-privacy').innerText(), /does not subscribe/);
    await page.setViewportSize({ width: 320, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await noJs.newPage();
    await staticPage.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await staticPage.goto(`${base}/privacy-policy/`);
    assert.equal(await staticPage.locator('article h2').count(), 9);
    assert.equal(await staticPage.locator('footer a[href="/cookie-policy/"]').count(), 1);
    await noJs.close();
    assert.deepEqual(errors, []);
    console.log(`政策页面截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

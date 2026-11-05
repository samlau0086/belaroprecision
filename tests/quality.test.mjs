import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

test('Quality 七项主题、能力边界、锚点和响应式布局', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const body = await readFile(new URL(`../dist${path.endsWith('/') ? `${path}index.html` : path}`, import.meta.url));
      res.setHeader('Content-Type', path.endsWith('.css') ? 'text/css' : path.endsWith('.js') ? 'text/javascript' : 'text/html');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await page.goto(`${baseUrl}/quality/`);
    assert.equal(await page.locator('h1').count(), 1);
    const ids = ['requirements', 'feasibility', 'inspection', 'documents', 'inspection-plan', 'deviations', 'packing'];
    assert.deepEqual(await page.locator('main section[id]').evaluateAll(nodes => nodes.map(node => node.id)), ids);
    for (const id of ids) {
      assert.equal(await page.locator(`.quality-nav a[href="#${id}"]`).count(), 1);
      assert.equal(await page.locator(`#${id} h3`).count(), 3);
    }
    assert.match(await page.locator('#inspection').innerText(), /not equipment Belaro claims to own/);
    assert.match(await page.locator('#documents').innerText(), /not automatic inclusions/);
    assert.match(await page.locator('#inspection-plan').innerText(), /does not mean every drawing characteristic/);
    assert.match(await page.locator('#deviations').innerText(), /written approval/);
    assert.match(await page.locator('#packing').innerText(), /lot \/ batch/);
    assert.doesNotMatch(await page.locator('main').innerText(), /±0\.01/);
    assert.equal(await page.locator('main a[href="/contact/#rfq-form"]').count(), 2);
    assert.equal(await page.locator('.breadcrumbs [aria-current="page"]').innerText(), 'Quality');
    assert.match(await page.title(), /Quality & Inspection/);
    assert.match(await page.locator('link[rel="canonical"]').getAttribute('href'), /\/quality\/$/);
    for (const width of [320, 390, 600, 700, 900, 901, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 横向溢出`);
    }
    await page.locator('.quality-nav a[href="#packing"]').click();
    assert.match(page.url(), /#packing$/);
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

test('首页九个模块：内容顺序、能力边界、链接、FAQ 与响应式布局', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const body = await readFile(new URL(`../dist${path === '/' ? '/index.html' : path}`, import.meta.url));
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
    await page.goto(baseUrl);

    assert.deepEqual(await page.locator('main > [data-home-module]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-home-module'))), [
      'hero',
      'procurement-fit',
      'core-services',
      'representative-parts',
      'capability-overview',
      'quality-inspection',
      'target-applications',
      'production-flow',
      'faq-rfq',
    ]);
    assert.equal(await page.locator('h1').count(), 1);
    assert.deepEqual(await page.locator('#core-services .cap-card h3').allTextContents(), [
      '3-axis and simultaneous 5-axis machining',
      'Rotational parts and turned features',
    ]);
    assert.deepEqual(await page.locator('#representative-parts .parts-preview-card h3').allTextContents(), [
      'Mounting Brackets ↗',
      'Machined Blocks ↗',
      'Precision Shafts ↗',
      'Bushings & Sleeves ↗',
    ]);
    assert.equal(await page.locator('#representative-parts').getByText('CONCEPT ILLUSTRATION', { exact: true }).count(), 4);
    assert.equal(await page.locator('#capability-overview a[href="/services/secondary-processes/"]').count(), 1);
    assert.equal(await page.locator('#target-applications a[href="/industries/#automation"]').count(), 1);
    assert.equal(await page.locator('#target-applications a[href="/industries/#machinery"]').count(), 1);
    assert.equal(await page.locator('#faq-rfq details').count(), 4);
    assert.equal(await page.locator('#faq-rfq a[href="/contact/"]').count(), 1);

    const capabilityText = await page.locator('#capability-overview').innerText();
    assert.match(capabilityText, /3-axis CNC milling/);
    assert.match(capabilityText, /simultaneous 5-axis CNC milling/);
    assert.match(capabilityText, /Dongguan and Shenzhen/);
    assert.doesNotMatch(capabilityText, /±0\.01|20–500/);
    assert.doesNotMatch(await page.locator('.hero-proof').innerText(), /±0\.01|20–500/);

    for (const width of [320, 390, 700, 701, 900, 901, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 不应横向溢出`);
      if (process.env.HOMEPAGE_SCREENSHOT_DIR && [390, 1440].includes(width)) {
        await page.screenshot({ path: `${process.env.HOMEPAGE_SCREENSHOT_DIR}/homepage-${width}.png`, fullPage: true });
      }
    }
    assert.deepEqual(errors, []);

    const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await noScript.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await noScript.goto(baseUrl);
    assert.equal(await noScript.locator('#faq-rfq summary').count(), 4);
    assert.match(await noScript.locator('#faq-rfq').textContent(), /3D CAD file/);
    assert.equal(await noScript.locator('#faq-rfq a[href="/contact/"]').isVisible(), true);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

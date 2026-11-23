import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

test('首页九个模块：内容顺序、能力边界、链接、FAQ 与响应式布局', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const filePath = path === '/' ? '/index.html' : path;
      const body = await readFile(new URL(`../dist${filePath}`, import.meta.url));
      const types = { css: 'text/css', js: 'text/javascript', webp: 'image/webp', html: 'text/html' };
      res.setHeader('Content-Type', types[filePath.split('.').pop()] ?? 'application/octet-stream');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = process.env.HOMEPAGE_BASE_URL ?? `http://127.0.0.1:${server.address().port}`;
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
    assert.deepEqual(await page.locator('.hero-proof strong').allTextContents(), [
      'Fast Response & Lead Times',
      'Broad Material Capabilities',
      'Complex CNC Machining',
      'Flexible Low-Volume Production',
      'Precision Inspection & Quality Assurance',
    ]);
    assert.equal(await page.locator('.hero-proof small').count(), 5);
    assert.deepEqual(await page.locator('#core-services .cap-card h3').allTextContents(), [
      '3-axis, 3+2 and simultaneous 5-axis machining',
      'Rotational parts and turned features',
    ]);
    assert.deepEqual(await page.locator('#representative-parts .parts-preview-card h3').allTextContents(), [
      'Mounting Brackets ↗',
      'Machined Blocks ↗',
      'Precision Shafts ↗',
      'Bushings & Sleeves ↗',
    ]);
    assert.equal(await page.locator('#representative-parts .parts-preview-card img').count(), 4);
    assert.equal(await page.locator('#representative-parts').getByText('REPRESENTATIVE PART', { exact: true }).count(), 4);
    assert.equal(await page.locator('#capability-overview a[href="/services/secondary-processes/"]').count(), 1);
    assert.equal(await page.locator('#target-applications a[href="/industries/#automation"]').count(), 1);
    assert.equal(await page.locator('#target-applications a[href="/industries/#machinery"]').count(), 1);
    assert.equal(await page.locator('#faq-rfq details').count(), 4);
    assert.equal(await page.locator('#faq-rfq a[href="/contact/"]').count(), 1);

    const imageMapping = [
      ['#procurement-fit', 'home-drawing-led-component-review'],
      ['#quality-inspection', 'quality-critical-dimension-check'],
      ['#target-applications article:first-child', 'industry-automation-fixture'],
      ['#target-applications article:last-child', 'industry-machinery-shaft-assembly'],
      ['#production-flow', 'quality-protective-packaging'],
    ];
    for (const [selector, filename] of imageMapping) {
      const img = page.locator(`${selector} img`);
      assert.equal(await img.count(), 1);
      assert.ok((await img.getAttribute('src')).includes(filename), filename);
      assert.ok(await img.getAttribute('srcset'), filename);
      assert.ok(await img.getAttribute('sizes'), filename);
      assert.ok((await img.getAttribute('alt')).length > 20, filename);
      assert.equal(await img.getAttribute('loading'), 'lazy');
    }
    assert.equal(await page.locator('main img').count(), 19);
    assert.equal(await page.locator('#capability-overview img').count(), 4, '已交付的能力图应在概览中复用');

    const capabilityText = await page.locator('#capability-overview').innerText();
    assert.match(capabilityText, /3-axis CNC milling/);
    assert.match(capabilityText, /simultaneous 5-axis CNC milling/);
    assert.match(capabilityText, /Dongguan and Shenzhen/);
    assert.doesNotMatch(capabilityText, /±0\.01|20–500/);
    assert.doesNotMatch(await page.locator('.hero-proof').innerText(), /±0\.01|20–500/);

    // 模拟图片组件未转发页面作用域属性，容器样式仍须保持图片比例。
    for (const [selector] of imageMapping) {
      await page.locator(`${selector} img`).evaluate(img => {
        for (const name of img.getAttributeNames()) {
          if (name.startsWith('data-astro-cid-')) img.removeAttribute(name);
        }
      });
    }
    for (const width of [320, 390, 700, 701, 900, 901, 1024, 1100, 1440, 1920, 2558]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator('main img').evaluateAll(nodes => Promise.all(nodes.map(node => { node.loading = 'eager'; return node.decode(); })));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 不应横向溢出`);
      assert.equal(await page.locator('.hero-proof > div').evaluateAll(nodes => nodes.some(node => node.scrollWidth > node.clientWidth)), false, `${width}px 优势文案不应溢出`);
      for (const [selector] of imageMapping) {
        const fits = await page.locator(`${selector} img`).evaluate(img => {
          const rect = img.getBoundingClientRect();
          const parent = img.parentElement.getBoundingClientRect();
          return rect.width > 0 && rect.left >= parent.left - 1 && rect.right <= parent.right + 1 && Math.abs(rect.width / rect.height - img.naturalWidth / img.naturalHeight) < 0.01;
        });
        assert.ok(fits, `${width}px ${selector} 图片应完整等比显示且不超出容器`);
        assert.equal(await page.locator(`${selector} img`).evaluate(img => getComputedStyle(img).objectFit), 'contain');
      }
      assert.ok(await page.locator('.delivery-image').evaluate(node => node.getBoundingClientRect().width <= 640), '包装图不应超过 640px');
      if (process.env.HOMEPAGE_SCREENSHOT_DIR && [390, 1440].includes(width)) {
        for (const img of await page.locator('main img').all()) {
          if (!(await img.isVisible())) continue;
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(node => node.decode());
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await page.screenshot({ path: `${process.env.HOMEPAGE_SCREENSHOT_DIR}/homepage-${width}.png`, fullPage: true });
        for (const selector of ['procurement-fit', 'quality-inspection', 'target-applications', 'production-flow']) {
          await page.locator(`#${selector}`).screenshot({ path: `${process.env.HOMEPAGE_SCREENSHOT_DIR}/${selector}-${width}.png` });
        }
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

import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('Quality 七项主题、能力边界、锚点和响应式布局', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const body = await readFile(new URL(`../dist${path.endsWith('/') ? `${path}index.html` : path}`, import.meta.url));
      res.setHeader('Content-Type', path.endsWith('.css') ? 'text/css' : path.endsWith('.js') ? 'text/javascript' : path.endsWith('.webp') ? 'image/webp' : 'text/html');
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
    assert.equal(await page.locator('.media-gallery img').count(), 5);
    assert.equal(await page.locator('main img').count(), 10);
    const newImages = {
      feasibility: 'quality-bore-measurement-access',
      'inspection-plan': 'quality-inspection-coverage-selection',
      deviations: 'quality-held-parts-separate-review-tray',
    };
    for (const [id, name] of Object.entries(newImages)) {
      const image = page.locator(`#${id} .quality-topic-media img`);
      assert.equal(await image.count(), 1);
      assert.match(await image.getAttribute('src'), new RegExp(name));
      assert.equal(await image.getAttribute('loading'), 'lazy');
      assert.ok((await image.getAttribute('alt')).length > 20);
      assert.ok(await image.getAttribute('srcset'));
    }
    assert.equal(await page.locator('#documents .document-preview').count(), 1);
    assert.match(await page.locator('#packing').innerText(), /single thick EPE foam sheet/);
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(node => node.complete && node.naturalWidth > 0, await image.elementHandle());
      await image.evaluate(node => node.decode());
      assert.ok(await image.evaluate(node => node.naturalWidth > 0));
    }
    const report = await page.locator('.document-preview img').evaluate(node => ({ rendered: node.clientWidth / node.clientHeight, natural: node.naturalWidth / node.naturalHeight }));
    assert.ok(Math.abs(report.rendered - report.natural) < 0.01, '报告应保持完整原比例');
    const reportLink = await page.locator('.document-preview').getAttribute('href');
    assert.equal((await page.request.get(`${baseUrl}${reportLink}`)).status(), 200);
    assert.doesNotMatch(await page.locator('main').innerText(), /±0\.01/);
    assert.equal(await page.locator('main a[href="#rfq-form"]').count(), 2);
    assert.equal(await page.locator('nav[aria-label="Breadcrumb"]').count(), 0);
    assert.match(await page.title(), /Quality & Inspection/);
    assert.match(await page.locator('link[rel="canonical"]').getAttribute('href'), /\/quality\/$/);
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-quality-'));
    for (const width of [320, 390, 600, 700, 900, 901, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 横向溢出`);
      for (const image of await page.locator('.quality-topic-media img').all()) {
        const geometry = await image.evaluate(node => {
          const bounds = node.getBoundingClientRect();
          const heading = node.closest('.quality-topic-intro').querySelector('.section-heading').getBoundingClientRect();
          return { ratio: bounds.width / bounds.height, natural: node.naturalWidth / node.naturalHeight, left: bounds.left, top: bounds.top, headingRight: heading.right, headingBottom: heading.bottom };
        });
        assert.ok(Math.abs(geometry.ratio - geometry.natural) < 0.01, `${width}px 图片保持原比例`);
        assert.ok(width > 900 ? geometry.left >= geometry.headingRight : geometry.top >= geometry.headingBottom, `${width}px 图文排列不重叠`);
      }
      if ([390, 1440].includes(width)) {
        for (const id of ['requirements', 'feasibility', 'inspection', 'documents', 'inspection-plan', 'deviations', 'packing']) {
          await page.locator(`#${id}`).screenshot({ path: join(screenshots, `${id}-${width}.png`), style: '.site-header{visibility:hidden}' });
        }
      }
    }
    await page.locator('.quality-nav a[href="#packing"]').click();
    assert.match(page.url(), /#packing$/);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ['/about/', '/privacy-policy/', '/cookie-policy/', '/terms-of-use/']) {
        await page.goto(`${baseUrl}${path}`);
        assert.equal(await page.locator('nav[aria-label="Breadcrumb"]').count(), 0, `${path} 不显示面包屑`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${path} ${width}px 不应横向溢出`);
      }
      await page.goto(`${baseUrl}/services/cnc-milling/`);
      assert.equal(await page.locator('nav[aria-label="Breadcrumb"]').count(), 1, '服务子页面保留面包屑');
    }
    assert.deepEqual(errors, []);
    console.log(`Quality 截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

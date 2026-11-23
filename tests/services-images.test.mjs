import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('Services 配图：图位、原始比例、响应式布局与服务链接', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const file = path.endsWith('/') ? `${path}index.html` : path;
      const body = await readFile(new URL(`../dist${file}`, import.meta.url));
      const types = { css: 'text/css', js: 'text/javascript', webp: 'image/webp', html: 'text/html' };
      res.setHeader('Content-Type', types[file.split('.').pop()] ?? 'application/octet-stream');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = process.env.SERVICES_BASE_URL ?? `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await page.goto(`${baseUrl}/services/`);
    assert.equal(await page.locator('main h1').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://belaroprecision.com/services/');
    assert.equal(await page.locator('main img').count(), 5);
    const mapping = [
      ['.services-hero-media', 'services-cnc-part-families-hero', 'eager'],
      ['#milling', 'hero-cnc-milling', 'eager'],
      ['#turning', 'hero-cnc-turning', 'lazy'],
      ['#secondary-processes', 'secondary-ground-shaft-detail', 'lazy'],
      ['#production', 'production-separated-components-batch', 'lazy'],
    ];
    for (const [selector, filename, loading] of mapping) {
      const img = page.locator(`${selector} img`);
      assert.equal(await img.count(), 1);
      assert.ok((await img.getAttribute('src')).includes(filename));
      assert.ok(await img.getAttribute('srcset'));
      assert.ok(await img.getAttribute('sizes'));
      assert.ok((await img.getAttribute('alt')).length > 20);
      assert.equal(await img.getAttribute('loading'), loading);
      // 模拟 Image 未转发页面作用域属性，仍不能失去比例约束。
      await img.evaluate(node => {
        for (const name of node.getAttributeNames()) {
          if (name.startsWith('data-astro-cid-')) node.removeAttribute(name);
        }
      });
    }
    assert.equal(await page.locator('.services-hero-media img').getAttribute('fetchpriority'), 'high');
    // 整个页面失去局部作用域标记时，背景层和正文图片约束仍有效。
    await page.locator('main, main *').evaluateAll(nodes => nodes.forEach(node => {
      for (const name of node.getAttributeNames()) {
        if (name.startsWith('data-astro-cid-')) node.removeAttribute(name);
      }
    }));
    for (const slug of ['cnc-machining', 'cnc-milling', 'cnc-turning', 'secondary-processes', 'production']) {
      assert.equal(await page.locator(`main a[href="/services/${slug}/"]`).count(), 1);
    }
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-services-images-'));
    for (const width of [320, 390, 700, 701, 1024, 1100, 1101, 1440, 1920, 2558]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const [selector] of mapping) {
        const img = page.locator(`${selector} img`);
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(node => node.decode());
        const metrics = await img.evaluate(node => {
          const rect = node.getBoundingClientRect();
          return { width: rect.width, height: rect.height, ratio: node.naturalWidth / node.naturalHeight, fit: getComputedStyle(node).objectFit, left: rect.left, right: rect.right };
        });
        assert.ok(metrics.width > 0 && metrics.height > 0);
        if (selector === '.services-hero-media') {
          assert.equal(metrics.fit, 'cover', 'Hero 等比铺满而非拉伸');
          const hero = await page.locator('.services-hero').boundingBox();
          assert.ok(Math.abs(metrics.width - hero.width) < 1 && Math.abs(metrics.height - hero.height) < 1, '背景铺满 Hero');
          assert.ok(hero.height >= 500 && hero.height <= 700, '高度不由原始图片撑开');
          const title = await page.locator('main h1').boundingBox();
          assert.ok(title.y >= hero.y && title.y + title.height <= hero.y + hero.height, '文字叠在背景范围内');
          assert.equal(await page.locator('.services-hero-media').evaluate(node => getComputedStyle(node).position), 'absolute');
          assert.equal(await page.locator('.services-hero').evaluate(node => getComputedStyle(node, '::after').display), 'none');
        } else {
          assert.ok(Math.abs(metrics.height - metrics.width / metrics.ratio) < 1, `${width}px ${selector} 图片不变形`);
          assert.equal(metrics.fit, 'contain');
        }
        assert.ok(metrics.left >= -1 && metrics.right <= width + 1);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 无横向溢出`);
      if ([390, 1440].includes(width)) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: join(screenshots, `services-${width}.png`), fullPage: true });
      }
    }
    assert.deepEqual(errors, []);
    console.log(`Services 配图截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

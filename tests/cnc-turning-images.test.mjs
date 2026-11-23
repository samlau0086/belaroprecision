import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('CNC Turning 配图：图位、等比显示、背景文字与响应式布局', async () => {
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
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await page.goto(`${baseUrl}/services/cnc-turning/`);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('main h1').count(), 1);
    assert.equal(await page.locator('main img').count(), 11);
    assert.equal(await page.locator('.turned-part').count(), 3);
    assert.equal(await page.locator('.turning-review-grid article').count(), 4);
    assert.equal(await page.locator('.turning-review-grid article').last().locator('img').count(), 1);
    const mapping = [
      ['.turning-hero-media', 'turning-process-detail'],
      ['.turning-review-intro', 'turning-shaft-shoulder-cut'],
      ['.turning-review-grid article:nth-child(1)', 'turning-bearing-seat-shoulder-detail'],
      ['.turning-review-grid article:nth-child(2)', 'turning-shaft-indicator-runout-setup'],
      ['.turning-review-grid article:nth-child(3)', 'turning-connector-thread-and-seat-detail'],
      ['.turning-review-grid article:nth-child(4)', 'stainless-steel-connectors-small-batch-packing'],
      ['.turning-specs-media', 'turning-sleeve-protected-functional-surfaces'],
    ];
    for (const [selector, name] of mapping) {
      const img = page.locator(`${selector} img`);
      assert.ok((await img.getAttribute('src')).includes(name));
      assert.ok(await img.getAttribute('srcset'));
      assert.ok(await img.getAttribute('sizes'));
      assert.ok((await img.getAttribute('alt')).length > 20);
      assert.equal(await img.getAttribute('loading'), selector === '.turning-hero-media' ? 'eager' : 'lazy');
    }
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-turning-images-'));
    for (const width of [320, 390, 700, 701, 1024, 1440, 1920, 2558]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const img of await page.locator('main img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(node => node.decode());
        const metrics = await img.evaluate(node => {
          const rect = node.getBoundingClientRect();
          return { width: rect.width, height: rect.height, ratio: node.naturalWidth / node.naturalHeight, fit: getComputedStyle(node).objectFit };
        });
        assert.ok(metrics.width > 0 && metrics.height > 0);
        if ((await img.getAttribute('src')).includes('turning-process-detail')) {
          assert.equal(metrics.fit, 'cover');
          const hero = await page.locator('.turning-hero').boundingBox();
          assert.ok(Math.abs(metrics.width - hero.width) < 1 && Math.abs(metrics.height - hero.height) < 1, `${width}px Hero: ${JSON.stringify({ metrics, hero })}`);
          const title = await page.locator('main h1').boundingBox();
          assert.ok(title.y >= hero.y && title.y + title.height <= hero.y + hero.height);
        } else {
          assert.equal(metrics.fit, 'contain');
          const isPart = (await img.getAttribute('src')).includes('/images/machined-parts/');
          const ratio = isPart ? 4 / 3 : metrics.ratio;
          assert.ok(Math.abs(metrics.height - metrics.width / ratio) < 1, `${width}px 正文图片等比或 contain 居中：${JSON.stringify(metrics)}`);
        }
      }
      const media = await page.locator('.turning-specs-media').boundingBox();
      const copy = await page.locator('.turning-specs-copy').boundingBox();
      assert.ok(width <= 700 ? media.y < copy.y : media.x < copy.x);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      const reviewCards = await page.locator('.turning-review-grid article').all();
      for (let index = 0; index < reviewCards.length; index++) {
        assert.equal(await reviewCards[index].locator('img').count(), 1);
        if (width > 700 && index % 2 === 1) {
          const left = await reviewCards[index - 1].locator('h3').boundingBox();
          const right = await reviewCards[index].locator('h3').boundingBox();
          assert.ok(Math.abs(left.y - right.y) < 1, `${width}px 同排评审标题对齐`);
        }
      }
      if ([390, 1440].includes(width)) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: join(screenshots, `turning-${width}.png`), fullPage: true });
        const screenshotStyle = await page.addStyleTag({ content: '.site-header { visibility: hidden !important; }' });
        await page.locator('.turning-review-grid').screenshot({ path: join(screenshots, `turning-review-${width}.png`) });
        await screenshotStyle.evaluate(node => node.remove());
      }
    }
    await page.getByRole('link', { name: 'Request a Turning Quote' }).first().click();
    assert.equal(new URL(page.url()).pathname, '/contact/');
    assert.equal(new URL(page.url()).hash, '#rfq-form');
    await page.waitForFunction(() => document.querySelector('[name=process]')?.value === 'CNC Turning');
    assert.equal(await page.locator('[name=process]').inputValue(), 'CNC Turning');
    assert.deepEqual(errors, []);
    console.log(`CNC Turning 截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

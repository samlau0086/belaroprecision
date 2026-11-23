import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('Production 配图：十一个图位、流程关联、等比加载、链接与响应式', { timeout: 120000 }, async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const file = path.endsWith('/') ? path + 'index.html' : path;
      const body = await readFile(new URL('../dist' + file, import.meta.url));
      res.setHeader('Content-Type', ({ css: 'text/css', js: 'text/javascript', html: 'text/html', webp: 'image/webp' })[file.split('.').pop()] ?? 'application/octet-stream');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(base + '/services/production/');
    assert.equal(await page.locator('main img').count(), 11);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.production-steps > li').count(), 4);
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://belaroprecision.com/services/production/');
    for (const [selector, name] of [
      ['.production-hero-grid', 'production-oem'],
      ['.production-batch-media', 'production-separated-components-batch'],
      ['.production-steps > li:nth-child(1)', 'home-drawing-led-component-review'],
      ['.production-steps > li:nth-child(2)', 'production-first-piece-comparison'],
      ['.production-steps > li:nth-child(3)', 'contact-rfq'],
      ['.production-steps > li:nth-child(4)', 'production-repeat-order-revision-review'],
      ['.scope-list > div:nth-child(1)', 'home-drawing-led-component-review'],
      ['.scope-list > div:nth-child(2)', 'production-separated-components-batch'],
      ['.scope-list', 'quality-batch-identification'],
      ['.scope-list', 'quality-protective-packaging'],
      ['.secondary-media', 'secondary-finished-housing-masking-detail'],
    ]) {
      const sources = await page.locator(selector + ' img').evaluateAll(nodes => nodes.map(node => node.getAttribute('src')));
      assert.equal(sources.filter(src => src.includes('/' + name + '.')).length, 1, name);
    }
    const shots = await mkdtemp(join(tmpdir(), 'belaro-production-'));
    for (const width of [320, 390, 700, 701, 1000, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, width + 'px 横向溢出');
      const intro = await page.locator('.production-intro').evaluate(node => {
        const rect = selector => {
          const box = node.querySelector(selector).getBoundingClientRect();
          return { top: box.top, bottom: box.bottom, left: box.left, right: box.right, width: box.width, height: box.height };
        };
        return { heading: rect('.section-heading'), media: rect('.production-batch-media'), principles: rect('.production-principles'), items: [...node.querySelectorAll('article')].map(item => item.getBoundingClientRect().top) };
      });
      assert.ok(intro.heading.bottom <= intro.media.top, width + 'px 标题位于图文上方');
      assert.ok(intro.items.every((top, index) => index === 0 || top > intro.items[index - 1]), width + 'px 原则纵向排列');
      if (width <= 700) {
        assert.ok(intro.media.bottom <= intro.principles.top, width + 'px 图片先于说明');
        assert.ok(Math.abs(intro.media.left - intro.principles.left) < 1);
      } else {
        assert.ok(intro.media.right < intro.principles.left, width + 'px 左图右文');
        assert.ok(Math.abs(intro.media.width - intro.principles.width) < 1, width + 'px 等宽双栏');
        assert.ok(Math.abs(intro.media.top + intro.media.height / 2 - intro.principles.top - intro.principles.height / 2) < 1, width + 'px 图文垂直居中');
      }
      for (const [selector, columns] of [['.production-steps', width <= 700 ? 1 : width <= 1100 ? 2 : 4], ['.scope-list', width <= 700 ? 1 : 2]]) {
        const boxes = await page.locator(selector + ' > *').evaluateAll(nodes => nodes.map(node => {
          const media = node.querySelector('.process-image').getBoundingClientRect();
          return { top: node.getBoundingClientRect().top, mediaTop: media.top, width: media.width, height: media.height };
        }));
        assert.equal(boxes.filter(box => Math.abs(box.top - boxes[0].top) < 1).length, columns, selector + ' 列数');
        for (let index = 0; index < boxes.length; index++) {
          const box = boxes[index];
          assert.ok(Math.abs(box.height - box.width * 3 / 4) < 1, selector + ' 图片框比例');
          assert.ok(Math.abs(box.mediaTop - boxes[Math.floor(index / columns) * columns].mediaTop) < 1, selector + ' 同排图片对齐');
        }
      }
      if (![390, 1440].includes(width)) continue;
      for (const img of await page.locator('main img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(async node => {
          if (!node.complete) await new Promise((resolve, reject) => {
            node.addEventListener('load', resolve, { once: true });
            node.addEventListener('error', reject, { once: true });
          });
          await node.decode();
        });
        const metrics = await img.evaluate(node => { const box = node.getBoundingClientRect(); return { width: box.width, height: box.height, ratio: node.naturalWidth / node.naturalHeight }; });
        assert.ok(metrics.width > 0 && metrics.height > 0);
        assert.ok(Math.abs(metrics.height - metrics.width / metrics.ratio) < 1);
        assert.ok(await img.getAttribute('srcset'));
        assert.ok(await img.getAttribute('sizes'));
        assert.ok((await img.getAttribute('alt')).length > 20);
        assert.equal(await img.getAttribute('loading'), (await img.getAttribute('src')).includes('/production-oem.') ? 'eager' : 'lazy');
      }
      const style = '.site-header{visibility:hidden}';
      await page.screenshot({ path: join(shots, 'production-' + width + '.png'), fullPage: true, style });
      await page.locator('#production-flow').screenshot({ path: join(shots, 'flow-' + width + '.png'), style });
      await page.locator('.production-intro').screenshot({ path: join(shots, 'intro-' + width + '.png'), style });
      await page.locator('.production-scope').screenshot({ path: join(shots, 'scope-' + width + '.png'), style });
    }
    await page.locator('.production-faq-list summary').first().click();
    assert.equal(await page.locator('.production-faq-list details').first().getAttribute('open'), '');
    assert.doesNotMatch(await page.locator('main').innerText(), /AI illustrations?|AI[-\s]*generated/i);
    const links = await page.locator('main a').evaluateAll(nodes => [...new Set(nodes.map(node => node.href))]);
    for (const href of links) {
      assert.equal((await page.request.get(href)).status(), 200, href);
      const target = new URL(href);
      if (target.hash) { await page.goto(href); assert.equal(await page.locator(target.hash).count(), 1); }
    }
    assert.deepEqual(errors, []);
    console.log('Production 截图：' + shots);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

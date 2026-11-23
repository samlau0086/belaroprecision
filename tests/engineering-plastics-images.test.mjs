import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('工程塑料配图：图位、等比、背景、响应式和同页 RFQ', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const file = path.endsWith('/') ? path + 'index.html' : path;
      const body = await readFile(new URL('../dist' + file, import.meta.url));
      const types = { css: 'text/css', js: 'text/javascript', webp: 'image/webp', html: 'text/html' };
      res.setHeader('Content-Type', types[file.split('.').pop()] ?? 'application/octet-stream');
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
    const path = '/materials/engineering-plastics-cnc-machining/';
    await page.goto(base + path);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('main img').count(), 16);
    assert.equal(await page.locator('.material-illustration figcaption').count(), 0);
    assert.equal(await page.locator('.illustration-notice').count(), 0);
    assert.doesNotMatch(await page.locator('main').innerText(), /AI[-\s]*generated|AI illustrations?/i);
    const counts = { capabilities: 1, grades: 0, components: 3, processes: 5, quality: 2, finishing: 3, production: 1, faq: 0, quote: 0 };
    for (const [id, count] of Object.entries(counts)) assert.equal(await page.locator('#' + id + ' img').count(), count, id);
    const doc = await readFile('docs/image-requirements/engineering-plastics-cnc-machining.md', 'utf8');
    const names = [...doc.matchAll(/文件名：.([^\s]+)\.webp/g)].map(match => match[1]);
    assert.equal(names.length, 16);
    for (const name of names) assert.equal(await page.locator('main img[src*="' + name + '"]').count(), 1, name);
    const guide = page.locator('#components article').filter({ has: page.locator('h3', { hasText: 'Guides, wear pads & fixtures' }) });
    assert.match(await guide.locator('img').getAttribute('src'), /pa-cnc-slotted-equipment-guide/);
    assert.match(await page.locator('#quality img').last().getAttribute('alt'), /polymer housing/);
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-plastics-'));
    for (const width of [320, 390, 700, 701, 1024, 1440, 1920, 2558]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const img of await page.locator('main img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(node => node.decode());
        const m = await img.evaluate(node => {
          const r = node.getBoundingClientRect();
          return {
            src: node.currentSrc,
            w: r.width,
            h: r.height,
            ratio: Number(node.getAttribute('width')) / Number(node.getAttribute('height')),
            fit: getComputedStyle(node).objectFit,
          };
        });
        assert.ok(m.w > 0 && m.h > 0);
        assert.ok(await img.getAttribute('srcset'));
        assert.ok(await img.getAttribute('sizes'));
        const alt = await img.getAttribute('alt');
        assert.ok(alt && alt.length > 20);
        assert.doesNotMatch(alt, /AI[-\s]*generated|AI illustrations?/i);
        if (await img.evaluate(node => node.classList.contains('hero-photo'))) {
          const hero = await page.locator('.material-hero').boundingBox();
          const title = await page.locator('h1').boundingBox();
          assert.equal(m.fit, 'cover');
          assert.ok(Math.abs(m.w - hero.width) < 1 && Math.abs(m.h - hero.height) < 1);
          assert.ok(title.y >= hero.y && title.y + title.height <= hero.y + hero.height);
          assert.equal(await img.getAttribute('loading'), 'eager');
        } else {
          assert.equal(m.fit, 'contain');
          assert.ok(Math.abs(m.h - m.w / m.ratio) < 1, width + 'px 图片不变形：' + JSON.stringify(m));
          assert.equal(await img.getAttribute('loading'), 'lazy');
        }
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, width + 'px 横向溢出');
      if ([390, 1440].includes(width)) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: join(screenshots, 'plastics-' + width + '.png'), fullPage: true });
      }
    }
    for (const selector of ['.hero-copy .button', '.section-index a[href="#rfq-form"]', '.nav-cta', 'footer a[href="#rfq-form"]']) {
      await page.locator(selector).click();
      assert.equal(new URL(page.url()).pathname, path);
      assert.equal(new URL(page.url()).hash, '#rfq-form');
    }
    await page.goto(base + '/materials/titanium-cnc-machining/');
    assert.equal(await page.locator('.material-illustration').count(), 0);
    assert.equal(await page.locator('main img').count(), 2);
    assert.equal(await page.locator('.inspection-image').count(), 1);
    assert.deepEqual(errors, []);
    console.log('工程塑料截图：' + screenshots);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});


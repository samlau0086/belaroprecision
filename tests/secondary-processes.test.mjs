import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('配套工艺页：内容边界、站内入口、导航与响应式', async () => {
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
    await page.goto(`${baseUrl}/services/secondary-processes/`);
    assert.match(await page.title(), /Secondary Processes.*Belaro Precision/);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://belaroprecision.com/services/secondary-processes/');
    assert.equal(await page.locator('.process-grid article').count(), 3);
    assert.equal(await page.locator('#grinding').count(), 1);
    assert.equal(await page.locator('#heat-treatment').count(), 1);
    assert.equal(await page.locator('#surface-finishing').count(), 1);
    assert.match(await page.locator('main').innerText(), /supplier network/i);
    assert.match(await page.locator('main').innerText(), /not.*in-house|core offering is CNC machining/is);
    assert.equal(await page.locator('main img').count(), 7);
    assert.doesNotMatch(await page.locator('main').innerText(), /AI illustrations?|AI[-\s]*generated/i);
    const imageMapping = [
      ['.secondary-hero', 'secondary-processes'],
      ['.handoff-media', 'quality-batch-identification'],
      ['#grinding', 'secondary-ground-shaft-detail'],
      ['#heat-treatment', 'secondary-heat-treatment-parts-tray'],
      ['#surface-finishing', 'secondary-finished-housing-masking-detail'],
      ['#protected-areas', 'secondary-bracket-protected-thread-and-face'],
      ['#inspection-records', 'secondary-returned-component-inspection'],
    ];
    for (const [selector, name] of imageMapping) {
      const img = page.locator(`${selector} img`);
      assert.equal(await img.count(), 1);
      assert.ok((await img.getAttribute('src')).includes(name), name);
      assert.ok(await img.getAttribute('srcset'));
      assert.ok(await img.getAttribute('sizes'));
      assert.ok((await img.getAttribute('alt')).length > 20);
      assert.equal(await img.getAttribute('loading'), selector === '.secondary-hero' ? 'eager' : 'lazy');
    }
    assert.equal(await page.locator('.requirements-list dt').count(), 6);

    await page.locator('.faq-list summary').first().focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('.faq-list details').open);
    assert.equal(await page.locator('.faq-list details').first().getAttribute('open'), '');

    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-secondary-'));
    for (const width of [320, 390, 700, 701, 800, 801, 1024, 1100, 1101, 1440, 1920, 2558]) {
      await page.setViewportSize({ width, height: 900 });
      for (const img of await page.locator('main img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(node => node.decode());
        const metrics = await img.evaluate(node => {
          const rect = node.getBoundingClientRect();
          return { width: rect.width, height: rect.height, ratio: node.naturalWidth / node.naturalHeight, fit: getComputedStyle(node).objectFit };
        });
        assert.ok(metrics.width > 0 && metrics.height > 0);
        assert.ok(Math.abs(metrics.height - metrics.width / metrics.ratio) < 1, `${width}px 图片等比：${JSON.stringify(metrics)}`);
        if (!(await img.getAttribute('src')).includes('/secondary-processes.')) assert.equal(metrics.fit, 'contain');
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 不应横向溢出`);
      if ([390, 1440].includes(width)) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: join(screenshots, `secondary-${width}.png`), fullPage: true });
      }
    }
    await page.locator('.hero-actions .button').click();
    assert.equal(new URL(page.url()).pathname, '/contact/');
    assert.equal(new URL(page.url()).hash, '#rfq-form');
    await page.goto(`${baseUrl}/services/secondary-processes/`);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('link', { name: /Capabilities/ }).first().hover();
    const submenuLink = page.locator('.nav-dropdown-menu a[href="/services/secondary-processes/"]');
    await submenuLink.waitFor({ state: 'visible' });
    assert.equal(await submenuLink.innerText(), 'Secondary Processes');

    for (const path of ['/', '/services/', '/machined-parts/', '/services/cnc-milling/', '/services/cnc-turning/', '/services/production/', '/about/', '/quality/']) {
      await page.goto(`${baseUrl}${path}`);
      assert.ok(await page.locator('a[href="/services/secondary-processes/"]').count(), `${path} 应包含配套工艺入口`);
    }

    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const staticPage = await noJs.newPage();
    await staticPage.goto(`${baseUrl}/services/secondary-processes/`);
    assert.equal(await staticPage.locator('.process-grid article').count(), 3);
    await noJs.close();
    assert.deepEqual(errors, []);
    console.log(`配套工艺页截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

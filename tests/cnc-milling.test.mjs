import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('铣削页：站内入口、响应式、SEO、FAQ 与工艺询价', async () => {
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
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await page.goto(`${baseUrl}/services/cnc-milling/`);
    assert.match(await page.title(), /CNC Milling Services.*Belaro Precision/);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://belaroprecision.com/services/cnc-milling/');
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 50);
    assert.equal(await page.locator('.milled-part').count(), 3);
    assert.equal(await page.locator('.milled-part svg[aria-hidden="true"]').count(), 3);
    assert.equal(await page.locator('.milling-review-grid article').count(), 4);
    await page.getByRole('link', { name: 'Explore milled parts' }).click();
    assert.equal(new URL(page.url()).hash, '#milled-parts');
    await page.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('details').first().getAttribute('open'), '');
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-milling-'));
    for (const width of [320, 390, 700, 701, 768, 1024, 1100, 1101, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 不应横向溢出`);
      const cards = await page.locator('.milled-part').evaluateAll(nodes => nodes.slice(0, 2).map(node => { const { x, y } = node.getBoundingClientRect(); return { x, y }; }));
      assert.equal(width <= 700 ? cards[0].x === cards[1].x : cards[0].y === cards[1].y, true, `${width}px 零件卡片列数`);
      if ([390, 1440].includes(width)) await page.screenshot({ path: join(screenshots, `milling-${width}.png`), fullPage: true });
    }
    // 遍历本页正文链接，验证构建产物中的目标和锚点确实存在。
    const links = await page.locator('main a').evaluateAll(nodes => [...new Set(nodes.map(node => node.href))]);
    for (const href of links) {
      const target = new URL(href);
      assert.equal(target.origin, baseUrl);
      assert.equal((await page.request.get(href)).status(), 200);
      await page.goto(href);
      if (target.hash) assert.equal(await page.locator(target.hash).count(), 1, target.href);
    }
    await page.goto(`${baseUrl}/services/cnc-milling/`);
    await page.getByRole('link', { name: 'Request a Milling Quote' }).first().click();
    await page.waitForURL('**/contact/?process=milling#rfq-form');
    await page.waitForLoadState('load');
    assert.equal(new URL(page.url()).hash, '#rfq-form');
    assert.equal(await page.locator('[name="process"]').inputValue(), 'CNC Milling');
    assert.equal(await page.locator('[name="details"]').inputValue(), '');
    await page.locator('.rfq-optional summary').click();
    await page.locator('[name="process"]').selectOption({ label: 'CNC Turning' });
    assert.equal(await page.locator('[name="process"]').inputValue(), 'CNC Turning');
    for (const query of ['?process=unknown', '?process=%3Cscript%3E']) {
      await page.goto(`${baseUrl}/contact/${query}`);
      assert.equal(await page.locator('[name="process"]').inputValue(), '');
      assert.equal(await page.locator('[name="details"]').inputValue(), '');
    }
    await page.goto(`${baseUrl}/contact/?part=precision-shafts&process=milling`);
    assert.equal(await page.locator('[name="process"]').inputValue(), 'CNC Turning');
    assert.match(await page.locator('[name="details"]').inputValue(), /^Part family: Precision Shafts/);
    await page.goto(baseUrl);
    await page.getByRole('link', { name: /^Explore milling/ }).click();
    assert.equal(new URL(page.url()).pathname, '/services/cnc-milling/');
    await page.goto(`${baseUrl}/services/#milling`);
    await page.getByRole('link', { name: 'Explore CNC Milling', exact: true }).click();
    assert.equal(new URL(page.url()).pathname, '/services/cnc-milling/');
    await page.goto(`${baseUrl}/machined-parts/`);
    assert.equal(await page.locator('main a.part-process[href="/services/cnc-milling/"]').count(), 3);
    await page.locator('main a.part-process').first().click();
    assert.equal(new URL(page.url()).pathname, '/services/cnc-milling/');
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    await noJs.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    const staticPage = await noJs.newPage();
    await staticPage.goto(`${baseUrl}/services/cnc-milling/`);
    assert.equal(await staticPage.locator('.milled-part').count(), 3);
    await staticPage.locator('summary').first().click();
    assert.equal(await staticPage.locator('details').first().getAttribute('open'), '');
    await noJs.close();
    assert.deepEqual(errors, []);
    console.log(`铣削页截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

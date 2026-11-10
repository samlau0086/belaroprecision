import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('行业页：行业锚点、零件与服务链接、SEO、FAQ 和响应式', async () => {
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
    await page.goto(`${baseUrl}/industries/`);
    assert.match(await page.title(), /Industrial OEM Applications.*Belaro Precision/);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://belaroprecision.com/industries/');
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 50);
    assert.equal(await page.locator('.industry-detail').count(), 4);
    assert.equal(await page.locator('.industry-visual img').count(), 4);
    for (const image of await page.locator('.industry-visual img').all()) {
      await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(node => node.complete && node.naturalWidth > 0, await image.elementHandle());
      await image.evaluate(node => node.decode());
      assert.ok(await image.evaluate(node => node.naturalWidth > 0));
    }
    assert.match(await page.locator('main').innerText(), /3-axis.*simultaneous 5-axis/is);
    assert.match(await page.locator('main').innerText(), /supplier network/i);
    assert.match(await page.locator('#fluid .scope-note').innerText(), /not assumed services/);
    await page.locator('.industry-jumps a').first().click();
    assert.equal(new URL(page.url()).hash, '#automation');
    await page.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('details').first().getAttribute('open'), '');

    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-industries-'));
    for (const width of [320, 390, 700, 701, 900, 1024, 1100, 1101, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 不应横向溢出`);
      const positions = await page.locator('#automation > div').evaluateAll(nodes => nodes.map(node => { const { x, y } = node.getBoundingClientRect(); return { x, y }; }));
      assert.ok(width <= 700 ? positions[0].x === positions[1].x && positions[1].y > positions[0].y : positions[1].x > positions[0].x, `${width}px 行业详情列数`);
      assert.equal(await page.locator('.breadcrumbs').evaluate(node => getComputedStyle(node).marginBottom), width <= 700 ? '28px' : '38px');
      if ([390, 1440].includes(width)) await page.screenshot({ path: join(screenshots, `industries-${width}.png`), fullPage: true });
    }

    // 验证正文全部目标页面及锚点，不触发真实询价提交。
    const links = await page.locator('main a').evaluateAll(nodes => [...new Set(nodes.map(node => node.href))]);
    for (const href of links) {
      const target = new URL(href);
      assert.equal(target.origin, baseUrl);
      assert.equal((await page.request.get(href)).status(), 200, href);
      await page.goto(href);
      if (target.hash) assert.equal(await page.locator(target.hash).count(), 1, href);
    }
    await page.goto(baseUrl);
    const homepageLinks = await page.locator('#target-applications a[href^="/industries/#"]').evaluateAll(nodes => nodes.map(node => node.href));
    assert.equal(homepageLinks.length, 2);
    for (const href of homepageLinks) {
      await page.goto(href);
      const sector = page.locator(new URL(href).hash);
      assert.equal(await sector.count(), 1);
      assert.ok((await sector.innerText()).length > 200);
    }
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const staticPage = await noJs.newPage();
    await staticPage.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await staticPage.goto(`${baseUrl}/industries/`);
    assert.equal(await staticPage.locator('.industry-detail').count(), 4);
    await staticPage.locator('summary').first().click();
    assert.equal(await staticPage.locator('details').first().getAttribute('open'), '');
    await noJs.close();
    assert.deepEqual(errors, []);
    console.log(`行业页截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('About：能力边界、链接、SEO、FAQ 与响应式布局', async () => {
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
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(`${base}/about/`);
    assert.match(await page.title(), /About Belaro Precision/);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://belaroprecision.com/about/');
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 50);
    assert.match(await page.locator('.company-profile').innerText(), /3-axis & simultaneous 5-axis/);
    assert.match(await page.locator('main').innerText(), /supplier network/);
    assert.match(await page.locator('details').nth(1).textContent(), /suppliers in Dongguan and Shenzhen/);
    assert.equal(await page.locator('.working-steps li').count(), 4);
    await page.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('details').first().getAttribute('open'), '');
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-about-'));
    for (const width of [320, 390, 700, 701, 900, 1024, 1100, 1101, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 横向溢出`);
      const positions = await page.locator('.about-hero-grid > *').evaluateAll(nodes => nodes.map(node => { const { x, y } = node.getBoundingClientRect(); return { x, y }; }));
      assert.ok(width <= 700 ? positions[0].x === positions[1].x && positions[1].y > positions[0].y : positions[1].x > positions[0].x, `${width}px 首屏列数`);
      if ([390, 1440].includes(width)) await page.screenshot({ path: join(screenshots, `about-${width}.png`), fullPage: true });
    }
    // 检查正文目标及锚点，不提交询盘。
    const links = await page.locator('main a').evaluateAll(nodes => [...new Set(nodes.map(node => node.href))]);
    for (const href of links) {
      const target = new URL(href);
      assert.equal(target.origin, base);
      assert.equal((await page.request.get(href)).status(), 200, href);
      await page.goto(href);
      if (target.hash) assert.equal(await page.locator(target.hash).count(), 1, href);
    }
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const staticPage = await noJs.newPage();
    await staticPage.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await staticPage.goto(`${base}/about/`);
    assert.equal(await staticPage.locator('.about-capabilities article').count(), 3);
    await staticPage.locator('summary').first().click();
    assert.equal(await staticPage.locator('details').first().getAttribute('open'), '');
    await noJs.close();
    assert.deepEqual(errors, []);
    console.log(`About 截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

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
    assert.match(await page.locator('.company-profile').innerText(), /3-axis, 3\+2 & simultaneous 5-axis/);
    assert.match(await page.locator('main').innerText(), /supplier network/);
    assert.match(await page.locator('details').nth(1).textContent(), /suppliers in Dongguan and Shenzhen/);
    assert.equal(await page.locator('.working-steps li').count(), 4);
    assert.equal(await page.locator('#manufacturing-scope article').count(), 2);
    assert.match(await page.locator('#manufacturing-scope').innerText(), /OWN MACHINING CAPABILITY/);
    assert.equal(await page.locator('#supplier-coordination .supplier-steps > li').count(), 4);
    assert.match(await page.locator('#supplier-coordination').innerText(), /confidentiality/);
    assert.equal(await page.locator('#workshop-team article').count(), 3);
    assert.doesNotMatch(await page.locator('main').innerText(), /illustrative/i);
    assert.equal(await page.locator('#workshop-team img').count(), 5);
    for (const image of await page.locator('#workshop-team img').all()) {
      await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(node => node.complete && node.naturalWidth > 0, await image.elementHandle());
      await image.evaluate(node => node.decode());
      assert.ok(await image.evaluate(node => node.naturalWidth > 0));
    }
    await page.locator('#workshop-team img').first().scrollIntoViewIfNeeded();
    await page.locator('#workshop-team img').first().waitFor({ state: 'visible' });
    await page.waitForFunction(() => {
      const image = document.querySelector('#workshop-team img');
      return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
    });
    assert.match(await page.locator('#company-contact').innerText(), /Shajing, Bao'an District, Shenzhen, China/);
    assert.equal(await page.locator('#company-contact a[href="mailto:sales@belaroprecision.com"]').count(), 1);
    assert.equal(await page.locator('#company-contact a[href="https://wa.me/8618682188709"]').count(), 1);
    assert.doesNotMatch(await page.locator('main').innerText(), /深圳市极客码头科技有限公司/);
    await page.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('details').first().getAttribute('open'), '');
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-about-'));
    for (const width of [320, 390, 700, 701, 900, 1024, 1100, 1101, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 横向溢出`);
      for (const selector of ['.scope-grid', '.company-panel', '.contact-panel']) {
        const columns = await page.locator(selector).evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length);
        assert.equal(columns, width <= 700 ? 1 : 2, `${width}px ${selector} 列数`);
      }
      const stepColumns = await page.locator('.supplier-steps').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length);
      assert.equal(stepColumns, width <= 480 ? 1 : width <= 1000 ? 2 : 4, `${width}px 外协流程列数`);
      assert.notEqual(await page.locator('.scope-card').first().evaluate(node => getComputedStyle(node).backgroundColor), 'rgba(0, 0, 0, 0)');
      const positions = await page.locator('.about-hero-grid > *').evaluateAll(nodes => nodes.map(node => { const { x, y } = node.getBoundingClientRect(); return { x, y }; }));
      assert.ok(width <= 700 ? positions[0].x === positions[1].x && positions[1].y > positions[0].y : positions[1].x > positions[0].x, `${width}px 首屏列数`);
      if ([390, 1440].includes(width)) {
        await page.screenshot({ path: join(screenshots, `about-${width}.png`), fullPage: true });
        await page.locator('#workshop-team').screenshot({ path: join(screenshots, `workshop-${width}.png`) });
      }
    }
    // 检查正文目标及锚点，不提交询盘。
    const links = await page.locator('main a').evaluateAll(nodes => [...new Set(nodes.map(node => node.href))]);
    for (const href of links) {
      const target = new URL(href);
      if (target.protocol === 'mailto:' || target.origin === 'https://wa.me') continue;
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

import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('CNC 综合加工落地页：SEO、询价路径、广告偏好、图片、响应式与无脚本回退', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const file = path.endsWith('/') ? `${path}index.html` : path;
      const body = await readFile(new URL(`../dist${file}`, import.meta.url));
      const types = { js: 'text/javascript', css: 'text/css', webp: 'image/webp', svg: 'image/svg+xml', png: 'image/png', ico: 'image/x-icon' };
      res.setHeader('Content-Type', types[file.split('.').at(-1)] || 'text/html');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const pathname = '/services/cnc-machining/';
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}${pathname}?gclid=Machining_Test_Click`);
    assert.match(await page.title(), /Custom CNC Machining Services.*Belaro Precision/);
    assert.equal(await page.locator('h1').count(), 1);
    assert.match(await page.locator('h1').innerText(), /CNC Machining\s+Services/);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://belaroprecision.com${pathname}`);
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 80);
    assert.equal(await page.locator('#rfq-form').count(), 1);
    assert.equal(await page.locator('.machining-parts article').count(), 6);
    assert.equal(await page.locator('.machining-processes article').count(), 3);
    assert.equal(await page.locator('.machining-steps li').count(), 4);
    assert.equal(await page.locator('.machining-faq details').count(), 6);
    assert.equal(await page.locator('.hero-photo').getAttribute('fetchpriority'), 'high');

    // 广告访问不应在同意前保存点击标识；页内询价不改变来源参数。
    await page.locator('[data-ad-preferences]').waitFor({ state: 'visible' });
    assert.equal(await page.locator('[name="gclid"]').inputValue(), '');
    assert.equal(await page.evaluate(() => localStorage.getItem('belaro.ad-attribution')), null);
    await page.locator('[data-ad-allow]').click();
    await page.waitForFunction(() => document.querySelector('[name="gclid"]').value === 'Machining_Test_Click');
    await page.locator('.machining-hero a[href="#rfq-form"]').click();
    assert.equal(new URL(page.url()).hash, '#rfq-form');
    assert.equal(new URL(page.url()).searchParams.get('gclid'), 'Machining_Test_Click');
    const formBox = await page.locator('#rfq-form').boundingBox();
    assert.ok(formBox.y >= 86 && formBox.y < 140, '询价表单顶部应避开吸顶导航');
    assert.equal(await page.locator('.rfq-optional').getAttribute('open'), null);
    assert.equal(await page.locator('#drawing-file').getAttribute('required'), null);
    assert.deepEqual(await page.locator('.rfq-form [required][name]').evaluateAll(nodes => nodes.map(node => node.name).sort()), ['company', 'consent', 'country', 'email', 'name']);
    assert.equal(await page.evaluate(() => window.dataLayer.filter(item => item.event === 'generate_lead').length), 0);
    await page.locator('[data-ad-preferences-open]').click();
    await page.locator('[data-ad-deny]').click();
    await page.waitForFunction(() => document.querySelector('[name="gclid"]').value === '');
    await page.goto(`${base}${pathname}`);

    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-machining-'));
    for (const width of [320, 390, 700, 701, 768, 1024, 1100, 1101, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => window.scrollTo(0, 0));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${width}px 不应横向溢出`);
      const heroCta = await page.locator('.machining-hero .button').boundingBox();
      assert.ok(heroCta.y > 0 && heroCta.y + heroCta.height < 900, `${width}px 首屏应有报价入口`);
      const band = await page.locator('.offer-band').boundingBox();
      assert.ok(band.y < 900, `${width}px 首屏应露出后续内容`);
      for (const selector of ['.machining-processes img', '.machining-parts img']) {
        const ratios = await page.locator(selector).evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width / node.getBoundingClientRect().height));
        assert.ok(ratios.every(ratio => Math.abs(ratio - (selector.includes('processes') ? 1.65 : 1.5)) < 0.02), `${width}px 图片应保持统一比例`);
      }
      await page.locator('.rfq-optional summary').click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${width}px 展开表单不应溢出`);
      await page.locator('.rfq-optional summary').click();
      if ([390, 1440].includes(width)) {
        // 逐段滚动触发原生懒加载，再回到页首生成可人工复核的截图。
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 650) {
            window.scrollTo(0, y);
            await new Promise(resolve => setTimeout(resolve, 40));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForFunction(() => [...document.querySelectorAll('main img')].every(img => img.complete && img.naturalWidth > 0));
        await page.screenshot({ path: join(screenshots, `machining-${width}.png`), fullPage: true });
        await page.screenshot({ path: join(screenshots, `machining-hero-${width}.png`) });
      }
    }
    await page.locator('.machining-faq summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.machining-faq details').first().getAttribute('open'), '');
    const internalLinks = await page.locator('main a').evaluateAll(nodes => [...new Set(nodes.filter(node => node.origin === location.origin).map(node => node.href))]);
    for (const href of internalLinks) {
      assert.equal((await page.request.get(href)).status(), 200, href);
      const hash = new URL(href).hash;
      if (hash) assert.equal(await page.locator(hash).count(), 1, href);
    }
    for (const source of ['/', '/services/']) {
      await page.goto(`${base}${source}`);
      assert.equal(await page.locator(`.desktop-nav a[href="${pathname}"]`).count(), 1);
      assert.equal(await page.locator(`.mobile-nav a[href="${pathname}"]`).count(), 1);
      assert.equal(await page.locator(`.site-footer a[href="${pathname}"]`).count(), 1);
      if (source === '/services/') await page.getByRole('link', { name: 'Explore CNC Machining', exact: true }).click();
    }
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await noJs.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    const staticPage = await noJs.newPage();
    await staticPage.goto(`${base}${pathname}`);
    await staticPage.locator('.machining-faq summary').first().click();
    assert.equal(await staticPage.locator('.machining-faq details').first().getAttribute('open'), '');
    assert.match(await staticPage.locator('noscript').innerText(), /enable JavaScript/);
    assert.equal(await staticPage.locator('button[type="submit"]').isDisabled(), true);
    assert.equal(await staticPage.locator('a[href="mailto:sales@belaroprecision.com"]').count() > 0, true);
    await noJs.close();
    assert.deepEqual(errors, []);
    console.log(`CNC Machining 页面截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

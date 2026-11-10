import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

test('公共导航：桌面与手机吸顶、首屏阈值、返回顶部、菜单和锚点', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const body = await readFile(new URL(`../dist${path.endsWith('/') ? `${path}index.html` : path}`, import.meta.url));
      res.setHeader('Content-Type', path.endsWith('.css') ? 'text/css' : path.endsWith('.js') ? 'text/javascript' : 'text/html');
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

    for (const width of [320, 390, 700, 701, 1024, 1100, 1101, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(baseUrl);
      const button = page.getByRole('button', { name: 'Back to top', exact: true });
      assert.equal(await button.isVisible(), false, `${width}px 首屏应隐藏按钮`);
      const headerHeight = width <= 700 ? 72 : 86;
      assert.equal(await page.locator('main').evaluate(el => el.getBoundingClientRect().top), headerHeight, '页头应保留布局占位');
      await page.evaluate(() => window.scrollTo(0, innerHeight - 1));
      await page.waitForFunction(() => window.scrollY === innerHeight - 1);
      assert.equal(await button.isVisible(), false, '不足一屏时保持隐藏');
      await page.evaluate(() => window.scrollTo(0, innerHeight + 1));
      await button.waitFor({ state: 'visible' });
      assert.equal(await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().top), 0, `${width}px 页头应持续吸顶`);
      const box = await button.boundingBox();
      assert.ok(box.x >= width - 80 && box.x + box.width <= width && box.y + box.height <= 844, '按钮应位于视窗右下角');
      assert.ok(box.width >= 44 && box.height >= 44, '触摸目标不应小于 44px');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, '不应横向溢出');
      if (process.env.NAVIGATION_SCREENSHOT_DIR && [390, 1440].includes(width)) {
        await page.screenshot({ path: `${process.env.NAVIGATION_SCREENSHOT_DIR}/navigation-${width}.png` });
      }
      if (width <= 1100) {
        await page.locator('[data-menu-toggle]').click();
        await page.locator('.mobile-capability-toggle').click();
        const menu = page.locator('[data-mobile-menu]');
        assert.equal(await menu.isVisible(), true);
        assert.ok(await menu.evaluate(el => el.getBoundingClientRect().bottom <= innerHeight + 1), '展开菜单应在视窗内滚动');
        await menu.getByRole('link', { name: 'Request a Quote' }).scrollIntoViewIfNeeded();
        await page.locator('[data-menu-toggle]').click();
      }
      // 浏览器可能为菜单内的目标调整页面滚动，返回按钮测试重新定位。
      await page.evaluate(() => window.scrollTo(0, innerHeight + 1));
      await button.waitFor({ state: 'visible' });
      await button.focus();
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => scrollY === 0);
      await button.waitFor({ state: 'hidden' });
      assert.equal(await button.isVisible(), false);
      assert.equal(await page.locator('.site-header .brand').evaluate(el => el === document.activeElement), true, '焦点应返回品牌入口');
    }

    // 验证缩放改变首屏阈值，以及默认动态效果下的平滑滚动。
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.locator('[data-back-to-top]').waitFor({ state: 'visible' });
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.locator('[data-back-to-top]').waitFor({ state: 'hidden' });
    await page.setViewportSize({ width: 1440, height: 844 });
    await page.locator('[data-back-to-top]').waitFor({ state: 'visible' });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('[data-back-to-top]').click();
    await page.waitForFunction(() => scrollY === 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${baseUrl}/services/cnc-milling/#three-axis`);
      await page.waitForFunction(() => scrollY > 0);
      const anchorTop = await page.locator('#three-axis').evaluate(el => el.getBoundingClientRect().top);
      const headerBottom = await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().bottom);
      assert.ok(anchorTop >= headerBottom, '锚点内容不应被页头遮挡');
    }
    for (const [path, selector] of [['/contact/', '.rfq-intro'], ['/privacy-policy/', '.legal-grid aside']]) {
      await page.goto(`${baseUrl}${path}`);
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForFunction(() => scrollY === 1000);
      assert.ok(await page.locator(selector).evaluate(el => Number.parseFloat(getComputedStyle(el).top) >= document.querySelector('.site-header').getBoundingClientRect().height), '侧栏吸顶偏移应预留导航高度');
      if (path === '/privacy-policy/') {
        assert.ok(await page.locator(selector).evaluate(el => el.getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom), '政策侧栏不应被导航遮挡');
      }
      assert.equal(await page.locator('[data-back-to-top]').count(), 1, '公共布局应只渲染一个按钮');
    }
    assert.deepEqual(errors, []);

    const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await noScript.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await noScript.goto(baseUrl);
    await noScript.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
    assert.equal(await noScript.locator('[data-back-to-top]').isVisible(), false, '无脚本时不展示无效按钮');
    assert.equal(await noScript.locator('.site-header').evaluate(el => el.getBoundingClientRect().top), 0);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

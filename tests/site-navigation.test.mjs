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
      const logo = page.locator('.site-header .brand-logo');
      assert.equal(await logo.getAttribute('src'), '/belaroprecision-logo.webp');
      await logo.evaluate(image => image.decode());
      const logoBox = await logo.boundingBox();
      assert.equal(logoBox.width, width <= 700 ? 64 : 80, `${width}px 页眉图标宽度应适配设备`);
      assert.equal(logoBox.height, width <= 700 ? 48 : 56, `${width}px 页眉图标高度应适配设备`);
      const brandBox = await page.locator('.site-header .brand').boundingBox();
      const nextControlBox = await page.locator(width <= 1100 ? '[data-menu-toggle]' : '.desktop-nav').boundingBox();
      assert.ok(brandBox.x + brandBox.width <= nextControlBox.x, '放大后的品牌区域不应挤压导航');
      assert.equal(await page.locator('.site-header .brand-copy').innerText(), 'BELARO\nPRECISION');
      const footerLogo = page.locator('.site-footer .brand-logo');
      assert.equal(await footerLogo.getAttribute('src'), '/belaroprecision-logo.webp');
      await footerLogo.evaluate(image => image.decode());
      const footerLogoBox = await footerLogo.boundingBox();
      assert.equal(footerLogoBox.width, logoBox.width, '页脚图标宽度应与页眉一致');
      assert.equal(footerLogoBox.height, logoBox.height, '页脚图标高度应与页眉一致');
      assert.equal(await page.locator('.site-footer .brand-copy').innerText(), 'BELARO\nPRECISION');
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
        const overlay = page.locator('[data-menu-overlay]');
        assert.equal(await overlay.isVisible(), false, '菜单关闭时遮罩应隐藏');
        await page.locator('[data-menu-toggle]').click();
        assert.equal(await overlay.isVisible(), true, '打开菜单时应显示遮罩');
        assert.equal(await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().top), 0, '滚动后打开菜单，页头应继续吸顶');
        assert.equal(await page.locator('[data-mobile-menu]').evaluate(el => el.getBoundingClientRect().top), headerHeight, '菜单应显示在可视页头下方');
        assert.equal(await page.locator('main').evaluate(el => el.inert), true, '背景内容应暂停交互');
        assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).overflowY), 'hidden', '打开菜单时锁定背景滚动');
        assert.equal(await page.evaluate(() => document.elementFromPoint(innerWidth - 24, innerHeight - 24)?.hasAttribute('data-menu-overlay')), true, '遮罩应覆盖页面与返回顶部按钮');
        const scrollBefore = await page.evaluate(() => scrollY);
        await page.mouse.move(width - 24, 820);
        await page.mouse.wheel(0, 300);
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert.equal(await page.evaluate(() => scrollY), scrollBefore, '遮罩上的滚轮不应滚动背景');
        if (process.env.NAVIGATION_SCREENSHOT_DIR && width === 390) {
          await page.screenshot({ path: `${process.env.NAVIGATION_SCREENSHOT_DIR}/navigation-overlay-${width}.png` });
        }
        await overlay.click({ position: { x: width - 24, y: 820 - headerHeight } });
        assert.equal(await overlay.isVisible(), false, '点击遮罩应关闭菜单');
        assert.equal(await page.locator('[data-menu-toggle]').evaluate(el => el === document.activeElement), true, '关闭后焦点应回到菜单按钮');
        assert.equal(await page.locator('main').evaluate(el => el.inert), false, '关闭后恢复背景交互');
        assert.notEqual(await page.locator('html').evaluate(el => getComputedStyle(el).overflowY), 'hidden', '关闭后恢复背景滚动');
        assert.equal(await page.evaluate(() => scrollY), scrollBefore, '关闭菜单应保留原滚动位置');
        await page.locator('[data-menu-toggle]').click();
        await page.keyboard.press('Escape');
        assert.equal(await overlay.isVisible(), false, 'Escape 应关闭遮罩');
        await page.locator('[data-menu-toggle]').click();
        await page.locator('.mobile-capability-toggle').click();
        const menu = page.locator('[data-mobile-menu]');
        assert.equal(await menu.isVisible(), true);
        assert.ok(await menu.evaluate(el => el.getBoundingClientRect().bottom <= innerHeight + 1), '展开菜单应在视窗内滚动');
        await menu.getByRole('link', { name: 'Request a Quote' }).scrollIntoViewIfNeeded();
        await page.locator('[data-menu-toggle]').click();
        assert.equal(await overlay.isVisible(), false, '菜单按钮关闭时应同步隐藏遮罩');
      }
      // 浏览器可能为菜单内的目标调整页面滚动，返回按钮测试重新定位。
      await page.evaluate(() => window.scrollTo(0, innerHeight + 1));
      await button.waitFor({ state: 'visible' });
      if (width === 1440) {
        await button.hover();
        await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-back-to-top]')).borderTopColor === 'rgb(255, 255, 255)');
      }
      await button.focus();
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => scrollY === 0);
      await button.waitFor({ state: 'hidden' });
      assert.equal(await button.isVisible(), false);
      assert.equal(await page.locator('.site-header .brand').evaluate(el => el === document.activeElement), true, '焦点应返回品牌入口');
      if (width === 390) {
        await page.locator('[data-menu-toggle]').click();
        assert.equal(await page.locator('[data-mobile-menu]').evaluate(el => el.getBoundingClientRect().top), headerHeight, '首屏打开菜单也应紧贴页头');
        if (process.env.NAVIGATION_SCREENSHOT_DIR) {
          await page.screenshot({ path: `${process.env.NAVIGATION_SCREENSHOT_DIR}/navigation-overlay-top-${width}.png` });
        }
        await page.keyboard.press('Escape');
      }
    }

    // 验证其他页面、同页锚点与桌面断点切换也能清理遮罩及背景锁定。
    for (const path of ['/contact/', '/privacy-policy/']) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${baseUrl}${path}`);
      await page.locator('[data-menu-toggle]').click();
      assert.equal(await page.locator('[data-menu-overlay]').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('main').evaluate(el => el.inert), false);
    }
    await page.goto(`${baseUrl}/services/cnc-milling/`);
    await page.locator('[data-menu-toggle]').click();
    await page.locator('.mobile-capability-toggle').click();
    await page.locator('[data-mobile-menu] a[href="/services/cnc-milling/#three-axis"]').click();
    assert.equal(await page.locator('[data-menu-overlay]').isVisible(), false, '选择同页锚点后关闭遮罩');
    assert.equal(await page.locator('main').evaluate(el => el.inert), false);
    await page.locator('[data-menu-toggle]').click();
    await page.setViewportSize({ width: 1440, height: 844 });
    await page.waitForFunction(() => !document.documentElement.classList.contains('mobile-menu-open'));
    assert.equal(await page.locator('[data-menu-overlay]').isVisible(), false, '切回桌面应清理遮罩');
    assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('main').evaluate(el => el.inert), false);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('[data-mobile-menu]').isVisible(), false, '切回手机时菜单保持关闭');
    await page.setViewportSize({ width: 1440, height: 844 });
    await page.goto(baseUrl);

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

    // 使用触屏上下文和单次 tap，避免仅缩小桌面视窗而漏测移动端交互。
    const touchPage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await touchPage.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    for (const reducedMotion of ['no-preference', 'reduce']) {
      await touchPage.emulateMedia({ reducedMotion });
      await touchPage.goto(baseUrl);
      assert.equal(await touchPage.evaluate(() => matchMedia('(hover: none)').matches), true);
      const touchButton = touchPage.locator('[data-back-to-top]');
      for (let attempt = 0; attempt < 2; attempt++) {
        await touchPage.evaluate(() => window.scrollTo({ top: innerHeight + 100, behavior: 'instant' }));
        await touchButton.waitFor({ state: 'visible' });
        const borderColor = await touchButton.evaluate(el => getComputedStyle(el).borderTopColor);
        if (attempt === 1) {
          // 首次操作直接轻触；再次操作额外验证兼容性 hover 不会改变边框。
          await touchButton.hover();
          await touchPage.waitForTimeout(250);
          assert.equal(await touchButton.evaluate(el => getComputedStyle(el).borderTopColor), borderColor, '触屏悬停不应改变橙色边框');
        }
        await touchButton.tap();
        await touchPage.waitForFunction(() => scrollY === 0);
        await touchButton.waitFor({ state: 'hidden' });
        assert.equal(await touchPage.locator('.site-header .brand').evaluate(el => el === document.activeElement), true, '单次触摸后焦点应返回品牌入口');
      }
    }
    await touchPage.close();

    const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await noScript.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await noScript.goto(baseUrl);
    assert.equal(await noScript.locator('[data-menu-overlay]').isVisible(), false, '无脚本时遮罩保持隐藏');
    await noScript.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
    assert.equal(await noScript.locator('[data-back-to-top]').isVisible(), false, '无脚本时不展示无效按钮');
    assert.equal(await noScript.getByRole('link', { name: 'Chat on WhatsApp', exact: true }).isVisible(), true, 'WhatsApp 无脚本时仍可使用');
    assert.equal(await noScript.locator('.site-header').evaluate(el => el.getBoundingClientRect().top), 0);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

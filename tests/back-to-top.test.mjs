import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium, webkit } from 'playwright';

test('返回顶部：单次触摸、滚动失败回退、延后键盘焦点与取消', async () => {
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
    const engine = process.env.BACK_TO_TOP_BROWSER === 'webkit' ? webkit : chromium;
    browser = await engine.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    const button = page.locator('[data-back-to-top]');
    const prepare = async (mode = 'normal') => {
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.evaluate(mode => {
        window.topTrace = { calls: [], focusPositions: [] };
        const nativeScrollTo = window.scrollTo.bind(window);
        nativeScrollTo({ top: 1800, behavior: 'instant' });
        window.scrollTo = options => {
          window.topTrace.calls.push(options.behavior);
          // 模拟 Safari 收到调用却未执行滚动，或进入首屏后动画停滞。
          if (options.behavior === 'smooth' && mode !== 'normal') {
            if (mode === 'partial') nativeScrollTo({ top: 300, behavior: 'instant' });
            return;
          }
          nativeScrollTo(options);
        };
        document.querySelector('.site-header .brand').addEventListener('focus', () => {
          window.topTrace.focusPositions.push(scrollY);
        });
      }, mode);
      await button.waitFor({ state: 'visible' });
    };
    for (const mode of ['normal', 'stalled', 'partial']) {
      await prepare(mode);
      await button.tap();
      await page.waitForFunction(() => scrollY === 0);
      await button.waitFor({ state: 'hidden' });
      const trace = await page.evaluate(() => window.topTrace);
      assert.equal(trace.calls[0], 'smooth');
      if (mode !== 'normal') assert.deepEqual(trace.calls, ['smooth', 'instant'], `${mode} 应自动回退，无需第二次点击`);
      assert.deepEqual(trace.focusPositions, [], '触摸不应强制转移焦点');
    }
    for (const key of ['Enter', 'Space']) {
      await prepare('stalled');
      await button.focus();
      await page.keyboard.press(key);
      assert.deepEqual(await page.evaluate(() => window.topTrace.focusPositions), [], '滚动完成前不应转移键盘焦点');
      await page.waitForFunction(() => scrollY === 0 && document.activeElement === document.querySelector('.site-header .brand'));
      assert.deepEqual(await page.evaluate(() => window.topTrace.focusPositions), [0], '只在真正到顶后恢复键盘焦点');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await prepare();
    await button.tap();
    assert.equal(await page.evaluate(() => scrollY), 0);
    assert.deepEqual(await page.evaluate(() => window.topTrace.calls), ['instant']);
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    for (const type of ['touchstart', 'pointerdown', 'wheel', 'keydown', 'pagehide']) {
      await prepare('stalled');
      await button.tap();
      await page.evaluate(type => {
        const target = type === 'pagehide' ? window : document;
        target.dispatchEvent(new Event(type, { bubbles: true }));
      }, type);
      await page.waitForTimeout(1400);
      assert.equal(await page.evaluate(() => scrollY), 1800, `${type} 后不应延迟跳顶`);
      assert.deepEqual(await page.evaluate(() => window.topTrace.calls), ['smooth']);
    }
    await prepare('stalled');
    await button.tap();
    await button.tap();
    await page.waitForFunction(() => scrollY === 0);
    await page.waitForTimeout(1400);
    assert.deepEqual(await page.evaluate(() => window.topTrace.calls), ['smooth', 'smooth', 'instant'], '重复点击只保留最后一次回退');
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

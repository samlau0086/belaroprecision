import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseHTML } from 'linkedom';
import { chromium } from 'playwright';

async function* htmlFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) yield* htmlFiles(url);
    else if (entry.name.endsWith('.html')) yield url;
  }
}

test('全站只加载一次异步 LiveChat，保留频道及原始外部脚本地址', async () => {
  let pages = 0;
  for await (const file of htmlFiles(new URL('../dist/', import.meta.url))) {
    const { document } = parseHTML(await readFile(file, 'utf8'));
    const scripts = document.querySelectorAll('script[data-channel]');
    assert.equal(scripts.length, 1, file.pathname);
    assert.equal(scripts[0].getAttribute('src'), 'https://wsdesk.geekmt.com/livechat/embed.js');
    assert.equal(scripts[0].getAttribute('data-channel'), '3c60547b-7bb7-48c3-8f4a-813af839ff13');
    assert.ok(scripts[0].hasAttribute('async'));
    assert.ok(document.body.contains(scripts[0]));
    assert.ok(document.querySelector('[data-back-to-top]').classList.contains('with-livechat'));
    pages++;
  }
  assert.ok(pages >= 14, '必须检查全站实际构建页面');
});

test('政策页披露客服服务和会话本地存储', async () => {
  for (const page of ['privacy-policy', 'cookie-policy']) {
    const { document } = parseHTML(await readFile(new URL(`../dist/${page}/index.html`, import.meta.url), 'utf8'));
    assert.match(document.querySelector('article').textContent, /wsdesk\.geekmt\.com/);
    assert.equal(document.querySelector('time').getAttribute('datetime'), '2026-11-14');
  }
  const cookiePolicy = await readFile(new URL('../dist/cookie-policy/index.html', import.meta.url), 'utf8');
  assert.match(cookiePolicy, /relaydesk\.livechat/);
});

test('客服入口与返回顶部按钮在桌面和手机不重叠，加载失败不阻止导航', async () => {
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
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-livechat-'));
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    // 仅模拟已核对的 72px 收起入口，避免真实聊天请求及远端服务波动。
    await page.route('https://wsdesk.geekmt.com/livechat/embed.js', route => route.fulfill({
      contentType: 'text/javascript',
      body: `const chat = document.createElement('button'); chat.id = 'mock-livechat'; chat.textContent = 'Chat'; chat.style.cssText = 'position:fixed;right:16px;bottom:16px;width:72px;height:72px;z-index:2147483647'; document.body.append(chat);`,
    }));
    for (const width of [320, 390, 700, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(base);
      await page.evaluate(() => scrollTo(0, innerHeight + 1));
      const top = page.locator('[data-back-to-top]');
      await top.waitFor({ state: 'visible' });
      const topBox = await top.boundingBox();
      const chatBox = await page.locator('#mock-livechat').boundingBox();
      assert.ok(topBox.y + topBox.height <= chatBox.y, `${width}px 返回顶部应在客服入口上方`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if ([390, 1440].includes(width)) await page.screenshot({ path: join(screenshots, `livechat-${width}.png`) });
      await top.click();
      await page.waitForFunction(() => scrollY === 0);
    }
    await page.unroute('https://wsdesk.geekmt.com/livechat/embed.js');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/contact/`);
    assert.equal(await page.locator('#rfq-form').count(), 1);
    await page.locator('[data-menu-toggle]').click();
    assert.equal(await page.locator('[data-mobile-menu]').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[data-menu-overlay]').isVisible(), false);
    assert.deepEqual(errors, []);
    console.log(`LiveChat 截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

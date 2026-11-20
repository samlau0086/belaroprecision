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
    const whatsapp = document.querySelectorAll('[data-whatsapp-float]');
    assert.equal(whatsapp.length, 1, '全站每页只渲染一个 WhatsApp 浮动入口');
    assert.equal(whatsapp[0].getAttribute('href'), 'https://wa.me/8618682188709');
    assert.equal(whatsapp[0].getAttribute('target'), '_blank');
    assert.equal(whatsapp[0].getAttribute('rel'), 'noopener noreferrer');
    assert.ok(whatsapp[0].classList.contains('with-livechat'));
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
      const whatsapp = page.getByRole('link', { name: 'Chat on WhatsApp', exact: true });
      assert.equal(await whatsapp.isVisible(), true, 'WhatsApp 在首屏也应可用');
      await whatsapp.focus();
      assert.equal(await whatsapp.evaluate(el => el === document.activeElement), true);
      await page.evaluate(() => scrollTo(0, innerHeight + 1));
      const top = page.locator('[data-back-to-top]');
      await top.waitFor({ state: 'visible' });
      const topBox = await top.boundingBox();
      const chatBox = await page.locator('#mock-livechat').boundingBox();
      const whatsappBox = await whatsapp.boundingBox();
      assert.ok(topBox.y + topBox.height + 16 <= whatsappBox.y, `${width}px 返回顶部与 WhatsApp 间隔至少 16px`);
      assert.equal(topBox.x, whatsappBox.x, '两个图标应右侧对齐');
      assert.ok(whatsappBox.y + whatsappBox.height + 16 <= chatBox.y, `${width}px WhatsApp 应为客服入口预留空间`);
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
    assert.equal(await page.locator('[data-whatsapp-float]').evaluate(el => el.inert), true, '菜单打开时 WhatsApp 不应接收背景交互');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[data-menu-overlay]').isVisible(), false);
    assert.equal(await page.locator('[data-whatsapp-float]').evaluate(el => el.inert), false);
    assert.equal(await page.locator('[data-whatsapp-float]').isVisible(), true, '客服脚本失败不影响 WhatsApp');
    assert.deepEqual(errors, []);
    console.log(`LiveChat 截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { chromium } from 'playwright';

test('全站文字至少 16px，桌面和移动端均无横向溢出', async () => {
  const root = new URL('../dist/', import.meta.url);
  const pages = (await readdir(root, { recursive: true })).filter(file => file.endsWith('index.html'));
  assert.ok(pages.length > 0, '请先构建站点');
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const file = path.endsWith('/') ? `${path}index.html` : path;
      const body = await readFile(new URL(`.${file}`, root));
      const extension = file.slice(file.lastIndexOf('.'));
      const types = { '.css': 'text/css', '.js': 'text/javascript', '.html': 'text/html', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
      res.setHeader('Content-Type', types[extension] ?? 'application/octet-stream');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    for (const width of [320, 390, 700, 701, 1024, 1100, 1101, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const file of pages) {
        const path = file.replaceAll('\\', '/').replace(/index\.html$/, '');
        await page.goto(`${base}/${path}`);
        // 展开 FAQ、可选表单和移动导航，覆盖通常隐藏的文字。
        await page.locator('details').evaluateAll(elements => elements.forEach(el => { el.open = true; }));
        if (width <= 1100) await page.locator('[data-menu-toggle]').click();
        const violations = await page.evaluate(() => [...document.querySelectorAll('body *')].flatMap(el => {
          if (el.matches('script,style,noscript,template')) return [];
          const hasText = [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
          if (!hasText && !el.matches('input:not([type=checkbox],[type=radio],[type=hidden]),textarea,select')) return [];
          const size = Number.parseFloat(getComputedStyle(el).fontSize);
          return size < 16 ? [{ tag: el.tagName, class: el.className, text: el.textContent.trim().slice(0, 70), size }] : [];
        }));
        assert.deepEqual(violations, [], `${width}px /${path} 存在小于 16px 的文字`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px /${path} 横向溢出`);
      }
    }
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

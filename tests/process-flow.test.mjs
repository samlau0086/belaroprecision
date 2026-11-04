import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

test('首页流程卡片：顺序、背景、边框和响应式箭头', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const body = await readFile(new URL(`../dist${path === '/' ? '/index.html' : path}`, import.meta.url));
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
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await page.goto(baseUrl);
    const flow = page.locator('.process-flow');
    assert.equal(await flow.getAttribute('role'), 'list');
    assert.deepEqual(await flow.locator('h3').allTextContents(), [
      'Send your drawing', 'Technical review', 'Quotation', 'Manufacture & inspect',
    ]);
    assert.deepEqual(await flow.locator('b').allTextContents(), ['01', '02', '03', '04']);
    assert.equal(await flow.locator('.process-arrow[aria-hidden="true"]').count(), 3);
    assert.equal(await flow.locator('li:last-child .process-arrow').count(), 0);

    for (const width of [320, 390, 768, 900, 901, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const layout = await flow.evaluate(el => {
        const rect = node => {
          const { x, y, width, height } = node.getBoundingClientRect();
          return { x, y, width, height };
        };
        const style = getComputedStyle(el.firstElementChild);
        return {
          cards: [...el.children].map(rect),
          arrows: [...el.querySelectorAll('.process-arrow')].map(rect),
          background: style.backgroundColor,
          border: style.borderTopWidth,
          borderColor: style.borderTopColor,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      assert.equal(layout.overflow, false, `${width}px 不应横向溢出`);
      assert.equal(layout.background, 'rgb(244, 246, 248)');
      assert.equal(layout.border, '3px');
      assert.equal(layout.borderColor, 'rgb(244, 123, 53)');
      for (let i = 0; i < 3; i++) {
        const card = layout.cards[i];
        const next = layout.cards[i + 1];
        const arrow = layout.arrows[i];
        if (width > 900) {
          assert.equal(card.y, next.y);
          assert.equal(card.height, next.height);
          assert.ok(arrow.x >= card.x + card.width && arrow.x + arrow.width <= next.x);
        } else {
          assert.equal(card.x, next.x);
          assert.ok(arrow.y >= card.y + card.height && arrow.y + arrow.height <= next.y);
        }
      }
      if (process.env.PROCESS_SCREENSHOT_DIR && [390, 1440].includes(width)) {
        await page.locator('.process-section').screenshot({ path: `${process.env.PROCESS_SCREENSHOT_DIR}/process-${width}.png` });
      }
    }
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

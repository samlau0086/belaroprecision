import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('业务页面与全部 Materials 页面：唯一 RFQ、页内定位和响应式布局', async () => {
  const materialDirs = await readdir(new URL('../dist/materials/', import.meta.url), { withFileTypes: true });
  const routes = [
    '/machined-parts/', '/industries/', '/quality/', '/services/',
    '/services/cnc-turning/', '/services/secondary-processes/', '/services/production/',
    ...materialDirs.filter(entry => entry.isDirectory()).map(entry => `/materials/${entry.name}/`),
  ];
  assert.equal(materialDirs.filter(entry => entry.isDirectory()).length, 6);
  const server = createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      const file = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
      const body = await readFile(new URL(`../dist${file}`, import.meta.url));
      const types = { html: 'text/html', css: 'text/css', js: 'text/javascript', webp: 'image/webp' };
      res.setHeader('Content-Type', types[file.split('.').pop()] ?? 'application/octet-stream');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const screenshots = await mkdtemp(join(tmpdir(), 'belaro-rfq-pages-'));
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    for (const path of routes) {
      await page.goto(`${base}${path}`);
      assert.equal(await page.locator('form').count(), 1, path);
      assert.equal(await page.locator('main #rfq-form').count(), 1, path);
      assert.equal(await page.locator('#drawing-file').count(), 1, path);
      assert.equal(await page.locator('header a[href="#rfq-form"]').count(), 2, path);
      assert.equal(await page.locator('footer a[href="#rfq-form"]').count(), 1, path);
      assert.equal(await page.locator('[name=process]').inputValue(), path === '/services/cnc-turning/' ? 'CNC Turning' : '', path);
      await page.locator('[name=name]').fill('RFQ Buyer');
      for (const width of [320, 390, 700, 701, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.locator('footer a[href="#rfq-form"]').click();
        assert.equal(new URL(page.url()).pathname, path);
        assert.equal(new URL(page.url()).hash, '#rfq-form');
        assert.equal(await page.locator('[name=name]').inputValue(), 'RFQ Buyer');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${path} ${width}px`);
        const fields = await page.locator('.rfq-layout > .rfq-intro, .rfq-layout > .rfq-form').evaluateAll(nodes => nodes.map(node => {
          const { x, y, width } = node.getBoundingClientRect();
          return { x, y, width };
        }));
        assert.equal(fields.length, 2);
        assert.ok(fields.every(field => field.x >= 0 && field.x + field.width <= width + 1));
        assert.ok(width <= 700 ? fields[1].y > fields[0].y : fields[1].x > fields[0].x, `${path} ${width}px 表单双栏/单栏布局`);
        if ([390, 1440].includes(width)) {
          await page.locator('.rfq-layout').screenshot({ path: join(screenshots, `${path.split('/').filter(Boolean).join('-')}-${width}.png`) });
        }
      }
      await page.locator('.rfq-optional summary').click();
      await page.locator('[name=process]').selectOption('CNC Milling');
      assert.equal(await page.locator('[name=process]').inputValue(), 'CNC Milling');
      await page.locator('#drawing-file').setInputFiles({ name: 'part.step', mimeType: 'application/octet-stream', buffer: Buffer.from('test drawing') });
      assert.match(await page.locator('#drawing-status').textContent(), /part.step/);
    }
    assert.deepEqual(errors, []);
    console.log(`RFQ 布局截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

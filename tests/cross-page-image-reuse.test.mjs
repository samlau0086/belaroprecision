import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright';

const added = {
  '/': [['#capability-overview', 'milling-three-axis-plate-setup'], ['#capability-overview', 'milling-indexed-angled-bracket'], ['#capability-overview', 'milling-five-axis-contoured-mount'], ['#capability-overview', 'turning-shaft-shoulder-cut']],
  '/services/': [['#secondary-processes', 'secondary-ground-shaft-detail'], ['#production', 'production-separated-components-batch']],
  '/services/cnc-milling/': [['.secondary-media', 'secondary-ground-shaft-detail']],
  '/services/cnc-turning/': [['.secondary-media', 'secondary-ground-shaft-detail']],
  '/about/': [['.secondary-media', 'secondary-finished-housing-masking-detail']],
  '/industries/': [['.application-capabilities', 'milling-three-axis-plate-setup'], ['.application-capabilities', 'turning-shaft-shoulder-cut'], ['.application-capabilities', 'production-separated-components-batch'], ['.secondary-media', 'secondary-finished-housing-masking-detail']],
  '/machined-parts/': [['.requirements-grid', 'home-drawing-led-component-review'], ['.requirements-grid', 'quality-critical-dimension-check'], ['.requirements-grid', 'production-separated-components-batch'], ['.secondary-media', 'secondary-finished-housing-masking-detail']],
  '/services/production/': [['#production-flow', 'home-drawing-led-component-review'], ['.scope-list', 'quality-protective-packaging'], ['.scope-list', 'quality-batch-identification'], ['.secondary-media', 'secondary-finished-housing-masking-detail']],
  '/quality/': [['#requirements', 'home-drawing-led-component-review']],
};

test('新增主资产与复用需求建立关联，已交付共享图片保持单一源文件', async () => {
  const slots = [];
  for (const filename of await readdir('docs/image-requirements')) {
    if (!filename.endsWith('.md')) continue;
    const source = await readFile(join('docs/image-requirements', filename), 'utf8');
    const route = source.match(/页面路径：`([^`]+)`/)?.[1];
    if (!route) continue;
    for (const block of source.split(/(?=^### )/m)) {
      const status = block.match(/^- 状态：(新增|替换|复用|保留)(?:。|，)/m)?.[1];
      const image = block.match(/英文文件名：`([^`]+)`/)?.[1];
      if (status && image) slots.push({ route, status, image });
    }
  }
  const masters = slots.filter(item => ['新增', '替换'].includes(item.status));
  assert.equal(masters.length, 34);
  const shared = masters.filter(master => slots.some(item => item.status === '复用' && item.image === master.image));
  assert.equal(shared.length, 8);
  const assets = await readdir('src/assets/images', { recursive: true });
  for (const master of shared) {
    assert.equal(assets.filter(path => path.replaceAll('\\', '/').split('/').pop() === master.image).length, 1, master.image);
  }
  assert.equal(slots.filter(item => item.status === '复用' && item.route !== '/contact/' && shared.some(master => master.image === item.image)).length, 19);
});

test('跨页复用：逐条核对需求、实际图位、加载及桌面手机等比展示', { timeout: 180000 }, async () => {
  const requirements = [];
  for (const filename of await readdir('docs/image-requirements')) {
    if (!filename.endsWith('.md')) continue;
    const source = await readFile(join('docs/image-requirements', filename), 'utf8');
    const route = source.match(/页面路径：`([^`]+)`/)?.[1];
    if (!route) continue;
    for (const block of source.split(/(?=^### )/m)) {
      if (!block.includes('- 状态：复用。')) continue;
      const image = block.match(/英文文件名：`([^`]+)`/)?.[1];
      assert.ok(image, filename);
      requirements.push({ route, image: image.replace(/\.webp$/, '') });
    }
  }
  assert.equal(requirements.length, 35);
  const assets = await readdir('src/assets/images', { recursive: true });
  for (const { image } of requirements) {
    const sources = assets.filter(path => path.replaceAll('\\', '/').split('/').pop() === `${image}.webp`);
    assert.equal(sources.length, 1, `共享源文件应唯一：${image}`);
  }
  assert.equal(assets.filter(path => path.endsWith('production-separated-components-batch.webp')).length, 1);
  const ready = requirements.filter(item => item.route !== '/contact/');
  assert.equal(ready.length, 34);
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const file = path.endsWith('/') ? `${path}index.html` : path;
      const body = await readFile(new URL(`../dist${file}`, import.meta.url));
      res.setHeader('Content-Type', ({ css: 'text/css', js: 'text/javascript', html: 'text/html', webp: 'image/webp' })[file.split('.').pop()] ?? 'application/octet-stream');
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
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-reuse-'));
    for (const route of new Set(ready.map(item => item.route))) {
      await page.goto(base + route);
      for (const item of ready.filter(item => item.route === route)) {
        assert.ok(await page.locator(`main img[src*="/${item.image}."]`).count(), `${route}: ${item.image}`);
      }
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const { image } of ready.filter(item => item.route === route)) {
          const img = page.locator(`main img[src*="/${image}."][alt]:not([alt=""])`).first();
          // 综合加工页按需求在手机端隐藏 RFQ 辅助图，不能将其误判为缺图。
          if (route === '/services/cnc-machining/' && image === 'contact-rfq' && width <= 700) {
            assert.equal(await img.isVisible(), false);
            continue;
          }
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(node => new Promise((resolve, reject) => {
            if (node.complete && node.naturalWidth > 0) return resolve();
            node.addEventListener('load', resolve, { once: true });
            node.addEventListener('error', () => reject(new Error(`图片加载失败：${node.currentSrc}`)), { once: true });
          }));
          await img.evaluate(node => node.decode()).catch(error => { throw new Error(`${route} ${width}px ${image}: ${error.message}`); });
          assert.equal(await img.isVisible(), true, `${route} ${width}px ${image}`);
          const metrics = await img.evaluate(node => ({
            width: node.getBoundingClientRect().width,
            height: node.getBoundingClientRect().height,
            ratio: node.naturalWidth / node.naturalHeight,
            fit: getComputedStyle(node).objectFit,
            alt: node.alt,
          }));
          assert.ok(metrics.width > 0 && metrics.height > 0 && metrics.ratio > 0, `${route} ${image}`);
          assert.ok(metrics.alt.trim().length > 0, `${route} ${image} 缺少 Alt`);
          assert.ok(['contain', 'cover'].includes(metrics.fit) || Math.abs(metrics.height - metrics.width / metrics.ratio) < 1,
            `${route} ${width}px ${image} 可能拉伸：${JSON.stringify(metrics)}`);
        }
        for (const [selector, name] of added[route] ?? []) {
          const img = page.locator(`${selector} img[src*="/${name}."]`);
          assert.equal(await img.count(), 1, `${route} ${selector} ${name}`);
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(node => new Promise((resolve, reject) => {
            if (node.complete && node.naturalWidth > 0) return resolve();
            node.addEventListener('load', resolve, { once: true });
            node.addEventListener('error', () => reject(new Error(`图片加载失败：${node.currentSrc}`)), { once: true });
          }));
          await img.evaluate(node => node.decode()).catch(async error => { throw new Error(`${route} ${width}px ${name}: ${await img.getAttribute('src')} ${error.message}`); });
          const metrics = await img.evaluate(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, ratio: node.naturalWidth / node.naturalHeight, fit: getComputedStyle(node).objectFit }));
          assert.ok(metrics.width > 0 && metrics.height > 0);
          assert.ok(Math.abs(metrics.height - metrics.width / metrics.ratio) < 1, JSON.stringify(metrics));
          assert.equal(metrics.fit, 'contain');
          assert.ok(await img.getAttribute('srcset'));
          assert.ok(await img.getAttribute('sizes'));
          assert.ok((await img.getAttribute('alt')).length > 20);
          assert.equal(await img.getAttribute('loading'), 'lazy');
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route} ${width}px`);
        assert.doesNotMatch(await page.locator('main').innerText(), /AI illustrations?|AI[-\s]*generated/i);
        if (added[route]) {
          const section = page.locator(added[route][0][0]).first();
          await section.screenshot({ path: join(screenshots, `${route.replaceAll('/', '-') || 'home'}-${width}.png`), style: '.site-header { visibility: hidden; }' });
        }
      }
    }
    await page.goto(base + '/contact/');
    assert.equal(await page.locator('main img').count(), 1, '按文档保持 Contact 单图，避免重复');
    assert.deepEqual(errors, []);
    console.log(`跨页复用截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

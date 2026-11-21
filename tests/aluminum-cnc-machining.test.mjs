import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('铝合金页面：九章节、材料菜单、图片、SEO、FAQ 和询价入口', async () => {
  const path = '/materials/aluminum-cnc-machining/';
  const server = createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      const file = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
      const body = await readFile(new URL(`../dist${file}`, import.meta.url));
      const types = { css: 'text/css', js: 'text/javascript', webp: 'image/webp', html: 'text/html' };
      res.setHeader('Content-Type', types[file.split('.').pop()] ?? 'application/octet-stream');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const screenshots = await mkdtemp(join(tmpdir(), 'belaro-aluminum-'));
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(`${base}${path}`);
    assert.match(await page.title(), /Aluminum CNC Machining.*Belaro Precision/);
    assert.equal(await page.locator('h1').innerText(), 'Precision Aluminum CNC Machining for OEM Components');
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('main section').count(), 10);
    assert.equal(await page.locator('main h2').count(), 9);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://belaroprecision.com${path}`);
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 50);
    assert.equal(await page.locator('.grade-grid article').count(), 3);
    assert.equal(await page.locator('#rfq-form').count(), 1);
    assert.equal(await page.locator('#drawing-file').getAttribute('type'), 'file');
    const imageMapping = [
      ['.aluminum-hero', ['aluminum-cnc-machining-oem-housing-hero']],
      ['#capabilities', ['aluminum-milled-equipment-bracket-features']],
      ['#components', ['aluminum-cnc-mounting-bracket', 'aluminum-cnc-locating-block', 'aluminum-cnc-instrument-housing', 'aluminum-cnc-stepped-shaft']],
      ['#processes', ['aluminum-cnc-milling-housing-pocket', 'aluminum-cnc-turning-flange-adapter', 'aluminum-three-axis-milling-mounting-plate', 'aluminum-indexed-milling-angled-bracket', 'aluminum-five-axis-contoured-mount']],
      ['#quality', ['aluminum-housing-cmm-hole-inspection']],
      ['#production', ['aluminum-oem-brackets-batch-packing']],
    ];
    for (const [selector, filenames] of imageMapping) {
      assert.equal(await page.locator(`${selector} img`).count(), filenames.length);
      for (const [index, filename] of filenames.entries()) {
        const img = page.locator(`${selector} img`).nth(index);
        assert.ok((await img.getAttribute('src')).includes(filename), filename);
        assert.ok((await img.getAttribute('alt')).length > 20);
        assert.ok(await img.getAttribute('srcset'));
        assert.ok(await img.getAttribute('sizes'));
        assert.equal(await img.getAttribute('loading'), selector === '.aluminum-hero' ? 'eager' : 'lazy');
      }
    }
    assert.match(await page.locator('#processes article').nth(1).innerText(), /CNC Turning/);
    assert.match(await page.locator('#processes article').nth(1).locator('img').getAttribute('alt'), /lathe chuck.*turning tool/);
    assert.match(await page.locator('#quality img').getAttribute('alt'), /machine-mounted dimensional probe/i);
    assert.match(await page.locator('#production img').getAttribute('alt'), /housing frames/);
    assert.match(await page.locator('#finishing').innerText(), /supplier availability/);
    assert.deepEqual(await page.locator('.finish-grid h3').allTextContents(), ['As-Machined', 'Bead Blasting', 'Clear Anodizing', 'Hard Anodizing', 'Powder Coating']);
    assert.equal(await page.locator('.finish-grid article').count(), 5);
    assert.equal(await page.locator('.finish-grid img').count(), 5);
    assert.equal(await page.locator('.finish-image-note').innerText(), 'Actual texture and color are agreed per order.');
    assert.doesNotMatch(await page.locator('main').innerText(), /AI[-\s]*generated|AI illustration/i);
    const finishFilenames = ['as-machined-aluminum-mounting-bracket', 'bead-blasted-aluminum-sensor-housing', 'clear-anodized-aluminum-flange-adapter', 'hard-anodized-aluminum-guide-carriage', 'blue-coated-aluminum-equipment-cover'];
    for (const [index, filename] of finishFilenames.entries()) {
      const img = page.locator('.finish-grid img').nth(index);
      assert.ok((await img.getAttribute('src')).includes(filename));
      assert.ok((await img.getAttribute('alt')).length > 20);
      assert.ok(await img.getAttribute('srcset'));
      assert.equal(await img.getAttribute('loading'), 'lazy');
    }
    assert.match(await readFile('dist/sitemap.xml', 'utf8'), /\/materials\/aluminum-cnc-machining\//);
    const links = await page.locator('main a').evaluateAll(nodes => [...new Set(nodes.map(node => node.href))]);
    for (const href of links) {
      const target = new URL(href);
      assert.equal((await page.request.get(href)).status(), 200, href);
      await page.goto(href);
      if (target.hash) assert.equal(await page.locator(target.hash).count(), 1, href);
    }
    for (const width of [320, 390, 700, 701, 1024, 1100, 1101, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${base}${path}`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 横向溢出`);
      await page.locator('main img').evaluateAll(nodes => Promise.all(nodes.map(node => { node.loading = 'eager'; return node.decode(); })));
      assert.equal(await page.locator('main img:not(.finish-grid img)').count(), 13);
      assert.equal(await page.locator('main img').count(), 18);
      assert.equal(await page.locator('main img:not(.hero-photo)').evaluateAll(nodes => nodes.every(node => {
        const rect = node.getBoundingClientRect();
        const parent = node.parentElement.getBoundingClientRect();
        return rect.width > 0 && rect.left >= parent.left - 1 && rect.right <= parent.right + 1;
      })), true, `${width}px 图片不应超出容器`);
      if (width > 1100) {
        const brand = await page.locator('.site-header .brand').boundingBox();
        const nav = await page.locator('.desktop-nav').boundingBox();
        const cta = await page.locator('.nav-cta').boundingBox();
        assert.ok(brand.x + brand.width <= nav.x && nav.x + nav.width <= cta.x, `${width}px 导航不应重叠`);
        await page.locator('.nav-material-trigger').focus();
        assert.equal(await page.locator('.materials-dropdown .nav-dropdown-menu').isVisible(), true);
        await page.locator(`.materials-dropdown .nav-dropdown-menu a[href="${path}"]`).click();
      } else {
        await page.locator('[data-menu-toggle]').click();
        await page.locator('.mobile-material-toggle').click();
        await page.locator(`.mobile-material-group a[href="${path}"]`).click();
        assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'false');
        await page.locator('[data-menu-toggle]').click();
        assert.equal(await page.locator('.mobile-material-group').evaluate(el => el.open), false);
        await page.keyboard.press('Escape');
      }
      await page.locator('.aluminum-hero .button').click();
      assert.equal(new URL(page.url()).hash, '#rfq-form');
      const formTop = await page.locator('#rfq-form').evaluate(el => el.getBoundingClientRect().top);
      const headerBottom = await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().bottom);
      assert.ok(formTop >= headerBottom, '询价表单不应被吸顶导航遮挡');
      await page.locator('.faq-list summary').first().focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('.faq-list details').first().getAttribute('open'), '');
      if ([390, 1440].includes(width)) {
        await page.goto(`${base}${path}`);
        await page.locator('main img').evaluateAll(nodes => Promise.all(nodes.map(node => { node.loading = 'eager'; return node.decode(); })));
        await page.screenshot({ path: join(screenshots, `aluminum-${width}.png`), fullPage: true });
        await page.locator('#finishing').screenshot({ path: join(screenshots, `finishing-${width}.png`) });
        await page.locator('#processes').screenshot({ path: join(screenshots, `processes-${width}.png`) });
        await page.locator('.aluminum-hero').screenshot({ path: join(screenshots, `hero-${width}.png`) });
      }
    }
    const staticPage = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    await staticPage.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await staticPage.goto(`${base}${path}`);
    await staticPage.locator('.faq-list summary').first().click();
    assert.equal(await staticPage.locator('.faq-list details').first().getAttribute('open'), '');
    assert.equal(await staticPage.locator('#rfq-form noscript').isVisible(), true);
    assert.deepEqual(errors, []);
    console.log(`铝合金页面截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

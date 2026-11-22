import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('不锈钢页面：九章节、材料菜单、图片、SEO、FAQ 和询价入口', async () => {
  const path = '/materials/stainless-steel-cnc-machining/';
  const aluminumPath = '/materials/aluminum-cnc-machining/';
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
  const screenshots = await mkdtemp(join(tmpdir(), 'belaro-stainless-'));
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(`${base}${path}`);
    assert.match(await page.title(), /Stainless Steel CNC Machining.*Belaro Precision/);
    assert.equal(await page.locator('h1').innerText(), 'Precision Stainless Steel CNC Machining for OEM Components');
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('main section').count(), 10);
    assert.equal(await page.locator('main h2').count(), 9);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://belaroprecision.com${path}`);
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 50);
    assert.equal(await page.locator('.grade-grid article').count(), 4);
    assert.match(await page.locator('#stainless-grades').innerText(), /303/);
    assert.match(await page.locator('#stainless-grades').innerText(), /304/);
    assert.match(await page.locator('#stainless-grades').innerText(), /316 \/ 316L/);
    assert.match(await page.locator('#stainless-grades').innerText(), /17-4 PH/);
    assert.equal(await page.locator('#rfq-form').count(), 1);
    assert.equal(await page.locator('#drawing-file').getAttribute('type'), 'file');
    assert.match(await page.locator('#finishing').innerText(), /supplier availability/);
    assert.match(await readFile('dist/sitemap.xml', 'utf8'), /\/materials\/stainless-steel-cnc-machining\//);
    const imageGroups = [
      ['.stainless-hero', ['stainless-steel-cnc-machining-oem-components-hero']],
      ['#capabilities', ['stainless-steel-machined-port-body-features']],
      ['#components', ['stainless-steel-cnc-precision-stepped-shaft', 'stainless-steel-cnc-flanged-sleeve', 'stainless-steel-cnc-threaded-connector', 'stainless-steel-cnc-equipment-interface-block']],
      ['#processes', ['stainless-steel-cnc-milling-interface-body', 'stainless-steel-cnc-turning-shaft-shoulder', 'stainless-steel-three-axis-milling-plate', 'stainless-steel-indexed-milling-angled-port', 'stainless-steel-five-axis-contoured-housing']],
      ['#quality', ['stainless-steel-shaft-runout-inspection']],
      ['#finishing', ['stainless-steel-clean-connector-passivation-context', 'bead-blasted-stainless-steel-sensor-cover', 'polished-stainless-steel-equipment-collar']],
      ['#production', ['stainless-steel-connectors-small-batch-packing']],
    ];
    for (const [selector, names] of imageGroups) {
      const pictures = page.locator(`${selector} img`);
      assert.equal(await pictures.count(), names.length, selector);
      for (const [index, name] of names.entries()) {
        const picture = pictures.nth(index);
        assert.ok((await picture.getAttribute('src')).includes(name), name);
        assert.ok(await picture.getAttribute('srcset'), name);
        assert.ok(await picture.getAttribute('sizes'), name);
        const alt = await picture.getAttribute('alt');
        assert.ok(alt.length > 20 && !/AI illustration/i.test(alt), name);
        assert.equal(await picture.getAttribute('loading'), selector === '.stainless-hero' ? 'eager' : 'lazy');
      }
    }
    assert.match(await page.locator('#processes img').nth(1).getAttribute('alt'), /Lathe chuck.*turning tool/);
    assert.doesNotMatch(await page.locator('#finishing img').first().getAttribute('alt'), /passivat/i);
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
      assert.equal(await page.locator('main img').count(), 16);
      assert.equal(await page.locator('main img:not(.hero-photo)').evaluateAll(nodes => nodes.every(node => {
        const box = node.getBoundingClientRect();
        return Math.abs(box.height - box.width * Number(node.getAttribute('height')) / Number(node.getAttribute('width'))) < 1;
      })), true, `${width}px 正文图片应保持原始比例`);
      assert.equal(await page.locator('main img:not(.hero-photo)').evaluateAll(nodes => nodes.every(node => getComputedStyle(node).objectFit === 'contain')), true, `${width}px 正文图片不应裁切`);
      assert.equal(await page.locator('.hero-photo').evaluate(node => {
        const image = node.getBoundingClientRect();
        const hero = node.parentElement.getBoundingClientRect();
        return getComputedStyle(node).objectFit === 'cover'
          && Math.abs(image.x - hero.x) < 1 && Math.abs(image.y - hero.y) < 1
          && Math.abs(image.width - hero.width) < 1 && Math.abs(image.height - hero.height) < 1
          && Math.abs(hero.width - innerWidth) < 1;
      }), true, `${width}px Hero 应全宽铺满背景`);
      assert.equal(await page.locator('main img:not(.hero-photo)').evaluateAll(nodes => nodes.every(node => node.getBoundingClientRect().width <= node.parentElement.getBoundingClientRect().width + 1)), true, `${width}px 图片超出容器`);
      if (width > 1100) {
        const brand = await page.locator('.site-header .brand').boundingBox();
        const nav = await page.locator('.desktop-nav').boundingBox();
        const cta = await page.locator('.nav-cta').boundingBox();
        assert.ok(brand.x + brand.width <= nav.x && nav.x + nav.width <= cta.x, `${width}px 导航不应重叠`);
        await page.locator('.nav-material-trigger').focus();
        assert.equal(await page.locator('.materials-dropdown .nav-dropdown-menu').isVisible(), true);
        assert.equal(await page.locator(`.materials-dropdown .nav-dropdown-menu a[href="${aluminumPath}"]`).count(), 1);
        assert.equal(await page.locator(`.materials-dropdown .nav-dropdown-menu a[href="${path}"]`).count(), 1);
        await page.locator(`.materials-dropdown .nav-dropdown-menu a[href="${path}"]`).click();
      } else {
        await page.locator('[data-menu-toggle]').click();
        await page.locator('.mobile-material-toggle').click();
        assert.equal(await page.locator(`.mobile-material-group a[href="${aluminumPath}"]`).count(), 1);
        assert.equal(await page.locator(`.mobile-material-group a[href="${path}"]`).count(), 1);
        await page.locator(`.mobile-material-group a[href="${path}"]`).click();
        assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'false');
        await page.locator('[data-menu-toggle]').click();
        assert.equal(await page.locator('.mobile-material-group').evaluate(el => el.open), false);
        await page.keyboard.press('Escape');
      }
      await page.locator('.stainless-hero .button').click();
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
        await page.screenshot({ path: join(screenshots, `stainless-${width}.png`), fullPage: true });
        for (const section of ['processes', 'finishing']) {
          await page.locator(`#${section}`).screenshot({ path: join(screenshots, `stainless-${section}-${width}.png`) });
        }
      }
    }
    const staticPage = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    await staticPage.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await staticPage.goto(`${base}${path}`);
    await staticPage.locator('.faq-list summary').first().click();
    assert.equal(await staticPage.locator('.faq-list details').first().getAttribute('open'), '');
    assert.equal(await staticPage.locator('#rfq-form noscript').isVisible(), true);
    assert.deepEqual(errors, []);
    console.log(`不锈钢页面截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

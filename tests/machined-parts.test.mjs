import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('零件页：响应式导航、无脚本内容、FAQ、SEO 与询价预填', async () => {
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
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await page.goto(`${baseUrl}/machined-parts/`);
    assert.match(await page.title(), /Custom CNC Machined Parts.*Belaro Precision/);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://belaroprecision.com/machined-parts/');
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 40);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.part-card').count(), 6);
    assert.equal(await page.locator('.part-card .part-image').count(), 6);
    assert.equal(await page.locator('.part-gallery img').count(), 14);
    const blockDetails = page.locator('#machined-blocks .part-gallery img');
    assert.equal(await blockDetails.count(), 2);
    for (const image of await blockDetails.all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
      assert.ok(await image.evaluate(image => image.naturalWidth > 0), '加工块细节图应正常加载');
    }
    assert.equal(await page.locator('.illustration-label').count(), 6);
    await page.getByRole('link', { name: 'Precision Shafts', exact: true }).click();
    assert.equal(new URL(page.url()).hash, '#precision-shafts');
    await page.locator('.faq-list summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.parts-faq details').first().getAttribute('open'), '');
    const shots = await mkdtemp(join(tmpdir(), 'belaro-parts-'));
    for (const width of [320, 390, 700, 701, 768, 1024, 1100, 1101, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 不应横向溢出`);
      const cards = await page.locator('.part-card').evaluateAll(nodes => nodes.slice(0, 2).map(node => { const { x, y } = node.getBoundingClientRect(); return { x, y }; }));
      assert.equal(width <= 700 ? cards[0].x === cards[1].x : cards[0].y === cards[1].y, true, `${width}px 零件卡片列数`);
      if (width <= 1100) {
        await page.getByRole('button', { name: 'Toggle navigation' }).click();
        assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'true');
        assert.equal(await page.locator('.mobile-nav').getByRole('link', { name: 'Machined Parts' }).isVisible(), true);
        assert.equal(await page.locator('.menu-toggle i').count(), 3, '移动菜单图标应为三横线');
        assert.equal(await page.locator('.mobile-capability-group').evaluate(el => el.open), false, '能力子菜单默认收起');
        assert.equal(await page.locator('.mobile-nav .mobile-nav-cta').getAttribute('class').then(value => value.includes('button-orange')), true, '移动端询价入口应显示为按钮');
        assert.equal(await page.locator('.mobile-nav .mobile-nav-cta').evaluate(el => getComputedStyle(el).paddingInline), '20px', '移动端询价按钮应保留左右留白');
        assert.equal(await page.locator('.mobile-capability-toggle span').evaluate(el => getComputedStyle(el).width), '7px', '能力菜单下拉指示器应使用稳定尺寸');
        await page.locator('.mobile-capability-toggle').click();
        assert.equal(await page.locator('#mobile-capability-links').isVisible(), true, '点击能力菜单后展开子链接');
        await page.locator('.mobile-capability-toggle').click();
        assert.equal(await page.locator('#mobile-capability-links').isVisible(), false, '再次点击能力菜单后收起子链接');
        await page.locator('.mobile-capability-toggle').click();
        await page.getByRole('button', { name: 'Toggle navigation' }).click();
        await page.getByRole('button', { name: 'Toggle navigation' }).click();
        assert.equal(await page.locator('.mobile-capability-group').evaluate(el => el.open), false, '重新打开主菜单时能力子菜单应重置为收起');
        await page.getByRole('button', { name: 'Toggle navigation' }).click();
      } else {
        assert.equal(await page.locator('.desktop-nav').getByRole('link', { name: 'Machined Parts' }).isVisible(), true);
        const overlap = await page.locator('.nav-wrap').evaluate(el => { const brand = el.querySelector('.brand').getBoundingClientRect(); const nav = el.querySelector('.desktop-nav').getBoundingClientRect(); const cta = el.querySelector('.nav-cta').getBoundingClientRect(); return brand.right > nav.left || nav.right > cta.left; });
        assert.equal(overlap, false, `${width}px 导航不应重叠`);
      }
      if ([390, 1440].includes(width)) await page.screenshot({ path: join(shots, `parts-${width}.png`), fullPage: true });
    }
    // 沿实际页面入口进入表单，验证所有类别对应的工艺和描述。
    const links = await page.locator('.part-card .text-link').evaluateAll(nodes => nodes.map(node => ({ href: node.getAttribute('href'), title: node.closest('article').querySelector('h3').textContent, process: node.closest('article').querySelector('.part-process').textContent })));
    for (const link of links) {
      await page.goto(`${baseUrl}${link.href}`);
      assert.equal(await page.locator('[name="process"]').inputValue(), link.process);
      assert.match(await page.locator('[name="details"]').inputValue(), new RegExp(`^Part family: ${link.title}`));
      await page.locator('.rfq-optional summary').click();
      await page.locator('[name="details"]').fill('My own part requirements');
      assert.equal(await page.locator('[name="details"]').inputValue(), 'My own part requirements');
    }
    for (const query of ['', '?part=unknown', '?part=%3Cscript%3E']) {
      await page.goto(`${baseUrl}/contact/${query}`);
      assert.equal(await page.locator('[name="process"]').inputValue(), '');
      assert.equal(await page.locator('[name="details"]').inputValue(), '');
    }
    await page.goto(baseUrl);
    assert.equal(await page.locator('.parts-preview-card').count(), 4);
    await page.getByRole('link', { name: 'Explore machined parts' }).click();
    assert.equal(new URL(page.url()).pathname, '/machined-parts/');
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    await noJs.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    const staticPage = await noJs.newPage();
    await staticPage.goto(`${baseUrl}/machined-parts/`);
    assert.equal(await staticPage.locator('.part-card').count(), 6);
    await staticPage.locator('.faq-list summary').first().click();
    assert.equal(await staticPage.locator('.parts-faq details').first().getAttribute('open'), '');
    await noJs.close();
    assert.deepEqual(errors, []);
    console.log(`零件页截图：${shots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

test('About：能力边界、链接、SEO、FAQ 与响应式布局', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const file = path.endsWith('/') ? `${path}index.html` : path;
      const body = await readFile(new URL(`../dist${file}`, import.meta.url));
      const types = { css: 'text/css', js: 'text/javascript', webp: 'image/webp', png: 'image/png', svg: 'image/svg+xml' };
      res.setHeader('Content-Type', types[file.split('.').at(-1)] || 'text/html');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = process.env.ABOUT_BASE_URL ?? `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(`${base}/about/`);
    assert.match(await page.title(), /About Belaro Precision/);
    assert.equal(await page.locator('main h1').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://belaroprecision.com/about/');
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 50);
    assert.match(await page.locator('.company-profile').innerText(), /3-axis, 3\+2 & simultaneous 5-axis/);
    assert.match(await page.locator('main').innerText(), /supplier network/);
    assert.match(await page.locator('main details').nth(1).textContent(), /suppliers in Dongguan and Shenzhen/);
    assert.equal(await page.locator('.working-steps li').count(), 4);
    assert.equal(await page.locator('#manufacturing-scope article').count(), 2);
    assert.equal(await page.locator('#manufacturing-scope img, .about-fixture-image').count(), 0);
    assert.equal(await page.locator('#manufacturing-scope .container > :last-child').getAttribute('class'), 'scope-grid');
    assert.match(await page.locator('#manufacturing-scope').innerText(), /OWN MACHINING CAPABILITY/);
    assert.equal(await page.locator('#supplier-coordination .supplier-steps > li').count(), 4);
    assert.match(await page.locator('#supplier-coordination').innerText(), /confidentiality/);
    assert.equal(await page.locator('#workshop-team article').count(), 3);
    assert.doesNotMatch(await page.locator('main').innerText(), /illustrative/i);
    assert.equal(await page.locator('#workshop-team img').count(), 5);
    assert.equal(await page.locator('main img').count(), 10);
    const imageMapping = [
      ['.about-hero-media', 'about-verified-workshop-hero'],
      ['#our-approach .about-drawing-image', 'home-drawing-led-component-review'],
      ['#workshop-team .media-card:nth-child(2)', 'about-simultaneous-5-axis-cnc'],
      ['#supplier-coordination .about-handoff-image', 'quality-batch-identification'],
      ['.about-quality .about-quality-image', 'quality-critical-dimension-check'],
    ];
    for (const [selector, filename] of imageMapping) {
      const img = page.locator(`${selector} img`);
      assert.equal(await img.count(), 1);
      assert.ok((await img.getAttribute('src')).includes(filename));
      assert.ok(await img.getAttribute('srcset'));
      assert.ok(await img.getAttribute('sizes'));
      assert.ok((await img.getAttribute('alt')).length > 20);
      assert.doesNotMatch(await img.getAttribute('alt'), /verified|our factory/i);
      assert.equal(await img.getAttribute('loading'), selector.includes('hero') ? 'eager' : 'lazy');
    }
    assert.equal(await page.locator('.about-hero-media img').getAttribute('fetchpriority'), 'high');
    // 移除图片作用域标记，检验页面容器仍能保证等比显示。
    await page.locator('main img').evaluateAll(nodes => nodes.forEach(node => {
      for (const name of node.getAttributeNames()) if (name.startsWith('data-astro-cid-')) node.removeAttribute(name);
    }));
    for (const image of await page.locator('#workshop-team img').all()) {
      await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(node => node.complete && node.naturalWidth > 0, await image.elementHandle());
      await image.evaluate(node => node.decode());
      assert.ok(await image.evaluate(node => node.naturalWidth > 0));
    }
    await page.locator('#workshop-team img').first().scrollIntoViewIfNeeded();
    await page.locator('#workshop-team img').first().waitFor({ state: 'visible' });
    await page.waitForFunction(() => {
      const image = document.querySelector('#workshop-team img');
      return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
    });
    assert.match(await page.locator('#company-contact').innerText(), /Shajing, Bao'an District, Shenzhen, Guangdong, China/);
    assert.equal(await page.locator('#company-contact dl > div').filter({ hasText: 'Shenzhen Office' }).locator('dd').innerText(), "Shajing, Bao'an District, Shenzhen, Guangdong, China");
    assert.equal(await page.locator('#company-contact dl > div').filter({ hasText: 'Dongguan CNC Factory' }).locator('dd').innerText(), 'Mingsheng Machinery Factory, Building A, Yonglida Smart Industrial Park, No. 115 Xinhua South Road, Xinhe Community, Wanjiang Subdistrict, Dongguan, Guangdong, China');
    assert.equal(await page.locator('#company-contact a[href="mailto:sales@belaroprecision.com"]').count(), 1);
    assert.equal(await page.locator('#company-contact a[href="https://wa.me/8618682188709"]').count(), 1);
    const contactLabels = page.locator('#company-contact .contact-label');
    assert.equal(await contactLabels.count(), 5);
    assert.deepEqual(await contactLabels.allInnerTexts(), ['LEGAL COMPANY NAME', 'SHENZHEN OFFICE', 'DONGGUAN CNC FACTORY', 'EMAIL', 'WHATSAPP']);
    assert.equal(await contactLabels.locator('svg[aria-hidden="true"][focusable="false"] path').count(), 5);
    assert.doesNotMatch(await page.locator('main').innerText(), /深圳市极客码头科技有限公司/);
    await page.locator('main summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('main details').first().getAttribute('open'), '');
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-about-'));
    for (const width of [320, 390, 700, 701, 900, 1024, 1100, 1101, 1440, 1920, 2558]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 横向溢出`);
      for (const selector of ['.scope-grid', '.company-panel', '.contact-panel']) {
        const columns = await page.locator(selector).evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length);
        assert.equal(columns, width <= 700 ? 1 : 2, `${width}px ${selector} 列数`);
      }
      const stepColumns = await page.locator('.supplier-steps').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length);
      assert.equal(stepColumns, width <= 480 ? 1 : width <= 1000 ? 2 : 4, `${width}px 外协流程列数`);
      const contactIconSizes = await contactLabels.locator('svg').evaluateAll(nodes => nodes.map(node => { const { width, height } = node.getBoundingClientRect(); return { width, height }; }));
      assert.ok(contactIconSizes.every(size => size.width === 18 && size.height === 18), `${width}px 联系标签图标尺寸`);
      assert.notEqual(await page.locator('.scope-card').first().evaluate(node => getComputedStyle(node).backgroundColor), 'rgba(0, 0, 0, 0)');
      await page.evaluate(() => window.scrollTo(0, 0));
      const hero = await page.locator('.about-hero').boundingBox();
      assert.equal(await page.locator('.about-hero-grid').evaluate(node => getComputedStyle(node).display), 'block');
      assert.equal(await page.locator('.about-hero h1').evaluate(node => getComputedStyle(node).fontSize), width <= 700 ? '38px' : '56px');
      assert.equal(await page.locator('.company-profile').evaluate(node => getComputedStyle(node).backgroundColor), 'rgba(0, 0, 0, 0)');
      const profile = await page.locator('.about-profile-band').boundingBox();
      assert.ok(profile.y < 900, `${width}px 首屏露出企业概况`);
      assert.ok(profile.y >= hero.y + hero.height - 1, '企业概况应在背景 Hero 之后');
      const cta = await page.locator('.about-hero .button').boundingBox();
      assert.ok(cta.y >= hero.y && cta.y + cta.height <= hero.y + hero.height, '报价按钮保留在 Hero 内');
      for (const img of await page.locator('main img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(node => node.decode());
        const metrics = await img.evaluate(async node => {
          const r = node.getBoundingClientRect();
          // 使用实际像素比例，避免 srcset 密度换算后的自然尺寸取整误差。
          const bitmap = await createImageBitmap(await (await fetch(node.currentSrc)).blob());
          const ratio = bitmap.width / bitmap.height;
          bitmap.close();
          return { width: r.width, height: r.height, ratio, fit: getComputedStyle(node).objectFit };
        });
        assert.ok(metrics.width > 0 && metrics.height > 0);
        if (await img.evaluate(node => !!node.closest('.about-hero-media'))) {
          assert.equal(metrics.fit, 'cover');
          assert.ok(Math.abs(metrics.width - hero.width) < 1 && Math.abs(metrics.height - hero.height) < 1, 'Hero 背景铺满');
        } else {
          assert.equal(metrics.fit, 'contain');
          assert.ok(Math.abs(metrics.height - metrics.width / metrics.ratio) < 1, `${width}px 正文保持原始比例`);
        }
      }
      for (const selector of ['.about-handoff-image']) {
        assert.ok((await page.locator(selector).boundingBox()).width <= 640);
      }
      if ([390, 1440].includes(width)) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: join(screenshots, `about-${width}.png`), fullPage: true });
        await page.screenshot({ path: join(screenshots, `hero-${width}.png`) });
        await page.locator('#workshop-team').screenshot({ path: join(screenshots, `workshop-${width}.png`) });
      }
    }
    // 检查正文目标及锚点，不提交询盘。
    const links = await page.locator('main a').evaluateAll(nodes => [...new Set(nodes.map(node => node.href))]);
    for (const href of links) {
      const target = new URL(href);
      if (target.protocol === 'mailto:' || target.origin === 'https://wa.me') continue;
      assert.equal(target.origin, base);
      assert.equal((await page.request.get(href)).status(), 200, href);
      await page.goto(href);
      if (target.hash) assert.equal(await page.locator(target.hash).count(), 1, href);
    }
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const staticPage = await noJs.newPage();
    await staticPage.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await staticPage.goto(`${base}/about/`);
    assert.equal(await staticPage.locator('.about-capabilities article').count(), 3);
    await staticPage.locator('main summary').first().click();
    assert.equal(await staticPage.locator('main details').first().getAttribute('open'), '');
    await noJs.close();
    assert.deepEqual(errors, []);
    console.log(`About 截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

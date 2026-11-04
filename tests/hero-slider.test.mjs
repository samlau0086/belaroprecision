import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

test('Hero carousel: navigation, autoplay, pause, focus, visibility, mobile and reduced motion', async () => {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const body = await readFile(new URL(`../dist${path === '/' ? '/index.html' : path}`, import.meta.url));
      res.setHeader('Content-Type', path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : 'text/html');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.clock.install();
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await page.goto(baseUrl);
    await page.locator('.hero-controls').waitFor({ state: 'visible' });
    assert.equal(await page.getByRole('button', { name: 'Pause slideshow', exact: true }).count(), 1);
    const counter = page.locator('[data-current]');
    const current = async number => assert.equal(await counter.textContent(), number);
    const height = await page.locator('.hero').evaluate(el => el.getBoundingClientRect().height);
    await page.clock.pauseAt(new Date());
    await page.mouse.move(1430, 950);
    await page.clock.runFor(7100);
    await current('02');
    await page.getByRole('button', { name: 'Next slide', exact: true }).click();
    await current('03');
    await page.getByRole('button', { name: 'Next slide', exact: true }).click();
    await current('04');
    await page.getByRole('button', { name: 'Next slide', exact: true }).click();
    await current('01');
    await page.getByRole('button', { name: 'Previous slide', exact: true }).click();
    await current('04');
    assert.equal(await page.locator('.hero').evaluate(el => el.getBoundingClientRect().height), height);
    await page.getByRole('button', { name: /Show slide 2:/ }).click();
    await current('02');
    await page.clock.runFor(600);
    await page.locator('.hero-slide.is-active a').first().waitFor({ state: 'visible' });
    assert.equal(await page.locator('.hero-slide[inert]').count(), 3);
    assert.equal(await page.locator('.hero').getByRole('link', { name: /Request a Quote/ }).count(), 1);
    assert.equal(await page.locator('.hero-page[aria-current=true]').count(), 1);
    await page.keyboard.press('ArrowRight');
    await current('03');
    await page.keyboard.press('ArrowLeft');
    await current('02');
    await page.clock.runFor(14000);
    await current('02'); // Focus inside carousel suspends autoplay.
    await page.getByRole('button', { name: 'Pause slideshow', exact: true }).click();
    await page.locator('.site-header .brand').focus();
    await page.mouse.move(1430, 950);
    await page.clock.runFor(14000);
    await current('02');
    await page.getByRole('button', { name: 'Play slideshow', exact: true }).click();
    await page.locator('.site-header .brand').focus();
    await page.mouse.move(1430, 950);
    await page.clock.runFor(7100);
    await current('03');
    await page.mouse.move(600, 300);
    await page.clock.runFor(14000);
    await current('03'); // Hover suspends autoplay.
    await page.mouse.move(1430, 950);
    await page.locator('.cta-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.clock.runFor(1000);
    const offscreenIndex = await counter.textContent();
    await page.clock.runFor(14000);
    await current(offscreenIndex);

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.hero').scrollIntoViewIfNeeded();
    await page.clock.runFor(1000);
    await page.getByRole('button', { name: 'Pause slideshow', exact: true }).click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('button', { name: 'Play slideshow', exact: true }).waitFor();
    await page.getByRole('button', { name: /Show slide 1:/ }).click();
    await page.clock.runFor(14000);
    await current('01');
    const swipe = (start, end) => page.locator('.hero').evaluate((hero, [start, end]) => {
      const touch = point => new Touch({ identifier: 1, target: hero, clientX: point[0], clientY: point[1] });
      hero.dispatchEvent(new TouchEvent('touchstart', { touches: [touch(start)] }));
      hero.dispatchEvent(new TouchEvent('touchend', { changedTouches: [touch(end)] }));
    }, [start, end]);
    await swipe([300, 250], [100, 255]);
    await current('02');
    await swipe([100, 250], [300, 255]);
    await current('01');
    await swipe([300, 100], [200, 400]);
    await current('01'); // Vertical scrolling must not switch slides.
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (let i = 1; i <= 4; i++) {
        await page.getByRole('button', { name: new RegExp(`Show slide ${i}:`) }).click();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `overflow at ${width}px, slide ${i}`);
      }
    }
    assert.deepEqual(errors, []);
    const noScript = await browser.newPage({ javaScriptEnabled: false });
    await noScript.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    await noScript.goto(baseUrl);
    assert.equal(await noScript.locator('.hero-slide.is-active').count(), 1);
    assert.equal(await noScript.locator('.hero-controls').isVisible(), false);
    assert.equal(await noScript.locator('.hero h1').isVisible(), true);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { parseHTML } from 'linkedom';

test('广告归因：全站采集、跨页/刷新、同意与撤回、JSON/附件提交及移动端', async () => {
  let base;
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      let body = await readFile(new URL(`../dist${path.endsWith('/') ? `${path}index.html` : path}`, import.meta.url));
      if (path === '/contact/') {
        const html = body.toString();
        const { document } = parseHTML(html);
        const config = JSON.parse(document.querySelector('[data-gravity-forms]').getAttribute('data-gravity-forms'));
        assert.equal(config.fields.gclid.id, 16);
        assert.equal(config.fields.gbraid.id, 18);
        assert.equal(config.fields.wbraid.id, 17);
        config.graphqlUrl = `${base}/graphql`;
        config.turnstileSiteKey = '';
        body = Buffer.from(html.replace(/data-gravity-forms="[^"]*"/, `data-gravity-forms="${JSON.stringify(config).replaceAll('"', '&quot;')}"`));
      }
      const extension = path.split('.').at(-1);
      const contentTypes = { js:'text/javascript', css:'text/css', webp:'image/webp', png:'image/png', jpg:'image/jpeg', svg:'image/svg+xml', woff2:'font/woff2' };
      res.setHeader('Content-Type', contentTypes[extension] || 'text/html');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless:true });
    const context = await browser.newContext();
    await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const submissions = [];
    await page.route(`${base}/graphql`, route => {
      const payload = route.request().postDataBuffer().toString();
      const operation = JSON.parse(payload.startsWith('{') ? payload : payload.match(/name="operations"\r\n\r\n([^\r\n]+)/)[1]);
      submissions.push(operation.variables.input.fieldValues);
      return route.fulfill({ json:{ data:{ submitGfForm:{ entry:{id:'test-only'}, errors:[] } } } });
    });
    await page.goto(`${base}/?gclid=Landing_Click`);
    const panel = page.locator('[data-ad-preferences]');
    await panel.waitFor({ state:'visible' });
    assert.equal(await page.evaluate(() => localStorage.getItem('belaro.ad-attribution')), null);
    const screenshots = await mkdtemp(join(tmpdir(), 'belaro-attribution-'));
    for (const width of [320, 390, 700, 1440]) {
      await page.setViewportSize({ width, height:900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      for (const selector of ['[data-ad-deny]', '[data-ad-allow]']) {
        const box = await page.locator(selector).boundingBox();
        assert.ok(box.width >= 100 && box.y >= 0 && box.y + box.height <= 900);
      }
      if ([390,1440].includes(width)) await page.screenshot({ path:join(screenshots, `consent-${width}.png`) });
    }
    await page.locator('[data-ad-allow]').click();
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('belaro.ad-attribution')).ids), { gclid:'Landing_Click' });
    await page.goto(`${base}/services/cnc-milling/?gbraid=New_Braid`);
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('belaro.ad-attribution')).ids.gbraid === 'New_Braid');
    await page.locator('a[href="/contact/?process=milling#rfq-form"]').first().click();
    const expectIds = async expected => {
      await page.waitForFunction(expected => ['gclid','gbraid','wbraid'].every(field => document.querySelector(`[name="${field}"]`)?.value === (expected[field] || '')), expected);
      for (const field of ['gclid','gbraid','wbraid']) assert.equal(await page.locator(`[name="${field}"]`).getAttribute('type'), 'hidden');
    };
    await expectIds({gbraid:'New_Braid'});
    await page.reload();
    await expectIds({gbraid:'New_Braid'});
    const fill = async () => {
      await page.getByLabel('Full name *', {exact:true}).fill('Test Buyer');
      await page.getByLabel('Business email *', {exact:true}).fill('test@example.com');
      await page.getByLabel('Company name *', {exact:true}).fill('Test Company');
      await page.locator('#country-search').fill('China');
    };
    const submit = async () => {
      await page.locator('button[type="submit"]').click();
      await page.waitForFunction(() => document.querySelector('#form-status').dataset.state === 'success');
    };
    await fill();
    await submit();
    assert.deepEqual(submissions[0].filter(field => [16,17,18].includes(field.id)), [{id:18,value:'New_Braid'}]);
    await page.locator('#drawing-file').setInputFiles({name:'part.step',mimeType:'application/octet-stream',buffer:Buffer.from('test drawing')});
    await submit();
    assert.deepEqual(submissions[1].filter(field => [16,17,18].includes(field.id)), [{id:18,value:'New_Braid'}]);
    assert.equal(await page.evaluate(() => window.dataLayer.filter(item => item.event === 'generate_lead').some(item => 'gclid' in item || 'gbraid' in item || 'wbraid' in item)), false);
    const otherTab = await context.newPage();
    await otherTab.goto(`${base}/`);
    await otherTab.locator('[data-ad-preferences-open]').click();
    await otherTab.locator('[data-ad-deny]').click();
    await expectIds({});
    assert.equal(await page.evaluate(() => localStorage.getItem('belaro.ad-attribution')), null);
    await page.goto(`${base}/contact/?wbraid=Rejected_Click`);
    await fill();
    await page.locator('[name="gclid"]').evaluate(input => { input.value = 'stale-dom-value'; });
    await submit();
    assert.equal(submissions[2].some(field => [16,17,18].includes(field.id)), false);
    assert.equal(await panel.isVisible(), false);
    await otherTab.close();
    const blocked = await browser.newContext();
    await blocked.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
    const blockedPage = await blocked.newPage();
    blockedPage.on('pageerror', error => errors.push(error.message));
    await blockedPage.goto(`${base}/contact/?gclid=Blocked_Click`);
    await blockedPage.locator('[data-ad-allow]').click();
    assert.equal(await blockedPage.locator('[name="gclid"]').inputValue(), '');
    assert.equal(await blockedPage.locator('button[type="submit"]').isDisabled(), false);
    await blocked.close();
    assert.deepEqual(errors, []);
    console.log(`归因界面截图：${screenshots}`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

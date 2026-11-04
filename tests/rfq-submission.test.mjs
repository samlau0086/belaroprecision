import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { rfqFields } from '../src/lib/gravity-forms.mjs';

test('RFQ submission: mapping, attachment, validation, failure, duplicate prevention and success', async () => {
  let configured = false;
  let baseUrl;
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      let body = await readFile(new URL(`../dist${path.endsWith('/') ? `${path}index.html` : path}`, import.meta.url));
      if (path === '/contact/') {
        const config = { graphqlUrl: `${baseUrl}/graphql`, formId: 42, uploadsEnabled: true, fields: Object.fromEntries(rfqFields.map((field, i) => [field, { id: i + 1, type: ({name:'name',email:'email',attachment:'file',consent:'consent'})[field] || 'text' }])) };
        if (!configured) config.fields.attachment.id = 0;
        body = Buffer.from(body.toString().replace(/data-gravity-forms="[^"]*"/, `data-gravity-forms="${JSON.stringify(config).replace(/"/g, '&quot;')}"`));
      }
      res.setHeader('Content-Type', path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : 'text/html');
      res.end(body);
    } catch {
      res.statusCode = 404;
      res.end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    let mode = 'validation';
    let requests = 0;
    let release;
    await page.route(`${baseUrl}/graphql`, async route => {
      requests++;
      assert.equal(route.request().url(), `${baseUrl}/graphql`);
      const payload = route.request().postDataBuffer().toString();
      assert.match(payload, /"id":42/);
      assert.match(payload, /"nameValues":\{"first":"Test","last":"Buyer"\}/);
      assert.match(payload, /"id":6,"value":"Custom alloy"/);
      assert.match(payload, /"id":12,"value":"1"/);
      assert.match(payload, /"id":13,"value":"\+86 13800138000"/);
      assert.match(payload, /name="0"; filename="part.step"/);
      assert.match(payload, /variables.input.fieldValues.9.fileUploadValues.0/);
      assert.match(payload, /drawing bytes/);
      assert.doesNotMatch(payload, /name="(?:_subject|material|country)"/);
      if (mode === 'validation') return route.fulfill({ json: { data: { submitGfForm: { entry: null, errors: [{id:2,message:'<b>Please check your email.</b>'},{id:12,message:'Please agree.'}] } } } });
      if (mode === 'graphql') return route.fulfill({ json: { errors: [{message:'Resolver failed'}] } });
      if (mode === 'server') return route.fulfill({ status: 500, json: { message: 'Internal error' } });
      if (mode === 'network') return route.abort();
      if (mode === 'malformed') return route.fulfill({ status: 200, body: '<html>Login</html>' });
      await new Promise(resolve => { release = resolve; });
      await route.fulfill({ json: { data: { submitGfForm: { entry: {id:'saved-entry'}, errors:[] } } } });
    });
    const fill = async () => {
      await page.getByLabel('Full name *', { exact: true }).fill('Test Buyer');
      await page.getByLabel('Business email *', { exact: true }).fill('test@example.com');
      await page.getByLabel('Company name *', { exact: true }).fill('Test Company');
      await page.locator('#country-search').fill('China');
      assert.equal(await page.locator('#phone-country-code').inputValue(), '+86');
      assert.match(await page.locator('.phone-current-flag').getAttribute('class'), /fi-cn/);
      await page.locator('.phone-country-toggle').click();
      await page.getByLabel('Search phone country or code').fill('United Kingdom');
      await page.getByRole('option', { name: /United Kingdom \+44/, exact: false }).click();
      assert.equal(await page.locator('#phone-country-code').inputValue(), '+44');
      assert.match(await page.locator('.phone-current-flag').getAttribute('class'), /fi-gb/);
      await page.locator('#phone-number').fill('13800138000');
      assert.equal(await page.locator('#phone-number').getAttribute('required'), null);
      // Leaving the country field must preserve a calling-country override for the same country.
      await page.locator('#country-search').focus();
      await page.locator('#phone-number').focus();
      assert.equal(await page.locator('#phone-country-code').inputValue(), '+44');
      await page.locator('#country-search').fill('United Stat');
      const usCountryOption = page.getByRole('option', { name: 'United States', exact: true });
      assert.ok(parseFloat(await usCountryOption.evaluate(element => getComputedStyle(element).paddingLeft)) > 0);
      assert.equal(await usCountryOption.locator('.fi-us').count(), 1);
      await usCountryOption.click();
      assert.equal(await page.locator('#phone-country-code').inputValue(), '+1');
      assert.match(await page.locator('.phone-current-flag').getAttribute('class'), /fi-us/);
      assert.equal(await page.locator('#phone-number').inputValue(), '13800138000');
      await page.locator('#country-search').fill('Hong Kong');
      await page.locator('#country-search').press('ArrowDown');
      await page.locator('#country-search').press('Enter');
      assert.equal(await page.locator('#phone-country-code').inputValue(), '+852');
      await page.locator('#country-search').fill('China');
      assert.equal(await page.locator('#phone-country-code').inputValue(), '+86');
      await page.locator('select[name=process]').selectOption('CNC Milling');
      await page.locator('#material-search').fill('Custom alloy');
      await page.locator('select[name=quantity]').selectOption('20–50 pcs');
      await page.locator('[name=consent]').check();
      await page.locator('#drawing-file').setInputFiles({ name: 'part.step', mimeType: 'application/octet-stream', buffer: Buffer.from('drawing bytes') });
    };
    const status = page.locator('#form-status');
    const submit = page.locator('button[type=submit]');
    await page.goto(`${baseUrl}/contact/`);
    assert.deepEqual(await page.locator('#country-select option').evaluateAll(options => options.slice(1, 4).map(option => option.value)), ['United States', 'Germany', 'United Kingdom']);
    assert.equal(await page.locator('[name=consent]').isChecked(), true);
    assert.equal(await page.getByText('(optional)', { exact: true }).count(), 0);
    assert.equal(await page.getByText('Country code follows your country / region. You can edit it.', { exact: true }).count(), 0);
    assert.equal(await page.getByLabel('Phone', { exact: true }).count(), 1);
    await fill();
    await submit.click();
    await page.waitForFunction(() => document.querySelector('#form-status').dataset.state === 'error');
    assert.match(await status.textContent(), /temporarily unavailable/);
    assert.equal(requests, 0);
    configured = true;
    await page.reload();
    await fill();
    await submit.click();
    await page.waitForFunction(() => document.querySelector('[data-gf-error]'));
    assert.equal(await page.locator('[name=email]').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.locator('[name=email]').evaluate(el => document.activeElement === el), true);
    assert.equal(await page.locator('#gf-error-email').textContent(), 'Please check your email.');
    assert.equal(await page.locator('[name=consent]').getAttribute('aria-invalid'), 'true');
    for (const failure of ['server', 'network', 'malformed', 'graphql']) {
      mode = failure;
      await submit.click();
      await page.waitForFunction(() => document.querySelector('#form-status').dataset.state === 'error' && !document.querySelector('button[type=submit]').disabled);
      assert.match(await status.textContent(), /could not confirm receipt/);
      assert.equal(await page.locator('#material-search').inputValue(), 'Custom alloy');
      assert.equal(await page.locator('[data-gf-error]').count(), 0);
    }
    mode = 'success';
    await submit.click();
    await page.waitForFunction(() => document.querySelector('form').getAttribute('aria-busy') === 'true');
    await page.locator('form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(requests, 6);
    release();
    await page.waitForFunction(() => document.querySelector('#form-status').dataset.state === 'success');
    assert.equal(await submit.isDisabled(), true);
    assert.equal(await page.locator('#material-search').inputValue(), 'Custom alloy');
    assert.match(await status.textContent(), /enquiry has been received/);
    assert.equal(await page.locator('form').getAttribute('aria-busy'), null);
    if (process.env.RFQ_SCREENSHOT_PATH) {
      await page.locator('#rfq-form').screenshot({ path: process.env.RFQ_SCREENSHOT_PATH });
      await page.locator('.phone-country-toggle').click();
      await page.getByLabel('Search phone country or code').fill('United');
      await page.locator('#rfq-form').screenshot({ path: process.env.RFQ_SCREENSHOT_PATH.replace(/\.png$/i, '-dropdown.png') });
      await page.getByLabel('Search phone country or code').press('Escape');
    }
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    assert.ok((await page.locator('#phone-number').boundingBox()).width > 100);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

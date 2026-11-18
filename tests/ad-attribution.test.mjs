import test from 'node:test';
import assert from 'node:assert/strict';
import { adClickFields, adsConsent, attributionKey, attributionLifetime, captureAttribution, clickIdsFromSearch, consentKey, consentLifetime, savedAttribution, setAdsConsent } from '../src/lib/ad-attribution.mjs';
import { rfqFields, submissionRequest } from '../src/lib/gravity-forms.mjs';

const storage = () => {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
};
const now = 1_800_000_000_000;

test('只读取三个点击标识，保留大小写，忽略重复、空白、控制字符及过长参数', () => {
  assert.deepEqual(clickIdsFromSearch('?gclid=AbC_123-xyz&gbraid=BraID&wbraid=WebID&utm_source=google'), { gclid:'AbC_123-xyz', gbraid:'BraID', wbraid:'WebID' });
  for (const value of ['', 'a%20b', '%0Aabc', 'a'.repeat(1025)]) assert.deepEqual(clickIdsFromSearch(`?gclid=${value}`), {});
  assert.deepEqual(clickIdsFromSearch('?gclid=first&gclid=second&GCLID=third'), {});
});

test('未经同意或明确拒绝时不保存归因，正常页面不创建存储', () => {
  const store = storage();
  assert.equal(adsConsent(store, now), null);
  assert.deepEqual(captureAttribution(store, '?gclid=first', now), {});
  assert.equal(store.getItem(attributionKey), null);
  assert.equal(store.getItem(consentKey), null);
  setAdsConsent(store, false, '?gclid=first', now);
  assert.equal(adsConsent(store, now), false);
  assert.deepEqual(captureAttribution(store, '?wbraid=next', now), {});
});

test('同意后整组保存最近点击，普通访问保留旧记录且不延长有效期', () => {
  const store = storage();
  assert.deepEqual(setAdsConsent(store, true, '?gclid=first&wbraid=firstWeb', now), { gclid:'first', wbraid:'firstWeb' });
  assert.deepEqual(captureAttribution(store, '', now + 1000), { gclid:'first', wbraid:'firstWeb' });
  assert.equal(JSON.parse(store.getItem(attributionKey)).savedAt, now);
  assert.deepEqual(setAdsConsent(store, true, '', now + 1500), { gclid:'first', wbraid:'firstWeb' });
  assert.equal(JSON.parse(store.getItem(attributionKey)).savedAt, now);
  assert.deepEqual(captureAttribution(store, '?gbraid=second', now + 2000), { gbraid:'second' });
  assert.deepEqual(savedAttribution(store, now + 3000), { gbraid:'second' });
  assert.deepEqual(savedAttribution(store, now + 2000 + attributionLifetime), {});
  assert.equal(store.getItem(attributionKey), null);
});

test('撤回、同意过期、损坏存储、未来时间和存储禁用均安全降级', () => {
  const store = storage();
  setAdsConsent(store, true, '?gclid=first', now);
  setAdsConsent(store, false, '?gclid=first', now + 1);
  assert.deepEqual(savedAttribution(store, now + 1), {});
  assert.equal(store.getItem(attributionKey), null);
  setAdsConsent(store, true, '?gclid=first', now);
  assert.deepEqual(savedAttribution(store, now + consentLifetime), {});
  assert.equal(store.getItem(consentKey), null);
  setAdsConsent(store, true, '?gclid=first', now);
  assert.deepEqual(savedAttribution(store, now - 1), {});
  store.setItem(consentKey, '{broken');
  assert.equal(adsConsent(store, now), null);
  setAdsConsent(store, true, '', now);
  store.setItem(attributionKey, 'null');
  assert.deepEqual(savedAttribution(store, now), {});
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } };
  for (const unavailable of [blocked, undefined]) {
    assert.deepEqual(setAdsConsent(unavailable, true, '?gclid=first', now), {});
    assert.deepEqual(captureAttribution(unavailable, '?gclid=first', now), {});
    assert.deepEqual(savedAttribution(unavailable, now), {});
  }
});

test('JSON 与附件请求按 16、18、17 提交可选标识，空值和非法值不发送', () => {
  const fields = Object.fromEntries(rfqFields.map((field, index) => [field, { id:index + 1, type:field === 'attachment' ? 'file' : 'text' }]));
  for (const [field, id] of Object.entries({gclid:16,gbraid:18,wbraid:17})) fields[field] = { id, type:'text' };
  const config = { graphqlUrl:'https://example.com/graphql', formId:1, uploadsEnabled:true, fields };
  for (const withFile of [false, true]) {
    const data = new FormData();
    if (withFile) data.set('attachment', new File(['drawing'], 'part.step'));
    for (const field of adClickFields) data.set(field, `${field}_Test`);
    const request = submissionRequest(data, config);
    const operation = JSON.parse(withFile ? request.init.body.get('operations') : request.init.body);
    const submitted = operation.variables.input.fieldValues;
    assert.deepEqual(submitted.filter(field => [16,17,18].includes(field.id)), [
      { id:16, value:'gclid_Test' }, { id:18, value:'gbraid_Test' }, { id:17, value:'wbraid_Test' },
    ]);
    data.set('gclid', ''); data.set('gbraid', 'bad value'); data.delete('wbraid');
    const empty = submissionRequest(data, config);
    assert.equal(JSON.parse(withFile ? empty.init.body.get('operations') : empty.init.body).variables.input.fieldValues.some(field => [16,17,18].includes(field.id)), false);
  }
});

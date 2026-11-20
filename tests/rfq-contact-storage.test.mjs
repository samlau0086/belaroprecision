import test from 'node:test';
import assert from 'node:assert/strict';
import { readRfqContact, writeRfqContact, rfqContactStorageKey } from '../src/lib/rfq-contact-storage.mjs';

function storage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('RFQ 基础联系信息可安全写入并读取', () => {
  const browserStorage = storage();
  writeRfqContact(browserStorage, {
    name: ' Test Buyer ', email: 'test@example.com', company: ' Test Company ', country: 'China',
    phoneCountryCode: '+86', phone: ' 13800138000 ', details: '不应保存',
  });
  assert.deepEqual(readRfqContact(browserStorage), {
    name: 'Test Buyer', email: 'test@example.com', company: 'Test Company', country: 'China',
    phoneCountryCode: '+86', phone: '13800138000',
  });
  assert.equal(JSON.parse(browserStorage.getItem(rfqContactStorageKey)).details, undefined);
});

test('RFQ 存储损坏或不可用时返回空对象', () => {
  const browserStorage = storage();
  browserStorage.setItem(rfqContactStorageKey, '{bad json');
  assert.deepEqual(readRfqContact(browserStorage), {});
  assert.deepEqual(readRfqContact({ getItem() { throw new Error('blocked'); } }), {});
  assert.doesNotThrow(() => writeRfqContact({ setItem() { throw new Error('blocked'); } }, { name: 'Buyer' }));
});

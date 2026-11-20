export const rfqContactStorageKey = 'belaro.rfq-contact';

export const rfqContactFields = ['name', 'email', 'company', 'country', 'phoneCountryCode', 'phone'];

export function readRfqContact(storage) {
  try {
    const raw = storage?.getItem(rfqContactStorageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(rfqContactFields.map(field => [field, typeof parsed[field] === 'string' ? parsed[field] : '']));
  } catch {
    return {};
  }
}

export function writeRfqContact(storage, values) {
  try {
    const contact = Object.fromEntries(rfqContactFields.map(field => [field, String(values[field] || '').trim()]));
    if (rfqContactFields.some(field => contact[field])) storage?.setItem(rfqContactStorageKey, JSON.stringify(contact));
  } catch {
    // 浏览器禁用存储时不影响表单正常使用。
  }
}

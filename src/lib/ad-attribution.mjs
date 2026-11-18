export const adClickFields = ['gclid', 'gbraid', 'wbraid'];
export const attributionKey = 'belaro.ad-attribution';
export const consentKey = 'belaro.ad-attribution-consent';
export const attributionLifetime = 30 * 24 * 60 * 60 * 1000;
export const consentLifetime = 180 * 24 * 60 * 60 * 1000;

export function validClickId(value) {
  return typeof value === 'string' && value.length > 0 && value.length <= 1024 && !/[\s\u0000-\u001f\u007f]/u.test(value);
}

export function clickIdsFromSearch(search) {
  const query = new URLSearchParams(search);
  return Object.fromEntries(adClickFields.flatMap(field => {
    const values = query.getAll(field);
    return values.length === 1 && validClickId(values[0]) ? [[field, values[0]]] : [];
  }));
}

function remove(storage, key) {
  try { storage?.removeItem(key); } catch { /* 存储受限时不影响正常询价。 */ }
}

function read(storage, key, lifetime, now) {
  try {
    const raw = storage?.getItem(key);
    if (!raw) return null;
    const record = JSON.parse(raw);
    if (!record || !Number.isSafeInteger(record.savedAt) || record.savedAt > now || now - record.savedAt >= lifetime) {
      remove(storage, key);
      return null;
    }
    return record;
  } catch {
    remove(storage, key);
    return null;
  }
}

export function adsConsent(storage, now = Date.now()) {
  const record = read(storage, consentKey, consentLifetime, now);
  return typeof record?.allowed === 'boolean' ? record.allowed : null;
}

export function savedAttribution(storage, now = Date.now()) {
  if (adsConsent(storage, now) !== true) {
    remove(storage, attributionKey);
    return {};
  }
  const record = read(storage, attributionKey, attributionLifetime, now);
  return Object.fromEntries(adClickFields.flatMap(field => validClickId(record?.ids?.[field]) ? [[field, record.ids[field]]] : []));
}

export function captureAttribution(storage, search, now = Date.now()) {
  const previous = savedAttribution(storage, now);
  if (adsConsent(storage, now) !== true) return {};
  const ids = clickIdsFromSearch(search);
  if (!Object.keys(ids).length) return previous;
  // 新点击整组替换，不将不同广告点击的标识拼在一起。
  try {
    storage?.setItem(attributionKey, JSON.stringify({ savedAt: now, ids }));
    return savedAttribution(storage, now);
  } catch { return {}; }
}

export function setAdsConsent(storage, allowed, search, now = Date.now()) {
  if (!allowed) remove(storage, attributionKey);
  try {
    storage?.setItem(consentKey, JSON.stringify({ allowed, savedAt: now }));
  } catch { return {}; }
  return allowed ? captureAttribution(storage, search, now) : {};
}

export function browserAdStorage() {
  try { return window.localStorage; } catch { return undefined; }
}

export function syncAttributionFields(form) {
  const ids = savedAttribution(browserAdStorage());
  for (const field of adClickFields) {
    const input = form?.querySelector(`input[type="hidden"][name="${field}"]`);
    if (input) input.value = ids[field] || '';
  }
}

export const rfqFields = ['name', 'email', 'company', 'country', 'process', 'material', 'quantity', 'delivery', 'tolerance', 'attachment', 'details', 'consent', 'phone'];

export function submissionRequest(values, config, turnstileToken) {
  if (!config.turnstileSiteKey || typeof turnstileToken !== 'string' || !turnstileToken.trim()) {
    throw new Error('Complete the human verification before submitting.');
  }
  const url = new URL(config.graphqlUrl);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('Configure a GraphQL URL without credentials, query or fragment.');
  }
  if (!Number.isSafeInteger(config.formId) || config.formId < 1) throw new Error('Configure a positive Gravity Forms form ID.');
  const ids = rfqFields.map(field => config.fields?.[field]?.id);
  if (ids.some(id => !Number.isSafeInteger(id) || id < 1) || new Set(ids).size !== ids.length) {
    throw new Error('Configure a unique Gravity Forms database field ID for every RFQ field.');
  }
  const fieldValues = [];
  let upload;
  let uploadIndex;
  for (const field of rfqFields) {
    const mapping = config.fields[field];
    const raw = values.get(field);
    let value = typeof raw === 'string' ? raw : '';
    if (field === 'phone') {
      value = value.trim();
      const prefix = String(values.get('phoneCountryCode') || '').trim();
      // A prefix alone is not a phone number. Preserve a pasted international number.
      if (value && prefix && !value.startsWith('+')) value = `${prefix} ${value}`;
    }
    const entry = { id: mapping.id };
    switch (mapping.type) {
      case 'file':
        if (!(raw instanceof Blob) || !raw.size) continue;
        if (!config.uploadsEnabled) throw new Error('WPGraphQL Upload is required for attachments.');
        upload = raw;
        uploadIndex = fieldValues.length;
        entry.fileUploadValues = [null];
        break;
      case 'name': {
        const [first = '', ...last] = value.trim().split(/\s+/);
        entry.nameValues = { first, last: last.join(' ') };
        break;
      }
      case 'email': entry.emailValues = { value }; break;
      case 'consent': entry.value = raw ? '1' : ''; break;
      case 'checkbox':
        if (!Number.isFinite(mapping.inputId) || Math.trunc(mapping.inputId) !== mapping.id || !mapping.choiceValue) throw new Error('Configure the consent checkbox input ID and choice value.');
        entry.checkboxValues = raw ? [{ inputId: mapping.inputId, value: mapping.choiceValue }] : [];
        break;
      case 'text': entry.value = value; break;
      default: throw new Error('Unsupported Gravity Forms field mapping.');
    }
    fieldValues.push(entry);
  }
  const operation = {
    query: 'mutation SubmitRFQ($input: SubmitGfFormInput!) { submitGfForm(input: $input) { errors { id message } entry { id } } }',
    variables: { input: { id: config.formId, fieldValues, saveAsDraft: false, sourcePage: 1, targetPage: 0 } },
  };
  /** @type {RequestInit} */
  const init = { method: 'POST', credentials: 'omit', redirect: 'error', headers: { 'X-Turnstile-Token': turnstileToken.trim() } };
  if (upload) {
    // A custom header makes cross-origin uploads preflight before WordPress accepts them.
    init.headers['GraphQL-Require-Preflight'] = '1';
    const body = new FormData();
    body.append('operations', JSON.stringify(operation));
    body.append('map', JSON.stringify({ 0: [`variables.input.fieldValues.${uploadIndex}.fileUploadValues.0`] }));
    body.append('0', upload, upload.name);
    init.body = body;
  } else {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(operation);
  }
  return { url: url.href, init };
}

export function submissionResult(ok, result) {
  if (!ok || result?.errors?.length) throw new Error('GraphQL submission failed.');
  const payload = result?.data?.submitGfForm;
  if (payload?.errors?.length) {
    const messages = {};
    for (const error of payload.errors) {
      if (error && typeof error.message === 'string') messages[String(error.id)] = error.message;
    }
    if (!Object.keys(messages).length) throw new Error('Invalid validation response.');
    return { is_valid: false, validation_messages: messages };
  }
  if (!payload?.entry?.id) throw new Error('No saved entry was confirmed.');
  return { is_valid: true };
}

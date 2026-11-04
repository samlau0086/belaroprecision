import test from 'node:test';
import assert from 'node:assert/strict';
import { rfqFields, submissionRequest, submissionResult } from '../src/lib/gravity-forms.mjs';

const config = () => ({ graphqlUrl: 'https://example.com/graphql', formId: 42, uploadsEnabled: true,
  fields: Object.fromEntries(rfqFields.map((field, i) => [field, { id: i + 1, type: ({name:'name',email:'email',attachment:'file',consent:'consent'})[field] || 'text' }])) });
const values = () => {
  const data = new FormData();
  for (const field of rfqFields) if (field !== 'attachment') data.set(field, field);
  data.set('name', 'Test Full Name');
  data.set('material', 'Custom alloy');
  return data;
};

test('JSON submission uses configurable form ID and typed GraphQL inputs', () => {
  const request = submissionRequest(values(), config());
  const operation = JSON.parse(request.init.body);
  assert.equal(request.url, 'https://example.com/graphql');
  assert.equal(request.init.headers['Content-Type'], 'application/json');
  assert.equal(request.init.credentials, 'omit');
  assert.equal(operation.variables.input.id, 42);
  const fields = operation.variables.input.fieldValues;
  assert.deepEqual(fields.find(f => f.id === 1).nameValues, {first:'Test', last:'Full Name'});
  assert.deepEqual(fields.find(f => f.id === 2).emailValues, {value:'email'});
  assert.equal(fields.find(f => f.id === 6).value, 'Custom alloy');
  assert.equal(fields.find(f => f.id === 12).value, '1');
  assert.equal(fields.some(f => f.id === 10), false);
  assert.equal(operation.variables.input.saveAsDraft, false);
});

test('multipart upload maps file placeholder to exact field and preserves bytes', async () => {
  const data = values();
  data.set('attachment', new File(['drawing bytes'], 'part.step'));
  const request = submissionRequest(data, config());
  assert.equal(request.init.headers['GraphQL-Require-Preflight'], '1');
  assert.equal(request.init.headers['Content-Type'], undefined);
  const body = request.init.body;
  const fields = JSON.parse(body.get('operations')).variables.input.fieldValues;
  assert.deepEqual(fields[9], {id:10, fileUploadValues:[null]});
  assert.deepEqual(JSON.parse(body.get('map')), {'0':['variables.input.fieldValues.9.fileUploadValues.0']});
  assert.equal(await body.get('0').text(), 'drawing bytes');
  assert.equal(body.get('0').name, 'part.step');
  assert.throws(() => submissionRequest(data, {...config(), uploadsEnabled:false}), /Upload/);
});

test('incomplete or duplicate IDs, unsupported types and invalid endpoints fail before sending', () => {
  for (const id of [0, -1, 1.5, '1', 1]) {
    const settings = config(); settings.fields.material.id = id;
    assert.throws(() => submissionRequest(values(), settings));
  }
  for (const formId of [0, -1, 1.5, '1']) assert.throws(() => submissionRequest(values(), {...config(), formId}));
  for (const graphqlUrl of ['', 'javascript:alert(1)', 'https://user:password@example.com', 'https://example.com/?key=x']) assert.throws(() => submissionRequest(values(), {...config(), graphqlUrl}));
  const settings = config(); settings.fields.email.type = 'unknown';
  assert.throws(() => submissionRequest(values(), settings));
});

test('consent supports a standard checkbox with explicit choice mapping', () => {
  const settings = config(); settings.fields.consent = { id:12, type:'checkbox', inputId:12.1, choiceValue:'Agreed' };
  const checked = JSON.parse(submissionRequest(values(), settings).init.body).variables.input.fieldValues.find(field => field.id === 12);
  assert.deepEqual(checked, {id:12, checkboxValues:[{inputId:12.1,value:'Agreed'}]});
  const empty = JSON.parse(submissionRequest(new FormData(), settings).init.body).variables.input.fieldValues.find(field => field.id === 12);
  assert.deepEqual(empty.checkboxValues, []);
});

test('optional phone combines the editable calling code without duplicating international numbers', () => {
  const data = values();
  const phoneValue = () => JSON.parse(submissionRequest(data, config()).init.body).variables.input.fieldValues.find(field => field.id === 13).value;
  data.set('phoneCountryCode', '+86');
  data.set('phone', '');
  assert.equal(phoneValue(), '');
  data.set('phone', ' 13800138000 ');
  assert.equal(phoneValue(), '+86 13800138000');
  data.set('phoneCountryCode', '+44');
  assert.equal(phoneValue(), '+44 13800138000');
  data.set('phone', '+1 202 555 0123');
  assert.equal(phoneValue(), '+1 202 555 0123');
});

test('only a confirmed saved entry counts as success; GraphQL and HTTP errors never do', () => {
  const saved = {data:{submitGfForm:{entry:{id:'entry-id'},errors:null}}};
  assert.deepEqual(submissionResult(true, saved), {is_valid:true});
  assert.throws(() => submissionResult(false, saved));
  assert.throws(() => submissionResult(true, {...saved, errors:[{message:'failed'}]}));
  for (const response of [null, {}, {data:{submitGfForm:{entry:null,errors:[]}}}]) assert.throws(() => submissionResult(true, response));
  assert.deepEqual(submissionResult(true, {data:{submitGfForm:{errors:[{id:3,message:'Check email'}]}}}), {is_valid:false,validation_messages:{3:'Check email'}});
});

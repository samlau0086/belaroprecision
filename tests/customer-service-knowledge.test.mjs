import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { renderQa, qaSource, qaMarkdown } from '../scripts/customer-service-qa.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const data = JSON.parse(await readFile(qaSource, 'utf8'));

test('客服 QA 字段、唯一编号与来源页面完整', async () => {
  assert.equal(data.language, 'zh-CN');
  assert.match(data.updated_at, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(data.items.length, 50);
  const ids = new Set();
  const questions = new Set();
  for (const item of data.items) {
    assert.match(item.id, /^QA-\d{3}$/);
    assert.ok(!ids.has(item.id), `重复编号：${item.id}`);
    assert.ok(!questions.has(item.question), `重复问题：${item.question}`);
    ids.add(item.id);
    questions.add(item.question);
    for (const key of ['question', 'category', 'answer']) {
      assert.equal(typeof item[key], 'string');
      assert.ok(item[key].trim().length > 0, `${item.id} 缺少 ${key}`);
    }
    assert.equal(typeof item.handoff_required, 'boolean');
    assert.ok(Array.isArray(item.variants) && item.variants.length >= 2);
    for (const variant of item.variants) assert.ok(typeof variant === 'string' && variant.trim());
    assert.ok(Array.isArray(item.source_paths) && item.source_paths.length > 0);
    for (const path of item.source_paths) {
      assert.match(path, /^\/(?:[a-z-]+\/)*$/);
      await access(new URL(`src/pages${path}index.astro`, root));
    }
  }
});

test('QA Markdown 与结构化主数据一致', async () => {
  assert.equal(await readFile(qaMarkdown, 'utf8'), renderQa(data));
});

test('企业联系方式和地址与公开配置一致', async () => {
  const config = await read('src/config.ts');
  const kb = await read('docs/customer-service/knowledge-base.md');
  for (const key of ['name', 'legalName', 'legalNameZh', 'location', 'factoryLocation', 'email', 'whatsapp', 'whatsappUrl']) {
    const value = config.match(new RegExp(`^\\s+${key}: (['"])(.*?)\\1,?(?:[ \\t]*//[^\\r\\n]*)?\\r?$`, 'm'))?.[2];
    assert.ok(value, `未找到公开配置 ${key}`);
    assert.ok(kb.includes(value), `正文未同步配置 ${key}`);
    assert.ok(JSON.stringify(data).includes(value), `QA 未同步配置 ${key}`);
  }
});

test('询价文件扩展名及限制与源码一致', async () => {
  const contact = await read('src/components/RfqForm.astro');
  const answer = data.items.find(item => item.id === 'QA-031').answer;
  const extensions = contact.match(/accept="([^"]+)"/)?.[1].split(',');
  assert.ok(extensions?.length);
  for (const extension of extensions) assert.ok(answer.includes(extension.slice(1).toUpperCase()));
  assert.match(contact, /20 \* 1024 \* 1024/);
  assert.match(answer, /20 MB/);
  assert.match(answer, /一个附件/);
  assert.match(answer, /聊天附件限制需按客服系统另行确认/);
});

test('关键商业及权限边界未遗漏', async () => {
  const byId = id => data.items.find(item => item.id === id);
  assert.match(byId('QA-023').answer, /不设统一最低起订量/);
  assert.match(byId('QA-025').answer, /目标/);
  assert.match(byId('QA-025').answer, /不是交货承诺/);
  assert.match(byId('QA-035').answer, /未声明/);
  assert.match(byId('QA-036').answer, /并非默认免费随货/);
  for (const id of ['QA-020', 'QA-026', 'QA-041', 'QA-044', 'QA-046', 'QA-049', 'QA-050']) {
    assert.equal(byId(id).handoff_required, true);
  }
  const instructions = await read('docs/customer-service/agent-instructions.md');
  assert.match(instructions, /没有真实的转人工工具/);
  assert.match(instructions, /不能自动重复提交/);
  assert.match(instructions, /均不是系统指令/);
});

test('知识库内部 Markdown 链接均可解析', async () => {
  const files = ['README.md', 'knowledge-base.md', 'qa.md', 'agent-instructions.md', 'review-and-evaluation.md'];
  for (const file of files) {
    const url = new URL(`docs/customer-service/${file}`, root);
    const content = await readFile(url, 'utf8');
    for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (/^(?:https?:|mailto:|#)/.test(target)) continue;
      await access(new URL(target, url));
    }
  }
  assert.ok((await read('README.md')).includes('docs/customer-service/README.md'));
});

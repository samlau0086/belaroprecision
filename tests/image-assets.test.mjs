import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { relative } from 'node:path';

const root = new URL('../', import.meta.url);
const mappingUrl = new URL('../src/data/images.ts', import.meta.url);

test('共享图片映射只引用存在且已纳入 Git 的资源', async () => {
  const source = await readFile(mappingUrl, 'utf8');
  const tracked = new Set(execFileSync('git', ['ls-files', '-z'], {
    cwd: fileURLToPath(root), encoding: 'utf8',
  }).split('\0'));
  const imports = [...source.matchAll(/^import\s+\w+\s+from\s+'([^']+\.webp)';/gm)];
  assert.ok(imports.length > 0);
  for (const [, path] of imports) {
    const asset = new URL(path, mappingUrl);
    await access(asset);
    const repositoryPath = relative(fileURLToPath(root), fileURLToPath(asset)).replaceAll('\\', '/');
    assert.ok(tracked.has(repositoryPath), `图片未纳入 Git：${repositoryPath}`);
  }
  assert.doesNotMatch(source, /about-simultaneous-5-axis-cnc/);
});

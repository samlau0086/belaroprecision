import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

test('全站 HTML 和 Markdown 不包含 AI 生成来源标注', () => {
  let pageCount = 0;
  function check(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('_')) check(path);
      } else if (/\.(html|md)$/.test(entry.name)) {
        const content = readFileSync(path, 'utf8');
        assert.doesNotMatch(content, /\bAI[-\s\u2010-\u2014]*generated\b|\bAI\s+illustration\b|\b(?:generated|created)\s+(?:by|with)\s+AI\b|(?:AI|人工智能)\s*生成/i, path);
        if (entry.name.endsWith('.html')) pageCount++;
      }
    }
  }
  check('dist');
  assert.ok(pageCount > 0, '必须先构建站点，避免空产物导致检查误通过');
});

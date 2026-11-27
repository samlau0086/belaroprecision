import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('公开页面不展示内部发布状态或虚构报告', async () => {
  const pages = ['about', 'quality'];
  for (const page of pages) {
    const html = await readFile(new URL(`../dist/${page}/index.html`, import.meta.url), 'utf8');
    assert.doesNotMatch(html, /team profiles are not currently published|verified (?:machine|equipment) inventory.{0,80}not (?:yet|currently) published|availability of photographs, equipment records/i);
    assert.doesNotMatch(html, /quality-dimensional-report-sample|sample report with fictional part details/i);
  }
});

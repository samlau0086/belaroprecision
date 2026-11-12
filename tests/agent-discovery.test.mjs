import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

test('构建产物包含可发现的抓取规则和全部页面的规范地址', () => {
  const robots = readFileSync('dist/robots.txt', 'utf8');
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  for (const bot of ['\\*', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']) {
    assert.match(robots, new RegExp(`User-agent: ${bot}\\s+Content-Signal: search=yes, ai-input=yes, ai-train=yes\\s+Allow: /`, 'i'));
  }
  assert.match(robots, /Sitemap: https:\/\/belaroprecision\.com\/sitemap\.xml/i);
  const pages = [];
  function collect(dir, path = '') {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !entry.name.startsWith('_')) collect(join(dir, entry.name), `${path}${entry.name}/`);
      else if (entry.name === 'index.html') pages.push(`https://belaroprecision.com/${path}`);
    }
  }
  collect('dist');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls.sort(), pages.sort());
  assert.equal(new Set(urls).size, urls.length);
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
});

test('Nginx 为普通页面配置真实 sitemap 的 Link 响应头', () => {
  const nginx = readFileSync('deploy/nginx.conf', 'utf8');
  assert.match(nginx, /add_header Link '<\/sitemap\.xml>; rel="alternate"; type="application\/xml"'/);
});

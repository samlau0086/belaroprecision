import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parseHTML } from 'linkedom';

const abbreviatedBrand = /\bbelaro\b(?!\s+precision\b)(?!\.(?:ad-attribution(?:-consent)?|rfq-contact|blog-contact)\b)/i;

function textWithSpaces(node) {
  return node.nodeType === 3 ? node.textContent : [...node.childNodes].map(textWithSpaces).join(' ');
}

test('页面源码及配置不使用品牌简称，保留完整的两行标志和技术标识', async () => {
  const root = new URL('../src/', import.meta.url);
  const files = (await readdir(root, { recursive: true })).filter(file => /\.(astro|ts|css|mjs)$/.test(file));
  for (const file of files) {
    const source = (await readFile(new URL(file.replaceAll('\\', '/'), root), 'utf8'))
      .replace(/<strong>BELARO<\/strong><small>PRECISION<\/small>/g, 'BELARO PRECISION');
    assert.doesNotMatch(source, abbreviatedBrand, `${file} 存在品牌简称`);
  }
});

test('全部构建页面的正文、标题、SEO 和无障碍文案使用完整品牌名称', async () => {
  const root = new URL('../dist/', import.meta.url);
  const files = (await readdir(root, { recursive: true })).filter(file => file.endsWith('.html'));
  assert.ok(files.length > 0, '请先执行 npm run build 生成完整站点');
  for (const file of files) {
    const { document } = parseHTML(await readFile(new URL(file.replaceAll('\\', '/'), root), 'utf8'));
    document.querySelectorAll('script, style, noscript, template').forEach(node => node.remove());
    assert.doesNotMatch(textWithSpaces(document.body), abbreviatedBrand, `${file} 正文存在品牌简称`);
    assert.match(document.title, /Belaro Precision/, `${file} 标题缺少完整品牌名称`);
    assert.doesNotMatch(document.title, abbreviatedBrand, `${file} 标题存在品牌简称`);
    for (const node of document.querySelectorAll('meta[content], [aria-label], [alt], [title]')) {
      for (const attribute of ['content', 'aria-label', 'alt', 'title']) {
        assert.doesNotMatch(node.getAttribute(attribute) || '', abbreviatedBrand, `${file} 的 ${attribute} 存在品牌简称`);
      }
    }
  }
});

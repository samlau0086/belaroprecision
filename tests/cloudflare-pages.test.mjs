import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { createWorker, prefersMarkdown } from '../deploy/pages-worker.mjs';
import { buildPages, validatePagesEnvironment } from '../scripts/cloudflare-pages.mjs';

test('Pages 内容协商与 VPS 的显式 Accept 权重约定一致', () => {
  for (const [accept, expected] of [
    ['', false], ['*/*', false], ['text/html', false], ['text/markdown', true],
    ['TEXT/MARKDOWN', true], ['text/markdown;q=0', false], ['text/markdown;q=0.0', false],
    ['text/html;q=1, text/markdown;q=0.5', false],
    ['text/html;q=0.5, text/markdown;q=0.6', true],
    ['text/html;q=0.51, text/markdown;q=0.501', false],
    ['text/html;q=0.501, text/markdown;q=0.51', true],
    ['text/html;q=0.001, text/markdown;q=0.001', true],
    ['text/markdown;q=1.001', false], ['text/markdown;q=0.0001', false],
  ]) assert.equal(prefersMarkdown(accept), expected, accept);
});

test('Pages Worker 的别名、HEAD、缓存、内部路径与异常处理', async () => {
  const worker = createWorker([{ path: '/', markdown: '# Home' }, { path: '/about/', markdown: '# About' }], 'https://belaroprecision.com');
  const calls = [];
  const env = { ASSETS: { fetch: async request => {
    calls.push(request);
    return new Response(request.method === 'HEAD' ? null : '<!doctype html><title>About</title>');
  } } };
  const send = (path, options = {}) => worker.fetch(new Request(`https://edge.example${path}`, options), env);
  for (const path of ['/', '/index.html', '/about', '/about/', '/about/index.html', '/about/?x=1']) {
    const result = await send(path, { headers: { Accept: 'text/markdown' } });
    assert.equal(result.status, 200);
    assert.match(result.headers.get('content-type'), /^text\/markdown/);
    assert.equal(result.headers.get('cache-control'), 'no-store');
    assert.equal(result.headers.get('vary'), 'Accept');
    assert.equal(result.headers.get('x-robots-tag'), 'noindex');
    assert.match(result.headers.get('content-signal'), /ai-train=yes/);
    assert.match(result.headers.get('link'), /sitemap.xml/);
    assert.match(await result.text(), /^# /);
  }
  assert.equal(calls.length, 0);
  const redirect = await send('/about?x=1');
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), '/about/?x=1');
  for (const path of ['/about/', '/about/index.html']) {
    const result = await send(path, { headers: { Range: 'bytes=0-1', 'If-None-Match': '*' } });
    assert.equal(result.status, 200);
    assert.match(await result.text(), /doctype html/);
    assert.equal(new URL(calls.at(-1).url).pathname, '/about/');
    assert.equal(calls.at(-1).headers.get('range'), null);
    assert.equal(calls.at(-1).headers.get('if-none-match'), null);
  }
  for (const accept of ['text/html', 'text/markdown']) {
    const result = await send('/about/', { method: 'HEAD', headers: { Accept: accept } });
    assert.equal(result.status, 200);
    assert.equal(await result.text(), '');
  }
  const before = calls.length;
  for (const path of ['/missing/', '/_agent-markdown/0.md', '/%5fagent-markdown/agent-markdown.conf', '/_worker.js', '/_routes.json']) {
    assert.equal((await send(path)).status, 404, path);
  }
  assert.equal(calls.length, before);
  assert.equal((await send('/%zz')).status, 400);
  const post = await send('/', { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
  const prod = await worker.fetch(new Request('https://belaroprecision.com/'), env);
  assert.equal(prod.headers.get('x-robots-tag'), null);
  const unavailable = await worker.fetch(new Request('https://edge.example/'), { ASSETS: { fetch: async () => new Response(null, { status: 404 }) } });
  assert.equal(unavailable.status, 502);
});

test('Pages 构建校验环境与输出目录，不能清理 VPS 目录', async () => {
  validatePagesEnvironment({ PUBLIC_GRAPHQL_URL: 'https://cms.example.com/graphql', PUBLIC_GTM_ID: 'GTM-ABC123' });
  for (const url of [undefined, 'invalid', 'http://cms.example.com/graphql', 'https://localhost/graphql', 'https://cms.local/graphql', 'https://user:secret@cms.example.com/graphql']) {
    assert.throws(() => validatePagesEnvironment({ PUBLIC_GRAPHQL_URL: url }), /HTTPS/);
  }
  assert.throws(() => validatePagesEnvironment({ PUBLIC_GRAPHQL_URL: 'https://cms.example.com/graphql', PUBLIC_GTM_ID: 'invalid' }), /GTM/);
  await assert.rejects(buildPages([], pathToFileURL(`${resolve('dist')}/`), 'https://belaroprecision.com'), /dist-pages/);
});

test('Pages 实际构建产物隔离内部文件，全部页面支持 Markdown', async () => {
  const worker = (await import('../dist-pages/_worker.js')).default;
  const sitemap = await readFile('dist-pages/sitemap.xml', 'utf8');
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  assert.equal(paths.length, 14);
  for (const path of paths) {
    const result = await worker.fetch(new Request(`https://edge.example${path}`, { headers: { Accept: 'text/markdown' } }), {});
    assert.equal(result.status, 200);
    const markdown = await result.text();
    assert.match(markdown, /^Source: https:\/\/belaroprecision.com\//);
    assert.match(markdown, /\n# /);
    assert.doesNotMatch(markdown, /<script|data-gravity-forms|turnstileSiteKey/);
  }
  await assert.rejects(access('dist-pages/_agent-markdown'));
  const routes = JSON.parse(await readFile('dist-pages/_routes.json', 'utf8'));
  assert.deepEqual(routes.include, ['/*']);
  for (const path of ['/_astro/*', '/images/*', '/robots.txt', '/sitemap.xml', '/favicon.svg']) assert.ok(routes.exclude.includes(path), path);
  assert.ok(!routes.exclude.some(path => path.startsWith('/_agent-markdown')));
  assert.ok(routes.include.length + routes.exclude.length <= 100);
  assert.match(await readFile('dist-pages/404.html', 'utf8'), /noindex/);
  assert.match(await readFile('dist-pages/_headers', 'utf8'), /immutable/);
  await access('dist/_agent-markdown/agent-markdown.conf');
});

test('Cloudflare 本地运行时 HTTP 协商、静态绕过与内部路径保护', { skip: !process.env.PAGES_BASE_URL }, async () => {
  const base = process.env.PAGES_BASE_URL;
  for (const path of ['/', '/about/', '/quality/index.html', '/contact/?process=milling']) {
    for (const accept of ['text/html', 'text/markdown', 'text/html;q=0.501, text/markdown;q=0.51']) {
      const result = await fetch(`${base}${path}`, { headers: { Accept: accept } });
      assert.equal(result.status, 200, `${path}: ${accept}`);
      assert.match(result.headers.get('content-type'), prefersMarkdown(accept) ? /^text\/markdown/ : /^text\/html/);
      assert.equal(result.headers.get('cache-control'), 'no-store');
      assert.equal(result.headers.get('vary'), 'Accept');
      assert.equal(result.headers.get('x-robots-tag'), 'noindex');
      await result.arrayBuffer();
    }
  }
  const redirect = await fetch(`${base}/about?x=1`, { redirect: 'manual' });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), '/about/?x=1');
  const head = await fetch(`${base}/about/`, { method: 'HEAD', headers: { Accept: 'text/markdown' } });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  for (const path of ['/missing/', '/_agent-markdown/0.md', '/%5fagent-markdown/0.md', '/_worker.js', '/_routes.json']) {
    assert.equal((await fetch(`${base}${path}`)).status, 404, path);
  }
  const css = (await readFile('dist-pages/index.html', 'utf8')).match(/href="(\/_astro\/[^" ]+\.css)"/)[1];
  for (const path of ['/robots.txt', '/sitemap.xml', '/favicon.svg', '/images/machined-parts/precision-shaft-main.webp', css]) {
    const result = await fetch(`${base}${path}`, { headers: { Accept: 'text/markdown' } });
    assert.equal(result.status, 200, path);
    assert.equal(result.headers.get('x-robots-tag'), null, '静态资源应绕过 Worker');
    assert.notEqual(result.headers.get('content-type'), 'text/markdown; charset=utf-8');
    await result.arrayBuffer();
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, dirname } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { pageMarkdown } from '../scripts/agent-markdown.mjs';

test('正文转换保留标题、列表、强调和绝对链接，不导出表单或脚本', () => {
  const result = pageMarkdown('<html><nav>Outside</nav><main><h1>Test<br>title</h1><p>A &amp; B <strong>strong</strong></p><p><strong>CNC Turning</strong><span>Rotational components</span></p><ul><li>One</li></ul><a href="../quality/#checks">Quality</a><script>secret()</script><form data-secret="config"><input value="private"></form><div hidden>Hidden</div></main></html>', 'https://belaroprecision.com/contact/');
  assert.match(result, /# Test title/);
  assert.match(result, /A & B \*\*strong\*\*/);
  assert.match(result, /\*\*CNC Turning\*\* Rotational components/);
  assert.match(result, /-\s+One/);
  assert.match(result, /https:\/\/belaroprecision.com\/quality\/#checks/);
  assert.match(result, /Open the website/);
  assert.doesNotMatch(result, /Outside|secret|private|Hidden|data-secret/);
  assert.throws(() => pageMarkdown('<p>No main</p>', 'https://example.com/'), /缺少 main/);
});

test('所有构建页面都有非空 Markdown，不包含询价后台配置或可执行 HTML', { skip: Boolean(process.env.AGENT_BASE_URL) }, async () => {
  const config = await readFile('dist/_agent-markdown/agent-markdown.conf', 'utf8');
  const targets = [...new Set([...config.matchAll(/"(\/_agent-markdown\/\d+\.md)"/g)].map(match => match[1]))];
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.equal(targets.length, [...sitemap.matchAll(/<loc>/g)].length);
  for (const target of targets) {
    const text = await readFile(`dist${target}`, 'utf8');
    assert.match(text, /^Source: https:\/\/belaroprecision.com\//);
    assert.match(text, /(?:^|\n)# /);
    assert.ok(text.length > 300);
    assert.doesNotMatch(text, /<script|data-gravity-forms|turnstileSiteKey|<form/);
  }
});

test('真实 Nginx 按 Accept 返回格式，隔离缓存并保留静态文件及 404', { skip: !process.env.NGINX_BINARY && !process.env.AGENT_BASE_URL, timeout: 30000 }, async t => {
  let base = process.env.AGENT_BASE_URL;
  if (!base) {
    const binary = resolve(process.env.NGINX_BINARY);
    const temporary = await mkdtemp(join(tmpdir(), 'belaro-markdown-http-'));
    await mkdir(join(temporary, 'logs'));
    await mkdir(join(temporary, 'temp'));
    const listener = createServer();
    await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve));
    const port = listener.address().port;
    await new Promise(resolve => listener.close(resolve));
    const path = value => value.replaceAll('\\', '/');
    let server = await readFile('deploy/nginx.conf', 'utf8');
    server = server.replace('listen 80;', `listen 127.0.0.1:${port};`).replaceAll('/usr/share/nginx/html', path(resolve('dist')));
    const config = join(temporary, 'nginx.conf');
    await writeFile(config, `daemon off;\nmaster_process off;\nevents {}\nhttp {\ninclude "${path(join(dirname(binary), 'conf/mime.types'))}";\n${server}\n}\n`);
    const args = ['-p', `${path(temporary)}/`, '-c', path(config)];
    const check = spawnSync(binary, ['-t', ...args], { encoding: 'utf8', windowsHide: true });
    assert.equal(check.status, 0, check.stderr);
    const child = spawn(binary, args, { windowsHide: true, stdio: 'ignore' });
    child.on('error', () => {});
    t.after(async () => {
      const stopped = new Promise(resolve => child.once('exit', resolve));
      if (child.exitCode === null) {
        spawnSync(binary, ['-s', 'stop', ...args], { windowsHide: true });
        await stopped;
      }
    });
    base = `http://127.0.0.1:${port}`;
    for (let attempt = 0; attempt < 30; attempt++) {
      try { if ((await fetch(`${base}/healthz`)).ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  for (const route of ['/', '/services/cnc-milling/', '/contact/?process=milling', '/about', '/quality/index.html']) {
    for (const [accept, markdown] of [
      ['text/markdown', true], ['TEXT/MARKDOWN', true], ['text/html', false], ['*/*', false],
      ['text/markdown;q=0', false], ['text/markdown;q=0.0', false],
      ['text/html;q=1, text/markdown;q=0.5', false],
      ['text/html;q=0.5, text/markdown;q=0.6', true],
      ['text/html;q=0.51, text/markdown;q=0.501', false],
      ['text/html;q=0.501, text/markdown;q=0.51', true],
      ['text/html;q=0.001, text/markdown;q=0.001', true],
    ]) {
      const response = await fetch(`${base}${route}`, { headers: { Accept: accept } });
      assert.equal(response.status, 200, `${route}: ${accept}`);
      assert.match(response.headers.get('content-type'), markdown ? /^text\/markdown/ : /^text\/html/, accept);
      assert.match(response.headers.get('vary'), /Accept/);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.match(response.headers.get('content-signal'), /ai-train=yes/);
      const body = await response.text();
      assert.match(body, markdown ? /^Source: https:/ : /<!doctype html>/i);
    }
  }
  const head = await fetch(`${base}/`, { method: 'HEAD', headers: { Accept: 'text/markdown' } });
  assert.match(head.headers.get('content-type'), /^text\/markdown/);
  assert.equal(await head.text(), '');
  for (const route of ['/missing-agent-page/', '/_agent-markdown/0.md', '/_agent-markdown/agent-markdown.conf']) {
    assert.equal((await fetch(`${base}${route}`, { headers: { Accept: 'text/markdown' } })).status, 404);
  }
  for (const [route, type] of [['/robots.txt', /text\/plain/], ['/sitemap.xml', /xml/], ['/images/machined-parts/precision-shaft-main.webp', /image\/webp/]]) {
    const response = await fetch(`${base}${route}`, { headers: { Accept: 'text/markdown' } });
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), type);
    await response.arrayBuffer();
  }
});

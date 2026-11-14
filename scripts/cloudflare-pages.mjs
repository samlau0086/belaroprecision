import { readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { resolveLiveChatConfig } from '../src/lib/livechat-config.mjs';

export function validatePagesEnvironment(env) {
  resolveLiveChatConfig(env);
  let url;
  try { url = new URL(env.PUBLIC_GRAPHQL_URL); } catch {
    throw new Error('Pages 构建必须配置 PUBLIC_GRAPHQL_URL 为正式 HTTPS 后台地址');
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.hostname === 'localhost' || url.hostname.endsWith('.local')) {
    throw new Error('PUBLIC_GRAPHQL_URL 必须是正式 HTTPS 后台地址，且不能包含凭证');
  }
  if (env.PUBLIC_GTM_ID?.trim() && !/^GTM-[A-Z0-9]+$/.test(env.PUBLIC_GTM_ID.trim())) {
    throw new Error('PUBLIC_GTM_ID 格式无效');
  }
}

export async function buildPages(pages, dir, site) {
  // 仅允许处理独立的 Pages 输出目录，避免清理 VPS 产物或其他用户目录。
  if (resolve(fileURLToPath(dir)) !== resolve('dist-pages')) throw new Error('Pages 输出目录必须为 dist-pages');
  const content = [];
  for (const [index, { pathname }] of pages.entries()) {
    const path = new URL(pathname, site).pathname;
    content.push({
      path: path.endsWith('/') ? path : `${path}/`,
      markdown: await readFile(new URL(`_agent-markdown/${index}.md`, dir), 'utf8'),
    });
  }
  const runtime = await readFile(new URL('../deploy/pages-worker.mjs', import.meta.url), 'utf8');
  await writeFile(new URL('_worker.js', dir), `${runtime}\nexport default createWorker(${JSON.stringify(content)}, ${JSON.stringify(site)});\n`);
  // 正文只存在于 Worker 模块中，静态层没有可绕过访问的 Markdown 文件。
  await rm(new URL('_agent-markdown/', dir), { recursive: true });
  const excludes = ['/_astro/*', '/images/*'];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isFile() && !entry.name.startsWith('_') && !entry.name.endsWith('.html')) excludes.push(`/${entry.name}`);
  }
  if (excludes.length + 1 > 100) throw new Error('Pages 路由规则超过 100 条，请收敛静态资源路径');
  await writeFile(new URL('_routes.json', dir), `${JSON.stringify({ version: 1, include: ['/*'], exclude: excludes }, null, 2)}\n`);
  await writeFile(new URL('_headers', dir), `/*
  X-Content-Type-Options: nosniff
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/images/*
  Cache-Control: public, max-age=86400
/404.html
  Cache-Control: no-store
  X-Robots-Tag: noindex
`);
  await writeFile(new URL('404.html', dir), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>404 | Belaro Precision</title><h1>Page not found</h1><a href="/">Belaro Precision</a></html>\n');
}

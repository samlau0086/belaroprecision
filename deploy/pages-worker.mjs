// 此模块只使用 Web API；构建时与预生成正文合并为独立的 Pages Worker。
export function prefersMarkdown(accept = '') {
  const quality = media => {
    const escaped = media.replace('/', '\\/');
    const weighted = new RegExp(`(?:^|,)\\s*${escaped}\\s*;\\s*q=(0(?:\\.[0-9]{0,3})?|1(?:\\.0{0,3})?)\\s*(?:;[^,]*)?(?:,|$)`, 'i').exec(accept);
    if (weighted) return Number(weighted[1]);
    return new RegExp(`(?:^|,)\\s*${escaped}\\s*(?:,|$)`, 'i').test(accept) ? 1 : 0;
  };
  const markdown = quality('text/markdown');
  return markdown > 0 && markdown >= quality('text/html');
}

export function createWorker(pages, site) {
  const siteHost = new URL(site).hostname;
  const routes = new Map();
  for (const page of pages) {
    for (const alias of new Set([page.path, `${page.path}index.html`, page.path === '/' ? '/' : page.path.slice(0, -1)])) {
      routes.set(alias, page);
    }
  }

  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      const headers = new Headers({
        'Cache-Control': 'no-store',
        'Vary': 'Accept',
        'Content-Signal': 'search=yes, ai-input=yes, ai-train=yes',
        'Link': '</sitemap.xml>; rel="alternate"; type="application/xml"',
        'X-Content-Type-Options': 'nosniff',
      });
      if (url.hostname !== siteHost) headers.set('X-Robots-Tag', 'noindex');
      const respond = (body, status, type) => {
        headers.set('Content-Type', type);
        return new Response(request.method === 'HEAD' ? null : body, { status, headers });
      };
      if (!['GET', 'HEAD'].includes(request.method)) {
        headers.set('Allow', 'GET, HEAD');
        return respond('Method Not Allowed', 405, 'text/plain; charset=utf-8');
      }

      let path;
      try {
        path = decodeURIComponent(url.pathname);
      } catch {
        return respond('Bad Request', 400, 'text/plain; charset=utf-8');
      }
      const page = routes.get(path);
      if (!page) return respond('<!doctype html><html lang="en"><title>404 | Belaro Precision</title><h1>Page not found</h1><a href="/">Belaro Precision</a></html>', 404, 'text/html; charset=utf-8');

      if (prefersMarkdown(request.headers.get('Accept') || '')) {
        return respond(page.markdown, 200, 'text/markdown; charset=utf-8');
      }
      if (!path.endsWith('/') && !path.endsWith('/index.html')) {
        headers.set('Location', `${page.path}${url.search}`);
        return respond(null, 301, 'text/html; charset=utf-8');
      }

      // 不转发客户端条件头，防止静态层的 304 或 Range 干扰协商响应。
      const assetUrl = new URL(page.path, url);
      const asset = await env.ASSETS.fetch(new Request(assetUrl, { method: request.method }));
      if (asset.status !== 200) {
        return respond('Static page unavailable', 502, 'text/plain; charset=utf-8');
      }
      return respond(asset.body, 200, 'text/html; charset=utf-8');
    },
  };
}

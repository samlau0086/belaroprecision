import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';
import { buildMarkdown } from './scripts/agent-markdown.mjs';

const site = 'https://belaroprecision.com';

export default defineConfig({
  site,
  output: 'static',
  integrations: [{
    name: 'belaro-sitemap',
    hooks: {
      'astro:build:done': async ({ pages, dir }) => {
        await buildMarkdown(pages, dir, site);
        const urls = [...new Set(pages.map(({ pathname }) => new URL(pathname, site).href))].sort();
        const entries = urls.map(url => `  <url><loc>${url.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')}</loc></url>`).join('\n');
        await writeFile(new URL('sitemap.xml', dir), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`);
      },
    },
  }],
});

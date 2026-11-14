import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import base from './astro.config.mjs';
import { buildPages, validatePagesEnvironment } from './scripts/cloudflare-pages.mjs';

validatePagesEnvironment({ ...loadEnv(process.env.NODE_ENV || 'production', process.cwd(), ''), ...process.env });

export default defineConfig({
  ...base,
  outDir: './dist-pages',
  integrations: [...base.integrations, {
    name: 'belaro-cloudflare-pages',
    hooks: {
      'astro:build:done': ({ pages, dir }) => buildPages(pages, dir, base.site),
    },
  }],
});

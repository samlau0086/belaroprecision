import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { chromium } from 'playwright';

// 使用当前安装的 Astro audit 规则，避免测试与开发工具栏规则脱节。
test('全站 Astro audit、优化图片与响应式回归', async (t) => {
  const root = new URL('../dist/', import.meta.url);
  const files = await readdir(root, { recursive: true });
  const pages = files.filter(file => file.endsWith('index.html'));
  const rules = await build({
    stdin: {
      contents: 'export { a11y } from "astro/runtime/client/dev-toolbar/apps/audit/rules/a11y.js"; export { perf } from "astro/runtime/client/dev-toolbar/apps/audit/rules/perf.js";',
      resolveDir: fileURLToPath(new URL('../', import.meta.url)),
    },
    bundle: true, write: false, format: 'iife', globalName: 'astroAuditRules',
  });
  const server = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.endsWith('/') ? `${path}index.html` : path;
      const body = await readFile(new URL(`.${file}`, root));
      const type = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
      res.setHeader('Content-Type', type[file.slice(file.lastIndexOf('.'))] ?? 'application/octet-stream');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = process.env.ASTRO_AUDIT_BASE_URL ?? `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.abort());
    const violations = [];
    const imageProblems = [];
    const loadingAdvice = [];
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const file of pages) {
        const route = `/${file.replaceAll('\\', '/').replace(/index\.html$/, '')}`;
        await page.goto(`${baseUrl}${route}`);
        await page.addScriptTag({ content: rules.outputFiles[0].text });
        const findings = await page.evaluate(async (isDev) => {
          const results = [];
          const advice = [];
          // Image 的识别标记只存在于开发产物；生产产物单独验证优化 URL 和 srcset。
          const rules = [...astroAuditRules.a11y, ...astroAuditRules.perf].filter(rule => isDev || rule.code !== 'perf-use-image-component');
          for (const rule of rules) {
            for (const element of document.querySelectorAll(rule.selector)) {
              const target = element.children[0] || element;
              if (target.offsetParent === null || getComputedStyle(element).display === 'none') continue;
              if (!rule.match || await rule.match(element)) {
                const finding = `${rule.code}: ${element.outerHTML.slice(0, 180)}`;
                // 首屏位置会随视口和字体改变；记录建议，不为消除提示反复修改 loading。
                if (rule.code.startsWith('perf-use-loading-')) advice.push(finding);
                else results.push(finding);
              }
            }
          }
          return { results, advice };
        }, Boolean(process.env.ASTRO_AUDIT_BASE_URL));
        violations.push(...findings.results.map(item => `${route} (${width}px) ${item}`));
        loadingAdvice.push(...findings.advice.map(item => `${route} (${width}px) ${item}`));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route} ${width}px 横向溢出`);
        // 逐张解码也覆盖尚未滚入视口及非活动轮播图片，避免只验证标签却遗漏损坏资源。
        const failedImages = await page.locator('img').evaluateAll(async nodes => {
          const failures = await Promise.all(nodes.map(async img => {
            img.loading = 'eager';
            try { await img.decode(); return img.naturalWidth > 0 ? null : img.currentSrc; }
            catch { return img.currentSrc || img.src; }
          }));
          return failures.filter(Boolean);
        });
        assert.deepEqual(failedImages, [], `${route} ${width}px 图片应能加载并解码`);
        const images = await page.locator('img').evaluateAll(nodes => nodes.map(img => ({
          src: img.getAttribute('src'), srcset: img.getAttribute('srcset'), sizes: img.getAttribute('sizes'),
          width: img.width, height: img.height, alt: img.getAttribute('alt'),
        })));
        for (const img of images) {
          if ((!process.env.ASTRO_AUDIT_BASE_URL && !img.src.startsWith('/_astro/')) || !img.srcset || !img.sizes || !img.width || !img.height || img.alt === null) {
            imageProblems.push(`${route}: ${JSON.stringify(img)}`);
          }
        }
      }
    }
    t.diagnostic(`已检查 ${pages.length} 页，390px / 1440px 两种视口。`);
    for (const advice of loadingAdvice) t.diagnostic(advice);
    assert.deepEqual(violations, [], 'Astro 可访问性与性能 audit（视口相关加载建议单独报告）');
    assert.deepEqual(imageProblems, [], '摄影图片应生成本地优化资源、响应式候选、尺寸与 alt');
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});

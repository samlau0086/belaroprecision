import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parseHTML } from 'linkedom';
import TurndownService from 'turndown';

export function pageMarkdown(html, url) {
  const { document } = parseHTML(html);
  const main = document.querySelector('main');
  if (!main) throw new Error(`页面缺少 main 正文：${url}`);
  main.querySelectorAll('script, style, nav, svg, button, [hidden], [aria-hidden="true"]').forEach(node => node.remove());
  for (const form of main.querySelectorAll('form')) {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = 'Open the website to complete and submit your enquiry.';
    form.replaceWith(link);
  }
  for (const node of main.querySelectorAll('a[href], img[src]')) {
    const attribute = node.localName === 'a' ? 'href' : 'src';
    const target = new URL(node.getAttribute(attribute), url);
    if (['https:', 'http:', 'mailto:', 'tel:'].includes(target.protocol)) node.setAttribute(attribute, target.href);
    else node.removeAttribute(attribute);
  }
  for (const node of main.querySelectorAll('strong, b, em, i, code')) {
    const next = node.nextSibling;
    if (next && /[\p{L}\p{N}]$/u.test(node.textContent) && /^[\p{L}\p{N}]/u.test(next.textContent)) {
      node.after(document.createTextNode(' '));
    }
  }
  const converter = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
  converter.addRule('lineBreak', { filter: 'br', replacement: () => ' ' });
  converter.remove(['input', 'select', 'textarea']);
  return `Source: ${url}\n\n${converter.turndown(main.innerHTML)}\n`;
}

// 只显式接受 text/markdown 才协商；按 q 值比较，权重相同时优先 Markdown。
export function negotiationConfig() {
  const blocks = [];
  for (const [name, media] of [['md', 'text/markdown'], ['html', 'text/html']]) {
    blocks.push(`map $http_accept $agent_${name}_q {\n    default 0;\n    "~*(?:^|,)\\s*${media}\\s*;\\s*q=(?<agent_${name}_weight>0(?:\\.[0-9]{0,3})?|1(?:\\.0{0,3})?)\\s*(?:;[^,]*)?(?:,|$)" $agent_${name}_weight;\n    "~*(?:^|,)\\s*${media}\\s*(?:,|$)" 1;\n}`);
    blocks.push(`map $agent_${name}_q $agent_${name}_score {\n    default 0000;\n    "~^1" 1000;\n    "~^0\\.(?<agent_${name}_three>[0-9]{3})$" "0$agent_${name}_three";\n    "~^0\\.(?<agent_${name}_two>[0-9]{2})$" "0${'$'}{agent_${name}_two}0";\n    "~^0\\.(?<agent_${name}_one>[0-9])$" "0${'$'}{agent_${name}_one}00";\n}`);
  }
  const comparisons = ['    "~^0000:" 0;', '    "~^1000:" 1;'];
  // 逐位比较四位整数，前缀相等时较大的首个数字决定优先级。
  for (let position = 1; position < 4; position++) {
    for (let digit = 1; digit <= 9; digit++) {
      const prefix = `agent_equal_${position}_${digit}`;
      comparisons.push(`    "~^(?<${prefix}>[0-9]{${position}})[${digit}-9][0-9]{${3 - position}}:\\k<${prefix}>${digit - 1}[0-9]{${3 - position}}$" 1;`);
    }
  }
  comparisons.push('    "~^(?<agent_equal_score>[0-9]{4}):\\k<agent_equal_score>$" 1;');
  blocks.push(`map "$agent_md_score:$agent_html_score" $agent_markdown {\n    default 0;\n${comparisons.join('\n')}\n}`);
  return `${blocks.join('\n\n')}\n`;
}

export async function buildMarkdown(pages, dir, site) {
  const output = new URL('_agent-markdown/', dir);
  await mkdir(output, { recursive: true });
  const routes = [];
  for (const [index, { pathname }] of pages.entries()) {
    const path = new URL(pathname, site).pathname;
    const canonical = path.endsWith('/') ? path : `${path}/`;
    const html = await readFile(new URL(`.${canonical}index.html`, dir), 'utf8');
    const filename = `${index}.md`;
    await writeFile(new URL(filename, output), pageMarkdown(html, new URL(canonical, site).href));
    const target = `/_agent-markdown/${filename}`;
    for (const alias of new Set([canonical, `${canonical}index.html`, canonical === '/' ? '/' : canonical.slice(0, -1)])) {
      routes.push({ alias, target });
    }
  }
  await writeFile(new URL('agent-markdown.conf', output), `${negotiationConfig()}\nmap "$agent_markdown:$uri" $agent_markdown_uri {\n    default "";\n${routes.map(({ alias, target }) => `    "1:${alias}" "${target}";`).join('\n')}\n}\n`);
}

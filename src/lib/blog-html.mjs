import { parseHTML } from 'linkedom';

// 构建期也清理 CMS 正文，避免将第三方可执行内容写入静态 HTML。
export function sanitizeBlogHtml(source, origin = 'https://belaroprecision.com') {
  const { document } = parseHTML('<!doctype html><html><body></body></html>');
  document.body.innerHTML = String(source || '');
  const allowed = new Set('A BLOCKQUOTE BR CODE DEL DIV EM FIGCAPTION FIGURE H2 H3 H4 H5 H6 HR IMG LI OL P PRE S STRONG SUB SUP TABLE TBODY TD TFOOT TH THEAD TR U UL'.split(' '));
  const blocked = new Set('BUTTON EMBED FORM IFRAME INPUT MATH OBJECT SCRIPT STYLE SVG TEMPLATE'.split(' '));
  const attributes = new Set('alt colspan height href rel rowspan src target title width'.split(' '));
  for (const element of [...document.body.querySelectorAll('*')]) {
    if (!allowed.has(element.tagName)) {
      if (blocked.has(element.tagName)) element.remove();
      else element.replaceWith(...element.childNodes);
      continue;
    }
    for (const attribute of [...element.attributes]) {
      if (!attributes.has(attribute.name.toLowerCase())) element.removeAttribute(attribute.name);
    }
    for (const name of ['href', 'src']) {
      if (!element.hasAttribute(name)) continue;
      try {
        const url = new URL(element.getAttribute(name), origin);
        const protocols = name === 'href' ? ['http:', 'https:', 'mailto:', 'tel:'] : ['http:', 'https:'];
        if (!protocols.includes(url.protocol)) element.removeAttribute(name);
      } catch { element.removeAttribute(name); }
    }
    if (element.tagName === 'A') element.setAttribute('rel', 'noopener noreferrer');
    if (element.tagName === 'IMG') element.setAttribute('loading', 'lazy');
  }
  return document.body.innerHTML;
}

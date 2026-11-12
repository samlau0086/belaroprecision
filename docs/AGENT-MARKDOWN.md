# 面向 Agent 的 Markdown 内容协商

## 目标

生产 Nginx 在同一个页面 URL 上按 `Accept` 请求头返回 HTML 或 Markdown，无需 Cloudflare Markdown for Agents。普通浏览器继续获得 HTML；显式请求 `text/markdown` 的 Agent 可获得更紧凑的正文版本。

站点同时通过响应头声明：

```text
Content-Signal: search=yes, ai-input=yes, ai-train=yes
```

这表示允许搜索、AI 回答引用及模型训练使用公开内容。该声明不是访问控制，也不能保证所有爬虫执行该偏好。

## 实现方式

`astro:build:done` 构建钩子读取 Astro 已生成的每个 HTML 页面，通过 `linkedom` 提取 `<main>`，再用 `turndown` 生成 Markdown。产物写入 `dist/_agent-markdown/`，同时生成仅供 Nginx 引用的路由映射文件。

转换会保留标题、段落、列表、强调、图片和链接，并将相对 URL 改为绝对 URL。导航、脚本、样式、SVG、按钮、隐藏内容和表单控件不会进入 Markdown。询价表单会替换为指向原网页的链接，Agent 不能通过 Markdown 响应直接提交询价。

`deploy/nginx.conf` 将内部 Markdown 产物设为不可直接访问。只有原页面 URL 匹配且协商结果为 Markdown 时，Nginx 才内部改写到对应文件。

Nginx 使用 `absolute_redirect off`：HTML 目录请求（例如 `/about`）返回相对 `Location: /about/`，查询参数保持不变。这样 Docker 端口映射和外层 HTTPS 代理不会将客户端跳转到容器内部端口或 HTTP 地址。HTTP 集成测试同时检查相对重定向和自动跟随后的页面响应。

## Accept 规则

- 没有显式 `text/markdown` 时返回 HTML，包括浏览器常见的 `*/*`。
- `text/markdown;q=0` 返回 HTML。
- 同时显式提供 `text/html` 与 `text/markdown` 时比较两者 `q` 值，较高者优先。
- 两者 `q` 值相同时返回 Markdown。
- 当前支持 `q` 值小数点后最多三位。
- 两种响应均返回 `Vary: Accept` 和 `Cache-Control: no-store`，避免共享缓存把 HTML 与 Markdown 串在一起。
- Markdown 响应使用 `Content-Type: text/markdown; charset=utf-8`。

当前没有可靠的分词器，因此不返回 `x-markdown-tokens`，也不提供不准确的估算值。

## 本地验证

`npm run build` 会生成 HTML、Markdown 和 Nginx 路由配置。Astro 的 `npm run dev` 与 `npm run preview` 不加载生产 Nginx 配置，因此不能用于验证内容协商。

使用 Docker 验证完整生产路径：

```bash
docker build --build-arg PUBLIC_GRAPHQL_URL=https://cms.example.com/graphql -t belaroprecision:local .
docker run --rm -p 127.0.0.1:8080:80 belaroprecision:local
```

另开终端检查：

```bash
curl -i -H "Accept: text/html" http://127.0.0.1:8080/about/
curl -i -H "Accept: text/markdown" http://127.0.0.1:8080/about/
curl -i -H "Accept: text/html;q=1, text/markdown;q=0.5" http://127.0.0.1:8080/about/
```

已有 Nginx 可执行文件时，也可运行真实 HTTP 集成测试：

```powershell
$env:NGINX_BINARY = 'C:\path\to\nginx.exe'
node --test tests/agent-markdown.test.mjs
```

对已启动的容器或服务器执行相同测试：

```bash
AGENT_BASE_URL=http://127.0.0.1:8080 node --test tests/agent-markdown.test.mjs
```

## Cloudflare 缓存要求

页面必须绕过 Cloudflare 共享缓存。不要对官网 HTML 使用“Cache Everything”或忽略源站 `Cache-Control` 的固定 Edge TTL，否则 Cloudflare 可能在同一 URL 下向 Agent 返回缓存的 HTML，或向浏览器返回缓存的 Markdown。

`/images/` 和 `/_astro/` 等不参与格式协商的静态资源仍可单独配置长期缓存。修改规则后应清除旧的页面缓存，再分别使用 HTML 与 Markdown 请求验收响应类型、`Vary` 和缓存状态。

## 上线边界

仓库已实现源站功能，但代码修改不会自动更新 Cloudflare Cache Rules，也不会自动部署到生产环境。第三方 Agent Ready 评分规则可能变化；本实现提供标准的 HTTP 内容协商行为，不保证特定检测分数。

# GitHub Actions 通过 SSH 部署 Docker 到 VPS

## 部署范围与流程

本方案只部署 Astro 静态前端。WordPress、数据库、Gravity Forms 和 MU 插件独立维护，不会随前端镜像更新。

推送到 `main` 或在 GitHub Actions 手动运行“Docker 部署到 VPS”后，工作流按以下顺序执行：校验配置、安装锁定依赖并运行部署参数与 Bash 语法测试、构建镜像（含表单单元测试和 Astro 构建）、启动临时容器检查首页/询价页/404、通过 SSH 私钥上传镜像包、在 VPS 导入镜像并用 Docker Compose 更新。无需 GHCR、Docker Hub 登录或 VPS 拉取源码。

镜像使用提交 SHA、运行编号和重试次数共同标记。VPS 使用固定 Compose 项目名 `belaroprecision`；健康检查通过后才更新 `current` 链接。更新失败时尝试用上一成功版本的镜像、Compose 和端口配置恢复，工作流仍报告失败。首次部署失败时停止失败容器。单容器重建可能短暂中断服务，不提供零停机承诺。

## VPS 前提

- Linux VPS，支持 `linux/amd64` 或 `linux/arm64`，使用 `uname -m` 确认架构。
- 已安装并启动 Docker Engine 和 Docker Compose 插件；Compose 必须支持 `up --wait --wait-timeout`。
- 已安装 OpenSSH Server、Bash、tar、gzip、util-linux（提供 `flock`）。
- SSH 用户能够执行 `docker info` 和 `docker compose version`，无需交互输入 sudo 密码；家目录可写，有足够空间保存新旧镜像及传输包。Docker 用户组拥有高权限，请使用专门的部署账户并妥善保管密钥。
- GitHub 托管 Runner 能访问 VPS 的 SSH 端口；已有防火墙白名单时，需允许 Runner 来源或改用可连接 VPS 的自托管 Runner。

以已创建的 `deploy` 用户为例，管理员可执行：

```bash
sudo usermod -aG docker deploy
```

然后重新登录该用户，执行以下命令确认权限及 Compose 功能。安装 Docker 的具体命令应按 VPS 发行版采用 Docker 官方文档，不要混用不同发行版的软件源。

```bash
docker info
docker compose version
docker compose up --help
uname -m
```

## 创建 SSH 部署密钥

在可信的本地终端生成专用 Ed25519 密钥，例如 Windows PowerShell：

```powershell
ssh-keygen -t ed25519 -C "github-actions-belaroprecision" -f "$env:USERPROFILE/.ssh/belaroprecision_actions"
```

本工作流使用无口令专用私钥，生成时在口令提示处直接回车。私钥完整内容放入 GitHub Secret `VPS_SSH_KEY`，包括 BEGIN/END 行；不要提交到仓库，也不要放在聊天记录中。公钥为同名 `.pub` 文件，将其整行追加到 VPS 部署用户的 `~/.ssh/authorized_keys`，保留原有公钥。

在 VPS 以部署用户执行：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# 使用编辑器将新公钥追加为 authorized_keys 的独立一行，保留原有内容。
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

SSH 服务须允许该用户使用公钥认证；GitHub 填写的用户名必须与安装公钥的用户一致。在本地用新私钥验证登录及 Docker 权限后再配置工作流。

## SSH 主机身份校验

不需要配置或维护 `VPS_KNOWN_HOSTS`。工作流使用 OpenSSH `StrictHostKeyChecking accept-new`，首次连接时接受服务器提供的主机密钥，并保存在本次 GitHub Runner 临时目录；后续 SSH/SCP 调用会校验该记录，工作流结束时删除临时文件。

注意：GitHub 托管 Runner 是临时环境，每次运行都会重新建立主机密钥信任。因此这种方式不能预先核验服务器身份，首次连接遇到 DNS/IP 劫持或中间人攻击时可能接受错误主机。优先用固定 `VPS_HOST` IP 并从可信网络连接；如果以后需要更强校验，可恢复固定主机指纹配置。

## GitHub 配置清单

仓库中创建名为 `production` 的 Environment，将下面的 Secrets 和 Variables 配置到其中（也可以使用仓库级配置）。如需推送后全自动部署，Environment 不要设置必须人工批准的部署规则；限制允许部署的分支为 `main`。仓库须允许 GitHub Actions 及工作流使用的官方 Actions。

Secrets：

| 名称 | 必填 | 内容 |
| --- | --- | --- |
| `VPS_HOST` | 是 | VPS IPv4 或域名，不带协议、用户名或端口；暂不支持 IPv6 |
| `VPS_USER` | 是 | SSH 登录用户名，例如 `deploy` |
| `VPS_SSH_KEY` | 是 | 专用、无口令 SSH 私钥完整内容 |

Variables：

| 名称 | 默认值 | 用途 |
| --- | --- | --- |
| `VPS_SSH_PORT` | `22` | SSH 端口 |
| `PUBLIC_GRAPHQL_URL` | 无，必须填写 | 正式 WordPress HTTPS GraphQL 地址，如 `https://cms.example.com/graphql`；不能包含用户名或密码，拒绝 `.local` 和 `localhost` |
| `PUBLIC_TURNSTILE_SITE_KEY` | 空 | 公开 Site Key；启用或停用须与 WordPress 后台同步 |
| `PUBLIC_GTM_ID` | 空 | 可选的 Google Tag Manager Web 容器 ID（`GTM-...`）；仅在同意管理和隐私政策准备完成后设置，修改后须重新构建发布 |
| `DOCKER_PLATFORM` | `linux/amd64` | x86_64 VPS 使用默认值，aarch64 VPS 改为 `linux/arm64`；ARM 构建和测试使用 QEMU，可能较慢 |
| `HTTP_BIND_ADDRESS` | `127.0.0.1` | 支持 `127.0.0.1` 或 `0.0.0.0`；后者允许通过宿主机公网端口访问 |
| `HTTP_PORT` | `8080` | VPS 映射端口，须避开已有服务 |

`PUBLIC_*` 变量在构建时写入静态文件，属于公开信息；VPS 容器启动后修改环境变量不会改变网页配置，必须重新构建发布。WordPress Secret Key 只能保留在后台，不能填写到这些公开变量。

`HTTP_PORT` 只控制 VPS 的端口映射。例如设为 `28080` 时，VPS 使用 `127.0.0.1:28080`（默认监听地址），下文反向代理和验收命令中的 `8080` 也要相应替换为 `28080`。GitHub Runner 上的临时测试容器独立使用 `127.0.0.1:18080`，不需要跟随 VPS 修改。

临时容器启动后，工作流先检查 `/healthz`：最多重试 15 次，间隔 2 秒，重试时间窗口为 60 秒，连接超时 3 秒、单次请求超时 5 秒，允许重试连接重置或拒绝等启动错误。只有就绪后才检查首页、询价页和 404。若仍失败，查看步骤末尾的容器日志；更新工作流后须推送新提交到 `main`，旧记录的 Re-run 不会使用修复后的文件。

## 域名、HTTPS 与反向代理

默认仅在 VPS 本机提供 `http://127.0.0.1:8080`。将域名解析到 VPS，在 VPS 现有 Nginx、Caddy 或其他代理中配置正式域名、TLS 证书和转发目标 `127.0.0.1:8080`。本仓库不会修改 VPS 已有代理或证书。

如直接使用宿主机 Nginx，在已配置域名和 TLS 的 `server` 块中设置：

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

若代理运行在另一个容器，代理内的 `127.0.0.1` 指向代理自身，需要按现有 Docker 网络调整上游连接方式。临时需要公网 HTTP 访问时可将 `HTTP_BIND_ADDRESS` 改为 `0.0.0.0`，并配置对应网络访问规则；这不会自动生成 HTTPS。不要把其他已使用的 80/443 端口直接改给本容器。

当前站点 Canonical 域名固定为 `https://belaroprecision.com`；更换域名须同步修改 `astro.config.mjs`、`src/config.ts` 和 `public/robots.txt`。容器支持 Astro 目录路由、未知页面 HTTP 404、HTML/Markdown 内容协商和 `/_astro/` 哈希资源长期缓存；构建生成 sitemap、Markdown 和 Nginx 路由映射，静态发布 robots.txt，页面响应包含 sitemap Link 头。页面使用 `Cache-Control: no-store` 与 `Vary: Accept`，Cloudflare 不得用全站强制缓存覆盖。详细实现与验证命令见 [AGENT-MARKDOWN.md](AGENT-MARKDOWN.md)。没有自定义 404 页面。

## 首次发布与验收

1. 完成 VPS、公钥和 GitHub 配置，并确认正式 WordPress 后台、字段映射、CORS 及按需启用的 Turnstile。
2. 将部署文件合并并推送到 `main`；也可以在该分支手动运行工作流。手动选择其他分支会跳过部署。
3. 检查工作流的构建、容器路由和 Markdown 内容协商检查，以及 VPS 健康检查结果。缺少必填配置时会在传输前失败。
4. 登录 VPS 检查：

```bash
cd ~/belaroprecision/current
docker compose --project-name belaroprecision --env-file .env -f compose.yaml ps
curl -f http://127.0.0.1:8080/
curl -f http://127.0.0.1:8080/contact/
```

端口或监听地址修改后需同步调整检查命令。随后从正式 HTTPS 域名核对首页、询价页、图片、未知路由、Canonical，并提交标记为测试的询盘核对条目、附件、CORS 和通知邮件。容器健康检查只验证首页能返回成功，不能证明询价后台或 HTTPS 正常。

如果正式域名经过 Cloudflare，发布前应将官网页面设为 Bypass cache，只对 `/images/` 与 `/_astro/` 单独缓存，并清除旧页面缓存。随后分别用 `Accept: text/html` 和 `Accept: text/markdown` 验证响应类型；Cloudflare 页面响应不得成为共享缓存 `HIT`。

本次仅完成本地配置开发及部分检查，尚未连接真实 VPS 或运行 GitHub 发布；本地 Docker 引擎未启动，不能据此声称镜像及恢复流程已完成真实验收。

## 回滚与维护

VPS 文件位于部署用户家目录的 `~/belaroprecision/`：`releases/` 保存每次部署的 Compose 和 `.env`，`current` 指向最近成功版本，`previous` 指向其前一个成功版本，`deploy.lock` 用于串行更新。成功后只移除本次传输压缩包和已导入的镜像 tar；保留 Docker 镜像及历史版本配置，不执行全局 prune。构建、传输或部署失败可能留下压缩包或失败版本目录，应在排查后人工整理，监控磁盘空间。

需要手动恢复上一成功版本时，先确保没有工作流正在部署，然后执行：

```bash
cd ~/belaroprecision
flock -w 300 deploy.lock bash -euo pipefail -c '
  target=$(readlink -f previous)
  test -n "$target"
  test -f "$target/.env"
  docker compose --project-name belaroprecision --env-file "$target/.env" -f "$target/compose.yaml" up -d --wait --wait-timeout 90
  ln -sfn "$target" current
'
```

首次部署没有 `previous`，无法回滚。手动回滚后 `previous` 仍保留原目标，不实现版本切换轮转；再次推送 `main` 或重新运行工作流会重新发布对应提交。若旧镜像已被人工删除，须重新构建该提交后再发布。不要在发布过程中执行 `docker compose down`，也不要盲目清理其他项目的容器或镜像。

## 本地 Docker 核查

构建依赖包含 Rollup、esbuild 和 Sharp 的原生平台包；Sharp 在 Alpine 下还需要对应的 musl libvips 包。Docker 使用 `npm ci --include=optional`，不可省略可选依赖。仓库锁文件应同时保留 Windows 和 Linux 平台记录；不要为修复安装错误直接升级全部依赖。`node --test tests/deployment.test.mjs` 会检查 x64/ARM64 Linux 构建依赖及 Sharp/libvips 是否按现有版本锁定。该检查不替代实际 Docker 镜像构建。

若出现 `MissingSharp` 或 `Cannot find module @rollup/rollup-linux-x64-musl`，先检查锁文件的平台包记录。锁文件修复后须提交并推送，再运行新提交的工作流；重新运行旧记录不会使用新文件。

先启动 Docker 引擎，从 `.env.example` 创建本地 `.env` 并填写公开配置，再执行：

```bash
docker build --build-arg PUBLIC_GRAPHQL_URL=https://cms.example.com/graphql -t belaroprecision:local .
docker compose --env-file .env -f compose.yaml up -d --wait --wait-timeout 90
curl -f http://127.0.0.1:8080/
```

启用 Turnstile 时还需在 `docker build` 中显式传入 `--build-arg PUBLIC_TURNSTILE_SITE_KEY=公开SiteKey`；Docker 不会自动将 `.env` 内容传给构建。不要使用示例后台地址进行正式发布。

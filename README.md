# Belaro Precision — Astro 企业网站

## 1. 项目简介与当前状态

面向工业 OEM 客户的响应式英文 B2B 网站，使用 Astro 和原生 CSS，包含企业展示页面和 RFQ（询价）表单。开发文档使用简体中文，网站页面仍使用英文。

网站采用静态输出；浏览器通过 GraphQL 向独立的 WordPress 服务提交询价。当前仓库不包含完整 WordPress 站点、数据库或后台管理系统，仅包含一个配套 MU 插件。制造、报价、检验和交付流程属于页面介绍内容，不代表本仓库实现了相应业务系统，也不构成对企业实际能力的验证。

本说明于 **2026 年 11 月 4 日**根据工作区代码和配置核查。原文中的历史联调记录保留于后文，并单独标注其验证边界。**2026 年 11 月 5 日**新增 Machined Parts 分类展示页、全站入口与询价预填流程，相关验证记录见第 10 节。

## 2. 技术栈与依赖

| 项目 | 实际配置与用途 |
| --- | --- |
| 前端框架 | Astro；`package.json` 声明 `^5.7.0`，锁文件及本地安装为 `5.18.2` |
| 语言与模块 | Astro 模板、TypeScript、JavaScript ESM；WordPress 配套代码使用 PHP |
| 构建工具 | Astro CLI，底层 Vite `6.4.5`（锁文件版本） |
| 包管理器 | npm，存在 `package-lock.json`，锁文件格式为 3 |
| 样式 | 原生全局 CSS、组件局部样式、CSS 自定义属性；未使用 UI 框架 |
| 国旗与电话区号 | `flag-icons`：声明 `^7.6.0`、锁定 `7.6.0`；`libphonenumber-js`：声明 `^1.13.15`、锁定 `1.13.15` |
| TypeScript 配置 | 继承 `astro/tsconfigs/strict`，定义 `@/*` 到 `src/*` 的别名；TypeScript `5.9.3` 为间接依赖 |
| 外部后台 | WordPress、Gravity Forms、WPGraphQL、WPGraphQL for Gravity Forms；附件还需要 WPGraphQL Upload |
| 测试 | Node.js 内置 `node:test`、`node:assert/strict`；浏览器测试使用 Playwright 和 Chromium |

项目没有独立的 Node.js 后端框架、SSR 适配器、ORM、数据库连接配置、Migration 或站内用户认证。WordPress 用作表单后台；展示内容直接写在 Astro 文件中，未实现从 CMS 动态读取页面内容。RFQ 使用匿名请求，代码设置 `credentials: 'omit'`，不携带 WordPress 登录凭证。

## 3. 目录结构

```text
.
├── AGENTS.md                 # 项目开发规范
├── README.md                 # 项目说明与核查记录
├── package.json              # 依赖与 dev/build/preview 脚本
├── package-lock.json         # npm 依赖锁文件
├── astro.config.mjs          # 站点地址及静态输出配置
├── tsconfig.json             # TypeScript 严格配置及路径别名
├── src/
│   ├── config.ts             # 站点公开信息、GraphQL 地址、表单字段映射
│   ├── layouts/BaseLayout.astro # 页面外壳、SEO、字体、移动导航脚本
│   ├── pages/                # 首页及服务、零件、行业、质量、企业和询价页面
│   ├── components/           # 页头、页脚、轮播、零件示意图及表单字段等
│   ├── data/                 # Machined Parts 分类与评审内容
│   ├── lib/                  # 国家数据、GraphQL 请求构造与结果解析
│   └── styles/global.css     # 全局样式和响应式规则
├── tests/                    # 表单单元测试及浏览器测试
├── wordpress/mu-plugins/     # 上传兼容与 Turnstile 校验插件
├── .astro/                   # Astro 生成目录，Git 忽略
├── dist/                     # 静态构建产物，Git 忽略
└── node_modules/             # 本地依赖，Git 忽略
```

当前没有 `docs/`、`public/`、`.github/`、CHANGELOG.md 或 `.env.example`；未发现 CI、Docker、托管平台部署配置和嵌套 AGENTS.md。

## 4. 已有页面与功能边界

| 路由 | 当前实现 |
| --- | --- |
| `/` | 首页、四张首屏轮播、服务/行业/质量概览和询价入口 |
| `/machined-parts/` | 六类按图加工零件展示、应用方向、工艺归类、图纸评审要点、询价准备资料和 FAQ；零件图为概念示意，不代表客户案例或库存产品 |
| `/services/` | CNC 铣削、车削及小批量生产介绍；锚点为 `milling`、`turning`、`production` |
| `/services/production/` | OEM 与小批量生产专页，包含需求对齐、生产流程、重复订单、检验要求和项目讨论入口 |
| `/services/cnc-milling/` | 独立 CNC Milling 服务页，包含 3-Axis CNC Machining、Simultaneous 5-Axis CNC Machining、典型零件、图纸评审、材料与表面要求、合作流程、FAQ 和铣削询价入口 |
| `/services/cnc-turning/` | 独立 CNC Turning 服务页，包含典型零件、图纸评审、材料与表面要求、合作流程、FAQ 和车削询价入口 |
| `/services/secondary-processes/` | 配套工艺专页，说明通过东莞供应商网络协调磨削、热处理、表面处理及其他二次工艺的方式、询价资料和能力边界 |
| `/industries/` | 自动化、工业机械、液压/气动、实验室与测试设备四个目标领域的应用说明、概念零件图、零件分类链接、图纸评审重点、加工与配套工艺入口、RFQ 清单及 FAQ；不代表已有客户关系或行业认证 |
| `/quality/` | 图纸评审、检验流程和公差适用条件说明；没有在线检验管理功能 |
| `/about/` | 企业定位、能力概览、东莞供应链支持、合作流程、质量评审与 FAQ |
| `/contact/` | 询价字段、国家搜索、电话区号、材料自定义输入、单附件上传、Turnstile 与 GraphQL 提交 |

公共组件包含桌面/移动导航、页脚、年份更新和章节标题。页头的 Capabilities 支持桌面端悬停/键盘聚焦下拉，并在移动菜单中展示 CNC Milling、3-Axis CNC Machining、5-Axis CNC Machining、CNC Turning、Secondary Processes 和 OEM & Low-Volume Production 子链接；页头、移动菜单、页脚和首页均提供 Machined Parts 入口。轮播支持约 7 秒自动切换、前后按钮、分页、暂停、方向键和触摸滑动；悬停、内部焦点、页面隐藏或离开视口时暂停计时，减少动态效果的 CSS 会关闭过渡。禁用 JavaScript 时显示首张轮播；询价提交需要 JavaScript。

首页四步 RFQ 流程使用橙色顶部边框和浅灰背景卡片，卡片间以箭头连接。宽度大于 900px 时横向排列、箭头向右；900px 及以下纵向排列、箭头向下。流程使用有序列表，装饰箭头对辅助技术隐藏，无需 JavaScript。

RFQ 必填项包括姓名、邮箱、公司、国家/地区、加工工艺、数量和联系同意；同意框当前默认勾选。电话、材料、交期、要求、附件和项目详情为可选项。国家搜索含国旗，材料既可选也可自填；电话区号随国家选择更新，并可独立修改。

已实现页面 Title、Meta Description、Canonical、英文 `lang` 和图片 Alt。当前未实现 Open Graph、Twitter Card、结构化数据、sitemap、robots.txt、自定义 404、隐私/条款页面、分析统计、广告转化、自动报价、订单管理或站内登录。

## 5. 环境要求、安装与启动

本次实测环境为 Node.js `22.23.4`、npm `10.9.9`。保留原项目的 Node.js 22.23.4 或更新的 Node 22 版本建议；项目未声明 `engines`、`packageManager` 或固定 Node 版本文件。锁定 Astro 的包声明为 Node.js `18.20.8 || ^20.3.0 || >=22.0.0`、npm `>=9.6.5`，这是依赖兼容声明，不代表所有版本都经过本项目验证。

按锁文件安装（本次检查没有执行安装）：

```bash
npm ci
```

原有本地开发方式仍有效：

```bash
npm install
npm run dev
```

构建与预览：

```bash
npm run build
npm run preview
```

`package.json` 只定义以下三个脚本：

| 命令 | 实际脚本 | 用途 |
| --- | --- | --- |
| `npm run dev` | `astro dev` | 本地开发与文件监听 |
| `npm run build` | `astro build` | 生成 `dist/` |
| `npm run preview` | `astro preview` | 本地预览构建产物 |

默认端口为 4321；以终端实际输出为准。可用 `npm run dev -- --host 127.0.0.1 --port 4432` 或 `npm run preview -- --host 127.0.0.1 --port 4433` 指定地址。预览前应先构建。没有 `start`、`test`、`lint` 或 `typecheck` npm 脚本。

## 6. 发布前检查

1. **配置生产 RFQ 地址。** 原文记录本地 Gravity Forms 曾联调成功；生产环境需修改 `src/config.ts` 的 `gravityForms`，安装下述后台兼容插件，并从正式域名验证条目保存、附件及通知。历史成功不代表当前 Turnstile 配置已验证。
2. **确认联系邮箱。** 核实 `src/config.ts` 中的 `sales@belaroprecision.com` 是否有人接收处理。
3. **替换占位图片。** 原有 Unsplash 摄影图片为展示占位，应换成授权且优化过的真实加工、零件和检验图片；Machined Parts 的 SVG 为概念示意，应在获得已授权素材后补充真实零件照片和经核实的案例。未经确认不得暗示图示设备归企业所有或图示零件来自真实客户。
4. **核实能力描述。** ±0.01–0.02 mm 仅为附条件的典型值；上线前确认实际工艺、车削、材料、批量和检验文件能力。材料下拉选项不代表已验证的可加工范围。
5. **补齐企业信息。** 法定名称、地址、电话、营业时间、交付条款和认证均须确认后再发布；当前 `site.phone` 为空。
6. **补充法律页面。** 隐私政策、必要的 Cookie 说明、条款和图纸保密/文件处理政策尚需落实，明确 CAD 文件保存、访问和删除规则。
7. **按需配置统计与广告。** 当前没有 GA4 或 Google Ads 集成；后续应在确认适用的同意要求后实施，并仅在后台确认收件后记录成功转化。
8. **完善 SEO。** 已有各页标题和描述；案例、材料专题和行业落地页须有足够真实内容后再添加，另需补齐 sitemap 等缺项。

## 7. 环境变量、配置与外部服务

### 7.1 配置位置

| 配置项 | 位置 | 用途及要求 |
| --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | 静态站点构建环境或根目录 `.env` | Turnstile 公开 Site Key，会写入产物；为空时构建仍可完成，但表单禁用提交 |
| `BELARO_TURNSTILE_SECRET_KEY` | WordPress `wp-config.php` 中的 PHP 常量 | 仅后台使用的 Secret Key，不得放入前端源码或静态站点构建环境 |
| `BELARO_TURNSTILE_HOSTNAME` | WordPress `wp-config.php` 中的 PHP 常量 | 校验访问者域名，必须与验证返回的 hostname 精确一致，不含协议或路径 |
| `RFQ_SCREENSHOT_PATH` | 浏览器测试进程环境 | 可选的 RFQ 截图路径；测试还会生成带 `-dropdown.png` 后缀的下拉截图 |

本次未发现根目录 `.env*` 文件，也未检查构建进程外部注入的公钥。当前没有 `.env.example` 或启动时必填变量校验。若需要本地配置，可手动创建 `.env`，仅填写公开变量：

```dotenv
PUBLIC_TURNSTILE_SITE_KEY=替换为公开的站点公钥
```

`.gitignore` 当前只明确忽略 `.env`，未覆盖 `.env.local` 等变体；不要将含凭证的其他环境文件纳入版本管理。本次只更新 README，没有创建环境文件或修改忽略规则。

在 `src/config.ts` 中配置 `gravityForms`：

- `graphqlUrl`：当前为 `https://belaroprecision.local/graphql`，部署前替换为正式后台地址。
- `formId`：当前为 `1`，切换后台表单时应同步复核所有字段映射。
- `fields`：配置数据库字段 `id` 和 `type`；支持 `text`、`name`、`email`、`file`、`consent`、`checkbox`。标准 Checkbox 还需配置与后台一致的 `inputId`（如 `12.1`）和 `choiceValue`；Consent 使用 `type: 'consent'`。
- `uploadsEnabled`：当前为 `true`；部署时须先安装 WPGraphQL Upload，并确认存在 `fileUploadValues` 输入。
- `turnstileSiteKey`：来自 `PUBLIC_TURNSTILE_SITE_KEY`，只能使用公开 Site Key。

站点域名分别存在于 `src/config.ts` 的 `site.domain` 和 `astro.config.mjs` 的 `site`，当前均为 `https://belaroprecision.com`；更换域名时应同步维护。所有这些静态配置更改后均须重新构建部署。

### 7.2 外部服务与 Turnstile 配置

外部服务包括 WordPress GraphQL、Cloudflare Turnstile、Unsplash 图片和 Google Fonts（DM Sans、Manrope）。只有表单后台和验证服务承担询价接收及校验；图片和字体由访问者浏览器外部加载。当前仓库没有邮件发送代码或 SMTP 配置，通知由独立 WordPress/Gravity Forms 环境负责。

RFQ 提交需要 Cloudflare Turnstile。在 Cloudflare 控制台中打开 Turnstile，创建组件，添加正式前端域名（如 `belaroprecision.com`；若使用 `www`，也需加入对应域名），选择 Managed 模式并取得 Site Key 和 Secret Key。控制台入口名称可能变化，以实际界面为准。

将 Site Key 配置为前端构建变量，将 Secret Key 和精确前端 hostname 配置为上述 WordPress 常量。复制当前 `wordpress/mu-plugins/belaro-graphql-upload.php` 到后台的 `wp-content/mu-plugins/`。插件对查询文本匹配到的 `mutation` 和 `submitGfForm` 请求调用 Turnstile Siteverify，核对 `success`、hostname 和 `rfq` action；缺配置、无效/过期 Token 或验证失败时，将请求替换为 `query { __typename }`，避免执行原提交。该实现依赖查询文本匹配，不能据此认定后台所有调用路径都已完成安全审计。WordPress 需能向 Cloudflare 发起 HTTPS 请求；CORS 需允许 `X-Turnstile-Token`。上线前验证有效、缺失、无效和过期 Token 的真实行为。

## 8. RFQ 架构与后台对接

### 8.1 请求流程与字段映射

浏览器收集表单和 Turnstile Token → `src/lib/gravity-forms.mjs` 构造请求 → WordPress MU 插件校验 → WPGraphQL for Gravity Forms 的 `submitGfForm` 保存条目 → 前端解析结果。纯文本请求使用 JSON；附件使用 GraphQL multipart 格式，依赖 WPGraphQL Upload。前端不保存 WordPress 密码或 API 私钥。

当前代码中的表单 ID 为 `1`，字段映射如下；这是仓库配置事实，后台当前实际配置仍需复核：

| 前端字段 | 后台字段 ID | 映射类型 |
| --- | --- | --- |
| `name` | 1 | `name` |
| `email` | 3 | `email` |
| `company` | 4 | `text` |
| `country` | 5 | `text` |
| `phone` | 6 | `text` |
| `process` | 7 | `text` |
| `material` | 8 | `text` |
| `quantity` | 9 | `text` |
| `delivery` | 10 | `text` |
| `tolerance` | 11 | `text` |
| `attachment` | 12 | `file` |
| `details` | 13 | `text` |
| `consent` | 14 | `consent` |

原文记录：2026 年 11 月 4 日本地表单 1 名为 `RFQ`，采用上述字段；WPGraphQL Upload `0.1.5`、WPGraphQL `2.23.1`、WPGraphQL for Gravity Forms `0.13.4` 已安装并启用。这些后台版本和启用状态本次没有重新连接核实；WordPress、PHP、Gravity Forms 和数据库的版本及运行配置待确认。

可选电话字段位于国家/地区之后。区号下拉支持搜索、国旗和区号；国家名称来自 `Intl.DisplayNames`，区号来自构建时的 libphonenumber-js 元数据。修改电话所属国家会保留已输入号码，不会反向修改 RFQ 国家字段。提交时将区号和号码合并为字段 6 的一个值；空号码保持为空，以 `+` 开头的粘贴号码不会重复添加区号。原文记载后台字段 6 使用 `phoneFormat: 'international'`，条目 7 验证了合并号码 `+86 13800138000`，条目 8 验证了空电话；后台格式和条目本次未复查。

### 8.2 上传兼容与后台表单要求

原文记载本地 WordPress 已安装配套 MU 插件，本次未复查安装目录。新后台必须复制仓库中的插件文件。它通过 WPGraphQL content-type filter 兼容 WPGraphQL Upload multipart 请求，要求 `GraphQL-Require-Preflight: 1`，并将此 Header 和 Turnstile Header 加入 GraphQL CORS 允许列表。插件也注册了页面声明的 CAD 扩展 MIME 类型；未关闭 WordPress 文件内容检查或 Gravity Forms 扩展检查。文本 CAD 和 DWG 使用注册的 MIME 类型；二进制 CAD 若无法通过后台 MIME 校验，可打包 ZIP 后提交，仍需实际验证。

后台使用单页表单。姓名通过 `nameValues` 提交：首词进入 first，其余进入 last；若后台要求姓氏，单词姓名会得到校验错误，可按需要改用单行文本姓名字段并配置 `type: 'text'`。邮箱使用 `emailValues`，普通文本、段落、下拉使用 `value`。材料允许自填，交期支持类似 `4–6 weeks` 的文本；工艺和数量可用文本或存储值一致的下拉字段。后台必填设置须与前端一致。

`attachment` 映射为单文件 File Upload。前端支持选择、拖放、移除附件，限制单文件 20 MiB（界面标为 20 MB），扩展名为 `pdf, step, stp, iges, igs, x_t, dwg, dxf, zip`。原文记载后台字段 12 采用同样限制，需重新确认后台、PHP 和 Web 服务器的上传/POST 限额。后台确认类型应为 Text。multipart 请求包含 `operations`、`map` 和二进制文件，由浏览器生成 Content-Type，避免丢失 boundary。

确认后台允许匿名 `submitGfForm`。前后端跨域时，WordPress 必须允许实际前端 Origin、JSON POST 和上传预检，以及校验/错误响应的 CORS；本地 HTTPS 证书需被浏览器信任。插件添加允许 Header 不等于完成 Origin 策略配置。应从真实前端域名测试，命令行成功不能证明浏览器 CORS 正常。不得暴露管理员凭证。新增 CAPTCHA 或后台必填字段时需补齐对应集成。没有 REST 回退或自动重试，避免在收件状态不明时重复创建条目。

前端只在 HTTP 成功、没有 GraphQL/字段错误且取得已保存的 `entry.id` 时显示成功。提交期间和确认成功后阻止重复提交；字段错误显示在对应字段旁，后台 HTML 作为纯文本处理。网络故障、异常响应和未确认保存时保留输入并显示失败。字段 ID、映射类型、地址或 Turnstile 配置不完整时阻止请求。Turnstile 失败会阻止原表单提交，但生产通知送达、服务端文件策略和完整安全边界仍需独立验证。

原文保留的集成参考（本次未在线核对）：<https://github.com/axewp/wp-graphql-gravity-forms/blob/develop/docs/submitting-forms.md>。

### 8.3 原有本地联调记录

原文记载：2026 年 11 月 4 日，从 `http://localhost:4322` 向本地 HTTPS GraphQL 后台进行匿名浏览器提交，PDF、STEP 和无附件场景通过，包含浏览器 CORS/预检；条目 3、4、5 中项目详情和同意值符合预期，PDF/STEP 文件字节已在磁盘核对，均为标记 `LOCAL TEST` 的合成条目，条目 2 为更早的 PDF 测试。原文另记本地邮件使用 Mailpit。

以上条目、文件、邮件和当前后台状态本次未重新核实，不能用来证明当前 Turnstile 集成或生产环境可用。生产邮件投递、其他 CAD 格式和真实 Token 的完整流程仍待确认。本次自动化测试模拟后台和 Turnstile，不创建 WordPress 条目。

## 9. 开发与内容维护

先阅读根目录 `AGENTS.md`，遵循现有 Astro、TypeScript 和原生 CSS 结构。页面位于 `src/pages/`；公共布局、导航和表单控件优先复用；颜色、字体和通用间距优先使用 `src/styles/global.css` 的现有变量与规则。公开联系方式、域名和字段配置位于 `src/config.ts`。后台上传及验证逻辑位于 PHP MU 插件，修改后需单独部署至 WordPress。

原有摄影图片是 Unsplash 占位资源；上线使用有授权的真实图片，优化尺寸并保留有意义的 Alt。Machined Parts 分类内容统一维护在 `src/data/machined-parts.ts`，代码原生 SVG 示意图维护在 `src/components/PartIllustration.astro`；这些图形仅用于解释零件类型，不是客户案例或标准库存件，实际加工能力仍需以图纸评审为准。

Machined Parts 卡片通过 `/contact/?part=<id>#rfq-form` 进入询价页。联系页只接受 `src/data/machined-parts.ts` 中的分类 ID，并仅在对应字段为空时预填加工工艺和项目详情；该流程没有新增后端字段，也不会把任意 URL 文本写入表单。字体通过 Google Fonts 外部加载，可根据实际需求考虑自托管。当前没有站内数据库初始化、迁移或页面内容 CMS 发布命令。

CNC Milling 页面位于 `src/pages/services/cnc-milling/index.astro`，沿用公共布局、设计变量和零件 SVG 组件；页面明确区分 3-axis 与 simultaneous 5-axis 铣削配置，三类铣削零件由共享数据按 `CNC Milling` 工艺筛选。首页、Capabilities 铣削区、Machined Parts 的铣削工艺标签和页脚均已连接到独立页面，原 `/services/#milling` 锚点保留。

铣削询价入口为 `/contact/?process=milling#rfq-form`，只将空的加工工艺字段预选为 `CNC Milling`，项目详情保持空白并可自由编辑。`process` 参数仅接受固定值 `milling`；与有效 `part` 参数同时存在时，零件工艺优先。3-axis 和 simultaneous 5-axis 是已确认的 Belaro 铣削能力，具体尺寸、材料、几何、精度和交期仍需按图纸逐项目确认。未新增后端字段、依赖或环境变量，示意图不代表客户案例。

配套工艺页面位于 `src/pages/services/secondary-processes/index.astro`。网站将磨削、热处理、表面处理和其他二次工艺描述为依托东莞制造生态及供应商网络协调的项目支持，不将其表述为全部自营能力。具体供应商、工艺标准、证书、检验方式和交期必须在报价阶段按图纸确认。公共 `SecondaryProcessSupport.astro` 区块已用于首页、Machined Parts、CNC Milling、CNC Turning 和 OEM Production 页面；Capabilities、About、Quality、页头和页脚也提供相应说明或入口。该变更未新增依赖、环境变量或 RFQ 后端字段。

Industries 页面位于 `src/pages/industries/index.astro`，保留首页引用的 `automation`、`machinery`、`fluid`、`laboratory` 四个锚点。行业与零件分类映射在页面中维护，零件名称和示意图复用共享数据与 `PartIllustration.astro`；配套工艺说明复用 `SecondaryProcessSupport.astro`。页面连接已有 RFQ 表单，不新增行业参数预填、后端字段、依赖或环境变量。液压/气动部分的压力、泄漏、清洁度与行业合规要求均需逐项目确认，未作现成测试服务承诺。

About 页面位于 `src/pages/about/index.astro`，以海外 OEM 按图加工需求为主线，展示 3 轴与联动五轴铣削、车削、小批量及重复订单定位，复用 `SecondaryProcessSupport.astro` 说明东莞供应商网络支持。合作流程和质量内容用于介绍评审方式；未添加未经确认的成立年份、设备数量、认证或客户案例。页面提供能力、行业、质量和 RFQ 入口，未新增依赖、后端字段或环境变量。

## 10. 测试与质量检查

现有测试直接使用 Node.js 执行，无 `npm test` 脚本：

```bash
# 表单映射、配置校验、上传、电话和响应解析，共 7 项
node --test tests/gravity-forms.test.mjs

# 浏览器测试依赖最新 dist/，执行前先构建
npm run build
node --test tests/hero-slider.test.mjs tests/rfq-submission.test.mjs

# 首页流程卡片：顺序、样式及 320–1440px 响应式布局
node --test tests/process-flow.test.mjs

# Machined Parts：内容、SEO、响应式、导航、FAQ 与六类询价预填
node --test tests/machined-parts.test.mjs

# CNC Milling：页面入口、正文链接、响应式、FAQ、SEO 与工艺预选
node --test tests/cnc-milling.test.mjs

# Secondary Processes：内容边界、站内入口、导航、SEO、FAQ 与响应式
node --test tests/secondary-processes.test.mjs

# Industries：行业锚点、正文目标与零件链接、SEO、FAQ 和响应式
node --test tests/industries.test.mjs

# About：能力边界、正文链接、SEO、FAQ 与响应式布局
node --test tests/about.test.mjs
```

轮播浏览器测试覆盖切换、自动播放/暂停、焦点、离屏、触摸、320/390/768/1440 像素宽度及无 JavaScript 等场景。RFQ 浏览器测试覆盖字段映射、附件、校验、网络/服务端异常、防重复提交、成功状态和移动端溢出检查。它们不验证真实 WordPress、Cloudflare、邮件、外部图片/字体或全站无障碍合规。

**可复现性限制：** Playwright 未写入 `package.json` 或锁文件。本次浏览器测试从 `C:/Users/samla/node_modules/playwright/index.mjs` 解析依赖，现有 Chromium 可启动，因此当前机器通过不代表干净环境执行 `npm ci` 后也能运行。团队测试依赖版本、浏览器准备方式和 CI 配置待确认，本次没有新增或安装依赖。

当前没有 ESLint 配置、独立类型检查脚本或 `@astrojs/check`。`astro build` 成功不等同于完整 TypeScript 检查通过。PHP 可用时可执行 `php -l wordpress/mu-plugins/belaro-graphql-upload.php`，但本次 PATH 中没有 `php`，未完成 PHP 语法检查。

### 本次核查结果（2026 年 11 月 4 日）

| 检查 | 结果 |
| --- | --- |
| `npm ls --depth=0` | 通过，三个直接依赖已安装 |
| `npm run build` | 通过，输出六个静态页面 |
| `node --test tests/gravity-forms.test.mjs` | 7 项通过 |
| `node --test tests/hero-slider.test.mjs tests/rfq-submission.test.mjs` | 2 项通过，使用既有上级目录依赖 |
| `node --check src/lib/gravity-forms.mjs` | 通过 JavaScript 语法检查 |
| `npm run dev -- --host 127.0.0.1 --port 4432` | 启动成功，六个路由均返回 HTTP 200 |
| `npm run preview -- --host 127.0.0.1 --port 4433` | 启动成功，六个路由均返回 HTTP 200 |
| PHP 语法检查 | 未完成，`php` 命令不可用 |
| 完整类型检查 / ESLint | 未执行，缺少对应项目工具与脚本 |
| 安装、真实后台联调与生产部署 | 未执行；本次不安装依赖，不创建外部条目或发布站点 |

构建及 Node 测试首次在沙箱中因 `spawn EPERM` 被阻断，获准在沙箱外重试后通过，该现象未判定为业务代码错误。临时开发和预览服务已停止。

### Machined Parts 验证（2026 年 11 月 5 日）

| 检查 | 结果 |
| --- | --- |
| `npm run build` | 通过，输出七个静态页面 |
| `node --test tests/machined-parts.test.mjs tests/gravity-forms.test.mjs tests/process-flow.test.mjs tests/rfq-submission.test.mjs tests/hero-slider.test.mjs` | 11 项通过 |
| Machined Parts 响应式检查 | 通过 320、390、700、701、768、1024、1100、1101、1280、1440 像素宽度的溢出、单双列和导航检查 |
| 桌面与手机截图复核 | 已检查 1440 和 390 像素长截图，未发现明显遮挡或错位 |
| 真实后台、外部资源与生产部署 | 未执行；浏览器测试阻断外部网络，不创建 WordPress 询盘，不验证真实 Turnstile、邮件、外部图片或字体 |

### CNC Milling 验证（2026 年 11 月 5 日）

| 检查 | 结果 |
| --- | --- |
| `npm run build` | 通过，输出八个静态页面；沙箱内因 `spawn EPERM` 受阻，获准重试后通过 |
| `node --test tests/cnc-milling.test.mjs tests/machined-parts.test.mjs tests/gravity-forms.test.mjs tests/process-flow.test.mjs tests/rfq-submission.test.mjs tests/hero-slider.test.mjs` | 12 项通过 |
| 新页面验证 | SEO、正文目标链接与锚点、首页/Capabilities/零件页入口、FAQ 键盘操作及无 JavaScript 内容通过 |
| 响应式与截图 | 320、390、700、701、768、1024、1100、1101、1440 像素宽度无横向溢出，卡片列数正确；1440 与 390 像素截图已复核 |
| 工艺预选 | 铣削预选、用户可修改、未知参数忽略、与零件入口共存时零件工艺优先，均通过 |
| 验证边界 | 浏览器测试模拟外部服务，未创建真实询盘；未执行生产部署、完整类型检查或 ESLint，项目没有相应检查工具 |

### Secondary Processes 验证（2026 年 11 月 5 日）

| 检查 | 结果 |
| --- | --- |
| `npm run build` | 通过，输出 11 个静态页面；沙箱内因 `spawn EPERM` 受阻，获准重试后通过 |
| 完整测试套件（7 个测试文件） | 13 项通过，覆盖表单、轮播、首页流程、Machined Parts、CNC Milling 和 Secondary Processes |
| 新页面验证 | Title、Description、Canonical、三个核心工艺、供应商网络边界、FAQ 键盘操作和无 JavaScript 内容通过 |
| 站内入口 | 首页、Capabilities、Machined Parts、CNC Milling、CNC Turning、OEM Production、About、Quality、页头和页脚入口通过 |
| 响应式与截图 | 320、390、700、701、1024、1100、1101、1440 像素宽度无横向溢出；1440 与 390 像素长截图已复核，未发现明显遮挡或错位 |
| 验证边界 | 未连接真实配套工艺供应商、未创建真实询盘、未执行生产部署、完整类型检查或 ESLint |

### Industries 验证（2026 年 11 月 5 日）

- `npm run build` 通过，输出 11 个静态页面；沙箱内的 `spawn EPERM` 经批准在沙箱外重试后通过。
- 构建产物的 23 项行业锚点与正文链接检查通过；单一 H1、Canonical 和 Description 检查通过，`git diff --check` 通过。
- 已新增 `tests/industries.test.mjs`，覆盖行业入口、正文链接、FAQ、SEO、无 JavaScript 内容及 320–1440px 响应式布局；本次两次运行申请均因自动审批超时而未启动，不能视为测试通过。桌面和手机端截图复核待完成。
- 未创建真实询盘，未部署生产环境；完整类型检查和 ESLint 因项目缺少对应工具而未执行。

### About 验证（2026 年 11 月 5 日）

- `npm run build` 通过，输出 11 个静态页面；沙箱内的 `spawn EPERM` 经批准在沙箱外重试后通过。
- `node --test tests/about.test.mjs` 通过，覆盖能力与供应商边界、正文链接及锚点、单一 H1、Title、Description、Canonical、FAQ 键盘操作与无 JavaScript 内容。初次浏览器运行发现测试未展开 FAQ 就读取可见文本，修正为读取节点文本后通过。
- 320、390、700、701、900、1024、1100、1101、1440px 无横向溢出，首屏列数正确；1440 和 390px 截图已复核，未发现明显遮挡或错位。
- 测试阻断外部网络，不验证外部字体、真实后台或询盘提交；未部署，未执行项目尚未配置的完整类型检查与 ESLint。

## 11. 构建与部署

`astro.config.mjs` 配置 `output: 'static'`。执行 `npm run build` 后，将 `dist/` 发布到静态托管服务或 Web 服务器，不需要运行 Node.js 生产后端。`npm run preview` 用于本地核查构建产物。

生产托管平台、自动发布流水线、域名解析、证书、重定向及缓存策略当前没有仓库配置，具体方案待确认。上线前配置 HTTPS、目录路由、404、sitemap、robots.txt，检查真实域名下的 Canonical、后台 CORS 和 Turnstile。WordPress 及插件需要独立安装维护；部署静态 `dist/` 不会部署后台，也不会自动更新 MU 插件。

## 12. 常见问题与待确认事项

- **页面可打开但不能提交：** 检查构建时是否提供公开 Site Key、浏览器是否加载 Turnstile、后台 Secret/hostname 是否正确、GraphQL 地址是否仍为 `.local`、字段 ID 和必填规则是否匹配。缺公钥不会导致构建失败。
- **附件或跨域请求失败：** 核对 WPGraphQL Upload、MU 插件、允许 Origin、预检 Header、证书信任、扩展/MIME 及服务器大小限制。上传兼容插件不替代完整 CORS 配置。
- **没有成功提示：** 只有保存条目 ID 才能确认接收，网络异常可能发生在后台已保存之后，应先核实再人工重试。
- **新机器浏览器测试无法启动：** 当前锁文件没有 Playwright，需先明确项目测试依赖管理方案；不能把本机上级目录的依赖视为可复现安装的一部分。
- **后台环境待确认：** WordPress/PHP/数据库/Gravity Forms 版本、插件当前启用情况、匿名权限、文件保存及删除、邮件投递和生产安全策略。
- **发布内容待确认：** 真实企业信息、监控邮箱、加工范围、公差、批量、认证及图片授权。

以上为代码核查所得问题或待确认信息，不代表已批准或排期的开发计划。

## 13. 缺失的重要技术文档

当前 README 已补充项目概览、架构、环境、运行、字段和验证说明。以下独立文档尚不存在；需在对应事实确认后补齐，本次没有创建占位文档：

| 建议文档 | 需补充的内容 |
| --- | --- |
| `.env.example` | 公开构建变量示例，明确前端与 WordPress 常量的边界 |
| `docs/DEPLOYMENT.md` | 实际托管平台、DNS/HTTPS、WordPress 插件部署、CORS、上传限制、回滚与验收步骤 |
| `docs/API.md` | 实际后台 Schema/插件版本、字段设置、错误响应和匿名提交权限 |
| `docs/DEVELOPMENT.md` | 可复现的 Playwright/Chromium 环境、类型检查、Lint 与 CI 方案 |
| `docs/ARCHITECTURE.md` | 前后端信任边界、图纸存储/访问/保留/删除和 Turnstile 校验限制 |
| `CHANGELOG.md` | 版本变更和上线记录，区分本地测试与生产验收 |

仓库没有自有数据库模型或 Migration，当前不应编造数据库设计文档；待确认 WordPress 运维范围后再决定是否编写 `docs/DATABASE.md`。

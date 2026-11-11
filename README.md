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
│   ├── assets/images/        # 交由 Astro 构建优化的 WebP 摄影原图
│   ├── data/                 # Machined Parts 分类、评审内容与 images.ts 图片映射
│   ├── lib/                  # 国家数据、GraphQL 请求构造与结果解析
│   └── styles/global.css     # 全局样式和响应式规则
├── tests/                    # 表单单元测试及浏览器测试
├── wordpress/mu-plugins/     # 上传兼容与 Turnstile 校验插件
├── .astro/                   # Astro 生成目录，Git 忽略
├── dist/                     # 静态构建产物，Git 忽略
└── node_modules/             # 本地依赖，Git 忽略
```

已新增 `.github/workflows/deploy.yml`、`Dockerfile`、`compose.yaml`、`deploy/`、`.env.example` 和 [VPS 部署指南](docs/DEPLOYMENT.md)，用于 GitHub Actions 通过 SSH 私钥部署 Docker 静态站点。当前没有 CHANGELOG.md 或嵌套 AGENTS.md。

## 4. 已有页面与功能边界

| 路由 | 当前实现 |
| --- | --- |
| `/` | 首页，按首屏定位、采购需求匹配、核心服务、代表性零件、能力概览、质量检验、目标应用、合作流程、FAQ 与询价入口组织 |
| `/machined-parts/` | 六类按图加工零件展示、应用方向、工艺归类、图纸评审要点、询价准备资料和 FAQ；零件图片为代表性视觉参考，不代表客户案例或库存产品 |
| `/services/` | CNC 铣削、车削及小批量生产介绍；锚点为 `milling`、`turning`、`production` |
| `/services/production/` | OEM 与小批量生产专页，包含需求对齐、生产流程、重复订单、检验要求和项目讨论入口 |
| `/services/cnc-milling/` | 独立 CNC Milling 服务页，包含 3-Axis CNC Machining、3+2 CNC Milling、Simultaneous 5-Axis CNC Machining、典型零件、图纸评审、材料与表面要求、合作流程、FAQ 和铣削询价入口 |
| `/services/cnc-turning/` | 独立 CNC Turning 服务页，包含典型零件、图纸评审、材料与表面要求、合作流程、FAQ 和车削询价入口 |
| `/services/secondary-processes/` | 配套工艺专页，说明通过东莞及深圳供应商网络协调磨削、热处理、表面处理及其他二次工艺的方式、询价资料和能力边界 |
| `/industries/` | 自动化、工业机械、液压/气动、实验室与测试设备四个目标领域的应用说明、应用场景示意图、零件分类链接、图纸评审重点、加工与配套工艺入口、RFQ 清单及 FAQ；不代表已有客户关系或行业认证 |
| `/quality/` | 图纸与材料确认、公差可行性、检测方法与环节、文件范围、首件/抽检/全检约定、偏差处理、包装标识七项质量说明；设备与文件能力按项目核实，没有在线检验管理功能 |
| `/about/` | 法定英文名称、沙井所在地、业务身份、自有加工与外协范围、车间/设备/团队资料说明、OEM 订单配合、外协管理约定、邮箱与 WhatsApp、质量评审与 FAQ |
| `/contact/` | 询价字段、国家搜索、电话区号、材料自定义输入、单附件上传、Turnstile 与 GraphQL 提交 |
| `/privacy-policy/` | 询价数据、技术文件、第三方服务、跨境处理、保留与权利请求说明 |
| `/cookie-policy/` | 浏览器存储、字体/图片请求、安全服务及当前未启用广告与统计标签的说明 |
| `/terms-of-use/` | 网站使用、按图评审、询价与订单边界、图纸权属及定制件商业条款说明 |

公共组件包含桌面/移动导航、页脚、年份更新和章节标题。页头的 Capabilities 支持桌面端悬停/键盘聚焦下拉，并在移动菜单中展示 CNC Milling、3-Axis CNC Machining、3+2 CNC Milling、5-Axis CNC Machining、CNC Turning、Secondary Processes 和 OEM & Low-Volume Production 子链接；页头、移动菜单、页脚和首页均提供 Machined Parts 入口。轮播支持约 7 秒自动切换、前后按钮、分页、暂停、方向键和触摸滑动；悬停、内部焦点、页面隐藏或离开视口时暂停计时，减少动态效果的 CSS 会关闭过渡。禁用 JavaScript 时显示首张轮播；询价提交需要 JavaScript。

首页按九个业务模块组织：首屏定位、采购需求匹配、核心加工服务、代表性零件、加工能力概览、质量与检验、目标应用、合作流程、FAQ 与询价入口。能力概览将 3 轴 CNC 铣削、3+2 定位铣削、联动五轴 CNC 铣削和 CNC 车削作为已确认工艺；材料、尺寸、公差与批量须按图纸和项目要求评审，不在首页展示未经确认的固定范围。Machined Parts 页面使用按类别整理的代表性图片和细节图，作为视觉参考，不宣称为客户案例或库存产品。

全站页头在 PC 和移动端均持续吸顶，并为锚点定位及询价、政策侧栏预留导航高度；移动菜单超出可视高度时可独立滚动。公共布局通过 `BackToTop.astro` 提供右下角返回顶部图标按钮：向下滚动达到一个视窗高度后显示，回到首屏时隐藏，点击平滑返回页顶并将键盘焦点移至品牌链接；系统开启减少动态效果时立即返回。按钮适配手机安全区域，无 JavaScript 时保持隐藏。可执行 `node --test tests/site-navigation.test.mjs` 验证吸顶、菜单、锚点和返回顶部交互。

移动菜单在 1100px 及以下打开时，页头下方显示深色半透明遮罩，菜单保持在遮罩上方；页面背景暂停滚动及键盘、鼠标交互，菜单自身仍可滚动。点击遮罩、再次点击菜单按钮、按 Escape 或选择菜单链接均会关闭；遮罩和 Escape 关闭后焦点回到菜单按钮。切回桌面布局或通过浏览器历史恢复页面时自动清理展开状态，关闭菜单后保留页面滚动位置。无 JavaScript 时遮罩保持隐藏，无新增依赖或环境变量。

2026 年 11 月 11 日遮罩验证：`npm run build` 通过，生成 14 页；`node --test tests/site-navigation.test.mjs tests/site-typography.test.mjs` 两项通过，覆盖 320–1440px 的八种宽度、滚动后展开时页头及菜单的位置、遮罩点击、Escape、背景滚动与交互恢复、菜单独立滚动、同页锚点和桌面断点切换。补充首屏菜单位置断言后单独重跑导航测试通过；390px 首屏及滚动后遮罩截图已复核。全站最小字号仍为 16px，无横向溢出。构建和浏览器测试在沙箱外执行，测试阻断外部网络；未进行真实手机设备验收或生产部署，未执行项目尚未配置的独立类型检查与 ESLint。

2026 年 11 月 10 日验证：`npm run build` 通过，生成 14 个页面；`node --test tests/site-navigation.test.mjs` 通过，覆盖 320、390、700、701、1024、1100、1101、1440px，以及按钮键盘操作、视窗高度变化、平滑滚动、减少动态效果、菜单滚动、锚点、侧栏与无 JavaScript 行为。首页和 Machined Parts 两项既有浏览器测试通过，390px 与 1440px 滚动截图已复核。构建与首次测试受沙箱 `spawn EPERM` 阻止，获准在沙箱外重试；测试阻断外部网络，未部署。项目没有独立类型检查与 ESLint 脚本，本次未执行这两项。
首页采购区域下方展示两项对外优势：完整的图纸询价以 24 小时内报价回复为目标，并支持无最低起订量（No MOQ）。这些内容是报价与订单沟通承诺，具体回复仍取决于资料完整度与项目评审。

首页四步 RFQ 流程为“提交图纸、技术评审与报价、确认生产、检验交付”，使用橙色顶部边框和白色卡片，卡片间以箭头连接。宽度大于 900px 时横向排列、箭头向右；900px 及以下纵向排列、箭头向下。流程使用有序列表，装饰箭头对辅助技术隐藏，无需 JavaScript。

首页“代表性零件”、CNC Milling“典型零件”和 CNC Turning“典型零件”卡片直接复用 `public/images/machined-parts/` 中六类零件的主图，并通过 `src/data/machined-parts.ts` 的 `image` 字段保持类别与图片映射一致。

Quality 页面按七项采购问题提供主题锚点、评审要点和询价入口，已移除未经确认的固定公差范围。检测方法示例不代表实际设备资产；设备、校准状态、文件可用性与检验覆盖率须在报价和订单阶段确认。当前缺少经企业核实的设备清单和报告样本，页面不承诺默认提供全部文件、正式 FAI/PPAP 或认证，后续取得确认资料后再补充。

About 页面区分自有 CNC 加工能力和通过东莞、深圳供应商协调的二次工艺，并列出外协范围确认、图纸及批次交接、回件检查和偏差处理等需按订单确认的控制要求。联系方式复用 `src/config.ts`，不在 About 显示中文法定名称。页面已接入用户提供的车间场景图片作为加工与检验语境展示；设备型号清单和团队资料仍未公开，具体设备、人员及图片来源真实性仍须在供应商评审时核实。邮箱收件、WhatsApp 账号和现场地址未通过此次代码测试作外部核验。

RFQ 必填项包括姓名、邮箱、公司、国家/地区和联系同意；同意框默认勾选，客户可取消，取消后需重新勾选才能提交。电话和图纸上传保留在外层；加工工艺、材料、预计数量、公差 / 关键要求、所需文件和项目详情放在默认收起的「Add details (optional)」区域，全部可选。文件需求可多选 FAI report、CMM / dimensional report、EN 10204 3.1 material cert，可用性和范围须在报价时确认。文件需求通过 `checkboxValues` 独立提交至字段 15，项目详情字段 13 仅保留用户备注；折叠状态不会清空输入，后台字段错误（含文件复选框组）会自动展开对应区域并聚焦。部署前须同步确认 Gravity Forms 字段 7（工艺）、9（数量）和 15（文件需求）均非必填，本次未更改真实后台配置。旁边提供 Privacy Policy 与 Terms of Use 链接，明确询价不订阅营销邮件。表单不收集 Target delivery date，预计交期由 Belaro 评审后提供。国家搜索含国旗，材料可选或自填；电话区号随国家选择更新，也可独立修改。

已实现页面 Title、Meta Description、Canonical、英文 `lang` 和图片 Alt。全站页脚提供隐私、Cookie 与使用条款入口。当前未实现 Open Graph、Twitter Card、结构化数据、sitemap、robots.txt、自定义 404、分析统计、广告转化、自动报价、订单管理或站内登录。

About 内容展示优化：应用方向改为分类标签，公司身份改为双栏信息卡，自有加工与外协范围采用深浅底色卡片，外协管理采用编号流程（桌面四列、平板两列、手机单列），联系方式采用引导区与信息卡双栏。新增 `src/styles/about.css`，样式限定在 `.about-page` 下，无新增依赖或交互脚本。

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
3. **核实图片授权与真实性。** 原有 Unsplash 摄影占位图和 Machined Parts 概念图已替换为本地 WebP 素材。上线前仍须核实素材授权、生成来源及可公开范围，不得仅凭图片暗示图示设备归企业所有或图示零件来自真实客户。Machined Parts 图片仍应标注为代表性视觉参考，取得已授权的真实样件照片和说明后再逐类替换。
4. **核实能力描述。** ±0.01–0.02 mm 仅为附条件的典型值；上线前确认实际工艺、车削、材料、批量和检验文件能力。材料下拉选项不代表已验证的可加工范围。
5. **补齐企业信息。** 用户已确认法定名称为深圳市极客码头科技有限公司（Shenzhen GEEKMATE Technology Co., Ltd.），公司地址为 `Shajing, Bao'an District, Shenzhen, China`，并提供 WhatsApp 联系号码 `+86 186 8218 8709`。完整街道地址、普通联系电话、营业时间、交付条款和认证仍须确认后再发布；当前 `site.phone` 仍为空。
6. **核定法律页面与实际处理流程。** 隐私政策、Cookie 说明和使用条款已实现；上线前须确认完整地址、监控邮箱、实际服务商与数据位置、CAD 文件保留/删除和供应商访问规则，并按适用地区审核文字。页面没有虚构固定保留年限或自动删除机制，不替代 NDA、商业合同或法律审核，也不保证 Google Ads 审核通过。
7. **按需配置统计与广告。** 当前没有 GA4 或 Google Ads 集成；后续应在确认适用的同意要求后实施，并仅在后台确认收件后记录成功转化。
8. **完善 SEO。** 已有各页标题和描述；案例、材料专题和行业落地页须有足够真实内容后再添加，另需补齐 sitemap 等缺项。

## 7. 环境变量、配置与外部服务

### 7.1 配置位置

| 配置项 | 位置 | 用途及要求 |
| --- | --- | --- |
| `PUBLIC_GRAPHQL_URL` | 静态站点构建环境或根目录 `.env` | 公开 WordPress GraphQL 地址；本地留空时沿用 `.local` 开发地址，GitHub 自动部署必须设置正式 HTTPS 地址 |
| `PUBLIC_TURNSTILE_SITE_KEY` | 静态站点构建环境或根目录 `.env` | Turnstile 公开 Site Key，会写入产物；为空或仅空白时不启用人机验证，表单仍可提交 |
| `BELARO_TURNSTILE_SECRET_KEY` | WordPress `wp-config.php` 中的 PHP 常量 | 未配置或仅空白时停用后台验证；配置后强制校验 Token，仅后台使用，不得放入前端源码或静态站点构建环境 |
| `BELARO_TURNSTILE_HOSTNAME` | WordPress `wp-config.php` 中的 PHP 常量 | 校验访问者域名，必须与验证返回的 hostname 精确一致，不含协议或路径 |
| `RFQ_SCREENSHOT_PATH` | 浏览器测试进程环境 | 可选的 RFQ 截图路径；测试还会生成带 `-dropdown.png` 后缀的下拉截图 |

仓库提供 `.env.example`，可复制为本地 `.env` 并填写公开构建变量。GitHub 自动部署的必填配置在构建前校验；静态站点没有 Node.js 生产启动过程。示例：

```dotenv
PUBLIC_GRAPHQL_URL=https://cms.example.com/graphql
PUBLIC_TURNSTILE_SITE_KEY=
```

`.gitignore` 已忽略 `.env`、`.env.*`（保留 `.env.example`）和常见 `.pem`/`.key` 私钥文件；`.dockerignore` 排除本地依赖、构建产物、Git、环境文件和私钥。真实 SSH 私钥仅保存在 GitHub Secrets，不得写入源码或公开构建变量。

在 `src/config.ts` 中配置 `gravityForms`：

- `graphqlUrl`：优先使用 `PUBLIC_GRAPHQL_URL`，未配置或空白时使用 `https://belaroprecision.local/graphql`；生产必须配置正式后台地址并重新构建。
- `formId`：当前为 `1`，切换后台表单时应同步复核所有字段映射。
- `fields`：配置数据库字段 `id` 和 `type`；支持 `text`、`name`、`email`、`file`、`consent`、`checkbox`、`checkboxes`。单项 Checkbox 使用 `inputId` 和 `choiceValue`；多项 Checkbox 使用 `choices` 数组，逐项配置 `inputId` 和 `value`。Consent 使用 `type: 'consent'`。
- `uploadsEnabled`：当前为 `true`；部署时须先安装 WPGraphQL Upload，并确认存在 `fileUploadValues` 输入。
- `turnstileSiteKey`：来自 `PUBLIC_TURNSTILE_SITE_KEY`，只能使用公开 Site Key。

站点域名分别存在于 `src/config.ts` 的 `site.domain` 和 `astro.config.mjs` 的 `site`，当前均为 `https://belaroprecision.com`；更换域名时应同步维护。所有这些静态配置更改后均须重新构建部署。

### 7.2 外部服务与 Turnstile 配置

外部服务包括 WordPress GraphQL、Cloudflare Turnstile 和 Google Fonts（DM Sans、Manrope）。只有表单后台和验证服务承担询价接收及校验；页面摄影图片由 Astro 在构建时生成至本站 `/_astro/`，字体仍由访问者浏览器从 Google Fonts 加载。当前仓库没有邮件发送代码或 SMTP 配置，通知由独立 WordPress/Gravity Forms 环境负责。

RFQ 人机验证为可选功能。未配置 `PUBLIC_TURNSTILE_SITE_KEY`（含仅空白）时，前端不加载 Turnstile 脚本、不展示验证组件、不发送验证 Header，允许普通和附件提交；姓名、邮箱等字段校验及防重复提交保持生效。需要启用时，在 Cloudflare 控制台中打开 Turnstile，创建组件，添加正式前端域名（如 `belaroprecision.com`；若使用 `www`，也需加入对应域名），选择 Managed 模式并取得 Site Key 和 Secret Key。控制台入口名称可能变化，以实际界面为准。

启用时，将 Site Key 配置为前端构建变量，将 Secret Key 和精确前端 hostname 配置为上述 WordPress 常量。停用时，清空前端 Site Key 并重新构建，同时移除或清空后台 Secret Key。服务端独立依据 Secret Key 决定是否验证，不接受客户端传参关闭验证；若后台仍配置 Secret Key，前端无 Site Key 的请求仍会被后台拒绝。复制当前 `wordpress/mu-plugins/belaro-graphql-upload.php` 到后台的 `wp-content/mu-plugins/`。插件仅在服务端 Secret Key 非空时，对查询文本匹配到的 `mutation` 和 `submitGfForm` 请求调用 Turnstile Siteverify，核对 `success`、hostname 和 `rfq` action；启用后缺 hostname、缺失/无效/过期 Token 或验证失败时，将请求替换为 `query { __typename }`，避免执行原提交。该实现依赖查询文本匹配，不能据此认定后台所有调用路径都已完成安全审计。WordPress 需能向 Cloudflare 发起 HTTPS 请求；CORS 需允许 `X-Turnstile-Token`。上线前验证有效、缺失、无效和过期 Token 的真实行为。

## 8. RFQ 架构与后台对接

### 8.1 请求流程与字段映射

浏览器收集表单和按需启用的 Turnstile Token → `src/lib/gravity-forms.mjs` 构造请求 → WordPress MU 插件校验 → WPGraphQL for Gravity Forms 的 `submitGfForm` 保存条目 → 前端解析结果。纯文本请求使用 JSON；附件使用 GraphQL multipart 格式，依赖 WPGraphQL Upload。前端不保存 WordPress 密码或 API 私钥。

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
| `tolerance` | 11 | `text` |
| `attachment` | 12 | `file` |
| `details` | 13 | `text` |
| `consent` | 14 | `consent` |
| `documents` | 15 | `checkboxes` |

用户已确认新增文件需求字段 15。当前配置的子项为 `15.1` → `FAI report`、`15.2` → `CMM / dimensional report`、`15.3` → `EN 10204 3.1 material cert`，提交时过滤未知值、去重，未勾选时发送空数组。子项输入编号和存储值必须与后台一致；若后台启用独立 choice value 或修改过选项，应同步修改 `src/config.ts` 的 `documents.choices` 和前端选项。本次本地后台连接被拒绝，尚未核实子项配置，也未创建真实询盘；自动化测试使用模拟后台。

原文记录：2026 年 11 月 4 日本地表单 1 名为 `RFQ`，采用当时的字段（另含交期字段 10）；WPGraphQL Upload `0.1.5`、WPGraphQL `2.23.1`、WPGraphQL for Gravity Forms `0.13.4` 已安装并启用。这些后台版本和启用状态本次没有重新连接核实；WordPress、PHP、Gravity Forms 和数据库的版本及运行配置待确认。

可选电话字段位于国家/地区之后。区号下拉支持搜索、国旗和区号；国家名称来自 `Intl.DisplayNames`，区号来自构建时的 libphonenumber-js 元数据。修改电话所属国家会保留已输入号码，不会反向修改 RFQ 国家字段。提交时将区号和号码合并为字段 6 的一个值；空号码保持为空，以 `+` 开头的粘贴号码不会重复添加区号。原文记载后台字段 6 使用 `phoneFormat: 'international'`，条目 7 验证了合并号码 `+86 13800138000`，条目 8 验证了空电话；后台格式和条目本次未复查。

2026 年 11 月 5 日已移除前端交期字段及提交映射；其余后台字段 ID 不变。原字段 10 不再发送，既有后台字段和历史条目保留。部署前确认后台字段 10 为非必填，避免后台校验阻止提交。

### 8.2 上传兼容与后台表单要求

图纸上传区下方显示 SVG 锁图标、保密说明「Files kept confidential, used only to quote and make your parts.」及隐私政策链接，文件输入通过 `aria-describedby` 关联该提示。隐私政策补充技术文件仅用于评估、报价及订单生产检验，不用于营销或公开展示；外协仅分享工作所需信息并遵守保密要求。此为业务处理承诺，不代表新增文件加密或访问控制功能。

原文记载本地 WordPress 已安装配套 MU 插件，本次未复查安装目录。新后台必须复制仓库中的插件文件。它通过 WPGraphQL content-type filter 兼容 WPGraphQL Upload multipart 请求，要求 `GraphQL-Require-Preflight: 1`，并将此 Header 和 Turnstile Header 加入 GraphQL CORS 允许列表。插件也注册了页面声明的 CAD 扩展 MIME 类型；未关闭 WordPress 文件内容检查或 Gravity Forms 扩展检查。文本 CAD 和 DWG 使用注册的 MIME 类型；二进制 CAD 若无法通过后台 MIME 校验，可打包 ZIP 后提交，仍需实际验证。

后台使用单页表单。姓名通过 `nameValues` 提交：首词进入 first，其余进入 last；若后台要求姓氏，单词姓名会得到校验错误，可按需要改用单行文本姓名字段并配置 `type: 'text'`。邮箱使用 `emailValues`，普通文本、段落、下拉使用 `value`。材料允许自填；工艺和数量可用文本或存储值一致的下拉字段。后台必填设置须与前端一致。

`attachment` 映射为单文件 File Upload。前端支持选择、拖放、移除附件，限制单文件 20 MiB（界面标为 20 MB），扩展名为 `pdf, step, stp, iges, igs, x_t, dwg, dxf, zip`。原文记载后台字段 12 采用同样限制，需重新确认后台、PHP 和 Web 服务器的上传/POST 限额。后台确认类型应为 Text。multipart 请求包含 `operations`、`map` 和二进制文件，由浏览器生成 Content-Type，避免丢失 boundary。

确认后台允许匿名 `submitGfForm`。前后端跨域时，WordPress 必须允许实际前端 Origin、JSON POST 和上传预检，以及校验/错误响应的 CORS；本地 HTTPS 证书需被浏览器信任。插件添加允许 Header 不等于完成 Origin 策略配置。应从真实前端域名测试，命令行成功不能证明浏览器 CORS 正常。不得暴露管理员凭证。新增 CAPTCHA 或后台必填字段时需补齐对应集成。没有 REST 回退或自动重试，避免在收件状态不明时重复创建条目。

前端只在 HTTP 成功、没有 GraphQL/字段错误且取得已保存的 `entry.id` 时显示成功。提交期间和确认成功后阻止重复提交；成功后只要修改任意表单字段即可重新提交，启用 Turnstile 时会清空旧 Token 并重置验证组件，必须完成新的验证后才能提交。字段错误显示在对应字段旁，后台 HTML 作为纯文本处理。网络故障、异常响应和未确认保存时保留输入并显示失败。字段 ID、映射类型或地址配置无效时阻止请求；配置 Site Key 后还必须取得有效 Token。启用后的 Turnstile 验证失败会阻止原表单提交，但生产通知送达、服务端文件策略和完整安全边界仍需独立验证。

原文保留的集成参考（本次未在线核对）：<https://github.com/axewp/wp-graphql-gravity-forms/blob/develop/docs/submitting-forms.md>。

### 8.3 原有本地联调记录

原文记载：2026 年 11 月 4 日，从 `http://localhost:4322` 向本地 HTTPS GraphQL 后台进行匿名浏览器提交，PDF、STEP 和无附件场景通过，包含浏览器 CORS/预检；条目 3、4、5 中项目详情和同意值符合预期，PDF/STEP 文件字节已在磁盘核对，均为标记 `LOCAL TEST` 的合成条目，条目 2 为更早的 PDF 测试。原文另记本地邮件使用 Mailpit。

以上条目、文件、邮件和当前后台状态本次未重新核实，不能用来证明当前 Turnstile 集成或生产环境可用。生产邮件投递、其他 CAD 格式和真实 Token 的完整流程仍待确认。本次自动化测试模拟后台和 Turnstile，不创建 WordPress 条目。

## 9. 开发与内容维护

先阅读根目录 `AGENTS.md`，遵循现有 Astro、TypeScript 和原生 CSS 结构。页面位于 `src/pages/`；公共布局、导航和表单控件优先复用；颜色、字体和通用间距优先使用 `src/styles/global.css` 的现有变量与规则。公开联系方式、域名和字段配置位于 `src/config.ts`。后台上传及验证逻辑位于 PHP MU 插件，修改后需单独部署至 WordPress。

全站文字最小字号为 **16px**，桌面、平板和手机端一致；包括导航、页脚、标签、图片说明、表单提示与政策页面。页面及组件局部样式中的 `font-size`、`font` 简写和媒体查询也须遵守此限制；`small`、`sub`、`sup` 在全局样式中设有 16px 下限。新增样式时保留现有较大的标题字号。构建后执行 `node --test tests/site-typography.test.mjs`，检查全部静态页面的计算字号及响应式溢出。

页面摄影和工艺图片分两类管理：既有根路径素材位于 `public/images/`，Machined Parts 分类主图和细节图位于 `public/images/machined-parts/`；需要 Astro 构建期优化的页面素材位于 `src/assets/images/`，通过 `src/data/images.ts` 显式映射并由 `ProcessImage.astro` 或 `MediaGallery.astro` 输出响应式图片。页面图片保持响应式宽度，非首屏图片默认 lazy。当前本地 WebP 素材包括首页铣削与车削主视觉、铣削与车削工艺细节、质量检验、OEM 批量生产、二次工艺、About 车间与设备团队场景、Industries 四类应用场景、Quality 检测与交付场景、RFQ 评审场景，以及六类 Machined Parts 代表性图片。上线前仍须确认授权、生成来源和公开范围；示意图片不代表客户案例、库存产品、设备资产证明或真实检测记录，实际能力仍需以图纸和项目评审为准。

Machined Blocks 卡片的细节图库使用 `machined-block-pocket.webp`（型腔与加工纹路）和 `machined-block-threaded-hole.webp`（螺纹孔与倒角），文件位于 `public/images/machined-parts/`；原始素材保留在 `webp/Machined Blocks/`。

图片映射如下：`hero-cnc-milling.webp` 用于首页和 Capabilities 铣削展示，`hero-cnc-turning.webp` 用于车削展示，`milling-process-detail.webp`、`turning-process-detail.webp` 和 `production-oem.webp` 用于对应服务详情页，`quality-inspection.webp` 用于 Quality，`secondary-processes.webp` 用于 Secondary Processes，`about-workshop.webp` 用于 About，`contact-rfq.webp` 用于 RFQ。替换素材时应保持相同文件名，或同步修改 `src/data/images.ts` 中的导入、组件引用与 Alt 文本；不要直接编辑生成的 `dist/_astro/` 文件。

Machined Parts 卡片通过 `/contact/?part=<id>#rfq-form` 进入询价页。联系页只接受 `src/data/machined-parts.ts` 中的分类 ID，并仅在对应字段为空时预填加工工艺和项目详情；该流程没有新增后端字段，也不会把任意 URL 文本写入表单。字体通过 Google Fonts 外部加载，可根据实际需求考虑自托管。当前没有站内数据库初始化、迁移或页面内容 CMS 发布命令。

CNC Milling 页面位于 `src/pages/services/cnc-milling/index.astro`，沿用公共布局、设计变量和零件 SVG 组件；页面明确区分 3-axis、3+2 positional 与 simultaneous 5-axis 铣削配置，三类铣削零件由共享数据按 `CNC Milling` 工艺筛选。首页、Capabilities 铣削区、Machined Parts 的铣削工艺标签和页脚均已连接到独立页面，原 `/services/#milling` 锚点保留。

铣削询价入口为 `/contact/?process=milling#rfq-form`，只将空的加工工艺字段预选为 `CNC Milling`，项目详情保持空白并可自由编辑。`process` 参数仅接受固定值 `milling`；与有效 `part` 参数同时存在时，零件工艺优先。3-axis、3+2 positional 和 simultaneous 5-axis 是用户已确认的 Belaro 铣削能力，具体尺寸、材料、几何、精度和交期仍需按图纸逐项目确认。未新增后端字段、依赖或环境变量，示意图不代表客户案例。

配套工艺页面位于 `src/pages/services/secondary-processes/index.astro`。网站将磨削、热处理、表面处理和其他二次工艺描述为依托东莞及深圳制造生态与供应商网络协调的项目支持，不将其表述为全部自营能力。具体供应商、工艺标准、证书、检验方式和交期必须在报价阶段按图纸确认。公共 `SecondaryProcessSupport.astro` 区块已用于首页、Machined Parts、CNC Milling、CNC Turning 和 OEM Production 页面；Capabilities、About、Quality、页头和页脚也提供相应说明或入口。该变更未新增依赖、环境变量或 RFQ 后端字段。

Industries 页面位于 `src/pages/industries/index.astro`，保留首页引用的 `automation`、`machinery`、`fluid`、`laboratory` 四个锚点。行业与零件分类映射在页面中维护，零件名称复用共享数据，应用图通过 `ProcessImage.astro` 展示；配套工艺说明复用 `SecondaryProcessSupport.astro`。页面连接已有 RFQ 表单，不新增行业参数预填、后端字段、依赖或环境变量。液压/气动部分的压力、泄漏、清洁度与行业合规要求均需逐项目确认，未作现成测试服务承诺。

2026 年 11 月 10 日接入 `webp/待处理/` 中 14 张素材，原文件保留，发布素材复制至 `src/assets/images/` 并在 `src/data/images.ts` 映射，沿用 Astro 图片优化、响应式尺寸及懒加载：

| 页面位置 | 发布图片文件名（均为 `.webp`） |
| --- | --- |
| Industries 自动化、机械轴系、气动接口、测试设备 | `industry-automation-fixture`、`industry-machinery-shaft-assembly`、`industry-fluid-interface`、`industry-test-equipment-mounting` |
| About 车间、3 轴、联动五轴、车床、团队 | `about-workshop-overview`、`about-3-axis-cnc`、`about-simultaneous-5-axis-cnc`、`about-cnc-lathe`、`about-team-at-work` |
| Quality 检测设备、尺寸测量、报告、包装、标识 | `quality-inspection-tools`、`quality-critical-dimension-check`、`quality-dimensional-report-sample`、`quality-protective-packaging`、`quality-batch-identification` |

About 和 Quality 复用 `MediaGallery.astro`，桌面双列、手机单列；报告以完整原比例展示，可打开原始大图。页面已按要求移除所有 Illustrative 展示标签及相关图片 Alt 中的该表述，保留工艺说明；报告仍明确为样本，包装空白标签不代表真实批次记录。包装内容采用用户确认的单层加厚珍珠棉与硬纸箱方式；未增加设备型号、认证或检测能力承诺。

### Industries、About 与 Quality 图片接入验证（2026 年 11 月 10 日）

- `npm run build` 通过，生成 14 个静态页面和 99 个优化图片变体。
- `node --test tests/about.test.mjs tests/industries.test.mjs tests/quality.test.mjs` 的 3 项浏览器测试通过，覆盖 14 张新增图片的加载与解码、Quality 报告原比例及原图链接、关键正文和 320–1440px 响应式布局。
- Industries 全页、About 设备与团队、Quality 检测、报告、包装区域的桌面端和手机端截图已复核，未发现图片与文字交错、遮挡或横向溢出。
- 测试阻断外部网络，不验证图片的真实设备归属、报告真实性、联系方式或生产后台；本次未部署，项目未配置完整 TypeScript 类型检查和 ESLint，因此未执行这两项检查。

About 页面位于 `src/pages/about/index.astro`，以海外 OEM 按图加工需求为主线，展示 3 轴与联动五轴铣削、车削、小批量及重复订单定位，复用 `SecondaryProcessSupport.astro` 说明东莞及深圳供应商网络支持。合作流程和质量内容用于介绍评审方式；未添加未经确认的成立年份、设备数量、认证或客户案例。页面提供能力、行业、质量和 RFQ 入口，未新增依赖、后端字段或环境变量。

政策页共用 `src/layouts/LegalLayout.astro`，正文在 `src/pages/privacy-policy/`、`cookie-policy/`、`terms-of-use/` 维护；日期需随实际内容变化更新。Cookie 页按当前源码披露未接入 GA4、GTM、Google Ads 标签，未添加无实际控制作用的 Cookie 弹窗。未来接入统计、广告、托管注入脚本或新服务时，必须重新核查请求与存储、更新政策，并按投放地区实现真实的同意、撤回和标签控制机制；询价联系同意不等于广告个性化同意。本次没有新增依赖、配置变量或后端字段。

企业信息统一在 `src/config.ts` 的 `site.legalName`、`site.legalNameZh`、`site.location` 维护。Belaro Precision 保留为网站品牌，英文运营主体名称用于 About、Contact、隐私政策和使用条款，公共页脚不再展示运营主体说明；地址 `Shajing, Bao'an District, Shenzhen, China` 通过共享配置用于相关页面和页脚；中文法定名称仅在 Terms of Use 正文显示，不在全站页脚或其他页面展示。WhatsApp 显示号码及直达链接分别由 `site.whatsapp` 和 `site.whatsappUrl` 维护，并显示于 Contact 页面及公共页脚；该渠道不等同于 `site.phone` 普通联系电话。公司所在地与东莞及深圳供应商网络分开表述；未提供的街道地址不作补写。本次未新增环境变量、依赖或后端字段。

Google 官方参考（上线前核对当前要求）：[数据收集和使用政策](https://support.google.com/adspolicy/answer/6020956?hl=en)、[欧盟用户同意政策](https://www.google.com/about/company/user-consent-policy/)。应按所用产品与投放地区核对适用要求，不能将 Terms of Use、Cookie Policy 描述为所有 Google Ads 广告统一强制的独立页面。新增政策页面不代表生产 HTTPS、广告账户、追踪和适用法律已完成审核。

2026 年 11 月 6 日补充 3+2 CNC Milling：铣削页新增 `#three-plus-two` 能力卡与工艺区别 FAQ，桌面和移动导航加入对应入口；首页、Capabilities、About、Industries 和 Machined Parts 同步展示。3+2 表述为旋转轴先定位、切削时保持固定角度的定位五轴加工，与联动五轴分别介绍。具体工艺仍按图纸、装夹和刀具可达性确认；没有新增设备型号、公差或加工尺寸承诺，也没有更改 RFQ 后台工艺值。

## 10. 测试与质量检查

### 全站最小字号验证

- 全站局部样式中原有的 9–15px 字号统一调整为 16px，较大的字号保持原值；全局补充 `small`、`sub`、`sup` 的字号下限。
- `npm run build` 通过，生成 14 个静态页面。
- `node --test tests/site-typography.test.mjs` 通过，覆盖全部 14 页在 320、390、700、701、1024、1100、1101、1440px 下的计算字号、展开内容、移动菜单和页面横向溢出。
- `node --test tests/site-navigation.test.mjs tests/rfq-submission.test.mjs tests/hero-slider.test.mjs` 的 4 项既有浏览器回归测试全部通过；`git diff --check` 通过。
- 构建与测试首次执行受沙箱 `spawn EPERM` 限制，获准在沙箱外重试后通过。浏览器测试阻断外部网络，询价测试使用模拟后台；未部署。项目未配置独立类型检查及 ESLint 脚本，本次未执行这两项。

### Illustrative 文案移除验证（2026 年 11 月 10 日）

- 已移除 About、Quality、Industries、Machined Parts 的 Illustrative 展示文案及图片 Alt 中的该表述，保留工艺说明和检测报告样本名称。
- `npm run build` 通过；`node --test tests/about.test.mjs tests/industries.test.mjs tests/quality.test.mjs tests/machined-parts.test.mjs` 的 4 项浏览器测试全部通过，覆盖图片加载、链接及响应式布局；未部署。

### Astro audit 与图片优化验证（2026 年 11 月 8 日）

- 页面摄影已全部使用 Astro `Image`；同时修复隐藏轮播内容及关闭的 `details` 内容参与 audit 时产生的可访问性提示。
- `npm run build` 通过，生成 14 页和 48 个优化图片变体；`node --test` 全部 24 项通过，包含轮播、RFQ、SEO 和响应式回归。
- `node --test tests/astro-audit.test.mjs` 检查构建产物的 14 页，覆盖 390px、1440px 视口、横向溢出、图片实际加载与解码、尺寸、Alt、`srcset`、`sizes` 及当前安装 Astro 的可访问性与性能规则。生产产物没有开发期 Image 标记，因此该模式使用优化资源路径和图片属性检查替代组件识别规则。
- 开发模式检查：先执行 `npm run dev -- --host 127.0.0.1 --port 4436`，再在另一个 PowerShell 终端执行 `$env:ASTRO_AUDIT_BASE_URL='http://127.0.0.1:4436'; node --test tests/astro-audit.test.mjs`，该模式包含 `Use the Image component` 规则。本次 14 页两种视口全部通过，未输出加载策略建议。测试使用构建产物发现路由，执行前须先构建。
- 加载策略规则依赖视口和字体位置，测试将相关提示单独报告，不作为失败断言；本次通过不代表任意窗口尺寸均无建议，也不等于完整无障碍合规认证。测试直接使用 Astro 附带的规则及其间接依赖 esbuild，升级 Astro 后应重新验证。
- 浏览器测试阻断外部网络，未创建真实询盘或部署；未执行项目未配置的完整类型检查及 ESLint。Playwright 的环境限制见下文。

### 3+2 铣削能力验证（2026 年 11 月 6 日）

- `npm run build` 通过，生成 14 个静态页面。
- `node --test tests/cnc-milling.test.mjs tests/homepage.test.mjs tests/about.test.mjs` 的 3 项浏览器测试通过；`node --test tests/industries.test.mjs` 通过。行业页首次检查发现旧首页入口断言失效，已按当前两项应用入口同步测试后通过。
- 覆盖新增能力卡、桌面与移动导航、锚点、FAQ、询价入口及响应式检查；铣削页 1440px 和 390px 截图已复核。
- 测试阻断外部网络，不验证真实后台；本次未部署。项目未配置完整类型检查与 ESLint，未执行这两项检查。

### 报价时效与起订量优势展示验证（2026 年 11 月 6 日）

- 首页首屏能力证明栏和采购模块下方新增 “Quotes Within 24 Hours” 与 “No MOQ” 展示，并提供直接进入 RFQ 表单的入口。
- `npm run build`、`node --test tests/homepage.test.mjs tests/hero-slider.test.mjs` 均通过；已覆盖首页响应式布局和轮播回归。
- 24 小时为完整图纸询价的目标回复时效，不代表所有项目无条件报价；No MOQ 表示不设统一最低起订量，数量仍需按项目确认。

现有测试直接使用 Node.js 执行，无 `npm test` 脚本：

```bash
# 表单映射、交期字段移除、可选人机验证、配置校验、上传、电话和响应解析，共 9 项
node --test tests/gravity-forms.test.mjs

# 浏览器测试依赖最新 dist/，执行前先构建
npm run build
node --test tests/hero-slider.test.mjs tests/rfq-submission.test.mjs

# 首页流程卡片：顺序、样式及 320–1440px 响应式布局
node --test tests/process-flow.test.mjs

# 首页九模块：顺序、能力边界、链接、FAQ、无 JavaScript 内容及响应式
node --test tests/homepage.test.mjs

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

# 政策页面、全站页脚、表单披露和同意默认值
node --test tests/legal-pages.test.mjs tests/rfq-submission.test.mjs
```

轮播浏览器测试覆盖切换、自动播放/暂停、焦点、离屏、触摸、320/390/768/1440 像素宽度及无 JavaScript 等场景。RFQ 浏览器测试在启用与停用人机验证两种模式下覆盖字段映射、附件、校验、网络/服务端异常、防重复提交、成功状态和移动端溢出检查，并检查启用后的 Token 过期与停用后的外部脚本不加载。它们不验证真实 WordPress、Cloudflare、邮件、外部图片/字体或全站无障碍合规。

**可复现性限制：** Playwright 未写入 `package.json` 或锁文件。本次浏览器测试从 `C:/Users/samla/node_modules/playwright/index.mjs` 解析依赖，现有 Chromium 可启动，因此当前机器通过不代表干净环境执行 `npm ci` 后也能运行。团队测试依赖版本、浏览器准备方式和 CI 配置待确认，本次没有新增或安装依赖。

当前没有 ESLint 配置、独立类型检查脚本或 `@astrojs/check`。`astro build` 成功不等同于完整 TypeScript 检查通过。PHP 可用时可执行 `php -l wordpress/mu-plugins/belaro-graphql-upload.php`。当前 PATH 中没有 `php`；2026 年 11 月 5 日使用 Local 自带 PHP 8.2.29 完成插件语法检查和函数替身测试。插件分支测试可运行 `php tests/turnstile-plugin.test.php <场景>`，场景包括 `disabled`、`blank`、`valid`、`missing-token`、`missing-hostname`、`invalid`、`wrong-hostname`、`wrong-action`、`network-error`；每个场景应单独启动 PHP 进程。

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

### 政策页面验证（2026 年 11 月 5 日）

- `npm run build` 通过，输出 14 个静态页面；沙箱内因 `spawn EPERM` 受阻，获准在沙箱外重试后通过。
- `node --test tests/legal-pages.test.mjs tests/rfq-submission.test.mjs` 通过，2 项通过、0 项失败。覆盖三页 SEO、政策互链、全站页脚入口、无 JavaScript 隐私正文、询价同意默认未勾选及 RFQ 提交回归。
- 320、390、700、701、900、1024、1440px 无横向溢出；三页各 1440 和 390px 共六张截图已复核，未发现明显遮挡或错位。
- 浏览器测试阻断外部网络，RFQ 使用模拟后台；未验证真实后台、外部政策链接或生产 Cookie 行为，未创建真实询盘或部署。完整类型检查及 ESLint 因项目缺少对应工具与脚本而未执行。

### RFQ 交期字段移除验证（2026 年 11 月 5 日）

- 已移除 Target delivery date 输入项、准备资料提示中的交期要求及 GraphQL 提交映射；页面说明预计交期由 Belaro 评审需求后提供，隐私政策同步调整。
- `npm run build` 通过，生成 14 个静态页面；`node --test tests/gravity-forms.test.mjs` 的 8 项测试通过；`node --test tests/rfq-submission.test.mjs tests/legal-pages.test.mjs` 的 2 项浏览器测试通过，包含 RFQ 移动端溢出检查。
- 测试覆盖移除字段后其他后台 ID 保持不变、忽略旧交期值、附件映射、同意校验、提交异常及成功流程。构建和测试首次因沙箱 `spawn EPERM` 受阻，获准在沙箱外重试后通过。
- 浏览器测试使用模拟后台并阻断外部网络；未修改真实后台字段或历史条目，未部署。上线前须确认后台字段 10 为非必填；完整类型检查和 ESLint 因项目未配置对应工具与脚本而未执行。

### 首页九模块重组验证（2026 年 11 月 5 日）

- 首页已按首屏定位、采购需求匹配、核心服务、代表性零件、能力概览、质量检验、目标应用、合作流程、FAQ 与询价入口的顺序重组。
- `npm run build` 通过，生成 14 个静态页面；`node --test tests/homepage.test.mjs tests/process-flow.test.mjs tests/hero-slider.test.mjs` 的 3 项测试通过。
- 自动化测试覆盖九模块顺序、单一 H1、核心站内链接、FAQ 无 JavaScript 内容、轮播回归、流程卡片及 320–1440px 横向溢出；1440px 和 390px 长截图已复核。
- 测试阻断外部网络，因此截图不验证外部字体；Machined Parts 代表性图片、材料、尺寸、公差和批量固定范围仍须取得企业确认后补充。本次未部署，也未执行项目尚未配置的完整类型检查和 ESLint。

### 可选 Turnstile 验证（2026 年 11 月 5 日）

- `npm run build` 通过，生成 14 个静态页面；`node --test tests/gravity-forms.test.mjs` 的 9 项测试通过；`node --test tests/rfq-submission.test.mjs tests/legal-pages.test.mjs` 的 3 项浏览器测试通过。构建和 Node 测试首次因沙箱 `spawn EPERM` 受阻，获准在沙箱外执行后通过。
- PHP 插件语法检查及上述 9 个场景测试均通过，验证未配置密钥时放行，以及启用后的 Token、hostname、action 与外部服务异常处理。函数替身测试不代表真实 WordPress/Cloudflare 联调。
- 已更新仓库内 MU 插件，未部署至真实 WordPress，也未发布静态站点。现有后台需同步更新插件；未配置 Site Key 仅表示前端不要求人机验证，不代表 GraphQL 地址、CORS、后台字段及通知投递已验证。

## 11. 构建与部署

供应商网络文案更新验证（2026 年 11 月 5 日）：网站正文、FAQ、配套工艺页 SEO 和公共配套工艺区块已统一涵盖东莞及深圳供应商网络，公司所在地继续为深圳。`npm run build` 通过，生成 14 页；`node --test tests/about.test.mjs tests/secondary-processes.test.mjs tests/industries.test.mjs` 的 3 项测试通过，包含桌面和手机宽度的横向溢出检查。构建与测试首次因沙箱 `spawn EPERM` 受阻，获准重试后通过。测试阻断外部网络，本次未部署。

企业信息更新验证（2026 年 11 月 5 日）：`npm run build` 通过，生成 14 个静态页面；`node --test tests/about.test.mjs tests/legal-pages.test.mjs tests/secondary-processes.test.mjs tests/industries.test.mjs` 的 4 项测试通过。构建与浏览器测试首次受沙箱 `spawn EPERM` 阻断，获准在沙箱外重试后通过。构建产物中 About、Contact、隐私政策和使用条款的中英文公司名称及深圳所在地已核对，未发现将公司所在地写为东莞的旧表述；东莞供应商网络说明保留。浏览器测试使用本地静态产物并阻断外部网络，未部署、未进行真实后台联调；未执行项目尚未配置的完整类型检查和 ESLint。

`astro.config.mjs` 配置 `output: 'static'`。执行 `npm run build` 后，将 `dist/` 发布到静态托管服务或 Web 服务器，不需要运行 Node.js 生产后端。`npm run preview` 用于本地核查构建产物。

### GitHub Actions → SSH → VPS Docker

已提供 `.github/workflows/deploy.yml`：推送 `main` 或手动运行后，构建 Node.js 22 / Nginx 多阶段镜像，执行表单单元测试与容器 HTTP 检查，通过 SSH 用户名及私钥传输镜像，再由 VPS 的 Docker Compose 更新容器。无需镜像仓库登录；使用 OpenSSH `accept-new` 首次信任 SSH 主机密钥、串行部署、容器健康检查和失败后的上一成功版本恢复。GitHub 临时 Runner 每次都会重新建立首次信任，不能预先核验服务器身份，存在首次连接被中间人攻击的风险。

在 GitHub 的 `production` Environment 或仓库配置 Secrets：`VPS_HOST`、`VPS_USER`、`VPS_SSH_KEY`；配置必填 Variable `PUBLIC_GRAPHQL_URL`。不需要 `VPS_KNOWN_HOSTS`。SSH 端口默认 `22`，容器默认映射至 VPS 的 `127.0.0.1:8080`，可通过 Variables 调整端口、监听地址、镜像架构和公开 Turnstile Site Key。完整配置表、公钥安装、VPS 前提、首次验收与回滚步骤见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

Nginx 容器支持目录路由、未知路径 404、HTML 重新验证和哈希资源缓存。域名解析、HTTPS 证书和外层反向代理仍需在 VPS 配置；上线前检查 Canonical、后台 CORS、Turnstile，并按需补齐 sitemap、robots.txt。WordPress 及插件独立安装维护，前端发布不会更新后台或 MU 插件。单容器重建可能短暂中断服务。

GitHub Runner 的临时测试容器固定使用 `127.0.0.1:18080`，与 VPS 的 `HTTP_PORT` 独立；例如设置 `HTTP_PORT=28080` 只影响 VPS 映射端口，现有反向代理的上游端口也应同步调整。工作流先对临时容器 `/healthz` 执行有限次数重试，覆盖启动期间的连接重置或拒绝，并设置连接和单次请求超时；健康检查通过后才验证页面及打包上传。修复后须推送新提交到 `main` 触发部署，重新运行旧记录不会使用更新后的工作流。

2026 年 11 月 11 日本地检查：`npm run build` 通过，生成 14 页；`node --test tests/deployment.test.mjs tests/gravity-forms.test.mjs` 的 14 项测试通过，覆盖部署参数校验、全部工作流步骤及部署脚本的 Bash 语法和表单映射；`node --test tests/rfq-submission.test.mjs` 的 2 项浏览器回归通过。Compose 配置、工作流 YAML 和公开 GraphQL 构建变量替换检查通过，检查后已恢复默认本地产物。部署测试解析现有 Astro 间接依赖 `js-yaml`，没有新增依赖；浏览器测试仍依赖本机既有 Playwright 环境。构建、Node 测试和 Bash 首次受沙箱权限阻止，获准在沙箱外重试通过。本机 Docker 引擎未启动，尚未执行真实镜像构建、容器运行、GitHub 工作流或 VPS 恢复验证；上线须完成部署指南中的验收步骤。

### Cloudflare Cache Rules：官网高命中率配置

以下为 **2026 年 11 月 11 日核对的配置建议，尚未在 Cloudflare 账户中应用或线上验收**。官网为 Astro 静态输出，用户已确认独立 WordPress 后台域名为 `wp.belaroprecision.com`。目标是尽量复用官网缓存，同时让询价、上传、登录和后台请求绕过缓存；不能保证所有请求或所有地区均达到 100% 命中。

#### 配置前提

- 官网 DNS 记录必须启用 Cloudflare 代理（橙云），关闭 Development Mode。后台绕过规则也仅对经过 Cloudflare 代理的请求生效。
- 生产构建变量应设置 `PUBLIC_GRAPHQL_URL=https://wp.belaroprecision.com/graphql`，确认后台实际 GraphQL 路径后重新构建；本次没有修改环境文件或部署变量。
- 当前 `deploy/nginx.conf` 对 `/_astro/` 返回 `public, max-age=31536000, immutable`，其他页面和 `/images/` 返回 `no-cache`。下列规则主动覆盖 **Edge TTL**；Browser TTL 单独设置，不能只勾选 Eligible for cache 就认为源站的 `no-cache` 已被覆盖。
- 只在当前静态官网使用强制缓存。将来增加服务端登录、个性化内容、服务端搜索或动态图片转换时，先调整规则和缓存键。

#### 四条规则及顺序

在 Cloudflare 控制台选择 `belaroprecision.com` → **Rules → Cache Rules → Create rule → Custom filter expression → Edit expression**。按下表从上到下创建。Cache Rules 会叠加，同一设置以最后匹配的规则为准，因此绕过规则必须放在最后；已有规则也需检查，不能在其后再放全站强制缓存。

| 顺序 / 建议名称 | 范围 | Edge TTL | Browser TTL |
| --- | --- | --- | --- |
| 1 / `官网公共静态内容` | 官网全部公共内容，包含 HTML 和 Contact 页面外壳 | 7 天（604800 秒） | Respect existing headers |
| 2 / `官网普通图片` | 官网 `/images/` | 30 天（2592000 秒） | Override origin，1 天（86400 秒） |
| 3 / `Astro 哈希资源` | 官网 `/_astro/` | 1 年（31536000 秒） | Respect existing headers，沿用源站 1 年 |
| 4 / `后台与敏感请求绕过` | WordPress 整个域名及官网接口、认证请求 | Bypass cache | 不设置覆盖 |

**规则 1：官网公共静态内容**

```text
(http.host in {"belaroprecision.com" "www.belaroprecision.com"})
```

设置 **Cache eligibility → Eligible for cache**；**Edge TTL → Ignore cache-control header and use this TTL → 7 days**；**Browser TTL → Respect existing headers**。HTML 在边缘缓存 7 天，浏览器继续按源站 `no-cache` 重新验证，以便发布后通过清理边缘缓存更新页面。这里的 `no-cache` 表示重新验证，不等于 `no-store`。

**规则 2：官网普通图片**

```text
(http.host in {"belaroprecision.com" "www.belaroprecision.com"}
 and starts_with(http.request.uri.path, "/images/"))
```

设置 **Eligible for cache**；**Edge TTL → Ignore cache-control header and use this TTL → 30 days**；**Browser TTL → Override origin and use this TTL → 1 day**。这些图片使用固定文件名，浏览器缓存 1 天可减少重复下载；同名替换后，即使清理 Cloudflare，已缓存图片的浏览器仍可能显示旧图至到期。需要即时更新时，使用新文件名并更新引用。

**规则 3：Astro 哈希资源**

```text
(http.host in {"belaroprecision.com" "www.belaroprecision.com"}
 and starts_with(http.request.uri.path, "/_astro/"))
```

设置 **Eligible for cache**；**Edge TTL → Ignore cache-control header and use this TTL → 1 year**；**Browser TTL → Respect existing headers**。该目录包含构建生成的 CSS、JavaScript 和优化图片，内容变化时由构建产生新的哈希 URL，适合长期缓存。

**前三条规则的共同补充设置：**

- 在 **Edge TTL → Status code TTL** 中为 `300–399` 设置 **2 小时**，为 `400–599` 设置 **No cache / No store**（API 对应 `-1`）。成功响应沿用各规则的默认 Edge TTL，避免错误页被缓存数天或一年。若界面要求列出成功范围，再添加 `200–299` 并填写该规则的 Edge TTL。
- 在 **Cache Key** 中启用 **Ignore query string**，让不同 `utm_*`、`gclid`、`part`、`process` 等参数复用同一路径的静态资源。它只改变缓存键，不会删除浏览器地址栏中的参数；当前 Contact 页的 `part` / `process` 由浏览器脚本读取，仍可预填。不要改用重定向删除参数。
- 官方 Cache keys 可用性表列出 Ignore query string 支持所有套餐；精细选择保留/排除哪些参数是另外的权限。若当前账户界面没有该选项，先保留默认缓存键，参数 URL 会分别缓存，不能将其当成已合并。
- 不启用 **Cache by device type**，不额外加入 Cookie、User-Agent、国家或语言作为缓存键；官网使用同一份响应式 HTML。其余未列出的高级选项保持默认，不设置缓存读取超时或源站错误回退的特殊覆盖。
- 忽略查询参数后，`?v=2` 不能用于刷新图片或脚本缓存，应更换文件名。未来若参数会改变源站响应内容，必须恢复相应参数进入缓存键或为该路径绕过缓存。

前三条表达式不限制为 GET：Cloudflare 自身控制可缓存方法，且官方提示仅匹配 GET 的规则可能影响按 URL 清缓存。下面的绕过规则为内部清缓存匹配保留 `PURGE` 方法，这不代表源站支持或允许匿名 PURGE。

**规则 4：后台与敏感请求绕过，必须最后执行**

```text
(
 http.host eq "wp.belaroprecision.com"
 or (
  http.host in {"belaroprecision.com" "www.belaroprecision.com"}
  and (
   not http.request.method in {"GET" "HEAD" "PURGE"}
   or starts_with(http.request.uri.path, "/graphql")
   or http.request.uri.path eq "/api"
   or starts_with(http.request.uri.path, "/api/")
   or starts_with(http.request.uri.path, "/wp-admin")
   or starts_with(http.request.uri.path, "/wp-json")
   or http.request.uri.path eq "/wp-login.php"
   or http.request.uri.path eq "/healthz"
   or starts_with(http.request.uri.path, "/cdn-cgi/")
   or any(http.request.headers["authorization"][*] ne "")
   or http.cookie contains "wordpress_logged_in_"
  )
 )
)
```

只设置 **Cache eligibility → Bypass cache**，不设置 Edge TTL 或 Browser TTL。WordPress 的所有页面、GraphQL、预检、上传和登录均绕过 Cloudflare 缓存；已有 WordPress 页面缓存插件或服务器缓存仍须单独排除 GraphQL、登录与上传。官网 `/contact/` 是可缓存的公共静态表单页面，真实提交发往后台，不需要因为有表单就绕过整个联系页。不要增加“存在任何 Cookie 就绕过”的规则，以免普通访问者带安全或统计 Cookie 时丢失命中。

#### 进一步提高命中率

- **Cache Key 合并查询参数**与**长 Edge TTL**配合使用，避免广告参数和询价入口参数分散相同内容的缓存。
- 在 **Caching → Tiered Cache** 中启用 **Smart Tiered Cache**（以账户实际入口为准），让边缘节点未命中时优先从上层缓存获取，减少回源。它不意味着所有首次访问都一定显示 HIT，也不替代上述规则。
- 统一访问 `https://belaroprecision.com`：在 Redirect Rules 或现有反向代理中将 HTTP 和 `www` 重定向到该规范地址，保留路径与查询参数。规则仍兼容两个官网域名，但长期分散访问会产生不同主机的缓存副本；不要重定向 `wp` 后台到官网。
- 静态官网响应应避免无意义的 `Set-Cookie` 和按用户变化的响应；保留后台认证及 CORS 所需设置。Google Fonts 和 Turnstile 使用第三方域名，不在这四条规则的加速范围内。
- 新部署前后不要反复 Purge Everything。TTL 是新鲜度上限，不是保留保证；低访问量内容仍可能提前被逐出。用 Cache Analytics 分别查看官网与后台、请求与字节命中率，后台绕过和冷请求不应被视为官网规则失效。

#### 每次发布后的操作

1. 先确认新容器健康检查及源站页面正常，再清除发生变化的 HTML URL；公共导航、页脚或样式引用变化时清除全部 14 个页面 URL。当前部署工作流**未实现自动 Cloudflare 清缓存**，必须手动执行，不能假设发布后立刻显示新内容。
2. 在 **Caching → Configuration → Purge Cache → Custom Purge → URL** 中填写完整 HTTPS URL，路径及末尾斜杠与用户实际访问一致；如仍使用 `www`，其缓存也需处理。不支持用单文件清理中的 `*` 代替整批路径。
3. 同名替换 `/images/` 文件时清理对应图片 URL；需要即时覆盖浏览器缓存时改文件名并清理引用它的 HTML。新哈希 `/_astro/` 文件通常不用清理；旧 HTML 可能仍引用旧哈希资源，部署时应保留上一版资源至旧页面缓存刷新完成，或安排一致的发布及清缓存流程。当前镜像部署未实现跨版本资源保留。
4. 默认不要清除所有哈希资源。仅在缓存策略迁移、旧变体无法定向清理或故障恢复时考虑 Purge Everything；它会清空整个 zone，增加冷请求和回源压力。
5. 正常文档请求按 URL 清理即可；若资源请求带 `Origin` 等参与默认缓存键的特殊 Header，控制台单 URL 清理可能无法覆盖该副本，需按官方说明通过 API 携带对应 Header，或使用账户支持的按主机/前缀清理。忽略查询参数本身通常不阻止单 URL 清理。

#### 验收与排查

使用 Windows 自带 `curl.exe` 连续执行两次普通 GET，避免只用 HEAD 代替实际页面请求；用自己站点实际存在的哈希文件替换最后一条的占位文件名：

```powershell
curl.exe -sS -D - -o NUL "https://belaroprecision.com/"
curl.exe -sS -D - -o NUL "https://belaroprecision.com/"
curl.exe -sS -D - -o NUL "https://belaroprecision.com/?utm_source=cache-check"
curl.exe -sS -D - -o NUL "https://belaroprecision.com/contact/?process=milling"
curl.exe -sS -D - -o NUL "https://belaroprecision.com/images/machined-parts/precision-shaft-main.webp"
curl.exe -sS -D - -o NUL "https://belaroprecision.com/_astro/替换为实际哈希文件名.css"
curl.exe -sS -D - -o NUL "https://wp.belaroprecision.com/wp-login.php"
curl.exe -sS -D - -o NUL "https://belaroprecision.com/cache-check-missing-page-20261111/"
```

- 官网成功响应：首次可能为 `MISS`，同一节点后续请求期望 `CF-Cache-Status: HIT`，通常伴随 `Age`；启用查询参数忽略后，带追踪参数的同路径应复用缓存。`Cache-Control: no-cache` 仍可能出现在 HTML 响应头中，它描述浏览器侧策略，不能据此单独判断 Edge TTL 未生效。
- 后台登录及 GraphQL：不得命中共享缓存；Cache Rules 绕过时可能显示 `DYNAMIC` 或 `BYPASS`，不要只认其中一种。此处仅 GET 登录页，不执行真实登录或表单提交。
- 不存在的页面：应返回 404，重复请求不应成为长期 `HIT`。部署健康检查与浏览器中的 GraphQL OPTIONS / POST、附件上传、Turnstile 和表单预填也需逐项验收；真实提交应使用明确标记的测试询盘并核实后台保存。
- 官网持续 `DYNAMIC` / `BYPASS` 时，检查橙云、Development Mode、规则顺序、实际请求域名、认证 Header / 登录 Cookie、Workers 及其他覆盖配置；用 Rules simulator 核对匹配。浏览器 Network 中的内存/磁盘缓存和 Cloudflare 边缘命中是两层不同缓存。

官方参考（上述建议的依据，界面与套餐权限以账户实际显示为准）：

- [Cache Rules 设置](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/)与[规则顺序](https://developers.cloudflare.com/cache/how-to/cache-rules/order/)。
- [Cache keys 与套餐可用性](https://developers.cloudflare.com/cache/how-to/cache-keys/)。
- [Tiered Cache](https://developers.cloudflare.com/cache/how-to/tiered-cache/)与[TTL 和缓存保留的区别](https://developers.cloudflare.com/cache/concepts/retention-vs-freshness/)。
- [单 URL 清理及限制](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-single-file/)与[缓存响应状态](https://developers.cloudflare.com/cache/concepts/cache-responses/)。

## 12. 常见问题与待确认事项

2026 年 11 月 11 日平台依赖修复验证：锁文件补齐 100 条缺失的平台及其依赖记录，原有包记录保持不变；Docker 安装显式包含可选依赖。`node --test tests/deployment.test.mjs tests/gravity-forms.test.mjs` 的 15 项测试和本地 `npm run build` 通过。实际执行 `docker build --target build --platform linux/amd64 --build-arg PUBLIC_GRAPHQL_URL=https://cms.example.com/graphql --tag belaroprecision:sharp-build-check .`，Alpine 内完成 11 项表单测试、14 页构建及 99 张图片优化，确认 Sharp/libvips 可用。完整运行镜像构建因 Docker Hub 的 Nginx 认证请求超时未完成；未验证 ARM64 实际构建、容器 HTTP 服务或 VPS 部署。

- **Docker 构建提示 MissingSharp 或缺少 Rollup 原生包：** Windows 下生成的不完整 npm 锁文件可能漏掉 Linux 平台依赖。当前锁文件已补齐 Sharp/libvips、Rollup 和 esbuild 的平台包，保留已有依赖版本；Docker 安装显式包含可选依赖。提交并推送更新后的锁文件后运行新提交的工作流，旧运行记录的 Re-run 仍使用原提交。维护锁文件时须保留跨平台记录，并执行 `node --test tests/deployment.test.mjs`；仅在 Windows 构建成功或使用 `--ignore-scripts` 安装成功，不能证明 Linux 图片优化可用。
- **页面可打开但不能提交：** 检查 GraphQL 地址、字段 ID 和后台必填规则。未配置 Site Key 时应可提交；若后台仍配置 Secret Key，需将前后端验证配置保持一致。启用时还需检查浏览器是否加载 Turnstile、后台 Secret/hostname 是否正确。
- **附件或跨域请求失败：** 核对 WPGraphQL Upload、MU 插件、允许 Origin、预检 Header、证书信任、扩展/MIME 及服务器大小限制。上传兼容插件不替代完整 CORS 配置。
- **没有成功提示：** 只有保存条目 ID 才能确认接收，网络异常可能发生在后台已保存之后，应先核实再人工重试。
- **新机器浏览器测试无法启动：** 当前锁文件没有 Playwright，需先明确项目测试依赖管理方案；不能把本机上级目录的依赖视为可复现安装的一部分。
- **后台环境待确认：** WordPress/PHP/数据库/Gravity Forms 版本、插件当前启用情况、匿名权限、文件保存及删除、邮件投递和生产安全策略。
- **发布内容待确认：** 真实企业信息、监控邮箱、加工范围、公差、批量、认证及图片授权。

以上为代码核查所得问题或待确认信息，不代表已批准或排期的开发计划。

## 13. 缺失的重要技术文档

当前 README 已补充项目概览、架构、环境、运行、字段和验证说明；已提供 `.env.example` 和 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。以下独立文档尚不存在，需在对应事实确认后补齐：

| 建议文档 | 需补充的内容 |
| --- | --- |
| `docs/API.md` | 实际后台 Schema/插件版本、字段设置、错误响应和匿名提交权限 |
| `docs/DEVELOPMENT.md` | 可复现的 Playwright/Chromium 环境、类型检查、Lint 与 CI 方案 |
| `docs/ARCHITECTURE.md` | 前后端信任边界、图纸存储/访问/保留/删除和 Turnstile 校验限制 |
| `CHANGELOG.md` | 版本变更和上线记录，区分本地测试与生产验收 |

仓库没有自有数据库模型或 Migration，当前不应编造数据库设计文档；待确认 WordPress 运维范围后再决定是否编写 `docs/DATABASE.md`。

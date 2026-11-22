# 加工能力总览：图片需求

- 页面路径：`/services/`
- 页面 slug：`services`
- 扫描依据：[src/pages/services/index.astro](../../src/pages/services/index.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：5 个图位均已展示。Hero 已交付并作为背景接入，原有铣削与车削图片保留；二次工艺和生产支持复用现有素材，原规划的两张跨页新图尚未交付。保留或复用不代表已完成真实性核验。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

Hero 和综合服务导语无图；milling、turning 各有一张机床图片；secondary-processes 与 production 为大段纯文字面板。

规划图位共 5 个：新增 1 个，替换 0 个，保留 2 个，复用 2 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

新增 Hero 成品组合图；为两项文字面板各补一张独立图片，保留服务链接与锚点。正文原有铣削、车削图无需重复制作。

不新增图片的区域与限制：能力范围、批量与可行性说明仍保留可检索文本，不把参数做成图片。

## 3. 逐项图片要求

### 01. Hero

- 状态：新增。
- 优先级：P0。
- 英文文件名：`services-cnc-part-families-hero.webp`。
- 实际交付路径：`src/assets/images/pages/services/services-cnc-part-families-hero.webp`。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：写实工业产品组合，一件带口袋壳体、一件 L 形安装支架、一根阶梯轴和一件法兰轴套，四类完整工件右侧错位摆放，材质自然，浅灰干净台面，左侧低细节留白。
- 英文 Alt 草案：`Milled housings and brackets with turned shafts and bushings`。

### 02. #milling

- 状态：保留。
- 优先级：P1。
- 英文文件名：`hero-cnc-milling.webp`。
- 现有资源：[src/assets/images/hero-cnc-milling.webp](../../src/assets/images/hero-cnc-milling.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有铣削机床图片，孔、刀具及夹具不能被裁切成无法辨认。
- 英文 Alt 草案：`CNC milling operation on a metal component`。

### 03. #turning

- 状态：保留。
- 优先级：P1。
- 英文文件名：`hero-cnc-turning.webp`。
- 现有资源：[src/assets/images/hero-cnc-turning.webp](../../src/assets/images/hero-cnc-turning.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有车削图片，后续可使用 CNC Turning 的切削近景替换，但不重复下单。
- 英文 Alt 草案：`CNC turning machine and operator`。

### 04. #secondary-processes

- 状态：复用。
- 优先级：P0。
- 英文文件名：`secondary-ground-shaft-detail.webp`。
- 共享资源：见[secondary-processes.md](secondary-processes.md)中的 `secondary-ground-shaft-detail.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：引用 Secondary Processes 的磨削工件图；这是协调工艺示意，不代表自有磨床。
- 英文 Alt 草案：`Ground journal on a stepped shaft`。

### 05. #production

- 状态：复用。
- 优先级：P0。
- 英文文件名：`production-separated-components-batch.webp`。
- 共享资源：见[production.md](production.md)中的 `production-separated-components-batch.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：引用 Production 的独立分隔批次图；以小批量完整工件替代抽象生产口号。
- 英文 Alt 草案：`Small batch of machined components in separated trays`。

## 4. 实际交付与接入记录

2026 年 11 月 22 日，用户的 `Services/` 目录共交付 1 张图片：`services-cnc-part-families-hero.webp.webp`。已去除重复扩展名，原样移动至上述路径，原始尺寸 1672 × 941px，51,950 字节，移动前后 SHA256 一致。未修改、裁剪或重新生成原图；来源为用户提供素材，未核验拍摄或生成信息。

实际画面为两件安装支架、阶梯轴与法兰轴套，未包含提示词中的口袋壳体。因此实际 Alt 使用 `Machined mounting brackets with a stepped shaft and flanged bushing`，不按提示词描述不存在的工件。

Hero 使用绝对定位图片背景层，文字始终在背景之上。桌面最小高度 560px，手机最小高度 620px，通过 `object-fit: cover` 等比铺满并按容器裁切，不改变工件比例；手机调整主体位置及遮罩以维持文字可读。背景裁切不等于修改或拉伸原图。Hero 优先加载并使用响应式 WebP。其余四张正文图使用 `width: 100%`、`height: auto`、`object-fit: contain`，完整展示原始比例。

5 个图位均已接入。`secondary-ground-shaft-detail.webp` 和 `production-separated-components-batch.webp` 在当前工作区仍未交付，本次改用以下已有素材，不将其冒充为原规划交付文件：

| 图位 | 实际复用路径 | 实际画面与 Alt |
| --- | --- | --- |
| `#secondary-processes` | `src/assets/images/secondary-processes.webp` | 六种二次工艺的组合示意；`Process montage showing grinding, anodizing, plating, heat treatment, blasting and polishing` |
| `#production` | `src/assets/images/production-oem.webp` | 工作台上的法兰、壳体、轴套批次及包装箱；`Batches of machined flanges, housings and sleeves on a workbench beside packing boxes` |

两处均保留可检索正文和详情链接，按现有服务行布局交替排列；直接复用资源映射，不复制图片文件或修改其他页面。二次工艺图是协调工艺示意，不证明自有设备；生产图未按独立分隔托盘描述。后续精确规划图交付后可再替换。

针对用户截图中的局部布局失效表现，本页规则改为以 `.services-page` 限定的非作用域样式，不依赖页面作用域标记。尚未确认截图原始触发原因，不归因为缓存。测试主动移除整个本页 DOM 的作用域属性，验证背景、文字层级、正文比例和图位显示；构建与浏览器验收记录见根 README。

## 5. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 未交付图位仍为需求；已接入部分的前端验证不代表图片来源真实性、制造能力或企业资产已经核验。


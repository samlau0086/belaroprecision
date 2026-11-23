# 首页：图片需求

- 页面路径：`/`
- 页面 slug：`home`（首页没有末级 slug，约定使用 home）
- 扫描依据：[src/pages/index.astro](../../src/pages/index.astro)、[src/components/HeroSlider.astro](../../src/components/HeroSlider.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：19 个规划图位已接入，能力概览新增四张跨页复用图。 来源与真实性仍需确认。当前跨页状态见 [核对记录](cross-page-reuse.md)。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

当前有 4 张轮播背景、2 张服务卡片图、4 张代表性零件图；采购匹配、能力概览、质量清单、应用卡片和四步流程主要依赖文字。服务卡片与轮播使用相同图片，新增图应优先补足正文，而不是继续堆叠首屏。

规划图位共 19 个：新增 1 个，替换 0 个，保留 8 个，复用 10 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

保留首屏轮播和现有入口。采购区增加一张横向图；能力概览用四张小图对应四种加工配置；质量区补一张清楚的测量图；应用卡片图文配对。流程只补末步包装图，不给每个步骤强配装饰图。

不新增图片的区域与限制：报价时效、No MOQ 优势条、FAQ、CTA 不新增图片，不用时钟、握手或证书图库图代替实际业务信息。

## 3. 逐项图片要求

### 01. Hero / 轮播 01

- 状态：保留。
- 优先级：P1。
- 英文文件名：`hero-cnc-milling.webp`。
- 现有资源：[src/assets/images/hero-cnc-milling.webp](../../src/assets/images/hero-cnc-milling.webp)。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：保留现有铣削背景；若后续替换，拍摄封闭加工区内的铣刀、夹持稳定的金属安装板和可见切削特征，主体偏右、左侧低细节。
- 英文 Alt 草案：`CNC milling a metal mounting plate`。

### 02. Hero / 轮播 02

- 状态：保留。
- 优先级：P1。
- 英文文件名：`hero-cnc-turning.webp`。
- 现有资源：[src/assets/images/hero-cnc-turning.webp](../../src/assets/images/hero-cnc-turning.webp)。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：保留现有车削背景；替换候选应明确卡盘、工件与车刀关系，不仅拍操作员背影。
- 英文 Alt 草案：`CNC turning setup for a stepped shaft`。

### 03. Hero / 轮播 03

- 状态：保留。
- 优先级：P1。
- 英文文件名：`quality-inspection.webp`。
- 现有资源：[src/assets/images/quality-inspection.webp](../../src/assets/images/quality-inspection.webp)。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：保留现有检验语境图；不通过画面宣称特定仪器资产或精度。
- 英文 Alt 草案：`Dimensional inspection of a machined component`。

### 04. Hero / 轮播 04

- 状态：保留。
- 优先级：P1。
- 英文文件名：`production-oem.webp`。
- 现有资源：[src/assets/images/production-oem.webp](../../src/assets/images/production-oem.webp)。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：保留现有批次生产语境图，完整显示前排工件与分隔安排，不把数量视为产能。
- 英文 Alt 草案：`Machined components arranged for batch production`。

### 05. #procurement-fit / Build to print

- 状态：新增，已接入。
- 优先级：P0。
- 英文文件名：`home-drawing-led-component-review.webp`。
- 实际交付路径：[home-drawing-led-component-review.webp](../../src/assets/images/pages/home/home-drawing-led-component-review.webp)，由 `Home/` 原样移动，文件名与内容不变。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：写实工业评审台，单件带口袋、安装孔与定位面的金属支架，旁边放同一轮廓的通用工程草图和无品牌屏幕 CAD 视图；图中不得出现可读尺寸、客户名称或订单；工件与图纸形状必须对应。
- 实际英文 Alt：`Machined bracket beside a generic drawing and CAD model`。图中草图、屏幕与实物呈相近构型，不将其描述为已验证完全一致的工程资料。

### 06. #core-services / CNC Milling

- 状态：复用。
- 优先级：P1。
- 英文文件名：`hero-cnc-milling.webp`。
- 现有资源：[src/assets/images/hero-cnc-milling.webp](../../src/assets/images/hero-cnc-milling.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：沿用铣削服务卡片现有图片，不再单独生成相同机床图。
- 英文 Alt 草案：`CNC milling equipment machining a metal component`。

### 07. #core-services / CNC Turning

- 状态：复用。
- 优先级：P1。
- 英文文件名：`hero-cnc-turning.webp`。
- 现有资源：[src/assets/images/hero-cnc-turning.webp](../../src/assets/images/hero-cnc-turning.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：沿用车削服务卡片现有图片；确认裁切后不是只有操作员而看不到加工语境。
- 英文 Alt 草案：`CNC turning machine and work area`。

### 08. Representative parts / Mounting Brackets

- 状态：保留。
- 优先级：P1。
- 英文文件名：`mounting-bracket-main.webp`。
- 现有资源：[public/images/machined-parts/mounting-bracket-main.webp](../../public/images/machined-parts/mounting-bracket-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有类别主图，与 src/data/machined-parts.ts 的类别映射一致，避免重新生成同一工件。
- 英文 Alt 草案：`Representative CNC-machined mounting bracket`。

### 09. Representative parts / Machined Blocks

- 状态：保留。
- 优先级：P1。
- 英文文件名：`machined-block-main.webp`。
- 现有资源：[public/images/machined-parts/machined-block-main.webp](../../public/images/machined-parts/machined-block-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有类别主图，与 src/data/machined-parts.ts 的类别映射一致，避免重新生成同一工件。
- 英文 Alt 草案：`Representative CNC-machined locating block`。

### 10. Representative parts / Precision Shafts

- 状态：保留。
- 优先级：P1。
- 英文文件名：`precision-shaft-main.webp`。
- 现有资源：[public/images/machined-parts/precision-shaft-main.webp](../../public/images/machined-parts/precision-shaft-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有类别主图，与 src/data/machined-parts.ts 的类别映射一致，避免重新生成同一工件。
- 英文 Alt 草案：`Representative CNC-turned stepped shaft`。

### 11. Representative parts / Bushings & Sleeves

- 状态：保留。
- 优先级：P1。
- 英文文件名：`bushings-sleeves-main.webp`。
- 现有资源：[public/images/machined-parts/bushings-sleeves-main.webp](../../public/images/machined-parts/bushings-sleeves-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有类别主图，与 src/data/machined-parts.ts 的类别映射一致，避免重新生成同一工件。
- 英文 Alt 草案：`Representative CNC-turned bushings and sleeves`。

### 12. Capability overview / 3-axis

- 状态：复用。
- 优先级：P1。
- 英文文件名：`milling-three-axis-plate-setup.webp`。
- 共享资源：见[cnc-milling.md](cnc-milling.md)中的 `milling-three-axis-plate-setup.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用 CNC Milling 文档的三轴安装板图；用于能力清单旁的小图，不另行生成。
- 英文 Alt 草案：`Three-axis milling setup for a mounting plate`。

### 13. Capability overview / 3+2

- 状态：复用。
- 优先级：P1。
- 英文文件名：`milling-indexed-angled-bracket.webp`。
- 共享资源：见[cnc-milling.md](cnc-milling.md)中的 `milling-indexed-angled-bracket.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用 CNC Milling 的固定倾角装夹图，不与同时五轴使用同一画面。
- 英文 Alt 草案：`Indexed-angle milling setup for a bracket`。

### 14. Capability overview / 5-axis

- 状态：复用。
- 优先级：P1。
- 英文文件名：`milling-five-axis-contoured-mount.webp`。
- 共享资源：见[cnc-milling.md](cnc-milling.md)中的 `milling-five-axis-contoured-mount.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用 CNC Milling 的复杂外曲面可达性图，静态图片不证明实际联动过程。
- 英文 Alt 草案：`Five-axis tool access around a contoured mount`。

### 15. Capability overview / Turning

- 状态：复用。
- 优先级：P1。
- 英文文件名：`turning-shaft-shoulder-cut.webp`。
- 共享资源：见[cnc-turning.md](cnc-turning.md)中的 `turning-shaft-shoulder-cut.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用 CNC Turning 正文车削近景，避免重复轮播背景。
- 英文 Alt 草案：`Turning tool approaching a shaft shoulder`。

### 16. #quality-inspection

- 状态：复用。
- 优先级：P0。
- 英文文件名：`quality-critical-dimension-check.webp`。
- 现有资源：[src/assets/images/quality-critical-dimension-check.webp](../../src/assets/images/quality-critical-dimension-check.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：使用现有轴径测量图，保留测砧接触与轴的径向关系；不得覆盖原有检验要求文字。
- 英文 Alt 草案：`Outside micrometer measuring a shaft diameter`。

### 17. #target-applications / Automation

- 状态：复用。
- 优先级：P0。
- 英文文件名：`industry-automation-fixture.webp`。
- 现有资源：[src/assets/images/industry-automation-fixture.webp](../../src/assets/images/industry-automation-fixture.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用行业页定位夹具图，主体为定位块、夹紧件和工件的实际装配关系。
- 英文 Alt 草案：`Locating blocks and a clamp in an automation fixture`。

### 18. #target-applications / Machinery

- 状态：复用。
- 优先级：P0。
- 英文文件名：`industry-machinery-shaft-assembly.webp`。
- 现有资源：[src/assets/images/industry-machinery-shaft-assembly.webp](../../src/assets/images/industry-machinery-shaft-assembly.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用行业页轴与支承装配图，与精密轴零件卡片形成工件到应用的对应。
- 英文 Alt 草案：`Stepped shaft between bearing supports in a machine assembly`。

### 19. #production-flow / Inspect & deliver

- 状态：复用。
- 优先级：P1。
- 英文文件名：`quality-protective-packaging.webp`。
- 现有资源：[src/assets/images/quality-protective-packaging.webp](../../src/assets/images/quality-protective-packaging.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：流程下方用一张已有 EPE 包装图承接交付，不把四步内容栅格化为四张相似桌面照。
- 英文 Alt 草案：`Machined parts protected with EPE foam inside a carton`。

## 4. 实际交付与接入记录

2026 年 11 月 22 日，`Home/` 内只有 `home-drawing-led-component-review.webp` 一张图片，原始尺寸 1672 × 941px，79,472 字节。移动前后 SHA256 一致；未重绘、裁剪或拉伸原图。图片来源为用户提供的视觉素材，未核验其生成工具或拍摄信息，不作客户项目或企业现场证明。

| 图位 | 资源 | 本轮处理 |
| --- | --- | --- |
| 05 / 采购评审 | `home-drawing-led-component-review.webp` | 已接入标题后、四项采购要点前；按原始比例展示 |
| 12–15 / 能力概览 | 三轴、3+2、五轴、车削共 4 张跨页新图 | 2026 年 11 月 23 日已补齐，复用各工艺页正式资产，桌面四列、手机两列等比展示 |
| 16 / 质量检验 | `quality-critical-dimension-check.webp` | 已复用，位于清单上方，完整保留千分尺与轴的关系 |
| 17 / 自动化应用 | `industry-automation-fixture.webp` | 已复用，位于自动化卡片顶部 |
| 18 / 工业机械 | `industry-machinery-shaft-assembly.webp` | 已复用，位于工业机械卡片顶部 |
| 19 / 检验交付 | `quality-protective-packaging.webp` | 已复用，位于四步流程下方 |

图位 01–04、06–11 原有图片继续保留。首页当前 19 个图位已接入，正文图按原比例完整展示，来源与许可仍需确认。

同日修复正文图片拉伸：以上 5 张图片改用页面原生容器和容器内图片样式控制，统一按原始比例完整展示，不依赖 Image 组件转发页面作用域属性；包装图最大宽度为 640px。原始文件不变，开发与生产构建回归覆盖 320–2558px 共 11 种宽度，并复核桌面和手机截图。

## 5. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 未交付图位仍为需求；已接入部分的构建与浏览器验证以根 README 中对应记录为准，不代表制造能力或来源真实性已核验。


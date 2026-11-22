# CNC 综合加工：图片需求

- 页面路径：`/services/cnc-machining/`
- 页面 slug：`cnc-machining`
- 扫描依据：[src/pages/services/cnc-machining/index.astro](../../src/pages/services/cnc-machining/index.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：13 个图位已接入，手机端按规划隐藏 RFQ 辅助图。专用 Hero 尚未交付，当前复用用户已交付的 Services 成品组合图；保留及复用项不代表已完成真实性核验。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

现有 Hero、三张工艺卡片及六张零件主图；质量评审、合作流程与页内询价为文字区。Hero 与铣削卡片重复同一资源。

规划图位共 13 个：新增 0 个，替换 1 个，保留 9 个，复用 3 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

将首屏替换为更能看到工件的专用背景；保留三张工艺卡片及六类零件，质量区增加测量图，流程与 RFQ 仅各复用一张辅助图，不能推迟表单入口。

不新增图片的区域与限制：No fixed MOQ、24 小时回复目标、FAQ 不配库存照片或时钟图；不新增客户 Logo、评价或认证图。

## 3. 逐项图片要求

### 01. Hero / #machining-title

- 状态：替换。
- 优先级：P0。
- 英文文件名：`cnc-machining-oem-components-hero.webp`。
- 替换对象：当前 src/assets/images/hero-cnc-milling.webp；原资源不删除，其他页面仍可继续使用。
- 建议交付路径：`src/assets/images/pages/cnc-machining/cnc-machining-oem-components-hero.webp`（待制作后建立）。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：写实加工现场近景，右侧以前景完整铣削壳体、阶梯轴和短套筒展示成品，中景封闭 CNC 机床仅作语境，主体清楚、不过度虚化，左侧留可叠字空间。不画机器人生产线或客户商标。
- 英文 Alt 草案：`Milled housing and turned components in a CNC machining setting`。

### 02. 工艺卡片 / CNC Milling

- 状态：保留。
- 优先级：P1。
- 英文文件名：`hero-cnc-milling.webp`。
- 现有资源：[src/assets/images/hero-cnc-milling.webp](../../src/assets/images/hero-cnc-milling.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有资源；配套工艺图不能被解释为全部工艺在自有车间完成。
- 英文 Alt 草案：`CNC milling a metal component`。

### 03. 工艺卡片 / CNC Turning

- 状态：保留。
- 优先级：P1。
- 英文文件名：`hero-cnc-turning.webp`。
- 现有资源：[src/assets/images/hero-cnc-turning.webp](../../src/assets/images/hero-cnc-turning.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有资源；配套工艺图不能被解释为全部工艺在自有车间完成。
- 英文 Alt 草案：`CNC turning machine and work area`。

### 04. 工艺卡片 / Secondary Processes

- 状态：保留。
- 优先级：P1。
- 英文文件名：`secondary-processes.webp`。
- 现有资源：[src/assets/images/secondary-processes.webp](../../src/assets/images/secondary-processes.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有资源；配套工艺图不能被解释为全部工艺在自有车间完成。
- 英文 Alt 草案：`Secondary processing examples for machined components`。

### 05. #parts-title / 类别 1

- 状态：保留。
- 优先级：P1。
- 英文文件名：`mounting-bracket-main.webp`。
- 现有资源：[public/images/machined-parts/mounting-bracket-main.webp](../../public/images/machined-parts/mounting-bracket-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：沿用 machinedParts 对应主图，不与材料页重复生图。
- 英文 Alt 草案：`Representative mounting bracket`。

### 06. #parts-title / 类别 2

- 状态：保留。
- 优先级：P1。
- 英文文件名：`machined-block-main.webp`。
- 现有资源：[public/images/machined-parts/machined-block-main.webp](../../public/images/machined-parts/machined-block-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：沿用 machinedParts 对应主图，不与材料页重复生图。
- 英文 Alt 草案：`Representative machined block`。

### 07. #parts-title / 类别 3

- 状态：保留。
- 优先级：P1。
- 英文文件名：`precision-shaft-main.webp`。
- 现有资源：[public/images/machined-parts/precision-shaft-main.webp](../../public/images/machined-parts/precision-shaft-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：沿用 machinedParts 对应主图，不与材料页重复生图。
- 英文 Alt 草案：`Representative stepped shaft`。

### 08. #parts-title / 类别 4

- 状态：保留。
- 优先级：P1。
- 英文文件名：`bushings-sleeves-main.webp`。
- 现有资源：[public/images/machined-parts/bushings-sleeves-main.webp](../../public/images/machined-parts/bushings-sleeves-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：沿用 machinedParts 对应主图，不与材料页重复生图。
- 英文 Alt 草案：`Representative bushings and sleeves`。

### 09. #parts-title / 类别 5

- 状态：保留。
- 优先级：P1。
- 英文文件名：`custom-connectors-main.webp`。
- 现有资源：[public/images/machined-parts/custom-connectors-main.webp](../../public/images/machined-parts/custom-connectors-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：沿用 machinedParts 对应主图，不与材料页重复生图。
- 英文 Alt 草案：`Representative custom connector`。

### 10. #parts-title / 类别 6

- 状态：保留。
- 优先级：P1。
- 英文文件名：`plates-housings-main.webp`。
- 现有资源：[public/images/machined-parts/plates-housings-main.webp](../../public/images/machined-parts/plates-housings-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：沿用 machinedParts 对应主图，不与材料页重复生图。
- 英文 Alt 草案：`Representative plate and housing`。

### 11. #quality-title

- 状态：复用。
- 优先级：P0。
- 英文文件名：`quality-critical-dimension-check.webp`。
- 现有资源：[src/assets/images/quality-critical-dimension-check.webp](../../src/assets/images/quality-critical-dimension-check.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：在质量评审内容旁展示实际测量接触关系；保留材料、公差、文件和数量四项说明。
- 英文 Alt 草案：`Micrometer checking a shaft diameter`。

### 12. #steps-title / Inspect & deliver

- 状态：复用。
- 优先级：P1。
- 英文文件名：`quality-protective-packaging.webp`。
- 现有资源：[src/assets/images/quality-protective-packaging.webp](../../src/assets/images/quality-protective-packaging.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：四步流程之后放一张包装图，不用图片替代流程文字或制造实时订单状态。
- 英文 Alt 草案：`Separated machined parts protected in a shipping carton`。

### 13. #request-quote / RFQ 导语

- 状态：复用。
- 优先级：P2。
- 英文文件名：`contact-rfq.webp`。
- 现有资源：[src/assets/images/contact-rfq.webp](../../src/assets/images/contact-rfq.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：引用 Contact 已有图纸与 CAD 评审图；只在桌面导语空余位置使用，移动端放表单之后或不显示，不增加首屏负担。
- 英文 Alt 草案：`Generic drawing and CAD model prepared for machining review`。

## 4. 实际接入记录

2026 年 11 月 22 日，在保留三张工艺图及六张代表性零件主图的基础上补齐三个复用图位，并替换原先与铣削卡片重复的首屏背景。没有新增依赖、环境变量或修改共享表单；未重新生成、覆盖或复制原始图片。

| 图位 | 实际资源 | 展示方式 |
| --- | --- | --- |
| Hero | `src/assets/images/pages/services/services-cnc-part-families-hero.webp` | 暂用已交付的安装支架、阶梯轴和法兰轴套组合图；绝对定位背景层，`object-fit: cover` 等比铺满，响应式裁切；Alt 为 `Machined mounting brackets with a stepped shaft and flanged bushing` |
| 质量评审 | `src/assets/images/quality-critical-dimension-check.webp` | 放在导语及质量链接之后，与四项评审文字并列；完整显示千分尺与 V 形块支撑的轴件，Alt 按实际画面填写 |
| 四步流程之后 | `src/assets/images/quality-protective-packaging.webp` | 完整显示泡棉分隔包装，最大宽度 640px，不替代四步流程文字 |
| RFQ 桌面导语 | `src/assets/images/contact-rfq.webp` | 放在导语底部，实际为两人查看图纸和 CAD 模型；700px 及以下隐藏，避免推迟表单入口 |

原规划的 `cnc-machining-oem-components-hero.webp` 尚未交付，当前复用图没有 CNC 机床背景，也不视为专用 Hero 制作完成。后续交付专用图后可按第 3 节替换，不删除 Services 原图或铣削原图。

正文照片采用响应式 Astro Image、懒加载、`width: 100%`、`height: auto` 与 `object-fit: contain`，按原始比例完整显示；六张公开零件图保留既有路径与容器比例，通过 `contain` 避免裁切主体。图片约束均限定于 `.machining-page` 下的原生容器，不依赖 Image 转发页面作用域标记。

来源边界：Hero 为用户前次交付素材，其余为项目已有资源；未核验拍摄或生成信息、公开授权和企业资产归属，不据图新增加工能力、认证或客户案例声明。测试与截图验收结果见根 README。

## 5. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 制作需求与实际接入以第 4 节区分；前端测试不替代素材真实性、授权或加工能力核验。


# 机加工零件：图片需求

- 页面路径：`/machined-parts/`
- 页面 slug：`machined-parts`
- 扫描依据：[src/pages/machined-parts/index.astro](../../src/pages/machined-parts/index.astro)、[src/data/machined-parts.ts](../../src/data/machined-parts.ts)
- 编制日期：2026 年 11 月 22 日。
- 状态：配图规划。新增、替换和补充复用图位尚未制作或接入；保留项不代表已完成真实性核验。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

Hero 为 PartIllustration 线稿；六类零件已有 6 张主图与 14 张细节图，图片区比其他页充足。需要优先升级 Hero 和两处评审辅助图，而不是重复生成整个图库。

规划图位共 24 个：新增 0 个，替换 1 个，保留 20 个，复用 3 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

用全幅成品组合摄影替换 Hero 线稿，保留六类主图与细节。图库图片逐项作为独立资产保留，下表按文件明确列出；零件评审区只增加两张跨类别图。

不新增图片的区域与限制：六类零件是同一页面内锚点，不另建 mounting-brackets 等页面需求文档；不把代表性零件变成库存商品或客户案例。

## 3. 逐项图片要求

### 01. Hero / .hero-drawing

- 状态：替换。
- 优先级：P0。
- 英文文件名：`machined-parts-component-collection-hero.webp`。
- 替换对象：当前 src/components/PartIllustration.astro 的 mounting-brackets 示意；原资源不删除，其他页面仍可继续使用。
- 建议交付路径：`src/assets/images/pages/machined-parts/machined-parts-component-collection-hero.webp`（待制作后建立）。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：写实产品组合，右侧展示一件安装支架、一件带口袋定位块、一根阶梯轴、一件法兰轴套、一件螺纹转接头和一件薄壁开口壳体；整齐错位放置，均有真实厚度、孔和稳定支承，左侧低细节，不用文字分类。
- 英文 Alt 草案：`Representative brackets, blocks, shafts, sleeves, connectors and housings`。

### 02. #mounting-brackets / 主图

- 状态：保留。
- 优先级：P1。
- 英文文件名：`mounting-bracket-main.webp`。
- 现有资源：[public/images/machined-parts/mounting-bracket-main.webp](../../public/images/machined-parts/mounting-bracket-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Representative machined mounting bracket`。

### 03. #mounting-brackets / 角度

- 状态：保留。
- 优先级：P1。
- 英文文件名：`mounting-bracket-angle.webp`。
- 现有资源：[public/images/machined-parts/mounting-bracket-angle.webp](../../public/images/machined-parts/mounting-bracket-angle.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Angled view of mounting faces on a bracket`。

### 04. #mounting-brackets / 细节

- 状态：保留。
- 优先级：P1。
- 英文文件名：`mounting-bracket-detail.webp`。
- 现有资源：[public/images/machined-parts/mounting-bracket-detail.webp](../../public/images/machined-parts/mounting-bracket-detail.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Mounting-hole and edge details on a bracket`。

### 05. #machined-blocks / 主图

- 状态：保留。
- 优先级：P1。
- 英文文件名：`machined-block-main.webp`。
- 现有资源：[public/images/machined-parts/machined-block-main.webp](../../public/images/machined-parts/machined-block-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Representative machined locating block`。

### 06. #machined-blocks / 口袋

- 状态：保留。
- 优先级：P1。
- 英文文件名：`machined-block-pocket.webp`。
- 现有资源：[public/images/machined-parts/machined-block-pocket.webp](../../public/images/machined-parts/machined-block-pocket.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Pocket features on a machined block`。

### 07. #machined-blocks / 孔

- 状态：保留。
- 优先级：P1。
- 英文文件名：`machined-block-threaded-hole.webp`。
- 现有资源：[public/images/machined-parts/machined-block-threaded-hole.webp](../../public/images/machined-parts/machined-block-threaded-hole.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Threaded-hole detail on a machined block`。

### 08. #precision-shafts / 主图

- 状态：保留。
- 优先级：P1。
- 英文文件名：`precision-shaft-main.webp`。
- 现有资源：[public/images/machined-parts/precision-shaft-main.webp](../../public/images/machined-parts/precision-shaft-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Representative stepped shaft`。

### 09. #precision-shafts / 键槽螺纹

- 状态：保留。
- 优先级：P1。
- 英文文件名：`precision-shaft-keyway-threads.webp`。
- 现有资源：[public/images/machined-parts/precision-shaft-keyway-threads.webp](../../public/images/machined-parts/precision-shaft-keyway-threads.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Keyway and threaded features on a shaft`。

### 10. #precision-shafts / 细节

- 状态：保留。
- 优先级：P1。
- 英文文件名：`precision-shaft-detail.webp`。
- 现有资源：[public/images/machined-parts/precision-shaft-detail.webp](../../public/images/machined-parts/precision-shaft-detail.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Shoulder and diameter features on a shaft`。

### 11. #precision-shafts / 端部

- 状态：保留。
- 优先级：P1。
- 英文文件名：`precision-shaft-end.webp`。
- 现有资源：[public/images/machined-parts/precision-shaft-end.webp](../../public/images/machined-parts/precision-shaft-end.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`End view of a machined shaft`。

### 12. #bushings-sleeves / 主图

- 状态：保留。
- 优先级：P1。
- 英文文件名：`bushings-sleeves-main.webp`。
- 现有资源：[public/images/machined-parts/bushings-sleeves-main.webp](../../public/images/machined-parts/bushings-sleeves-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Representative bushings and sleeves`。

### 13. #bushings-sleeves / 组合

- 状态：保留。
- 优先级：P1。
- 英文文件名：`bushings-sleeves-arrangement.webp`。
- 现有资源：[public/images/machined-parts/bushings-sleeves-arrangement.webp](../../public/images/machined-parts/bushings-sleeves-arrangement.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Arrangement of machined bushings and sleeves`。

### 14. #bushings-sleeves / 剖面

- 状态：保留。
- 优先级：P1。
- 英文文件名：`bushings-sleeves-cross-section.webp`。
- 现有资源：[public/images/machined-parts/bushings-sleeves-cross-section.webp](../../public/images/machined-parts/bushings-sleeves-cross-section.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Section-view illustration of a sleeve wall and bore`。

### 15. #custom-connectors / 主图

- 状态：保留。
- 优先级：P1。
- 英文文件名：`custom-connectors-main.webp`。
- 现有资源：[public/images/machined-parts/custom-connectors-main.webp](../../public/images/machined-parts/custom-connectors-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Representative custom connector`。

### 16. #custom-connectors / 联接

- 状态：保留。
- 优先级：P1。
- 英文文件名：`custom-connectors-coupling.webp`。
- 现有资源：[public/images/machined-parts/custom-connectors-coupling.webp](../../public/images/machined-parts/custom-connectors-coupling.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Coupling features on a machined connector`。

### 17. #custom-connectors / 装配

- 状态：保留。
- 优先级：P1。
- 英文文件名：`custom-connectors-assembly.webp`。
- 现有资源：[public/images/machined-parts/custom-connectors-assembly.webp](../../public/images/machined-parts/custom-connectors-assembly.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Representative connector assembly`。

### 18. #custom-connectors / 螺纹

- 状态：保留。
- 优先级：P1。
- 英文文件名：`custom-connectors-threaded-fitting.webp`。
- 现有资源：[public/images/machined-parts/custom-connectors-threaded-fitting.webp](../../public/images/machined-parts/custom-connectors-threaded-fitting.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Threaded fitting details on a connector`。

### 19. #plates-housings / 主图

- 状态：保留。
- 优先级：P1。
- 英文文件名：`plates-housings-main.webp`。
- 现有资源：[public/images/machined-parts/plates-housings-main.webp](../../public/images/machined-parts/plates-housings-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Representative plate and housing`。

### 20. #plates-housings / 法兰

- 状态：保留。
- 优先级：P1。
- 英文文件名：`plates-housings-flange.webp`。
- 现有资源：[public/images/machined-parts/plates-housings-flange.webp](../../public/images/machined-parts/plates-housings-flange.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Flange features on a machined housing`。

### 21. #plates-housings / 角部

- 状态：保留。
- 优先级：P1。
- 英文文件名：`plates-housings-corner.webp`。
- 现有资源：[public/images/machined-parts/plates-housings-corner.webp](../../public/images/machined-parts/plates-housings-corner.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前资源；接入或替换前逐图核对视角和特征，Alt 以实际画面为准；剖面图继续作为结构示意，不能当作实物照片。
- 英文 Alt 草案：`Corner and wall features on a machined housing`。

### 22. The details that define your part / Drawing & revision

- 状态：复用。
- 优先级：P1。
- 英文文件名：`home-drawing-led-component-review.webp`。
- 共享资源：见[home.md](home.md)中的 `home-drawing-led-component-review.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用首页工件与匹配图纸评审图。
- 英文 Alt 草案：`Component beside a matching generic drawing and CAD model`。

### 23. The details that define your part / Material & inspection

- 状态：复用。
- 优先级：P1。
- 英文文件名：`quality-critical-dimension-check.webp`。
- 现有资源：[src/assets/images/quality-critical-dimension-check.webp](../../src/assets/images/quality-critical-dimension-check.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用现有测量图，展示特征检验，不展示未经确认的公差。
- 英文 Alt 草案：`Micrometer checking a shaft diameter`。

### 24. SecondaryProcessSupport

- 状态：复用。
- 优先级：P2。
- 英文文件名：`secondary-finished-housing-masking-detail.webp`。
- 共享资源：见[secondary-processes.md](secondary-processes.md)中的 `secondary-finished-housing-masking-detail.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用配套工艺壳体外观图，不额外生成同类工件。
- 英文 Alt 草案：`Housing with contrasting mating and outer surfaces`。

## 4. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 本文仅为需求，不代表已完成图片制作、审核、前端布局或图片性能验收。


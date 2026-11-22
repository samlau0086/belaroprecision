# CNC Turning：图片需求

- 页面路径：`/services/cnc-turning/`
- 页面 slug：`cnc-turning`
- 扫描依据：[src/pages/services/cnc-turning/index.astro](../../src/pages/services/cnc-turning/index.astro)、[src/components/SecondaryProcessSupport.astro](../../src/components/SecondaryProcessSupport.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：配图规划。新增、替换和补充复用图位尚未制作或接入；保留项不代表已完成真实性核验。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

Hero 有车削图、典型零件有三张主图；轴肩配合、跳动、螺纹接口以及处理后尺寸要求均只有文字。

规划图位共 10 个：新增 5 个，替换 0 个，保留 4 个，复用 1 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

保留首屏与三类零件；围绕四项评审增加三张对应近景，工艺正文补一张真实夹持关系图，表面要求补一张保护面示意。

不新增图片的区域与限制：数量与复购项不额外配图片；FAQ、三步询价和 CTA 保持简洁。

## 3. 逐项图片要求

### 01. Hero

- 状态：保留。
- 优先级：P1。
- 英文文件名：`turning-process-detail.webp`。
- 现有资源：[src/assets/images/turning-process-detail.webp](../../src/assets/images/turning-process-detail.webp)。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：保留现有阶梯轴车削图；审核车刀为车削刀而非立铣刀，卡盘、夹持长度与刀尖距离合理。
- 英文 Alt 草案：`CNC turning tool machining a stepped shaft`。

### 02. #turned-parts / Precision Shafts

- 状态：保留。
- 优先级：P1。
- 英文文件名：`precision-shaft-main.webp`。
- 现有资源：[public/images/machined-parts/precision-shaft-main.webp](../../public/images/machined-parts/precision-shaft-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有类别主图，与零件页一致。
- 英文 Alt 草案：`Representative CNC-turned stepped shaft`。

### 03. #turned-parts / Bushings & Sleeves

- 状态：保留。
- 优先级：P1。
- 英文文件名：`bushings-sleeves-main.webp`。
- 现有资源：[public/images/machined-parts/bushings-sleeves-main.webp](../../public/images/machined-parts/bushings-sleeves-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有类别主图，与零件页一致。
- 英文 Alt 草案：`Representative CNC-turned bushings and sleeves`。

### 04. #turned-parts / Custom Connectors

- 状态：保留。
- 优先级：P1。
- 英文文件名：`custom-connectors-main.webp`。
- 现有资源：[public/images/machined-parts/custom-connectors-main.webp](../../public/images/machined-parts/custom-connectors-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有类别主图，与零件页一致。
- 英文 Alt 草案：`Representative threaded connector`。

### 05. #drawing-review 前 / 加工语境

- 状态：新增。
- 优先级：P0。
- 英文文件名：`turning-shaft-shoulder-cut.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-turning/turning-shaft-shoulder-cut.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：写实数控车床内部，金属轴后端由三爪牢固夹持，前段形成两级轴径与清楚轴肩，外圆车刀从径向接近外圆与轴肩交界，少量碎屑在托盘内；不伸手、不飞火花。
- 英文 Alt 草案：`Turning tool approaching a stepped shaft shoulder`。

### 06. #drawing-review / Diameter fits & shoulders

- 状态：新增。
- 优先级：P0。
- 英文文件名：`turning-bearing-seat-shoulder-detail.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-turning/turning-bearing-seat-shoulder-detail.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：完整阶梯轴局部近景，轴承配合段细密同心车纹、端部小倒角、轴肩及退刀槽清晰，旁边配合环与该段同轴但未压紧；不是轴承合格证明。
- 英文 Alt 草案：`Bearing seat and shoulder features on a stepped shaft`。

### 07. #drawing-review / Runout & concentricity

- 状态：新增。
- 优先级：P0。
- 英文文件名：`turning-shaft-indicator-runout-setup.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-turning/turning-shaft-indicator-runout-setup.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：检验台上短阶梯轴以两端顶尖支承，杠杆指示表测头轻触配合外圆，支架和接触点可见，表盘无可读数字；图片仅为跳动检验构型，不给出合格结果。
- 英文 Alt 草案：`Dial-indicator setup for checking a shaft surface`。

### 08. #drawing-review / Threads & interfaces

- 状态：新增。
- 优先级：P0。
- 英文文件名：`turning-connector-thread-and-seat-detail.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-turning/turning-connector-thread-and-seat-detail.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：单件金属螺纹转接头三分之四微距，外螺纹连续、退刀槽、端面密封环与轴向通孔清楚；不画阀门或压力等级标记，螺纹标准不能由图像确认。
- 英文 Alt 草案：`External thread and end-face features on a machined connector`。

### 09. Material & finish / Threads and treatment

- 状态：新增。
- 优先级：P1。
- 英文文件名：`turning-sleeve-protected-functional-surfaces.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-turning/turning-sleeve-protected-functional-surfaces.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：深灰外观短套筒，内孔、端面配合环保持自然金属色，外圆缎面与边界清楚，完整展示壁厚和倒角；只作遮蔽与功能面概念，不声称具体涂层。
- 英文 Alt 草案：`Sleeve with contrasting outer and functional surfaces`。

### 10. SecondaryProcessSupport

- 状态：复用。
- 优先级：P2。
- 英文文件名：`secondary-ground-shaft-detail.webp`。
- 共享资源：见[secondary-processes.md](secondary-processes.md)中的 `secondary-ground-shaft-detail.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用 Secondary Processes 的磨削轴颈近景，不另行生成。
- 英文 Alt 草案：`Ground journal on a machined shaft`。

## 4. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 本文仅为需求，不代表已完成图片制作、审核、前端布局或图片性能验收。


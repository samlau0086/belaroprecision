# OEM 与小批量生产：图片需求

- 页面路径：`/services/production/`
- 页面 slug：`production`
- 扫描依据：[src/pages/services/production/index.astro](../../src/pages/services/production/index.astro)、[src/components/SecondaryProcessSupport.astro](../../src/components/SecondaryProcessSupport.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：配图规划。新增、替换和补充复用图位尚未制作或接入；保留项不代表已完成真实性核验。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

当前只有 Hero 批次图；图纸控制、商业范围、复购、四步生产流程、交付与包装均为文字。

规划图位共 8 个：新增 3 个，替换 0 个，保留 1 个，复用 4 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

保留 Hero，新增批次、首件比对、复购版本比对三张图；复用图纸评审与包装图。图像应围绕同一系列工件建立连续性，不把所有步骤拍成开会照片。

不新增图片的区域与限制：数量预测、报价和商业条件保持文本；不生成 ERP 看板、客户订单、库存数量或自动排产界面。

## 3. 逐项图片要求

### 01. Hero

- 状态：保留。
- 优先级：P1。
- 英文文件名：`production-oem.webp`。
- 现有资源：[src/assets/images/production-oem.webp](../../src/assets/images/production-oem.webp)。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：保留已有批次生产图，审核是否能辨认代表性工件及分隔保护。
- 英文 Alt 草案：`Organized machined components prepared for production and packing`。

### 02. A practical production model / Repeatability

- 状态：新增。
- 优先级：P0。
- 英文文件名：`production-separated-components-batch.webp`。
- 建议交付路径：`src/assets/images/pages/production/production-separated-components-batch.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：八件相同金属安装支架分隔置于中性周转托盘，前排一件完整清晰，其余朝向一致，孔、定位面与口袋一致；无库存标签和客户信息，不画流水线大规模产能。
- 英文 Alt 草案：`Small batch of identical mounting brackets in separated trays`。

### 03. Drawing control / Share the requirement

- 状态：复用。
- 优先级：P0。
- 英文文件名：`home-drawing-led-component-review.webp`。
- 共享资源：见[home.md](home.md)中的 `home-drawing-led-component-review.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用首页图纸、CAD 与工件对应图，体现按图要求，不生成另一张相似桌面照。
- 英文 Alt 草案：`Component beside a matching generic drawing and CAD model`。

### 04. #production-flow / Review feasibility

- 状态：新增。
- 优先级：P1。
- 英文文件名：`production-first-piece-comparison.webp`。
- 建议交付路径：`src/assets/images/pages/production/production-first-piece-comparison.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：一件金属支架单独放在检验台前景，后方同类少量工件分隔排放，外径千分尺与高度规静置在旁，参考图仅显示不可读线稿；这是首件核对语境，不画批准签名或合格章。
- 英文 Alt 草案：`First component beside a small batch and inspection tools`。

### 05. #production-flow / Manage repeats

- 状态：新增。
- 优先级：P1。
- 英文文件名：`production-repeat-order-revision-review.webp`。
- 建议交付路径：`src/assets/images/pages/production/production-repeat-order-revision-review.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：两件相似金属安装板并排，一件多一个明确可见安装孔，旁边两张匹配的通用轮廓草图，不印文字或尺寸；通过差异体现复购前需核对版本，而非宣称可随意替代。
- 英文 Alt 草案：`Two mounting-plate variants prepared for revision review`。

### 06. What to include / Delivery and packing

- 状态：复用。
- 优先级：P0。
- 英文文件名：`quality-protective-packaging.webp`。
- 现有资源：[src/assets/images/quality-protective-packaging.webp](../../src/assets/images/quality-protective-packaging.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用厚 EPE 泡棉与纸箱图，图中保护方式须与页面文字一致，不改成不对应的裸件堆叠。
- 英文 Alt 草案：`Machined parts individually protected with thick EPE foam`。

### 07. What to include / Quality requirements

- 状态：复用。
- 优先级：P1。
- 英文文件名：`quality-batch-identification.webp`。
- 现有资源：[src/assets/images/quality-batch-identification.webp](../../src/assets/images/quality-batch-identification.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用空白标签和包装图，表现批次信息承载位置，不伪造可追溯记录。
- 英文 Alt 草案：`Protected machined part beside a carton with a blank label`。

### 08. SecondaryProcessSupport

- 状态：复用。
- 优先级：P2。
- 英文文件名：`secondary-finished-housing-masking-detail.webp`。
- 共享资源：见[secondary-processes.md](secondary-processes.md)中的 `secondary-finished-housing-masking-detail.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用配套表面处理外观图，说明外协范围按项目确认。
- 英文 Alt 草案：`Housing with contrasting finished and masked surfaces`。

## 4. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 本文仅为需求，不代表已完成图片制作、审核、前端布局或图片性能验收。


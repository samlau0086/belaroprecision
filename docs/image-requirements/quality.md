# 质量与检验：图片需求

- 页面路径：`/quality/`
- 页面 slug：`quality`
- 扫描依据：[src/pages/quality/index.astro](../../src/pages/quality/index.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：配图规划。新增、替换和补充复用图位尚未制作或接入；保留项不代表已完成真实性核验。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

已有 Hero、2 张检验工具图、1 张样例报告、2 张包装标识图；requirements、feasibility、inspection-plan、deviations 四个主题仍为纯文字。

规划图位共 10 个：新增 3 个，替换 0 个，保留 6 个，复用 1 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

在四个缺图主题各加一张明确表达流程或检查对象的图片；保留现有报告与包装，不把所有三张文字卡片分别配图。

不新增图片的区域与限制：不新增 ISO 证书、校准证书、真实客户检验记录、虚构 FAI/PPAP、通过章或任意公差读数；有数据的文件必须经人工验证。

## 3. 逐项图片要求

### 01. Hero

- 状态：保留。
- 优先级：P1。
- 英文文件名：`quality-inspection.webp`。
- 现有资源：[src/assets/images/quality-inspection.webp](../../src/assets/images/quality-inspection.webp)。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：保留现有检验语境；若需替换应先核实仪器和使用方式，而不是生成高端实验室。
- 英文 Alt 草案：`Dimensional inspection of a machined component`。

### 02. #requirements

- 状态：复用。
- 优先级：P0。
- 英文文件名：`home-drawing-led-component-review.webp`。
- 共享资源：见[home.md](home.md)中的 `home-drawing-led-component-review.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用首页图纸与工件对应图，说明版本和关键特征需确认。
- 英文 Alt 草案：`Component with a matching generic drawing and CAD model`。

### 03. #feasibility

- 状态：新增。
- 优先级：P0。
- 英文文件名：`quality-bore-measurement-access.webp`。
- 建议交付路径：`src/assets/images/pages/quality/quality-bore-measurement-access.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：测量可达性语境，开口金属定位块放在稳定台面上，一件小型内径测量工具沿孔轴进入前方贯通孔，接触端与孔壁关系可信，工具长度合理；无读数、无承诺精度。
- 英文 Alt 草案：`Bore-measurement setup for an accessible hole in a machined block`。

### 04. #inspection / 工具

- 状态：保留。
- 优先级：P1。
- 英文文件名：`quality-inspection-tools.webp`。
- 现有资源：[src/assets/images/quality-inspection-tools.webp](../../src/assets/images/quality-inspection-tools.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留检验台图，工具类别与图中实物核对，不自动等同已核实设备清单。
- 英文 Alt 草案：`Inspection workbench with dimensional instruments and machined parts`。

### 05. #inspection / 关键尺寸

- 状态：保留。
- 优先级：P1。
- 英文文件名：`quality-critical-dimension-check.webp`。
- 现有资源：[src/assets/images/quality-critical-dimension-check.webp](../../src/assets/images/quality-critical-dimension-check.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留现有千分尺径向测量轴径图，接触面不可裁掉。
- 英文 Alt 草案：`Outside micrometer measuring a shaft diameter`。

### 06. #documents

- 状态：保留。
- 优先级：P1。
- 英文文件名：`quality-dimensional-report-sample.webp`。
- 现有资源：[src/assets/images/quality-dimensional-report-sample.webp](../../src/assets/images/quality-dimensional-report-sample.webp)。
- 展示比例：原始文档比例；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留已有明确标注为虚构数据的样例报告，不重新用 AI 生成文字和测量结果。若将来制作新样例，采用人工排版并核对 nominal、limits、result 的一致性，不能增加认证。
- 英文 Alt 草案：`Sample dimensional inspection report with fictional part data`。

### 07. #inspection-plan

- 状态：新增。
- 优先级：P0。
- 英文文件名：`quality-inspection-coverage-selection.webp`。
- 建议交付路径：`src/assets/images/pages/quality/quality-inspection-coverage-selection.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：少量相同短轴整齐放在分隔托盘中，前方一根单独放到软支承检验位，千分尺在旁；通过一件与一批的关系说明覆盖范围待约定，不显示 AQL、100% 合格或抽样统计。
- 英文 Alt 草案：`One shaft selected beside a small batch for inspection planning`。

### 08. #deviations

- 状态：新增。
- 优先级：P1。
- 英文文件名：`quality-held-parts-separate-review-tray.webp`。
- 建议交付路径：`src/assets/images/pages/quality/quality-held-parts-separate-review-tray.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：两个有明确间隔的中性托盘，一侧少量正常外观支架，另一侧单独一件支架置于待评审位置并配空白卡片；不出现红色合格章、缺陷判定值或真实不良率，不靠颜色宣称已批准。
- 英文 Alt 草案：`Machined component separated for further review`。

### 09. #packing / EPE 防护

- 状态：保留。
- 优先级：P1。
- 英文文件名：`quality-protective-packaging.webp`。
- 现有资源：[src/assets/images/quality-protective-packaging.webp](../../src/assets/images/quality-protective-packaging.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留厚白色 EPE 泡棉包裹工件和瓦楞纸箱图，不改为与正文不一致的薄膜包装。
- 英文 Alt 草案：`Machined parts protected with thick EPE foam in a carton`。

### 10. #packing / 标识

- 状态：保留。
- 优先级：P1。
- 英文文件名：`quality-batch-identification.webp`。
- 现有资源：[src/assets/images/quality-batch-identification.webp](../../src/assets/images/quality-batch-identification.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留空白标签及包装图；实际标签须以后由真实订单数据产生。
- 英文 Alt 草案：`Protected machined part beside a carton with a blank identification label`。

## 4. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 本文仅为需求，不代表已完成图片制作、审核、前端布局或图片性能验收。


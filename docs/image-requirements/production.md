# OEM 与小批量生产：图片需求

- 页面路径：`/services/production/`
- 页面 slug：`production`
- 扫描依据：[src/pages/services/production/index.astro](../../src/pages/services/production/index.astro)、[src/components/SecondaryProcessSupport.astro](../../src/components/SecondaryProcessSupport.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：初始规划的 8 个图位已接入；2026 年 11 月 24 日按页面反馈补充 3 个复用图位，当前共 11 个图位。分隔批次图同步复用于 Services 和 Industries。来源与真实性仍需确认。当前跨页状态见 [核对记录](cross-page-reuse.md)。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

初次扫描时只有 Hero 批次图；初始 8 个规划图位均已展示，本轮再为订单确认、零件资料、数量需求补齐语境配图，共展示 11 图；商业条件与订单批准仍以文字说明，不生成业务记录。

规划图位共 8 个：新增 3 个，替换 0 个，保留 1 个，复用 4 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

保留 Hero，新增批次、首件比对、复购版本比对三张图；复用图纸评审与包装图。图像应围绕同一系列工件建立连续性，不把所有步骤拍成开会照片。

配图限制：数量预测、报价和商业条件的具体内容保持文本；可复用通用工件与图纸作为语境图，不生成 ERP 看板、客户订单、库存数量或自动排产界面。

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
- 实际交付路径：`src/assets/images/pages/production/production-separated-components-batch.webp`。
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
- 实际交付路径：`src/assets/images/pages/production/production-first-piece-comparison.webp`。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：一件金属支架单独放在检验台前景，后方同类少量工件分隔排放，外径千分尺与高度规静置在旁，参考图仅显示不可读线稿；这是首件核对语境，不画批准签名或合格章。
- 英文 Alt 草案：`First component beside a small batch and inspection tools`。

### 05. #production-flow / Manage repeats

- 状态：新增。
- 优先级：P1。
- 英文文件名：`production-repeat-order-revision-review.webp`。
- 实际交付路径：`src/assets/images/pages/production/production-repeat-order-revision-review.webp`。
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
- 需求清单不等同于来源与业务真实性审核；实际接入范围见下方记录。

## 5. 实际接入记录

### 2026 年 11 月 24 日：补充图位与布局

生产模式区域随后按页面反馈调整为标题上置、下方左图右文的等宽双栏，三项原则改为带编号的纵向说明，消除旧布局左下方的大块留白。手机端按标题、完整比例批次图、三项原则排列；不增加图位或资产副本。

按用户页面反馈补齐以下三个原规划以外的复用图位，不制作或复制新资产：

| 页面位置 | 共享源文件 | 语境与限制 |
| --- | --- | --- |
| Approve the order | `src/assets/images/contact-rfq.webp` | 通用图纸与 CAD 评审，不表示真实订单批准 |
| Part documentation | `src/assets/images/pages/home/home-drawing-led-component-review.webp` | 图纸、模型与工件对应关系 |
| Quantity profile | `src/assets/images/pages/production/production-separated-components-batch.webp` | 分隔批次工件，不表示实际库存或产能 |

当前实际展示 11 图。流程桌面四列、中屏两列、手机单列；资料区标题上置，四项要求桌面两列、手机单列。同排图片框底部对齐，统一 4:3 框，图片保留自然比例完整展示，不拉伸、不裁切。初始跨页规划的统计口径不变，这三个追加图位单独记录。

本轮验证：`npm run build` 通过，生成 23 页；`node --test tests/production-images.test.mjs tests/cross-page-image-reuse.test.mjs tests/image-labels.test.mjs` 共 4 项通过。Production 覆盖 320、390、700、701、1000、1440px 列数、图框对齐和横向溢出，以及桌面和手机 11 图加载、原图比例、FAQ、链接；两处区域截图已人工复核。未部署，未执行全站测试。

2026 年 11 月 23 日，用户 `webp/` 的三张同名素材原样复制到 `src/assets/images/pages/production/`，保留源文件。分隔批次图置于生产模式区域、三项原则之后；首页图纸评审图移至 Share the requirement 步骤，首件核对图与版本比对图分别置于 Review feasibility 和 Manage repeats 步骤。批准订单不配虚构记录。桌面图文并排，手机上下排列，保留原 Hero、质量、包装及配套工艺图片，共 8 图。

新增图沿用 Astro 图片映射与 ProcessImage，响应式 WebP、自然高度、等比完整显示及懒加载。分隔批次图由 Services 的 `#production` 和 Industries 的 OEM 能力卡片复用同一源文件；不重复复制资产。未新增依赖、环境变量或表单，不修改询价路径。

实际画面：批次图为蓝色分隔托盘中的长圆孔金属支架；首件语境图为支架、千分尺、高度规与后方少量同类工件；版本图为两件折角支架及轮廓草图，右侧支架多一个前部孔。Alt 按画面描述，不据图确认材料、测量精度、首件批准、版本合规、产能或客户案例。用户提供素材，公开使用许可及真实性仍需业务负责人确认。

验证：`npm run build` 通过，生成 23 页；`node --test tests/production-images.test.mjs tests/industries.test.mjs tests/services-images.test.mjs tests/cross-page-image-reuse.test.mjs tests/image-labels.test.mjs` 的 5 项测试全部通过。Production 检查 320、390、700、701、1000、1440px 的横向溢出，以及 390px、1440px 的八图加载、原始比例、响应式资源、懒加载、流程对应位置、FAQ 和链接；截图已人工复核。未执行全站测试，未部署。


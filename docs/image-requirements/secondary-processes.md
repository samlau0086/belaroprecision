# 配套工艺：图片需求

- 页面路径：`/services/secondary-processes/`
- 页面 slug：`secondary-processes`
- 扫描依据：[src/pages/services/secondary-processes/index.astro](../../src/pages/services/secondary-processes/index.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：配图规划。新增、替换和补充复用图位尚未制作或接入；保留项不代表已完成真实性核验。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

Hero 为多种工艺综合图；Grinding、Heat Treatment、Surface Finishing 三项正文、最终状态清单和责任交接没有对应图片。

规划图位共 7 个：新增 5 个，替换 0 个，保留 1 个，复用 1 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

保留 Hero，新增三类工艺各一张，保护面一张、回件检查一张；外协协调采用一张复用包装图。不把外协示意图当作企业自有设备照片。

不新增图片的区域与限制：其他配套工艺未有确定目录，不为未确认工艺新增图片；FAQ 和 CTA 无独立图。

## 3. 逐项图片要求

### 01. Hero

- 状态：保留。
- 优先级：P1。
- 英文文件名：`secondary-processes.webp`。
- 现有资源：[src/assets/images/secondary-processes.webp](../../src/assets/images/secondary-processes.webp)。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：保留现有多工艺综合图；后续若发现拼图内工艺不准确，可用三张正文图重新组合，文字标签由网页制作。
- 英文 Alt 草案：`Examples of secondary processing for machined components`。

### 02. #grinding

- 状态：新增。
- 优先级：P0。
- 英文文件名：`secondary-ground-shaft-detail.webp`。
- 建议交付路径：`src/assets/images/pages/secondary-processes/secondary-ground-shaft-detail.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：写实工业成品近景，一根阶梯轴完整置于软质 V 形支承，轴颈呈均匀细致磨削纹理，邻接轴肩保留车削纹，磨削段和过渡清楚；不标粗糙度数值或公差。
- 英文 Alt 草案：`Ground journal and turned shoulder on a stepped shaft`。

### 03. #heat-treatment

- 状态：新增。
- 优先级：P0。
- 英文文件名：`secondary-heat-treatment-parts-tray.webp`。
- 建议交付路径：`src/assets/images/pages/secondary-processes/secondary-heat-treatment-parts-tray.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：写实热处理准备语境，少量钢制轴套与短轴间隔放置耐热金属料盘，远处封闭炉体仅作环境，常温无红热发光，工件不悬浮；不出现温度曲线、硬度结果或材料标记。
- 英文 Alt 草案：`Steel shafts and sleeves arranged in a process tray`。

### 04. #surface-finishing

- 状态：新增。
- 优先级：P0。
- 英文文件名：`secondary-finished-housing-masking-detail.webp`。
- 建议交付路径：`src/assets/images/pages/secondary-processes/secondary-finished-housing-masking-detail.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：单件金属设备壳体，外表面均匀缎面深灰外观，法兰贴合面、内孔接触环保留自然金属色，遮蔽边界整齐；浅灰背景，完整工件，不声称阳极、喷粉或特定镀种。
- 英文 Alt 草案：`Machined housing with contrasting outer and masked mating surfaces`。

### 05. RFQ checklist / Protected areas

- 状态：新增。
- 优先级：P1。
- 英文文件名：`secondary-bracket-protected-thread-and-face.webp`。
- 建议交付路径：`src/assets/images/pages/secondary-processes/secondary-bracket-protected-thread-and-face.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：写实处理前准备，一件金属支架上两处螺纹入口装有可辨的硅胶保护塞，一块平面贴合遮蔽片，剩余安装孔仍可见；不让保护塞漂浮，不画已喷涂却仍露出不合理涂料堆积。
- 英文 Alt 草案：`Protective plugs and masking on a bracket before finishing`。

### 06. RFQ checklist / Inspection & records

- 状态：新增。
- 优先级：P1。
- 英文文件名：`secondary-returned-component-inspection.webp`。
- 建议交付路径：`src/assets/images/pages/secondary-processes/secondary-returned-component-inspection.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：回件检验台，缎面外观壳体放在柔软支承上，外径千分尺测量可达的短圆柱凸台，基面和处理后外观可见；无报告、通过章或可读数值。
- 英文 Alt 草案：`Inspection setup for a finished housing boss`。

### 07. One coordinated requirement / 工艺交接

- 状态：复用。
- 优先级：P1。
- 英文文件名：`quality-batch-identification.webp`。
- 现有资源：[src/assets/images/quality-batch-identification.webp](../../src/assets/images/quality-batch-identification.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用空白批次标签与保护包装照片，不伪造供应商证明、物流线路或审核资质。
- 英文 Alt 草案：`Protected part and blank batch identification label`。

## 4. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 本文仅为需求，不代表已完成图片制作、审核、前端布局或图片性能验收。


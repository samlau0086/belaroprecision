# CNC Turning：图片需求

- 页面路径：`/services/cnc-turning/`
- 页面 slug：`cnc-turning`
- 扫描依据：[src/pages/services/cnc-turning/index.astro](../../src/pages/services/cnc-turning/index.astro)、[src/components/SecondaryProcessSupport.astro](../../src/components/SecondaryProcessSupport.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：原 10 个规划图位已接入，另补数量与复购图位，当前共 11 个图位。来源与真实性仍需确认。当前跨页状态见 [核对记录](cross-page-reuse.md)。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

Hero 有车削图、典型零件有三张主图；轴肩配合、跳动、螺纹接口以及处理后尺寸要求均只有文字。

规划图位共 10 个：新增 5 个，替换 0 个，保留 4 个，复用 1 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

保留首屏与三类零件；围绕四项评审增加三张对应近景，工艺正文补一张真实夹持关系图，表面要求补一张保护面示意。

补充调整：数量与复购项复用现有小批量包装图，与其他三项评审形成完整图文网格；FAQ、三步询价和 CTA 保持简洁。

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

## 4. 实际接入记录

- 用户交付目录：`webp/`；5 张原图均为 1448 × 1086px，已复制至 `src/assets/images/pages/cnc-turning/`，保留原始文件名和交付原图，不覆盖旧资产。
- `turning-shaft-shoulder-cut.webp`：图纸评审前的加工语境，与评审引导文字左右排列。
- `turning-bearing-seat-shoulder-detail.webp`：Diameter fits & shoulders 评审项。
- `turning-shaft-indicator-runout-setup.webp`：Runout & concentricity 评审项。
- `turning-connector-thread-and-seat-detail.webp`：Threads & interfaces 评审项。
- `turning-sleeve-protected-functional-surfaces.webp`：Material & finish 左侧，右侧保留全部要求文字。
- Hero 保留 `turning-process-detail.webp`，改为等比裁切背景，标题及按钮置于遮罩上方；3 张类别主图继续引用公共零件图库。正文均以原始比例完整显示，不拉伸、不裁切功能细节。
- 2026 年 11 月 23 日已找到正式资源并在 SecondaryProcessSupport 接入共享阶梯轴图，当前 10/10 个规划图位已展示；画面不作为磨削结果证明。
- 来源：用户提供，生成或拍摄方式、母版、公开许可与企业工程审核待确认。已做画面初检，使用中性 Alt，不凭外观确认材料、精度、涂层或企业设备资产。

## 5. 本页验收重点

### 数量与复购补充图位

- 2026 年 11 月 24 日按反馈补齐 Quantity & repeat orders，当前共 11 个图位；原规划 10 个的统计保留用于追溯。
- 直接复用 `src/assets/images/materials/stainless-steel/stainless-steel-connectors-small-batch-packing.webp`，不复制资产。
- 原图为 1448 × 1086px，与另外三项评审图保持 4:3，正文完整等比展示，不拉伸或裁切。
- Alt：`Small batch of individually foam-wrapped threaded connectors in a divided carton`。
- 图片仅说明小批量零件独立防护的语境，不证明真实订单、复购记录、库存、材质或交付能力；来源与许可审核沿用原素材记录。

### 通用验收

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 接入状态以上述记录为准；图片不能代替企业工程审核、来源许可确认或制造能力验收。


# CNC Milling：图片需求

- 页面路径：`/services/cnc-milling/`
- 页面 slug：`cnc-milling`
- 扫描依据：[src/pages/services/cnc-milling/index.astro](../../src/pages/services/cnc-milling/index.astro)、[src/components/SecondaryProcessSupport.astro](../../src/components/SecondaryProcessSupport.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：已接入。新增、替换和复用图位已按页面结构接入；图片来源、生成方式及真实性仍需企业上线前核验。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

Hero 使用一张配置对照图，典型零件有三张现成主图；三种铣削配置、四项图纸评审及材料表面要求缺乏独立图解。

规划图位共 11 个：新增 6 个，替换 1 个，保留 3 个，复用 1 个。新增素材位于 `src/assets/images/pages/services/`；Hero 已改为全幅背景展示，正文图使用 Astro `Image` 响应式输出并保持原始比例。当前共享二次工艺图复用 `secondary-processes.webp`，待后续交付更具体的磨削细节图时再替换映射。

## 2. 图文组织建议

优先为三种铣削配置各补一张清楚的装夹图；评审区用两张特征近景减少纯文字；保留三类成品图。共享二次工艺区最多复用一张图，不在每个服务页重复制作三套。

不新增图片的区域与限制：FAQ、询价步骤、CTA、材料牌号列表不加装饰图；不通过照片证明五轴联动或某个公差。

## 3. 逐项图片要求

### 01. Hero

- 状态：替换。
- 优先级：P1。
- 英文文件名：`cnc-milling-housing-setup-hero.webp`。
- 替换对象：当前 src/assets/images/milling-process-detail.webp；原资源不删除，其他页面仍可继续使用。
- 建议交付路径：`src/assets/images/pages/cnc-milling/cnc-milling-housing-setup-hero.webp`（待制作后建立）。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：写实铣削加工场景，带开口口袋及安装孔的金属设备壳体被软爪可靠夹持，竖直立铣刀靠近可达内壁，完整可见刀柄间隙、夹持区和工件，不做三幅拼贴或文字对照图。
- 英文 Alt 草案：`CNC milling setup for a pocketed equipment housing`。

### 02. #three-axis

- 状态：新增。
- 优先级：P0。
- 英文文件名：`milling-three-axis-plate-setup.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-milling/milling-three-axis-plate-setup.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：写实三轴立式加工中心内部，一块矩形安装板水平固定在虎钳软爪中，竖直立铣刀靠近上表面开口口袋，安装孔、夹紧位置与刀具退让清楚；工作台不倾斜。
- 英文 Alt 草案：`Three-axis milling setup for a mounting plate`。

### 03. #three-plus-two

- 状态：新增。
- 优先级：P0。
- 英文文件名：`milling-indexed-angled-bracket.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-milling/milling-indexed-angled-bracket.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：写实 3+2 定位装夹构型，带倾斜安装面的厚壁支架夹在已倾转并锁定的转台上，竖直钻头与该面孔轴对正，低位夹具可靠支承；不出现转台运动模糊。
- 英文 Alt 草案：`Indexed-angle drilling setup for an inclined bracket face`。

### 04. #five-axis

- 状态：新增。
- 优先级：P0。
- 英文文件名：`milling-five-axis-contoured-mount.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-milling/milling-five-axis-contoured-mount.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：写实复杂安装座加工构型，工件有连续外曲面和不同朝向安装面，低位夹具固定底面，倾斜球头刀靠近开放曲面，刀柄与转台不干涉；单一场景，不做航空叶轮。
- 英文 Alt 草案：`Five-axis tool access around a contoured mounting component`。

### 05. #milled-parts / Mounting Brackets

- 状态：保留。
- 优先级：P1。
- 英文文件名：`mounting-bracket-main.webp`。
- 现有资源：[public/images/machined-parts/mounting-bracket-main.webp](../../public/images/machined-parts/mounting-bracket-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前类别主图；不重新生成同一构型。
- 英文 Alt 草案：`Representative CNC-milled mounting bracket`。

### 06. #milled-parts / Machined Blocks

- 状态：保留。
- 优先级：P1。
- 英文文件名：`machined-block-main.webp`。
- 现有资源：[public/images/machined-parts/machined-block-main.webp](../../public/images/machined-parts/machined-block-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前类别主图；不重新生成同一构型。
- 英文 Alt 草案：`Representative CNC-milled locating block`。

### 07. #milled-parts / Plates & Housings

- 状态：保留。
- 优先级：P1。
- 英文文件名：`plates-housings-main.webp`。
- 现有资源：[public/images/machined-parts/plates-housings-main.webp](../../public/images/machined-parts/plates-housings-main.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前类别主图；不重新生成同一构型。
- 英文 Alt 草案：`Representative CNC-milled equipment housing`。

### 08. #drawing-review / Geometry & tool access

- 状态：新增。
- 优先级：P0。
- 英文文件名：`milling-pocket-corner-and-wall-detail.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-milling/milling-pocket-corner-and-wall-detail.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：单件开口铣削壳体近景，口袋内角具有合理刀具圆角，一侧薄壁厚度真实，两个不同深度的开放台阶清楚；浅灰背景，斜上方视角，不画封闭不可达内腔或尺寸标注。
- 英文 Alt 草案：`Pocket corner radii and wall features on a milled housing`。

### 09. #drawing-review / Datums & critical dimensions

- 状态：新增。
- 优先级：P1。
- 英文文件名：`milling-bracket-datum-and-hole-check.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-milling/milling-bracket-datum-and-hole-check.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：检验台上 L 形支架底面稳定贴在平板支承上，高度规测头接近上方定位面，安装孔与基面同时可见；测头不是穿过工件，不显示数值和通过标记。
- 英文 Alt 草案：`Height-gauge setup for a bracket locating face`。

### 10. Material & finish / Functional surfaces

- 状态：新增。
- 优先级：P1。
- 英文文件名：`milling-housing-masked-mating-face.webp`。
- 建议交付路径：`src/assets/images/pages/cnc-milling/milling-housing-masked-mating-face.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：单件缎面深灰外观设备壳体，法兰贴合面和一处接触环保留自然金属色，遮蔽边界整齐，孔和配合面不被厚膜填平；仅外观概念，不标记处理体系。
- 英文 Alt 草案：`Equipment housing with contrasting mating and outer surfaces`。

### 11. SecondaryProcessSupport

- 状态：复用。
- 优先级：P2。
- 英文文件名：`secondary-ground-shaft-detail.webp`。
- 共享资源：见[secondary-processes.md](secondary-processes.md)中的 `secondary-ground-shaft-detail.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：共享二次工艺区复用已规划的磨削成品细节，按需展示一张即可。
- 英文 Alt 草案：`Ground surface on a machined shaft`。

## 4. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 本次已完成前端接入和构建验证；图片内容、来源许可、设备归属及工艺真实性仍需企业确认，且不代表已验证实际能力或性能。


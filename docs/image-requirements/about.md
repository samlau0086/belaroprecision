# 关于 Belaro：图片需求

- 页面路径：`/about/`
- 页面 slug：`about`
- 扫描依据：[src/pages/about/index.astro](../../src/pages/about/index.astro)、[src/components/SecondaryProcessSupport.astro](../../src/components/SecondaryProcessSupport.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：原规划 11 个图位；2026 年 11 月 28 日按用户要求移除制造范围下方的 07 装夹图位，当前展示 10 张图片，区域供应商网络共享壳体图已补齐。来源与真实性仍需确认。当前跨页状态见 [核对记录](cross-page-reuse.md)。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

workshop-team 已有车间总览、三轴、五轴、车床、团队共 5 张图；Hero 为企业概况文字卡；业务定位、制造范围、外协交接与质量说明仍以文字为主。

规划图位共 11 个：新增 2 个，替换 0 个，保留 5 个，复用 4 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

Hero 优先采集并核实企业现场全幅照片；保留企业概况文本。将现有五张图纳入实拍核验清单；增加三轴定位装夹图，其他正文复用工艺、交接与测量图，不生成第二套假团队或假厂房。

不新增图片的区域与限制：公司名称、地址、设备型号、工作范围和联系人继续使用文本；不生成营业执照、设备铭牌、客户合影或合作品牌墙。

## 3. 逐项图片要求

### 01. Hero

- 状态：新增。
- 优先级：P0。
- 英文文件名：`about-verified-workshop-hero.webp`。
- 建议交付路径：`src/assets/images/pages/about/about-verified-workshop-hero.webp`（待制作后建立）。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：仅真实拍摄：由企业确认可公开的当前车间通道和封闭机床，工位整洁但不刻意扩建空间，右侧设备与局部工件清楚，左侧可叠字。拍摄前确认地点、拍摄日期、公开许可；如无法提供，不用 AI 厂房替代，暂用已有并经核实的车间图。
- 英文 Alt 草案：`Verified workshop view with enclosed CNC machines`。

### 02. #workshop-team / 车间总览

- 状态：保留。
- 优先级：P0。
- 英文文件名：`about-workshop-overview.webp`。
- 现有资源：[src/assets/images/about-workshop-overview.webp](../../src/assets/images/about-workshop-overview.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：当前页面已接入。保留但必须核实来源、设备或人物真实性和公开许可；不能因为存在文件就将其当作自有资产证明。真实性未确认时仅作场景示意，需真实证明时必须改用实拍，不以 AI 生成替换。
- 英文 Alt 草案：`Workshop aisle with enclosed CNC machines`。

### 03. #workshop-team / 三轴设备

- 状态：保留。
- 优先级：P0。
- 英文文件名：`about-3-axis-cnc.webp`。
- 现有资源：[src/assets/images/about-3-axis-cnc.webp](../../src/assets/images/about-3-axis-cnc.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：当前页面已接入。保留但必须核实来源、设备或人物真实性和公开许可；不能因为存在文件就将其当作自有资产证明。真实性未确认时仅作场景示意，需真实证明时必须改用实拍，不以 AI 生成替换。
- 英文 Alt 草案：`Vertical milling setup with a vise and workpiece`。

### 04. #workshop-team / 五轴装夹

- 状态：2026 年 11 月 28 日按用户要求恢复原五轴图片，保持图库比例一致。
- 优先级：P0。
- 英文文件名：`about-simultaneous-5-axis-cnc.webp`。
- 当前资源：[src/assets/images/about-simultaneous-5-axis-cnc.webp](../../src/assets/images/about-simultaneous-5-axis-cnc.webp)，随代码纳入 Git。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：当前页面已接入。保留但必须核实来源、设备或人物真实性和公开许可；不能因为存在文件就将其当作自有资产证明。真实性未确认时仅作场景示意，需真实证明时必须改用实拍，不以 AI 生成替换。
- 英文 Alt 草案：`Tilted rotary-table machining setup`。

### 05. #workshop-team / 数控车床

- 状态：保留。
- 优先级：P0。
- 英文文件名：`about-cnc-lathe.webp`。
- 现有资源：[src/assets/images/about-cnc-lathe.webp](../../src/assets/images/about-cnc-lathe.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：当前页面已接入。保留但必须核实来源、设备或人物真实性和公开许可；不能因为存在文件就将其当作自有资产证明。真实性未确认时仅作场景示意，需真实证明时必须改用实拍，不以 AI 生成替换。
- 英文 Alt 草案：`Lathe chuck and turret beside a shaft`。

### 06. #workshop-team / 技术协作

- 状态：保留。
- 优先级：P0。
- 英文文件名：`about-team-at-work.webp`。
- 现有资源：[src/assets/images/about-team-at-work.webp](../../src/assets/images/about-team-at-work.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：当前页面已接入。保留但必须核实来源、设备或人物真实性和公开许可；不能因为存在文件就将其当作自有资产证明。真实性未确认时仅作场景示意，需真实证明时必须改用实拍，不以 AI 生成替换。
- 英文 Alt 草案：`Technical review of a component at a workbench`。

### 07. #manufacturing-scope / 3+2

- 状态：已于 2026 年 11 月 28 日按用户要求移除展示；原图文件保留，以下为历史规划。
- 优先级：P1。
- 英文文件名：`about-indexed-milling-fixture.webp`。
- 建议交付路径：`src/assets/images/pages/about/about-indexed-milling-fixture.webp`（待制作后建立）。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：优先真实拍摄现有 3+2 定位装夹；若仅作工艺示意，可生成一件厚壁斜面支架在锁定倾转台上的固定角度装夹，竖直刀具对准开放面，支承和避让合理；不得借此宣称具体设备型号或实际加工现场。
- 英文 Alt 草案：`Indexed-angle workholding setup for a bracket`。

### 08. #our-approach / 图纸与工件

- 状态：复用。
- 优先级：P1。
- 英文文件名：`home-drawing-led-component-review.webp`。
- 共享资源：见[home.md](home.md)中的 `home-drawing-led-component-review.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用按图评审图；如需表现真实员工，则应另行取得真实拍摄与肖像许可，不改造为虚构团队合照。
- 英文 Alt 草案：`Machined component beside a matching generic drawing`。

### 09. #supplier-coordination / 交接

- 状态：复用。
- 优先级：P1。
- 英文文件名：`quality-batch-identification.webp`。
- 现有资源：[src/assets/images/quality-batch-identification.webp](../../src/assets/images/quality-batch-identification.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用空白标签与保护包装图，配合范围、交接、回件检查、偏差处理四步。
- 英文 Alt 草案：`Protected part and carton prepared for identification`。

### 10. Quality & technical alignment

- 状态：复用。
- 优先级：P1。
- 英文文件名：`quality-critical-dimension-check.webp`。
- 现有资源：[src/assets/images/quality-critical-dimension-check.webp](../../src/assets/images/quality-critical-dimension-check.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用检验台测量图，避免再制作无可核实设备资产的实验室照。
- 英文 Alt 草案：`Micrometer checking a shaft diameter`。

### 11. SecondaryProcessSupport

- 状态：复用。
- 优先级：P2。
- 英文文件名：`secondary-finished-housing-masking-detail.webp`。
- 共享资源：见[secondary-processes.md](secondary-processes.md)中的 `secondary-finished-housing-masking-detail.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用外协配套工艺示意，不展示虚构供应商工厂、资质或地理线路。
- 英文 Alt 草案：`Housing with contrasting finished and mating surfaces`。

## 4. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 图片接入与页面验证记录见下节；前端验收不替代来源、真实性及公开许可审核。

## 5. 本次接入记录（2026 年 11 月 22 日）

| 图位 | 实际资源与页面位置 |
|---|---|
| 01 | `About/about-verified-workshop-hero.webp` 复制到 `src/assets/images/pages/about/` 同名文件，作为全幅 Hero 背景；企业概况保留并移到 Hero 下方 |
| 02–06 | 保留原有车间、设备、协作五张图，正文按原始比例完整显示 |
| 07 | `About/about-indexed-milling-fixture.webp` 复制到 `src/assets/images/pages/about/` 同名文件，放在制造范围双栏之后 |
| 08 | 直接导入首页 `src/assets/images/pages/home/home-drawing-led-component-review.webp`，放在 `#our-approach` 图纸评审内容旁 |
| 09 | 复用 `src/assets/images/quality-batch-identification.webp`，放在外协交接四步之后 |
| 10 | 复用 `src/assets/images/quality-critical-dimension-check.webp`，放在质量说明与质量页入口之后 |
| 11 | `secondary-finished-housing-masking-detail.webp` 尚不存在，保持配套工艺正文，不用其他图片冒充 |

两张新增图分别为 1672 × 941px、1448 × 1086px，原交付文件保留在 `About/`。Hero 使用 `object-fit: cover` 等比裁切铺满，正文使用自动高度与 `object-fit: contain`，避免拉伸。新增图使用 Astro Image 输出响应式 WebP，Hero 优先加载，正文懒加载；Alt 按实际画面描述。

来源记录：新增图片由用户提供，本轮没有收到拍摄地点、日期、公开许可或真实性审核凭证。`verified` 文件名不构成实拍核验；图片不证明自有设备、现场身份、3+2 或联动五轴能力。原有及跨页复用素材沿用既有来源状态，仍需企业确认。

验证记录：生产构建生成 21 页；About、公共导航、全站字号三项浏览器测试通过。About 专项覆盖 320–2558px 的 11 种宽度、10 张图片解码和等比显示、Hero 背景铺满、概况区样式、链接及无脚本行为；390px、1440px 全页与首屏截图已复核。现有本地开发服务的同一专项测试通过，未部署。


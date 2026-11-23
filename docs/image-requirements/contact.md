# 联系与询价：图片需求

- 页面路径：`/contact/`
- 页面 slug：`contact`
- 扫描依据：[src/pages/contact/index.astro](../../src/pages/contact/index.astro)、[src/components/RfqForm.astro](../../src/components/RfqForm.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：已按可选规则复核；现有 RFQ 配图足够，本轮不重复添加首页审查图。 来源与真实性仍需确认。当前跨页状态见 [核对记录](cross-page-reuse.md)。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

Hero 为紧凑文字区，左侧联系信息下方已有 contact-rfq 图片，右侧为完整询价表单。此页不是优先增加大量照片的内容页。

规划图位共 2 个：新增 0 个，替换 0 个，保留 1 个，复用 1 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

保留一张评审图；可在表单后的准备资料区增加一张工件与通用图纸对应图，默认不新增 Hero 大图。首屏必须尽快出现表单和上传入口。

不新增图片的区域与限制：不生成虚构 RFQ 页面、成功提交截图、报价单、NDA 签署页、团队头像、地址地图或 WhatsApp 二维码。真实二维码和地图需验证目标与位置，本轮不制作。

## 3. 逐项图片要求

### 01. .rfq-intro / .rfq-image

- 状态：保留。
- 优先级：P0。
- 英文文件名：`contact-rfq.webp`。
- 现有资源：[src/assets/images/contact-rfq.webp](../../src/assets/images/contact-rfq.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前技术与商业评审图片，核对 CAD、图纸与工件的一致性，不展示客户文件或含个人数据的屏幕。
- 英文 Alt 草案：`Generic machining drawing and CAD model prepared for review`。

### 02. What to prepare / 表单之后的可选补充

- 状态：复用。
- 优先级：P2。
- 英文文件名：`home-drawing-led-component-review.webp`。
- 共享资源：见[home.md](home.md)中的 `home-drawing-led-component-review.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：只在现有图无法说明资料准备时复用首页图；与 contact-rfq 功能重复时不接入，宁可保持单图。移动端不得插在提交按钮、同意项或上传字段之间。
- 英文 Alt 草案：`Machined component with a matching generic drawing and CAD model`。

## 4. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 本文仅为需求，不代表已完成图片制作、审核、前端布局或图片性能验收。


# 非材料页面图片需求总索引

## 1. 范围与状态

2026 年 11 月 22 日按当前 Astro 页面源码、共享图片映射和零件图库扫描。覆盖全部 15 个非材料页面，不包含六个材料页面；材料页原需求文档和图片均不修改。首页无末级 slug，文件约定为 `home.md`；嵌套服务页采用末级 slug 命名，目前没有重名。

共规划 133 个图位：新增 31 个、替换 3 个、保留 64 个、复用 35 个。唯一待制作任务为 **34 项（31 项新增、3 项替换）**。图位含现有资源和跨页共享位置，不等于需要生成 133 张图片。三个政策页均已审查，建议新增 0 张。公共 Logo、导航图标等非业务图片不重复列出。

初次规划仅交付需求文档，不生成、移动、删除或接入图片，不改页面代码。位置包含现有位置和建议新增位置；最终布局需在接入任务中验证。

2026 年 11 月 23 日跨页复用核对：35 个规划复用图位中，34 个已落地、1 个 Contact 可选图按规则不重复添加。初次在 9 个页面补齐或替换 19 处，Production 三张新增图交付后再补齐 Services 与 Industries 的 2 处批次图，不重复复制共享资产。原始制作清单保留历史规划口径，不代表全部尚未交付；当前状态见 [跨页复用核对记录](cross-page-reuse.md)。

## 2. 按页面查阅

| 页面 | 路径 | 需求文件 | 规划图位 | 新增 | 替换 | 保留 | 复用 |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| 首页 | `/` | [home.md](home.md) | 19 | 1 | 0 | 8 | 10 |
| 加工能力总览 | `/services/` | [services.md](services.md) | 5 | 1 | 0 | 2 | 2 |
| CNC 综合加工 | `/services/cnc-machining/` | [cnc-machining.md](cnc-machining.md) | 13 | 0 | 1 | 9 | 3 |
| CNC Milling | `/services/cnc-milling/` | [cnc-milling.md](cnc-milling.md) | 11 | 6 | 1 | 3 | 1 |
| CNC Turning | `/services/cnc-turning/` | [cnc-turning.md](cnc-turning.md) | 10 | 5 | 0 | 4 | 1 |
| OEM 与小批量生产 | `/services/production/` | [production.md](production.md) | 8 | 3 | 0 | 1 | 4 |
| 配套工艺 | `/services/secondary-processes/` | [secondary-processes.md](secondary-processes.md) | 7 | 5 | 0 | 1 | 1 |
| 机加工零件 | `/machined-parts/` | [machined-parts.md](machined-parts.md) | 24 | 0 | 1 | 20 | 3 |
| 应用行业 | `/industries/` | [industries.md](industries.md) | 13 | 5 | 0 | 4 | 4 |
| 质量与检验 | `/quality/` | [quality.md](quality.md) | 10 | 3 | 0 | 6 | 1 |
| 关于 Belaro | `/about/` | [about.md](about.md) | 11 | 2 | 0 | 5 | 4 |
| 联系与询价 | `/contact/` | [contact.md](contact.md) | 2 | 0 | 0 | 1 | 1 |
| 隐私政策 | `/privacy-policy/` | [privacy-policy.md](privacy-policy.md) | 0 | 0 | 0 | 0 | 0 |
| Cookie 政策 | `/cookie-policy/` | [cookie-policy.md](cookie-policy.md) | 0 | 0 | 0 | 0 | 0 |
| 使用条款 | `/terms-of-use/` | [terms-of-use.md](terms-of-use.md) | 0 | 0 | 0 | 0 | 0 |

材料页继续使用本目录已有的 `aluminum-cnc-machining.md`、`stainless-steel-cnc-machining.md`、`brass-cnc-machining.md`、`carbon-alloy-steel-cnc-machining.md`、`titanium-cnc-machining.md`、`engineering-plastics-cnc-machining.md`，不并入本轮统计。

## 3. 唯一制作清单

按主文档制作以下文件，复用页不另行生成。P0 为优先补足关键内容，P1 为第二批补充，P2 为可选；优先级用于制作排序，不表示已审核。About 真实现场图需企业先提供并授权，不能因优先级高而使用虚构现场替代。

| 序号 | 主文档 | 状态 | 优先级 | 待交付文件 |
| ---: | --- | --- | --- | --- |
| 1 | [home.md](home.md) | 新增 | P0 | `home-drawing-led-component-review.webp` |
| 2 | [services.md](services.md) | 新增 | P0 | `services-cnc-part-families-hero.webp` |
| 3 | [cnc-machining.md](cnc-machining.md) | 替换 | P0 | `cnc-machining-oem-components-hero.webp` |
| 4 | [cnc-milling.md](cnc-milling.md) | 替换 | P1 | `cnc-milling-housing-setup-hero.webp` |
| 5 | [cnc-milling.md](cnc-milling.md) | 新增 | P0 | `milling-three-axis-plate-setup.webp` |
| 6 | [cnc-milling.md](cnc-milling.md) | 新增 | P0 | `milling-indexed-angled-bracket.webp` |
| 7 | [cnc-milling.md](cnc-milling.md) | 新增 | P0 | `milling-five-axis-contoured-mount.webp` |
| 8 | [cnc-milling.md](cnc-milling.md) | 新增 | P0 | `milling-pocket-corner-and-wall-detail.webp` |
| 9 | [cnc-milling.md](cnc-milling.md) | 新增 | P1 | `milling-bracket-datum-and-hole-check.webp` |
| 10 | [cnc-milling.md](cnc-milling.md) | 新增 | P1 | `milling-housing-masked-mating-face.webp` |
| 11 | [cnc-turning.md](cnc-turning.md) | 新增 | P0 | `turning-shaft-shoulder-cut.webp` |
| 12 | [cnc-turning.md](cnc-turning.md) | 新增 | P0 | `turning-bearing-seat-shoulder-detail.webp` |
| 13 | [cnc-turning.md](cnc-turning.md) | 新增 | P0 | `turning-shaft-indicator-runout-setup.webp` |
| 14 | [cnc-turning.md](cnc-turning.md) | 新增 | P0 | `turning-connector-thread-and-seat-detail.webp` |
| 15 | [cnc-turning.md](cnc-turning.md) | 新增 | P1 | `turning-sleeve-protected-functional-surfaces.webp` |
| 16 | [production.md](production.md) | 新增 | P0 | `production-separated-components-batch.webp` |
| 17 | [production.md](production.md) | 新增 | P1 | `production-first-piece-comparison.webp` |
| 18 | [production.md](production.md) | 新增 | P1 | `production-repeat-order-revision-review.webp` |
| 19 | [secondary-processes.md](secondary-processes.md) | 新增 | P0 | `secondary-ground-shaft-detail.webp` |
| 20 | [secondary-processes.md](secondary-processes.md) | 新增 | P0 | `secondary-heat-treatment-parts-tray.webp` |
| 21 | [secondary-processes.md](secondary-processes.md) | 新增 | P0 | `secondary-finished-housing-masking-detail.webp` |
| 22 | [secondary-processes.md](secondary-processes.md) | 新增 | P1 | `secondary-bracket-protected-thread-and-face.webp` |
| 23 | [secondary-processes.md](secondary-processes.md) | 新增 | P1 | `secondary-returned-component-inspection.webp` |
| 24 | [machined-parts.md](machined-parts.md) | 替换 | P0 | `machined-parts-component-collection-hero.webp` |
| 25 | [industries.md](industries.md) | 新增 | P0 | `industries-oem-fixture-assembly-hero.webp` |
| 26 | [industries.md](industries.md) | 新增 | P0 | `industries-automation-locating-interface.webp` |
| 27 | [industries.md](industries.md) | 新增 | P0 | `industries-machinery-shaft-sleeve-interface.webp` |
| 28 | [industries.md](industries.md) | 新增 | P0 | `industries-fluid-port-sealing-face.webp` |
| 29 | [industries.md](industries.md) | 新增 | P1 | `industries-test-equipment-sensor-bracket.webp` |
| 30 | [quality.md](quality.md) | 新增 | P0 | `quality-bore-measurement-access.webp` |
| 31 | [quality.md](quality.md) | 新增 | P0 | `quality-inspection-coverage-selection.webp` |
| 32 | [quality.md](quality.md) | 新增 | P1 | `quality-held-parts-separate-review-tray.webp` |
| 33 | [about.md](about.md) | 新增 | P0 | `about-verified-workshop-hero.webp` |
| 34 | [about.md](about.md) | 新增 | P1 | `about-indexed-milling-fixture.webp` |

跨页复用不复制文件：例如首页的三轴、3+2、五轴图分别引用 CNC Milling 的三项主资产；工艺支持区域可共用 Secondary Processes 图。制作排期按主资产优先级执行，页面图位优先级仅控制接入顺序。

## 4. 交付规格

- Hero 建议母版 2400 × 1350px、16:9；正文建议 1600 × 1200px、4:3。已存在资源、检验报告和文档截图保留原始比例，不能为统一尺寸强行拉伸或裁剪关键内容。
- 输出 WebP，保留高质量母版。Hero 建议不超过 400KB、正文建议不超过 250KB；这是优化目标，不以损失螺纹、孔口、测头等细节为代价。
- 新资产建议放入 `src/assets/images/pages/<主文档slug>/`。这些目录尚未建立，文档中的路径是未来交付目标，不是现有资源。英文小写连字符文件名以逐页清单为准。
- 旧图片不移动、不覆盖；替换图使用新文件名，以免影响其他复用页面。共享新图由主文档管理，其他页面只引用。
- 工件图使用中性浅灰背景、柔和工业光线和可信的金属纹理；优先完整三分之四视角、明确功能面和真实厚度。避免同一页每张都使用相同构图。
- Hero 主体偏右，左侧低细节供文字叠加；手机裁切仍应保留主体。不要将关键接口放在最外侧。正文图片应可直接辨认工件，不依赖过暗背景或过度景深。
- 不把标题、参数、尺寸、材料牌号、CTA 或说明文字烘焙进图片；需要标签时由页面以可检索文本呈现。

## 5. 真实性、来源与负面提示

- 企业厂房、人员、设备资产、检测能力与认证类证据优先使用已核验实拍。记录拍摄地点、日期、授权及审核人。现有 About 五张图片也需核验，不能仅因已在站内使用就认定为真实企业现场。
- AI 适合通用工件、装夹、工艺或应用示意，不能作为本企业自有设备、实际产线、客户项目或合格产品的证明。静态图片不能证明同时五轴联动、特定公差、粗糙度、硬度、产能或交期。
- 材料与表面处理外观不能证明牌号、钝化、热处理、涂层体系及性能；需要企业和项目条件确认。未确认时使用中性描述，不新增承诺。
- 通用负面提示：畸形螺纹、断裂孔壁、不可达封闭腔、刀具穿透工件、悬浮夹具、干涉刀柄、测头未接触、错误测量方向、徒手伸入加工区、夸张火花、虚构机械结构、客户品牌、水印、证书、合格章、可读检验数值、客户图纸和订单信息。
- 工程师需复核装夹、切削、基准和测量关系；AI 草图或摄影外观不能代替工艺评审。生成图未通过结构审核时不应接入。
- 保留每张图片来源（AI／实拍／授权图库）、母版、生成提示词或拍摄信息、使用许可、审核结论及最终映射。遵循现有站点做法，将来源记录在内部文档，不在本轮擅自新增页面可见 AI 标注。
- 不采集或展示客户保密工件、可识别人员、设备序列号或受限场所；公开前检查授权、个人信息及图像元数据。

## 6. 后续接入与验收

1. 按唯一清单制作与审核，先完成可跨页复用的 P0 图，再补 P1；Contact 可选 P2 图不影响表单使用，政策页不加装饰图。
2. 在主文档记录实际交付路径、来源、审核状态及与原提示词的偏差；修正其他引用页的文件映射和 Alt。
3. 沿用现有 Astro Image、ProcessImage 和 MediaGallery 等项目机制，按布局选择，不新增图片框架。首屏按需优先，正文懒加载，设置尺寸、响应式来源和适当 sizes。
4. 核验桌面／手机真实裁切、文本对比度、布局稳定性、图片解码和表单可达性。文字说明仍保留，不把纯文字长页改成无语义图片墙。
5. 接入后再执行构建、相关页面测试与截图检查。本轮仅文档检查，不声称上述前端验收已完成。


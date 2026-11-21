# Engineering Plastics CNC Machining 配图需求

## 范围与使用方法

- 页面：`/materials/engineering-plastics-cnc-machining/`；依据 `src/data/material-pages.ts` 当前内容，共 16 个图位，全部待生成、待审核、待接入。本次仅交付图片需求。
- 建议资源目录：`src/assets/images/materials/engineering-plastics/`，尚未创建。每项“提示词 + 统一规则 + 负面要求”组成完整生图输入；Alt 接入时按实际画面复核。
- POM、PA、PEEK、PTFE、ABS、PC、PMMA 在下文仅为不同工件的设计方向，不表示可互换、现货或已经完成选材。颜色与照片不能验证聚合物配方、填料、厂家牌号或合规性。
- 图像为 AI 示意，不是实拍客户工件、性能证明或设备资产；上线须明确 AI 示意。不能由图像宣称食品接触、医疗、阻燃、电气或光学认证。

## 统一规则

- 产品图采用中性浅灰背景、柔和侧光、三分之四机位，主体完整占约 75%。材质具有真实聚合物的低光泽、轻微刀纹与柔和反射，不做金属镀层或廉价注塑玩具质感。
- Hero：16:9、2400×1350px，右侧主体、左侧低细节区域便于叠字，手机裁切保留工件；其余 4:3、1600×1200px。交付 WebP，建议普通图不超过 250 KB、Hero 不超过 400 KB，避免压缩丢失毛边与表面差别。
- 加工图采用宽面、低位、非损伤夹持，足够支承但不夸张挤压；刀具与可达特征匹配，避免薄壁变形。切削液与冷却方式按材料和工艺确认，示意不统一画浸泡冷却。不用画面保证尺寸稳定或精度。
- 负面要求：材料样块、彩色色板、注塑分型线、顶针印、3D 打印层纹、金属高光、橡胶软塌、熔化拉丝、任意透明、刀锋薄壁、随机孔、夹具压扁工件、刀具穿透、手伸入机内、火花、品牌、文字、水印、证书、合格数值、过曝和重度虚化。
- 优先生成 Hero、三类典型零件和五类工艺图；其次能力、两类质检、表面验收与订单图。五轴单帧只展示刀具可达构型，不证明同时联动。

## Hero — 工程塑料 OEM 工件

- 文件名：`engineering-plastics-cnc-machining-oem-components-hero.webp`。
- AI 生图提示词：写实工业产品摄影，右侧展示一件黑色 POM 法兰衬套、一件自然乳白色 PA 导向件和一件米灰色 PEEK 小型夹具座，分别有同轴通孔、开放导向槽和定位凹腔，结构用于设备装配，非金属柔和反光及细微刀纹；干净工作台，中性背景，左侧低细节留白，16:9。颜色仅为视觉示例，无牌号标签、无透明性能或合规暗示。
- 英文 Alt：`AI illustration of CNC-machined polymer bushings, a guide and a fixture component`。

## 01 — Engineering Plastics Machining Capabilities

- 文件名：`peek-cnc-fixture-body-machined-features.webp`。
- AI 生图提示词：单件米灰色未填充 PEEK 外观的工业定位夹具座，开放圆角定位腔、两处沉孔、侧面安装槽，合理厚度与轻微铣纹，低光泽聚合物表面；浅灰背景，写实三分之四俯视，4:3。不是材料块，不画碳纤维纹或金属表面，不暗示高温承载合格。
- 英文 Alt：`AI illustration of a polymer fixture body with milled pockets and mounting features`。

## 02 — Engineering Plastics Grades

不新增颜色对应牌号的样块图。保留 POM/PA、PEEK/PTFE、ABS/PC/PMMA 的文字说明；实际厂家牌号、填料、颜色与状态通过采购文件确认。以下提示词中的配色不是材料鉴定依据。

## 03.1 — Bushings, Sleeves & Spacers

- 文件名：`pom-cnc-flanged-bushing.webp`。
- AI 生图提示词：单件黑色 POM 外观的法兰衬套，短筒主体、贯通内孔、端部法兰、均匀合理壁厚和小倒角，细微车纹与低光泽塑料反射，侧放可见内孔；浅灰背景，写实三分之四视角，4:3。无金属滚珠、无橡胶弯曲、无注塑分型线。
- 英文 Alt：`AI illustration of a black machined polymer flanged bushing`。

## 03.2 — Guides, Wear Pads & Fixtures

- 文件名：`pa-cnc-slotted-equipment-guide.webp`。
- AI 生图提示词：单件乳白色 PA 外观的设备导向条，厚实长条轮廓、贯通 U 形导向槽、两处沉孔和端部定位台阶，槽内轻微铣纹、内角合理，表面哑光非金属；浅灰背景，写实三分之四俯视，4:3。无金属嵌条、无易变形薄壁、不用磨损前后对比宣称寿命。
- 英文 Alt：`AI illustration of a machined polymer equipment guide with a mounting slot`。

## 03.3 — Housings, Covers & Machined Blocks

- 文件名：`abs-cnc-instrument-housing.webp`。
- AI 生图提示词：单件深灰色 ABS 外观的 CNC 仪器壳体，开放浅内腔、合理均匀壁厚、四角盖板安装孔及侧面线缆接口开口，轻微加工纹与柔和塑料反光；浅灰背景，写实三分之四视角，4:3。无注塑顶针印或卡扣细节堆积，不做透明壳体、无电气认证符号。
- 英文 Alt：`AI illustration of a CNC-machined polymer instrument housing with an open cavity`。

## 04.1 — CNC Milling / 3-Axis

- 文件名：`pom-three-axis-milling-guide-slot.webp`。
- AI 生图提示词：写实三轴机内场景，黑色 POM 外观的导向件在宽面软爪上水平夹持、底部充分支承，竖直铣刀接近上方开放槽，少量干净塑料切屑位于旁边，刀柄与夹具分离，工件不受挤压变形；4:3。无金属火花、无熔化拉丝、无回转台运动。
- 英文 Alt：`AI illustration of three-axis milling a slot in a supported polymer guide`。

## 04.2 — CNC Turning

- 文件名：`ptfe-cnc-turning-sleeve.webp`。
- AI 生图提示词：写实车床近景，白色 PTFE 外观的短套筒后部由宽面软爪均匀支承，短悬伸，车刀在前端外径处，内孔同轴且壁厚合理，白色低光泽塑料表面与少量浅色切屑可辨；4:3。无卡爪深咬印、不把柔性材料画成金属镜面，无默认冷却液浸泡。
- 英文 Alt：`AI illustration of a CNC turning setup for a short white polymer sleeve`。

## 04.3 — 3+2-Axis Milling

- 文件名：`pc-indexed-milling-angled-equipment-cover.webp`。
- AI 生图提示词：写实固定角度加工构型，一件不透明灰色 PC 外观的设备护盖，厚实安装边夹在已倾转锁定的回转夹具上，斜侧接口面朝向竖直钻具，宽面支承、不挤压外壁，刀柄间隙明确；4:3。无透明光学展示、无旋转运动模糊，仅表现固定角度定位。
- 英文 Alt：`AI illustration of an indexed-angle machining setup for a polymer equipment cover`。

## 04.4 — Simultaneous 5-Axis

- 文件名：`peek-five-axis-contoured-fixture.webp`。
- AI 生图提示词：写实五轴刀具可达构型示意，米灰色 PEEK 外观的定制夹具零件有连续弧形接触外面和开放定位腔，厚底座固定在低位宽面夹具上，倾斜刀轴球头刀接近外侧弧面，回转台和刀柄有合理间隙；4:3。无超薄叶轮、无金属质感、不暗示已验证同时联动或高温性能。
- 英文 Alt：`AI illustration of five-axis tool access for a contoured polymer fixture`。

## 04.5 — Stock Removal & Conditioning

- 文件名：`pa-rough-machined-guide-resting-support.webp`。
- AI 生图提示词：写实工序间语境图，一件乳白色 PA 外观的粗加工导向件以自然自由状态平放在洁净平整支承面上，开放导向槽和厚实侧壁可见，表面留有较粗但整齐的加工纹，不受夹紧力；柔和光，4:3。无烘箱、无水槽、无温湿度数值，不把工件画弯以表示调湿。
- 英文 Alt：`AI illustration of a rough-machined polymer guide resting on a flat support`。
- 限制：静置不等于调湿或退火。是否需中间处理、温湿度、时间和尺寸验收状态均按具体牌号确认，不暗示所有塑料统一退火。

## 05.1 — Measurement Conditions

- 文件名：`polymer-housing-environmental-inspection-context.webp`。
- AI 生图提示词：写实检验台语境，一件不透明聚合物壳体自然放在平整支承上，旁边远离工件放一台无可读显示的温湿度记录仪，壳体不受夹持，安装边和孔口清晰；中性柔和照明，4:3。无合格读数、无环境等级标签，不以图像表示已达到调湿平衡。
- 英文 Alt：`AI illustration of a polymer housing on an inspection bench beside an environmental logger`。

## 05.2 — Functional Acceptance & Inspection Reports

- 文件名：`polymer-guide-noncontact-dimensional-inspection.webp`。
- AI 生图提示词：写实影像测量构型，一件黑色聚合物导向件自由放置在平整低位支承上，上方非接触测量镜头对准开放槽和安装孔轮廓，工件不受压，关键边缘清晰；4:3。无读数屏幕、无虚构报告、不用卡尺大力压薄壁、不显示金属零件通用公差。
- 英文 Alt：`AI illustration of a noncontact dimensional inspection setup for a polymer guide`。
- 限制：仅为测量方法示意，实际方法、环境、自由态或装配态验收需另行约定，不代表已有设备资产。

## 06.1 — Burrs & Surface Condition

- 文件名：`polymer-cnc-cover-deburred-edge-detail.webp`。
- AI 生图提示词：写实聚合物工件近景，深灰色 CNC 护盖一角完整进入画面，安装孔、轻微倒角和开放内腔边沿清楚，表面保留细微铣纹但无拉丝毛边，柔和非金属反射；浅灰背景，4:3。无抛光金属高光、不磨成过大圆角，不用注塑表皮遮盖加工纹。
- 英文 Alt：`AI illustration of clean machined edges and tool marks on a polymer cover`。

## 06.2 — Optical & Cosmetic Requests

- 文件名：`pmma-cnc-guard-machined-edge-appearance.webp`。
- AI 生图提示词：一件透明 PMMA 外观的设备观察护板，具有厚度、两个安装沉孔及铣削外轮廓，主平面可以透视浅灰背景，但加工边呈轻微雾面细刀纹，柔和侧光显示厚度和孔口，完整平放，写实三分之四，4:3。不是玻璃镜片，不做光学放大、无棱镜虹彩，不将全件做成完全无痕光学透明。
- 英文 Alt：`AI illustration of a clear polymer equipment guard with visibly machined edges`。
- 限制：示意允许存在雾面加工边，不能据此承诺 PC/PMMA 自动达到光学透明、光学级或抛光性能。

## 06.3 — Handling & Packaging

- 文件名：`polymer-housing-protected-cosmetic-surfaces.webp`。
- AI 生图提示词：写实包装场景，一件深灰色聚合物壳体位于洁净独立托盘，柔软隔垫托住厚安装边，薄壁与外观面不碰硬质包材，开口内腔和角部螺孔完整可见；柔和光，4:3。无洁净室或灭菌标识、无黏胶直接覆盖未知材料表面、无随机堆叠。
- 英文 Alt：`AI illustration of separated packaging protecting a polymer housing and its cosmetic faces`。

## 07 — Production & Orders

- 文件名：`polymer-bushings-small-batch-packing.webp`。
- AI 生图提示词：八件几何相同的黑色聚合物法兰轴套分隔放置在保护托盘，内孔和法兰厚度一致，前排主体清晰，哑光非金属表面带细车纹，干净包装台，4:3。无不同材料混装、无食品医疗阻燃符号、无大量库存与交期数字。
- 英文 Alt：`AI illustration of a small batch of machined polymer bushings in separated packaging`。

## 08 — FAQ / 09 — RFQ CTA

不新增装饰图，材料选型、环境和验收要求应通过文字清楚表达，保留上传操作空间；必要时复用 Hero，不生成图纸、合规文件或报价截图。

## 验收与接入

核对 16 个图位、文件名及 Alt，重点检查非金属质感、真实壁厚、无损夹持、自由态支承和合理加工边。不能从图像推断配方、吸湿、蠕变、耐温、光学表现或认证。保留 AI 来源和授权记录，明确示意。接入后使用 Astro 响应式图片、适当懒加载，检查桌面/移动裁切，运行 `npm run build` 和适用材料页测试。本轮不生成或接图，相关页面验证尚未执行。

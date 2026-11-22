# Brass CNC Machining 配图需求

## 范围与使用方法

- 页面：`/materials/brass-cnc-machining/`；依据 `src/data/material-pages.ts` 当前内容，共 14 个图位，已完成素材接入。
- 素材目录：`src/assets/images/materials/brass/`；用户原始素材保留在项目根目录 `Brass CNC Machining/`，页面使用独立副本。
- 所有工件为 AI 外观与工艺构型示意，不是实拍客户产品或库存，展示处须明确 AI 示意。黄铜颜色不能证明 C360、含铅量、无铅合规、饮用水适用性、导电性或气密性。

## 统一规则

- 产品图：柔和侧光、浅灰无缝背景、三分之四机位，完整工件占画面约 75%，浅金黄铜色和细微车铣纹，避免金首饰般饱和镜面或铜红色。
- Hero：16:9、2400×1350px，右侧主体清楚，左侧低细节区域便于网页叠字，移动裁切保留工件；其他 4:3、1600×1200px。交付 WebP，建议普通图不超过 250 KB，Hero 不超过 400 KB，保留孔口和螺纹细节。
- 加工图需看清工件、夹具和刀具关系，夹持不遮挡目标特征，刀柄避开卡爪；螺纹标准和密封结构只作几何示意，不能自动视为功能合格。静态图不能证明同时五轴联动或企业设备所有权。
- 负面要求：矩形样块、色板、珠宝、纯金质感、绿锈、粗糙铸件、随机孔、封死流道、畸形螺纹、过薄密封边、悬浮夹持、刀具穿透、火花、熔化金属、手伸入加工区、文字、品牌、水印、证书、压力读数、合格章、重度虚化、过曝。
- 优先生成 Hero、三类工件及四类加工图；表面处理以实际确认的工艺为准，不能因为生成了银色图就宣称已有某种镀层能力。

## Hero — 黄铜接口工件

- 文件名：`brass-cnc-machining-connectors-hero.webp`。
- AI 生图提示词：写实工业产品摄影，右侧展示一件黄铜直通螺纹转接头和一件法兰衬套，六角扳手面、轴向通孔、轴肩及细密车纹可见，浅金黄色自然金属光泽，自然放置在干净台面，背景轻度虚化但不昏暗，左侧留低细节区域，16:9。不使用水龙头、成套阀门或首饰，不出现合规标记。
- 英文 Alt：`AI illustration of CNC-machined brass connectors and a flanged bushing`。

## 01 — Brass Machining Capabilities

- 文件名：`brass-machined-port-body-features.webp`。
- AI 生图提示词：一件黄铜小型设备连接体，中部铣削扳手平面、轴向内孔、侧向交叉通孔和端部螺纹，孔口干净有小倒角，结构厚实且有装配用途；写实浅灰背景，三分之四近景，4:3。显示可见开口，不用透明剖面展示内腔，不生成毛刺或随机孔。
- 英文 Alt：`AI illustration of turned and milled features on a brass port body`。

## 02 — Brass Grades

不新增牌号图。C360 / C36000 是含铅黄铜，不能通过颜色判断成分或宣称无铅；替代牌号与合规文件仍需采购和技术评审，不生成无铅标志或伪造证书。

## 03.1 — Connectors & Threaded Adapters

- 文件名：`brass-cnc-threaded-adapter.webp`。
- AI 生图提示词：单件黄铜直通转接头，中段六角扳手面、一端外螺纹、一端内螺纹入口，端面平整，螺纹有合理退刀位置，浅金黄细车纹；浅灰背景，写实三分之四视角，4:3。螺纹连续可信，不增加无用阀杆、软管或虚构压力铭牌。
- 英文 Alt：`AI illustration of a brass threaded adapter with wrench flats`。

## 03.2 — Bushings & Sleeves

- 文件名：`brass-cnc-flanged-bushing.webp`。
- AI 生图提示词：单件黄铜法兰轴套，完整圆柱外径、贯通同轴内孔、一端定位法兰，内外孔口小倒角，厚度合理，侧放使内孔可见；浅灰背景，写实三分之四近景，4:3。均质浅金色，不做多孔烧结轴承，不加钢滚珠或润滑性能标记。
- 英文 Alt：`AI illustration of a CNC-turned brass flanged bushing`。

## 03.3 — Custom Inserts & Small Bodies

- 文件名：`brass-cnc-custom-threaded-insert-body.webp`。
- AI 生图提示词：单件定制黄铜定位嵌件体，短圆柱轴肩、顶部内螺纹、外侧两处平行铣削平面和一个横向通孔，轮廓用于设备安装，细微刀纹、孔口去毛刺；浅灰背景，写实近景，4:3。不是标准热熔滚花嵌件堆积，不生成多余装饰孔。
- 英文 Alt：`AI illustration of a custom brass insert body with milled flats and a cross-hole`。

## 04.1 — CNC Turning

- 文件名：`brass-cnc-turning-adapter-shoulder.webp`。
- AI 生图提示词：写实车床内部，黄铜短圆棒后部由三爪牢固夹持，前部已车出转接头轴肩与短外径，外圆刀靠近前段，少量细碎黄铜切屑位于下方，卡盘与刀尖有充分距离；4:3。无手、无火花、无长条切屑缠住卡盘。
- 英文 Alt：`AI illustration of CNC turning a shoulder on a brass adapter`。

## 04.2 — CNC Milling / 3-Axis

- 文件名：`brass-three-axis-milling-wrench-flats.webp`。
- AI 生图提示词：写实三轴立式加工场景，黄铜连接体水平牢固夹在软爪中，竖直立铣刀加工上方扳手平面，前端通孔与轴肩可辨，刀路避开夹具，固定水平工作台；机内柔和光，4:3。无倾转运动、无刀具穿过封闭孔壁。
- 英文 Alt：`AI illustration of three-axis milling wrench flats on a brass connector`。

## 04.3 — 3+2-Axis Milling

- 文件名：`brass-indexed-milling-angled-port-body.webp`。
- AI 生图提示词：写实机内构型，一件带斜面接口的黄铜小连接体夹在已倾转锁定的转台上，竖直钻头与斜面孔轴对正，夹具低位，刀柄可达，底座可靠支承；4:3。固定单一角度，无回转运动模糊，不宣称同时联动。
- 英文 Alt：`AI illustration of an indexed-angle drilling setup for a brass port body`。

## 04.4 — Simultaneous 5-Axis

- 文件名：`brass-five-axis-contoured-interface-body.webp`。
- AI 生图提示词：写实五轴装夹示意，黄铜定制接口体带连续弧面过渡和不同朝向的安装面，低位夹具固定底座，倾斜刀轴的球头铣刀接近外侧弧面，回转台与刀柄有合理间隙；4:3。不做夸张叶轮或微型不可达封闭流道，静态图仅展示刀具可达关系。
- 英文 Alt：`AI illustration of five-axis tool access around a contoured brass interface body`。

## 05 — Tolerances & Quality Control

- 文件名：`brass-connector-thread-gauge-inspection.webp`。
- AI 生图提示词：写实检验台，一件黄铜内螺纹接头以软质托座固定，螺纹塞规与孔轴对正、端部少量旋入，扳手面及端面可见，量规无可读标记；干净中性背景，4:3。无气密设备、无压力读数、不表现通止检验结果或合格判定。
- 英文 Alt：`AI illustration of a thread-gauge inspection setup for a brass connector`。

## 06.1 — Plating Specification

- 文件名：`brass-adapter-silver-tone-coating-concept.webp`。
- AI 生图提示词：单件黄铜转接体的拟定镀层外观示意，中段扳手面呈均匀银色缎面，端部一个明确遮蔽的接触环面保留黄铜色，边界整齐、螺纹不被厚层填平；浅灰背景，写实三分之四近景，4:3。无剥落、无镀层剖面厚度数字、无镍或铬工艺标签。
- 英文 Alt：`AI appearance concept of a brass adapter with a silver-tone coating and masked contact face`。
- 限制：当前页面未承诺具体镀种。仅在镀层体系、遮蔽与供应商可行性确认后采用；图像不证明镀镍、镀铬等具体工艺。

## 06.2 — Polishing & Appearance

- 文件名：`brass-polished-instrument-collar.webp`。
- AI 生图提示词：一件黄铜仪器定位环，内孔、端面和两处安装孔清楚，外圆为柔和细纹抛光外观，保留自然浅金色，不做珠宝镜面；浅灰背景，柔和侧光，三分之四视角，4:3。无透明清漆光膜、无氧化斑、无粗糙度数值。
- 英文 Alt：`AI illustration of a brass instrument collar with a fine polished surface`。

## 06.3 — After-Treatment Fit

- 文件名：`brass-coated-connector-final-fit-inspection.webp`。
- AI 生图提示词：写实检查场景，一件银色覆盖外观的黄铜连接体放在软质支承上，端部可见少量遮蔽保留的黄铜接触环，外螺纹与螺纹环规同轴，环规刚接近螺纹入口；中性照明，4:3。量规无可读标记，不显示厚度或通止结果，不宣称已完成真实处理后检验。
- 英文 Alt：`AI illustration of a final thread-fit inspection setup for a coated brass connector`。
- 限制：与上一图同属待确认镀层示意；若最终订单不采用镀层，取消该图，不用图片制造新增服务承诺。

## 07 — Production & Orders

- 文件名：`brass-threaded-adapters-small-batch-packing.webp`。
- AI 生图提示词：八件相同黄铜螺纹转接头分隔放在保护托盘中，螺纹和密封端面互不碰撞，前排一件完整清晰，浅金色细车纹，干净包装台；4:3。无库存数量标签、无无铅标识、不画百万件大规模产线。
- 英文 Alt：`AI illustration of a small batch of brass threaded adapters in separated packaging`。

## 08 — FAQ / 09 — RFQ CTA

不新增图片，保留问答与上传空间；如需辅助图可复用 Hero。不要生成虚构 RFQ 界面、报价截图或客户图纸。

## 验收与接入

核对 14 个图位与文件名、Alt 对应；重点检查螺纹、孔轴、密封边、黄铜色及夹持合理性。核实 AI 来源和使用权限，上线明确示意属性，不推断含铅量、气密性或涂层性能。页面已使用 Astro `Image` 输出响应式图片：Hero 作为背景图并使用 `object-fit: cover`，正文图片保持自然比例并使用 `height: auto` / `object-fit: contain`，不拉伸。已执行 `npm run build`，构建通过；页面专属实现位于 `src/pages/materials/brass-cnc-machining/index.astro`。

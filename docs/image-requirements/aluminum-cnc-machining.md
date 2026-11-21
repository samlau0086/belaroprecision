# Aluminum CNC Machining 配图需求

## 使用位置与交付状态

- 页面：`/materials/aluminum-cnc-machining/`。
- 范围：Hero 与 01–09 全页面配图规划；18 张图片均已接入，其中 13 张来自本次 `Aluminum/Webp` 交付，另保留原有 5 张表面处理图。牌号、FAQ 与 RFQ 不单独配图。
- 用户提供的五张 AI 图片已接入页面，统一存放于 `src/assets/images/aluminum-finishes/`，由 Astro 生成响应式图片；页面已添加 AI 外观示意说明，并按实际工件更新 Alt。
- 页面采用显式导入；替换图片保留下列文件名，修改文件名时同步修改页面导入。原图片仅移动并重命名，内容未重新压缩或修改。

### 已接入图片映射

| 原文件名（来自 Aluminum/Webp） | 资源文件名 | 展示位置 |
| --- | --- | --- |
| 精密铝合金L型支架特写.webp | as-machined-aluminum-mounting-bracket.webp | As-Machined |
| 银色铝制开口电子外壳.webp | bead-blasted-aluminum-sensor-housing.webp | Bead Blasting |
| Machined Metal Flange Adapter.webp | clear-anodized-aluminum-flange-adapter.webp | Clear Anodizing |
| Machined Aluminum Linear Guide Bracket.webp | hard-anodized-aluminum-guide-carriage.webp | Hard Anodizing |
| Blue Anodized Machined Enclosure Tray.webp | blue-coated-aluminum-equipment-cover.webp | Powder Coating 外观示意 |

蓝色护盖的原文件名含 Anodized，与喷粉要求不一致。当前使用中性 blue-coated 命名及 Alt，仅展示蓝色覆盖外观，不从图片确认工艺；后续优先替换为更明确的哑光喷粉示意。下列提示词保留为重做或替换图片的目标要求，不代表现有图片的工艺已获验证。

### 本次全页图片交付映射

以下 13 张原图已从 `Aluminum/Webp` 移至 `src/assets/images/materials/aluminum/`，不改变图片内容。除能力图原文件名的双句点修正外，其余保留交付文件名。

| 资源文件名 | 页面位置 |
| --- | --- |
| aluminum-cnc-machining-oem-housing-hero.webp | Hero |
| aluminum-milled-equipment-bracket-features.webp | 01 加工能力；原文件名为 features..webp |
| aluminum-cnc-mounting-bracket.webp | 03 Mounting brackets |
| aluminum-cnc-locating-block.webp | 03 Machined blocks |
| aluminum-cnc-instrument-housing.webp | 03 Plates & housings |
| aluminum-cnc-stepped-shaft.webp | 03 Shafts & turned parts |
| aluminum-cnc-milling-housing-pocket.webp | 04.1 CNC Milling |
| aluminum-cnc-turning-flange-adapter.webp | 04.2 CNC Turning |
| aluminum-three-axis-milling-mounting-plate.webp | 04.3 3-Axis Machining |
| aluminum-indexed-milling-angled-bracket.webp | 04.4 3+2-Axis Milling |
| aluminum-five-axis-contoured-mount.webp | 04.5 Simultaneous 5-Axis |
| aluminum-housing-cmm-hole-inspection.webp | 05 质检 |
| aluminum-oem-brackets-batch-packing.webp | 07 生产与订单 |

实际画面优先于文件名及生成目标：车削图展示卡盘、同轴工件与外圆车刀；质检图为机内测头场景，页面 Alt 使用 `machine-mounted dimensional probe`，不宣称 CMM；包装图展示六件框形壳体，Alt 使用 `housing frames`，不标为支架。3+2 图不能明确识别锁定转台，五轴图不能证明联动，分别以斜面加工与倾斜刀具可达性描述。为保持用户文件映射，这些文件名不再改动；将来替换时应同时核对内容和命名。

页面使用 Astro `Image` 输出响应式 `srcset`、`sizes` 及明确尺寸；Hero 优先加载，其余懒加载。各展示区域说明 AI 示意属性，图片不能作为设备、订单或检验记录证明。以下提示词保留作重做目标，不是现有图片的事实描述。

## 统一视觉要求

- Surface Finishing 共 5 张独立图片，每项一张；以具有明确装配用途、可加工结构的 OEM 铝合金工件为主体，不使用矩形材料块、测试样块或色板。下述工件是 AI 生图的设计方向，不代表已生产的客户产品。
- 五张图采用不同工件，展示零件类型与表面处理的搭配，不作为同一零件处理前后的对比。保持一致的中性浅灰背景、柔和侧光、三分之四机位和画面占比，避免每张都像同一铝块换颜色。
- 主体完整，占画面约 70%–85%，清晰显示正面纹理和侧边；柔和侧光，不使用过曝反光、重度模糊或强烈色偏。
- 比例 4:3；建议原图 1600×1200px，最终 WebP 建议不超过 250 KB。禁止拉伸、拼图、水印、文字、标签及装饰背景。
- 下列每项“AI 生图提示词”均可独立使用；“统一负面提示词”与该项“避免”内容一并使用。生成图只可作为外观示意，不作为实物、工艺验收标准或制造能力证明；上线前须审核材质、纹理与标注，并在展示处明确其为 AI 外观示意。
- 图片仅示意外观，不能从照片推断涂层厚度、硬度、耐蚀性或合格性。硬质氧化的颜色、透明氧化的色调均不应作为统一交付保证。

### 产品与表面处理图负面提示词

矩形材料样块，表面处理色板，金属原料，纯装饰雕塑，科幻机械，无法加工的封闭内腔，悬空结构，相互穿透的实体，变形孔洞，歪斜孔轴，随机密集孔，刀锋薄壁，无意义齿轮，熔化边缘，铸造砂眼，塑料质感，锈蚀，油污，手持，机床背景，工具道具，爆炸图，拼图，多件堆叠，尺寸线，文字，商标，水印，过曝，高反射遮盖纹理，重度景深模糊，裁断主体。

## 全页图片生成参考（已接入，保留替换目标）

以下各项使用“本项提示词 + 本节拍摄规则 + 对应负面要求”作为完整生图输入。产品图沿用上方背景与照明；加工、质检、包装图允许对应设备、量具及托盘，不使用上方的“机床背景、工具道具、多件堆叠”禁用项。所有场景仍禁止文字、Logo、水印、虚构证书、尺寸读数和客户标识。

- Hero：16:9，建议 2400×1350px，主体在右侧约 60%，左侧保留低细节区域便于网页叠字；主体仍须清晰、无遮挡，移动端裁切保留完整核心工件。
- 其余：4:3，1600×1200px；工艺图看清夹具、工件与刀具关系，局部刀具背景可虚化，关键结构不可虚化。WebP 建议单图不超过 250 KB，Hero 不超过 400 KB，以保留纹理为先。
- 所有机加工图：工件牢固夹持，刀柄避开夹具，刀具真实接近可达特征；不出现手伸入加工区、火花、熔化金属或悬浮工件。静态图仅示意装夹和刀具姿态，不能证明加工精度、轴数联动或企业设备所有权。
- 优先级：Hero、典型零件和工艺图优先生成，其次能力、质检与生产图。各图独立生成，不拼图；场景不伪装成实拍车间或客户项目。
- 资源目录：`src/assets/images/materials/aluminum/`，已创建并接入 13 张图片；已有 `aluminum-finishes/` 资源保持原位。下列英文 Alt 为生成目标参考，页面已按实际画面复核调整，并配套明确的 AI 示意说明。

### Hero — 铝合金 OEM 工件主图

- 文件名：`aluminum-cnc-machining-oem-housing-hero.webp`。
- AI 生图提示词：写实工业摄影，一件银色 CNC 铝合金伺服驱动模块壳体放在干净工作台上，开口浅腔、圆角内壁、四角盖板螺孔和两侧安装耳清楚可见，旁置一件同系列圆形法兰转接件，均为合理可加工的真实工件结构；自然铝色，细微铣削纹和车削纹，不镀铬，不放原料样块。柔和侧光，背景为轻度虚化的中性加工环境，不显示企业标识，右侧主体完整，左侧留白，16:9。
- 英文 Alt：`AI illustration of an aluminum CNC-machined housing and flange adapter`。

### 01 — Aluminum Machining Capabilities

- 文件名：`aluminum-milled-equipment-bracket-features.webp`。
- AI 生图提示词：写实产品摄影，单件一体铣削铝合金设备支架，厚底座、竖直安装面、侧面开口减重腔、两个定位孔和两个长圆调节孔，腔角保留刀具圆角，清晰呈现平面、孔位与侧向特征的关系，银色细密刀纹，边缘已去毛刺；浅灰背景，三分之四俯视，4:3。不是折弯钣金，不设计密闭不可达内腔，不显示公差数字。
- 英文 Alt：`AI illustration of milled pockets and locating holes on an aluminum equipment bracket`。

### 02 — Aluminum Grades

不单独生成牌号图。6061、6082、7075 不能靠银色外观区分；保持文字比较，不生成带牌号标签的假材料证书、库存或不同颜色的“牌号样块”。

### 03.1 — Mounting Brackets

- 文件名：`aluminum-cnc-mounting-bracket.webp`。
- AI 生图提示词：写实产品摄影，一件铝合金电机安装支架，水平底座上有两个调节长孔，竖直面有大型圆形电机定位孔及四个螺栓孔，底座与立面为同一坯料铣削成形，合理厚壁和内角圆弧，银色细刀纹；浅灰背景，三分之四视角，完整显示安装方向，4:3。无电机、无钣金折弯、无装饰孔。
- 英文 Alt：`AI illustration of a CNC-machined aluminum motor mounting bracket`。

### 03.2 — Machined Blocks

- 文件名：`aluminum-cnc-locating-block.webp`。
- AI 生图提示词：写实产品摄影，一件用于自动化夹具的铝合金定位座，阶梯形外轮廓、顶面开口定位槽、两只沉孔和侧面贯通安装孔，几何具有明确夹具安装用途，不是空白方块；显示槽底刀纹与轻微倒角，浅灰背景，三分之四俯视，4:3。无密集随机孔、无假刻字。
- 英文 Alt：`AI illustration of an aluminum locating block with a machined slot and counterbores`。

### 03.3 — Plates & Housings

- 文件名：`aluminum-cnc-instrument-housing.webp`。
- AI 生图提示词：写实产品摄影，一件开口铝合金仪器底壳及其独立平盖，底壳有浅内腔、合理均匀壁厚、盖板安装边和角部螺孔，盖板在旁平放并有匹配的四孔，银色未涂覆加工面，完整可见；浅灰背景，三分之四俯视，4:3。无电子元件、无透明外壁、无悬浮爆炸结构。
- 英文 Alt：`AI illustration of an aluminum instrument housing and matching machined cover plate`。

### 03.4 — Shafts & Turned Parts

- 文件名：`aluminum-cnc-stepped-shaft.webp`。
- AI 生图提示词：写实产品摄影，一件短铝合金阶梯轴放于自身较大轴肩稳定支承，三个同轴外径、窄退刀槽和端面中心孔，端部短螺纹有合理退刀位置，细密同心车纹、自然银色；浅灰背景，三分之四侧视，4:3。轴心不可弯折，不做钢制传动轴或虚构镜面精度。
- 英文 Alt：`AI illustration of a turned aluminum stepped shaft with shoulders and an end thread`。

### 04.1 — CNC Milling

- 文件名：`aluminum-cnc-milling-housing-pocket.webp`。
- AI 生图提示词：写实 CNC 加工场景，铝合金壳体毛坯通过低位软爪牢固夹持，立铣刀从上方接近敞开的圆角内腔，在腔壁处进行铣削，壳体安装边及残留合理加工余量可见；少量银色切屑位于非接触区，刀柄与夹具有间隙，柔和机内照明，近景 4:3。无手、无火花、无穿透刀柄。
- 英文 Alt：`AI illustration of CNC milling an open pocket in an aluminum housing`。

### 04.2 — CNC Turning

- 文件名：`aluminum-cnc-turning-flange-adapter.webp`。
- AI 生图提示词：写实数控车床内部，三爪夹持铝合金短圆柱的后部，前部已车出法兰和同轴定位凸台，外圆车刀靠近前部外径，尾端不悬伸过长；圆孔、轴肩、刀尖及卡爪关系清楚，银色同心车纹，近景 4:3。禁止刀具碰卡盘、整件悬空或加工中用手持件。
- 英文 Alt：`AI illustration of CNC turning an aluminum flange adapter in a lathe chuck`。

### 04.3 — 3-Axis Machining

- 文件名：`aluminum-three-axis-milling-mounting-plate.webp`。
- AI 生图提示词：写实三轴立式铣削场景，铝合金设备安装板水平固定于台面夹具，竖直主轴铣刀沿上方可达的长槽加工，板上可见沉孔和阶梯面，压板在刀路之外，固定台面无倾斜回转姿态；机内柔和光，4:3。不得画同时倾转台面或五轴联动轨迹。
- 英文 Alt：`AI illustration of a vertical three-axis milling setup for an aluminum mounting plate`。

### 04.4 — 3+2-Axis Milling

- 文件名：`aluminum-indexed-milling-angled-bracket.webp`。
- AI 生图提示词：写实 CNC 机内场景，带斜侧安装面的铝合金支架固定在已倾转并锁定角度的转台夹具上，竖直钻具对准该斜面上的孔位，工件底座可靠夹持，留出刀柄空间，其他孔位合理；4:3。展示单一固定角度装夹，不画回转运动模糊、轨迹箭头或多重刀具。
- 英文 Alt：`AI illustration of an indexed-angle milling setup for an aluminum bracket`。

### 04.5 — Simultaneous 5-Axis

- 文件名：`aluminum-five-axis-contoured-mount.webp`。
- AI 生图提示词：写实五轴加工构型示意，一件带连续弧形侧面及开口减重腔的铝合金安装座夹在低位定位夹具上，倾斜刀轴的球头铣刀接近外侧曲面，回转台、刀柄和工件间留有真实间隙，构图突出复杂曲面可达性；4:3。无航空叶轮、无悬空夹持，不以静态画面表示已验证同时联动。
- 英文 Alt：`AI illustration of a five-axis tool-access setup for a contoured aluminum mount`。

### 05 — Tolerances & Quality Control

- 文件名：`aluminum-housing-cmm-hole-inspection.webp`。
- AI 生图提示词：写实计量场景，铝合金壳体放在三坐标测量平台的低位支承上，红宝石球测头靠近安装边定位孔内壁，测杆与孔口无碰撞，壳体基准面和完整孔轮廓清楚可见；干净中性检验环境，4:3。无屏幕合格读数、无虚构报告、无手持游标卡尺代替三坐标。
- 英文 Alt：`AI illustration of a CMM probe checking a locating hole on an aluminum housing`。

### 07 — Production & Orders

- 文件名：`aluminum-oem-brackets-batch-packing.webp`。
- AI 生图提示词：写实小批量工件摄影，六件相同银色铝合金设备支架整齐分隔放在洁净保护托盘内，安装孔与长槽几何一致，前排一件完整展示细密加工面，隔垫保护接触面；柔和侧光，4:3。无巨量库存、无数量或交期标语、无随机不同零件混装。
- 英文 Alt：`AI illustration of a small batch of aluminum mounting brackets in separated packaging`。

### 08 — Frequently Asked Questions / 09 — RFQ CTA

不新增装饰图，保留 FAQ 的可扫描性与 RFQ 上传操作空间；不生成虚构图纸截图、报价结果或上传成功状态。若后续版式确需侧图，可复用已审核的 Hero 工件图，不另制造重复需求。

## 06 — Surface Finishing（已有图片及替换提示词）

以下五项沿用已接入文件名和实际映射，独立于上述新增计划。

### 06.1 — As-Machined

- 文件名：`as-machined-aluminum-mounting-bracket.webp`。
- 工件：一体式 CNC 铝合金安装支架，用于机械设备的电机或传感器安装；由厚实底座与竖直安装面组成，带减重凹腔、安装孔和长圆调节孔。
- AI 生图提示词：生成一张写实工业产品摄影风格的图片，主体是一件从铝合金坯料 CNC 铣削成形的一体式 L 形设备安装支架，不是折弯钣金，也不是矩形样块。厚实底座上有两个长圆调节通孔，竖直安装面有两个圆形安装通孔；侧面有一个开口减重凹腔，凹腔内角有合理的铣刀圆角，各安装面平直，边缘轻微倒角。未经涂覆的自然银色铝表面，平面保留细密连续的铣削刀路，凹腔底部可见克制的弧形走刀痕迹；干净、已去毛刺，不是粗糙半成品。单件独立放置于中性浅灰无缝背景，三分之四俯视近景，同时看到底座、竖直面及侧面凹腔，柔和侧光清晰呈现刀纹，主体完整并占画面约 75%，全工件清晰，真实金属反光，4:3 横图，无文字、无品牌。
- 避免：喷珠颗粒纹理、镜面抛光、阳极氧化层或明显划伤。
- 建议英文 Alt：`As-machined aluminum mounting bracket with visible milling tool paths`。

### 06.2 — Bead Blasting

- 文件名：`bead-blasted-aluminum-sensor-housing.webp`。
- 工件：开口式传感器壳体，带内腔、安装耳和盖板固定孔；展示外壳的均匀喷珠质感。
- AI 生图提示词：生成一张写实工业产品摄影风格的图片，主体是一件 CNC 铣削铝合金传感器壳体，盖板未安装，开口朝上；有均匀且厚度合理的侧壁、带圆角的矩形内腔、平整盖板安装边，四角各有一个盖板固定孔，两侧有与壳体一体加工的安装耳及通孔。形状简洁可信，内腔可从上方加工，不出现复杂电子元件。外表面为细喷珠处理的自然银灰色，呈均匀、细密、低反光的哑光颗粒纹理，不强调方向性刀纹，不呈现粗砂或闪粉效果。单件置于中性浅灰无缝背景，三分之四俯视近景，完整展示内腔、正面外壁与安装耳，柔和侧光使喷珠纹理可辨，主体占画面约 75%，全工件清晰，4:3 横图，无文字、无品牌。
- 避免：粗糙砂粒、锈蚀、镜面亮面或把未处理刀纹当成喷珠效果。
- 建议英文 Alt：`Bead-blasted aluminum sensor housing with a fine matte silver texture`。

### 06.3 — Clear Anodizing

- 文件名：`clear-anodized-aluminum-flange-adapter.webp`。
- 工件：车铣加工的圆形法兰转接件，具有中心通孔、同轴定位台阶及均布安装孔。
- AI 生图提示词：生成一张写实工业产品摄影风格的图片，主体是一件 CNC 车铣加工的铝合金圆形法兰转接件，用于设备模块的定位与连接。零件有圆盘形安装法兰、一个短圆柱形同轴定位凸台、贯穿中心的圆孔，以及法兰上四个等间距安装通孔；圆孔保持同轴，壁厚合理，边缘有细小倒角。表面表现为透明阳极氧化后的自然银色金属外观，细腻缎面反光，可保留非常轻微的同心车削纹理，不是镜面镀铬，也不是白色涂漆；透明氧化不意味着工件透明。单件略倾斜支承在自身法兰边缘，中性浅灰无缝背景，三分之四近景，清楚看到法兰正面、中心孔和凸台侧面，柔和侧光，主体完整且占画面约 75%，全工件清晰，4:3 横图，无文字、无品牌。
- 避免：将其画成透明材料、镀铬镜面或带有明显彩色涂层。
- 建议英文 Alt：`Clear-anodized aluminum flange adapter with a satin silver metallic finish`。

### 06.4 — Hard Anodizing

- 文件名：`hard-anodized-aluminum-guide-carriage.webp`。
- 工件：带开口导向槽的机械导向滑座，突出导向接触面和安装特征，不使用通用黑色外壳代替。
- AI 生图提示词：生成一张写实工业产品摄影风格的图片，主体是一件 CNC 铣削铝合金机械导向滑座，用于工业设备的滑动导向组件。零件有厚实安装底座、沿长度方向贯通且上方敞开的 U 形直导向槽，两侧导向面平行，底座两侧伸出安装边，每侧有两个安装通孔；槽底内角保留合理加工圆角，整体无装配件、无滚珠、无导轨钢条。表面表现为硬质阳极氧化的炭灰色低光泽金属质感，导向面平直且轮廓清晰，轻微加工纹理可辨，不是黑漆或塑料；炭灰仅为本图示例色调，不表现为所有硬质氧化的固定颜色。单件置于中性浅灰无缝背景，三分之四俯视近景，清楚看到贯通导向槽、侧面及安装孔，柔和侧光保留暗部细节，主体完整且占画面约 75%，全工件清晰，4:3 横图，无文字、无品牌。
- 避免：黑色喷漆塑料感、锈蚀、夸张厚边或暗部全黑而失去纹理。
- 建议英文 Alt：`Hard-anodized aluminum guide carriage with a charcoal gray finish`。

### 06.5 — Powder Coating

- 文件名：`blue-coated-aluminum-equipment-cover.webp`。
- 工件：CNC 铣削设备端部护盖，带浅内腔、周边安装边和螺栓通孔；以非配合外表面展示蓝色喷粉。
- AI 生图提示词：生成一张写实工业产品摄影风格的图片，主体是一件从铝合金坯料 CNC 铣削成形的设备端部护盖，不是冲压钣金或铸件。整体为圆角矩形，有平整外表面、浅内腔、厚度合理的侧壁、连续周边安装边及四个角部螺栓通孔。护盖以开口略朝向镜头的姿态自然放置，能同时看到蓝色外壁、部分浅内腔和安装边。非配合外表面采用均匀蓝色哑光粉末喷涂，呈细微、克制的涂层纹理及不透明覆盖，不透出阳极氧化式金属光泽；安装边的密封接触面保留整齐、狭窄的遮蔽银色区域，边界清晰，不出现大面积随机露底。中性浅灰无缝背景，三分之四近景，柔和侧光，主体完整且占画面约 75%，全工件清晰，4:3 横图，无文字、无品牌。
- 避免：蓝色阳极氧化的半透明金属效果、流挂、剥落、刷痕或过厚而掩盖几何的涂层。
- 建议英文 Alt：`Blue powder-coated aluminum equipment cover with a matte protective finish`。

## 验收

1. 核对新增 13 个图位与既有 5 张表面处理图片，共 18 项；区分待生成与已接入状态，不沿用原参考中错位的描述。
2. 核对工件是否有合理装配用途，检查孔位、壁厚、凹腔可达性及实体连接；拒绝把样块简单换色或生成无法制造的结构。以上提示词是视觉设计约束，不是生产图纸或工艺审核结论。
3. 保存 AI 生成来源与使用授权记录；如改用真实照片，核实处理类型、保密要求及客户授权。不得将 AI 图宣传为真实客户案例。
4. 替换图片时同步检查页面 Alt 与实际画面，保留 AI 外观示意说明；下列建议 Alt 为工件内容描述，当前页面另明确注明 AI illustration，蓝色护盖使用中性 blue-coated 描述。
5. 接入图片后运行 `npm run build` 和 `node --test tests/aluminum-cnc-machining.test.mjs`。
6. 复核手机、平板和桌面裁切、颜色、纹理及 Alt；不能因压缩丢失刀纹或喷珠颗粒差异。

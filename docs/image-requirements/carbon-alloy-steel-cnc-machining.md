# Carbon & Alloy Steel CNC Machining 配图需求

## 范围与使用方法

- 页面：`/materials/carbon-alloy-steel-cnc-machining/`；依据 `src/data/material-pages.ts` 当前内容，共 15 个图位，已接入。
- 用户提供的 15 张 WebP 已复制到 `src/assets/images/materials/carbon-alloy-steel/`，原始 `webp/` 素材保留。“本项提示词 + 统一规则 + 负面要求”组成完整生图输入；英文 Alt 已按需求和画面主题设置，仍需人工核对具体细节。
- 工件为工业设备 OEM 几何示意，不是实拍客户项目或设备资产证明；上线须明确 AI 示意。1018、1045、4140、供货状态、硬度及热处理质量不能从照片判断。

## 统一规则

- 产品图：浅灰背景、柔和侧光、三分之四视角，主体完整约占 75%，钢材为中性灰银色、克制的车铣纹；不要用金属颜色暗示牌号或硬度。
- Hero：16:9、2400×1350px，右侧工件清楚，左侧低细节留白便于叠字，移动裁切保留主体；其余 4:3、1600×1200px。交付 WebP，建议普通图不超过 250 KB、Hero 不超过 400 KB，保留螺纹及刀纹细节。
- 加工图工件夹持可靠，长轴应有合理支承，刀尖对准可达特征，刀柄避开夹具，允许少量切屑和切削液。热处理、磨削与保护方式须按订单确认，不能借图宣称全部提供。
- 负面要求：样块、色板、无功能方块、锈蚀、铸造砂眼、随机齿轮、畸形螺纹、不可达封闭内腔、悬浮夹持、刀具穿透、手伸入加工区、夸张火花、红热工件、文字、Logo、水印、合格证、硬度数值、重度虚化和过曝。
- 优先生成 Hero、典型零件、四种加工构型；随后补充工序、质检、保护与生产图。静态五轴图仅表达刀具可达性，不证明联动能力。

## Hero — 钢制 OEM 传动与安装零件

- 文件名：`carbon-alloy-steel-cnc-machining-oem-parts-hero.webp`。
- AI 生图提示词：写实工业摄影，右侧一件短钢制阶梯轴与一件阶梯形设备安装座自然放在干净台面，轴肩、定位槽、沉孔、安装面可辨，中性灰银色细车铣纹，背景轻度虚化；左侧保留低细节区域，16:9。无齿轮组、无锈、无牌号硬度刻字，不把钢材画成黑色塑料。
- 英文 Alt：`AI illustration of a steel stepped shaft and CNC-machined equipment mount`。

## 01 — Carbon & Alloy Steel Machining Capabilities

- 文件名：`steel-machined-bearing-mount-features.webp`。
- AI 生图提示词：一件从钢坯车铣成形的设备轴承安装座，厚实底部安装边、圆形贯通轴承孔、侧向开放减重槽和四个沉孔，内角有刀具圆弧，灰银色加工面；浅灰背景，写实三分之四视角，4:3。不是铸件、无虚构负载数字、无空白材料块。
- 英文 Alt：`AI illustration of a steel bearing mount with machined bore and mounting features`。

## 02 — Carbon & Alloy Steel Grades

不新增牌号图片。1018、1045、4140 及退火/预硬状态用文字和真实材料文件区分，不生成彩色牌号样块、虚假炉批标签或硬度合格证。

## 03.1 — Shafts, Pins & Sleeves

- 文件名：`steel-cnc-stepped-shaft-and-sleeve.webp`。
- AI 生图提示词：一件短钢制阶梯轴和一件独立定位套筒自然并列，轴有轴肩、退刀槽和短键槽，套筒有贯通内孔与端面倒角，细密车纹和合理金属高光；浅灰背景，写实三分之四侧视，4:3。无悬浮装配、无滚珠、不显示硬度数值。
- 英文 Alt：`AI illustration of a machined steel stepped shaft and locating sleeve`。

## 03.2 — Blocks, Plates & Mounting Parts

- 文件名：`steel-cnc-slotted-mounting-plate.webp`。
- AI 生图提示词：一件厚钢制设备安装板，外轮廓有功能阶梯、两条调节长槽、四个沉孔及一个定位台阶，平面有细微铣纹、边缘倒角；浅灰背景，写实俯视三分之四，4:3。不是材料样板，不画薄钣金折弯件或无用途孔阵列。
- 英文 Alt：`AI illustration of a CNC-machined steel mounting plate with slots and counterbores`。

## 03.3 — Custom Housings & Bodies

- 文件名：`steel-cnc-actuator-interface-housing.webp`。
- AI 生图提示词：一件钢制执行机构接口壳体，短厚壁杯形轮廓、开放内腔、端面法兰安装孔和侧向接口孔，结构可从开口加工，灰银色车铣纹、边缘干净；浅灰背景，写实三分之四视角，4:3。无装配电机、无密闭不可达结构、无铸造纹理。
- 英文 Alt：`AI illustration of a steel actuator interface housing with an open bore and mounting flange`。

## 04.1 — CNC Milling / 3-Axis

- 文件名：`steel-three-axis-milling-mounting-slot.webp`。
- AI 生图提示词：写实固定台面三轴加工场景，厚钢安装板水平夹牢，竖直立铣刀加工上方长槽，压板远离刀路，少量切削液、短金属切屑，刀柄与工件无碰撞；近景 4:3。无倾转运动、无火花或红热钢。
- 英文 Alt：`AI illustration of three-axis milling a slot in a steel mounting plate`。

## 04.2 — CNC Turning

- 文件名：`steel-cnc-turning-stepped-shaft.webp`。
- AI 生图提示词：写实数控车床内，钢制阶梯轴一端由卡盘夹紧，较长自由端由尾座顶尖支承，外圆刀靠近中段轴颈，轴线、卡盘和尾座同轴，少量切削液不遮挡刀尖；4:3。无过长无支承悬伸、无刀具撞尾座，不显示具体钢种。
- 英文 Alt：`AI illustration of CNC turning a steel shaft supported by a tailstock`。

## 04.3 — 3+2-Axis Milling

- 文件名：`steel-indexed-milling-angled-mount.webp`。
- AI 生图提示词：写实机内场景，钢制多面安装座固定在已倾转锁定的回转台夹具上，斜面朝向竖直铣刀，侧孔与底座可见，刀柄远离压板，灰银色工件；4:3。单一静止角度，不画旋转模糊或多重刀具轨迹。
- 英文 Alt：`AI illustration of an indexed-angle milling setup for a steel equipment mount`。

## 04.4 — Simultaneous 5-Axis

- 文件名：`steel-five-axis-contoured-housing.webp`。
- AI 生图提示词：写实五轴构型示意，一件有弧形加强外壁和多方向安装面的钢制壳体夹持在低位回转夹具上，倾斜刀轴球头刀接近外侧曲面，刀具、工件和台面间隙清楚，结构厚实可加工；4:3。无航空叶片、无火花，静态画面不表示已验证联动或硬铣能力。
- 英文 Alt：`AI illustration of five-axis tool access for a contoured steel housing`。

## 04.5 — Heat-Treatment Sequence

- 文件名：`steel-rough-machined-shaft-process-planning.webp`。
- AI 生图提示词：写实工序规划语境图，单件已粗加工的钢制阶梯轴放在洁净工序托盘上，轴肩、退刀槽和粗车纹清晰，端部及后续配合段保留厚实轮廓，未装配；中性光，三分之四视角，4:3。不画热处理炉、火焰、红热金属、磨床或前后拼图，不用颜色表示硬度改变。
- 英文 Alt：`AI illustration of a rough-machined steel shaft prepared for process planning`。
- 限制：余量、热处理顺序及后续磨削无法从单张照片确认，须在章节文字中说明按图纸与实际硬度评审。

## 05.1 — Critical Interfaces & Dimensional Inspection

- 文件名：`steel-housing-cmm-bore-inspection.webp`。
- AI 生图提示词：写实三坐标检验场景，钢制接口壳体稳定置于低位支承，测头伸入开放轴承孔靠近内壁，测杆与孔口留有间隙，基准端面完整可见；干净中性计量环境，4:3。无公差读数、无合格报告、不把测头悬在孔外冒充接触。
- 英文 Alt：`AI illustration of a CMM inspection setup for a steel housing bore`。

## 05.2 — Hardness Verification

- 文件名：`steel-component-hardness-test-setup.webp`。
- AI 生图提示词：写实台式硬度检验构型，一件带平整检验平台面的厚钢制安装座稳定支承在硬度计砧座上，压头垂直对准指定平面，支承与测试面对应，设备无品牌且屏幕不可读；近景 4:3。无虚构 HRC 数值、合格章、火花或把压头画成钻头。
- 英文 Alt：`AI illustration of a hardness-test setup on a supported steel component`。
- 限制：测试方法、位置与记录按订单确定；本图不证明企业拥有设备或零件硬度合格。

## 06.1 — Surface Treatment

- 文件名：`steel-dark-finish-mounting-collar-concept.webp`。
- AI 生图提示词：单件钢制设备安装环，法兰有四个安装孔、中心贯通定位孔，非配合外表面为低光泽深灰黑色外观，中心精密配合孔保留整齐灰银色遮蔽面，薄层外观不掩盖边缘；浅灰背景，写实三分之四，4:3。无厚漆流挂、无塑料感、无工艺标签。
- 英文 Alt：`AI appearance concept of a dark-finished steel collar with a masked bore`。
- 限制：发黑、镀层或涂覆路线由项目确认；深色外观不能证明具体处理、防腐性能或厚度。

## 06.2 — Shipping Protection

- 文件名：`steel-shaft-separated-shipping-protection.webp`。
- AI 生图提示词：写实包装近景，两件钢制短阶梯轴置于独立保护凹位，轴颈不接触硬质边缘，旁边可见干净防护包材但不遮挡前排主体，银灰表面无锈，保护措施克制；4:3。无滴油、水珠、密封洁净等级或已验证防锈标志。
- 英文 Alt：`AI illustration of steel shafts separated and protected for shipping`。
- 限制：临时防锈、禁油要求和包材适用性另行确认，不由图片指定。

## 07 — Production & Orders

- 文件名：`steel-mounting-parts-small-batch-tray.webp`。
- AI 生图提示词：六件相同钢制安装座整齐分隔在生产周转托盘中，同样的轴承孔、沉孔和安装边几何一致，前排清晰呈现车铣表面；干净工业台面、柔和光，4:3。无巨型库存、无工期标语、无客户标识。
- 英文 Alt：`AI illustration of a small batch of machined steel mounting parts in a tray`。

## 08 — FAQ / 09 — RFQ CTA

不新增装饰图，保留问答与上传的清晰度；需要辅助图时复用 Hero，不生成报价界面、客户图纸或合格证。

## 验收与接入

核对 15 个图位、英文文件名和 Alt；重点审核长轴支承、热处理语境与硬度测试构型，禁止用外观证明牌号、硬度、表面性能或尺寸合格。页面 Hero 作为背景图等比覆盖显示；正文使用 Astro 响应式图片并采用 `height: auto`，保持原始比例。FAQ 与 RFQ 不新增装饰图。图片仅明确为 AI 示意，保留 AI 来源与授权记录。桌面/移动布局及构建、材料页测试按本次交付记录验证。

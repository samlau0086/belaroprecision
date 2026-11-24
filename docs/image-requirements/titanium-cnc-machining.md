# Titanium CNC Machining 配图需求

## 范围与使用方法

- 页面：`/materials/titanium-cnc-machining/`；依据 `src/data/material-pages.ts` 当前内容，共 13 个图位，已完成资源接入。
- 资源目录：`src/assets/images/materials/titanium/`。每项“提示词 + 统一规则 + 负面要求”用于审核和后续替换；页面 Alt 已按实际画面使用中性描述。
- 配图只表达工件几何、表面与加工构型，不是实拍、客户案例、设备资产或合格性证明。Grade 2、Grade 5、ELI、植入级、材料追溯与认证均不能由照片证明。

## 统一规则

- 产品图采用中性浅灰背景、柔和侧光、三分之四视角，主体完整占约 75%；钛件呈克制的中性灰色金属光泽，可见细微车铣纹，不用深黑或彩虹色代表钛本色。
- Hero：16:9、2400×1350px，右侧工件、左侧低细节留白便于叠字，手机裁切保留核心工件；其余 4:3、1600×1200px。交付 WebP，建议普通图不超过 250 KB、Hero 不超过 400 KB，不能压掉薄壁和纹理细节。
- 加工图突出刚性支承、短而合理的刀具伸出和可达开放结构，允许少量切削液，不以火花、发红或熔化表达钛加工。静态五轴图只表明构型，不证明同时联动或设备配置。
- 负面要求：材料样块、装饰色板、人体植入物、骨钉、牙科零件、航空发动机、品牌、认证、Logo、水印、彩虹氧化色、镜面镀铬、刀锋薄壁、无法加工封闭内腔、随机孔、夹持悬空、刀具碰撞、手伸入机内、火花、熔化、过曝和重度模糊。
- 优先生成 Hero、典型零件与四类工艺图；其次能力、质检、指定表面示意和包装图。表面处理图为条件项，不构成已确认的供应承诺。

## Hero — 钛制工业 OEM 工件

- 文件名：`titanium-cnc-machining-industrial-components-hero.webp`。
- AI 生图提示词：写实工业产品摄影，右侧展示一件钛制设备安装支架和一件短法兰套筒，支架有开放减重腔、厚度合理的壁面与定位孔，套筒有同轴内孔和定位肩，灰色金属带细密加工纹，自然放在干净工作台；左侧低细节区域，背景轻度虚化，16:9。无航空或医疗暗示、无彩色阳极氧化。
- 英文 Alt：`Titanium mounting bracket and flanged sleeve for industrial assemblies`。

## 01 — Titanium Machining Capabilities

- 文件名：`titanium-machined-bracket-open-pocket-features.webp`。
- AI 生图提示词：单件一体铣削钛合金设备支架，浅开放减重腔、合理壁厚、宽安装底面、两处定位孔和侧面安装孔，内角有加工圆弧，灰色细铣纹，边缘去毛刺；写实浅灰背景，三分之四俯视，4:3。着重展示腔体可达性与连接结构，不用极薄叶片、超深窄槽或透明剖视。
- 英文 Alt：`Open pocket and locating features on a titanium bracket`。

## 02 — Titanium Grades

不新增牌号图片。Grade 2 与 Grade 5 的材料标准、状态和追溯要求用文字及真实文件表达；不能靠色差辨认，不生成 ELI、植入级或航空合格标识。

## 03.1 — Brackets & Mounting Parts

- 文件名：`titanium-cnc-sensor-mounting-bracket.webp`。
- AI 生图提示词：单件钛制工业传感器安装支架，U 形开放安装区、两侧平行安装耳和底部两个长圆调节孔，各壁厚合理、内角圆弧，灰色轻微铣纹；写实浅灰背景，三分之四视角，4:3。无传感器装配件、无折弯钣金外观、无任意锐薄边。
- 英文 Alt：`CNC-machined titanium sensor mounting bracket`。

## 03.2 — Shafts, Sleeves & Connectors

- 文件名：`titanium-cnc-stepped-sleeve-connector.webp`。
- AI 生图提示词：单件钛制短阶梯套筒连接件，贯通同轴内孔、中部定位肩、一端短外螺纹及合理退刀槽，自然侧放可看到孔口与外径，灰色细密车纹；写实浅灰背景，4:3。无医疗用途、无过薄螺纹壁、无弯曲轴线。
- 英文 Alt：`Turned titanium sleeve connector with a locating shoulder`。

## 03.3 — Custom Housings & Bodies

- 文件名：`titanium-cnc-instrument-interface-housing.webp`。
- AI 生图提示词：单件钛制工业仪器接口壳体，浅杯形开口内腔、连续安装法兰、四个螺栓孔与侧面接口平面，内腔可从正面加工，厚度合理，灰色车铣纹；浅灰背景，写实三分之四视角，4:3。无涡轮叶片、无透明壁、无密闭复杂流道。
- 英文 Alt：`Titanium instrument interface housing with an open cavity`。

## 04.1 — CNC Milling / 3-Axis

- 文件名：`titanium-three-axis-milling-bracket-pocket.webp`。
- AI 生图提示词：写实三轴立式机内近景，钛制支架底部由低位软爪刚性夹持，短伸出立铣刀从上方加工开放浅腔，细水流式切削液不遮挡刀尖，刀柄避开腔沿和夹具，固定水平台面；4:3。无火花、无干烧红热、无极长细刀。
- 英文 Alt：`Three-axis milling an open pocket in a titanium bracket`。

## 04.2 — CNC Turning

- 文件名：`titanium-cnc-turning-sleeve-shoulder.webp`。
- AI 生图提示词：写实数控车床内部，短钛制套筒后部牢固夹在软爪中，外圆车刀靠近前端定位肩，工件悬伸短，端部同轴内孔可见，少量切削液、灰色细纹；近景 4:3。刀具不撞卡爪、不画燃烧碎屑、不出现人体植入结构。
- 英文 Alt：`CNC turning a shoulder on a titanium sleeve`。

## 04.3 — 3+2-Axis Milling

- 文件名：`titanium-indexed-milling-angled-bracket.webp`。
- AI 生图提示词：写实加工构型，带斜侧安装面的钛制设备支架夹在已倾转并锁定的回转夹具上，竖直钻具对准斜面定位孔，短刀柄有足够间隙，底面可靠支承，灰色加工纹；4:3。无回转运动模糊、无多重刀位，只表现固定角度定位。
- 英文 Alt：`Indexed-angle machining setup for a titanium bracket`。

## 04.4 — Simultaneous 5-Axis

- 文件名：`titanium-five-axis-contoured-equipment-mount.webp`。
- AI 生图提示词：写实五轴机内构型示意，一件带平缓弧形外侧面和开放减重腔的钛制设备安装座，通过厚实底座固定在低位回转夹具，倾斜刀轴球头刀接近外侧曲面，支承与刀具可达性清楚；4:3。无航空叶轮、无过深不可达腔，不把单帧构图当作同时联动证明。
- 英文 Alt：`Five-axis tool access for a contoured titanium equipment mount`。

## 05 — Tolerances & Quality Control

- 文件名：`titanium-bracket-cmm-locating-hole-inspection.webp`。
- AI 生图提示词：写实三坐标检验场景，钛制安装支架置于低位非损伤支承，球形测头接近定位孔内壁，支承避开测量特征，基准安装面和开放腔可见，灰色细刀纹；干净中性光，4:3。无微米数值、合格章、检验报告或航空医疗标志。
- 英文 Alt：`CMM inspection setup for a titanium bracket locating hole`。
- 限制：薄壁验收、表面完整性和特殊资格要求须单独确认，不能从这一尺寸测量示意推导。

## 06.1 — Specified Treatment Only

- 文件名：`titanium-matte-finish-equipment-cover-concept.webp`。
- AI 生图提示词：一件钛制工业设备端盖，浅开口内腔、四个安装孔与连续法兰，外表面为拟定细喷珠后的均匀低光泽灰色，孔口与棱边仍清晰，表面颗粒细微；浅灰背景，写实三分之四，4:3。无彩虹氧化、无黑色厚漆、不显示处理厚度或耐磨等级。
- 英文 Alt：`Titanium equipment cover with a fine matte gray surface`。
- 限制：仅为指定处理的候选外观；喷珠、阳极氧化、抛光等须确认材质兼容、供应商及遮蔽要求后才采用对应描述。本图不证明已提供喷珠服务。

## 06.2 — Surface Protection

- 文件名：`titanium-housing-protected-contact-faces.webp`。
- AI 生图提示词：一件钛制接口壳体置于独立洁净保护托盘，法兰接触面避免与包材硬边摩擦，旁置尺寸合适的柔软隔垫但不覆盖主要特征，工件灰色表面清楚；写实包装近景，4:3。无真空洁净等级、无医疗包装、无已验证灭菌标识。
- 英文 Alt：`Titanium housing supported to protect its contact faces`。

## 07 — Production & Orders

- 文件名：`titanium-brackets-small-batch-order.webp`。
- AI 生图提示词：四件相同钛制设备安装支架分隔置于洁净工序托盘，定位孔与开放腔结构一致，前排一件完整清晰，灰色细铣纹，工业工作台背景克制；4:3。无客户标签、无航空认证、无大规模库存或固定交期暗示。
- 英文 Alt：`Small batch of titanium equipment brackets in a separated tray`。

## 08 — FAQ / 09 — RFQ CTA

不新增装饰图，保留资格、牌号与图纸要求的文字表达和上传空间；必要时复用 Hero，不生成虚假材料追溯文件或报价结果。

## 验收与接入

核对 13 个图位、文件名和 Alt，重点检查灰色材质表现、合理壁厚、开放腔可达性、刀具间隙与可靠支承。Hero 使用 Astro 响应式图片作为背景并按比例覆盖，正文图片按比例完整显示；页面不展示“AI illustration”等可见说明。`titanium-indexed-milling-angled-bracket-2.webp` 为同一 3+2 图位的备用原图，当前未在页面展示。图片来源、授权和真实制造能力仍需单独确认。

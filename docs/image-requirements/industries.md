# 应用行业：图片需求

- 页面路径：`/industries/`
- 页面 slug：`industries`
- 扫描依据：[src/pages/industries/index.astro](../../src/pages/industries/index.astro)、[src/components/SecondaryProcessSupport.astro](../../src/components/SecondaryProcessSupport.astro)
- 编制日期：2026 年 11 月 22 日。
- 状态：5 张新增图、4 个保留应用图及 4 个复用图位已接入，共 13 个图位，无待图项。来源与真实性仍需确认。当前跨页状态见 [核对记录](cross-page-reuse.md)。
- 通用制作规格、来源限制及跨页复用规则见[总索引](README.md)。

## 1. 扫描结论

初次扫描时四个应用领域各有一张装配语境图。现已增加全幅 Hero 和每个领域的一张关键接口特写，能力区已接入铣削、车削及生产批次图，配套工艺共享图也已展示；RFQ 清单不增加装饰图。

规划图位共 13 个：新增 5 个，替换 0 个，保留 4 个，复用 4 个。复用图位不重复计算制作任务；“保留”只列现有资源，不要求重新生成。

## 2. 图文组织建议

Hero 增加真实组件装配场景；保留四张已有应用图，各新增一张接口细节，与零件页类别链接对应。能力区可复用两张加工图，RFQ 清单不再加图。

不新增图片的区域与限制：不新增汽车、医疗、航空等当前页面未介绍的行业图，不生成品牌客户设备、洁净室资质或压力测试合格画面。

## 3. 逐项图片要求

### 01. Hero

- 状态：新增。
- 优先级：P0。
- 英文文件名：`industries-oem-fixture-assembly-hero.webp`。
- 实际交付路径：`src/assets/images/pages/industries/industries-oem-fixture-assembly-hero.webp`。
- 展示比例：16:9；建议母版 2400 × 1350px。
- 制作提示词／保留要求：写实工业装配工位，一套小型定位机构由夹具底板、金属安装支架、定位块和轴支承组成，右侧完整可见各组件功能关系，背景干净，左侧低细节；非巨大机器人产线，不含客户品牌。
- 英文 Alt 草案：`Machined brackets and locating blocks in an equipment fixture`。

### 02. #automation / 应用主图

- 状态：保留。
- 优先级：P1。
- 英文文件名：`industry-automation-fixture.webp`。
- 现有资源：[src/assets/images/industry-automation-fixture.webp](../../src/assets/images/industry-automation-fixture.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前应用语境图，不作为已服务客户项目或整机制造能力证据。
- 英文 Alt 草案：`Locating blocks and a clamp securing a workpiece`。

### 03. #machinery / 应用主图

- 状态：保留。
- 优先级：P1。
- 英文文件名：`industry-machinery-shaft-assembly.webp`。
- 现有资源：[src/assets/images/industry-machinery-shaft-assembly.webp](../../src/assets/images/industry-machinery-shaft-assembly.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前应用语境图，不作为已服务客户项目或整机制造能力证据。
- 英文 Alt 草案：`Stepped shaft between bearing supports and a coupling`。

### 04. #fluid / 应用主图

- 状态：保留。
- 优先级：P1。
- 英文文件名：`industry-fluid-interface.webp`。
- 现有资源：[src/assets/images/industry-fluid-interface.webp](../../src/assets/images/industry-fluid-interface.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前应用语境图，不作为已服务客户项目或整机制造能力证据。
- 英文 Alt 草案：`Pneumatic manifold with threaded connectors and tubing`。

### 05. #laboratory / 应用主图

- 状态：保留。
- 优先级：P1。
- 英文文件名：`industry-test-equipment-mounting.webp`。
- 现有资源：[src/assets/images/industry-test-equipment-mounting.webp](../../src/assets/images/industry-test-equipment-mounting.webp)。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：保留当前应用语境图，不作为已服务客户项目或整机制造能力证据。
- 英文 Alt 草案：`Sensor mounting brackets on a fixture plate`。

### 06. #automation / 定位接口

- 状态：新增。
- 优先级：P0。
- 英文文件名：`industries-automation-locating-interface.webp`。
- 实际交付路径：`src/assets/images/pages/industries/industries-automation-locating-interface.webp`。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：自动化夹具局部近景，底板上的两根定位销与工件定位孔有合理配合关系，侧面压紧件固定工件，安装支架和可达紧固件清楚；定位销不穿透实体，工件不悬浮。
- 英文 Alt 草案：`Locating pins and a clamp positioning a workpiece on a fixture plate`。

### 07. #machinery / 轴与轴套接口

- 状态：新增。
- 优先级：P0。
- 英文文件名：`industries-machinery-shaft-sleeve-interface.webp`。
- 实际交付路径：`src/assets/images/pages/industries/industries-machinery-shaft-sleeve-interface.webp`。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：工业机械组件近景，短阶梯轴穿过有支承的轴套，一端轴肩靠近端面，另一端联轴器与轴同轴；支架、轴与套筒边界清楚，不做漂浮爆炸图或透明实体。
- 英文 Alt 草案：`Stepped shaft and sleeve supported in a machinery assembly`。

### 08. #fluid / 接口与密封面

- 状态：新增。
- 优先级：P0。
- 英文文件名：`industries-fluid-port-sealing-face.webp`。
- 实际交付路径：`src/assets/images/pages/industries/industries-fluid-port-sealing-face.webp`。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：单件流体接口块与一个拆下的螺纹接头放在旁边，孔口、平整密封环面和一处合理交叉流道开口可见；螺纹连续，无剖透封闭流道、压力表或气密认证标志。
- 英文 Alt 草案：`Threaded port and sealing face on a machined fluid interface block`。

### 09. #laboratory / 传感器安装界面

- 状态：新增。
- 优先级：P1。
- 英文文件名：`industries-test-equipment-sensor-bracket.webp`。
- 实际交付路径：`src/assets/images/pages/industries/industries-test-equipment-sensor-bracket.webp`。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：测试装置局部，金属传感器支架以长圆孔固定在小底板，传感器夹持环、调节余量和仪器侧壁接口清楚；无品牌和患者，不画精度读数或无菌设备。
- 英文 Alt 草案：`Adjustable sensor bracket mounted on a test fixture plate`。

### 10. Capabilities / CNC Milling

- 状态：复用。
- 优先级：P2。
- 英文文件名：`milling-three-axis-plate-setup.webp`。
- 共享资源：见[cnc-milling.md](cnc-milling.md)中的 `milling-three-axis-plate-setup.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用铣削专页三轴图，仅用于该能力卡片。
- 英文 Alt 草案：`Three-axis milling setup for a mounting plate`。

### 11. Capabilities / CNC Turning

- 状态：复用。
- 优先级：P2。
- 英文文件名：`turning-shaft-shoulder-cut.webp`。
- 共享资源：见[cnc-turning.md](cnc-turning.md)中的 `turning-shaft-shoulder-cut.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用车削正文近景，避免行业页另行生成机床库存图。
- 英文 Alt 草案：`Turning tool approaching a shaft shoulder`。

### 12. Capabilities / OEM production

- 状态：复用。
- 优先级：P2。
- 英文文件名：`production-separated-components-batch.webp`。
- 共享资源：见[production.md](production.md)中的 `production-separated-components-batch.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用生产页分隔批次图，与其他两张能力卡片保持统一比例。
- 英文 Alt 草案：`Small batch of machined brackets in separated trays`。

### 13. SecondaryProcessSupport

- 状态：复用。
- 优先级：P2。
- 英文文件名：`secondary-finished-housing-masking-detail.webp`。
- 共享资源：见[secondary-processes.md](secondary-processes.md)中的 `secondary-finished-housing-masking-detail.webp`；使用该主文档的交付路径，不在本页重复制作。
- 展示比例：4:3；常规正文建议母版 1600 × 1200px，报告等原始比例资源例外。
- 制作提示词／保留要求：复用配套工艺壳体图，保持外协能力说明。
- 英文 Alt 草案：`Housing with contrasting finished and mating surfaces`。

## 4. 本页验收重点

- 图像必须说明相邻正文的工件、工序或评审要点；不得用图片替代原有参数、FAQ 或询价字段。
- 新图先审工件结构、夹持、刀具可达性及测量接触关系，再检查风格；不得据图确认精度、牌号、资质或制造能力。
- 桌面和手机均检查裁切，完整保留关键工件、孔口及功能面；Hero 叠字需保持可读。报告按原始比例展示，不裁掉必要上下文。
- Alt 按最终画面修订，不照搬文件名推断设备类型或工艺结果。保留来源和公开许可记录。
- 需求清单不等同于交付验收；当前已接入范围及验证结果见下方实际接入记录。

## 5. 实际接入记录

2026 年 11 月 23 日将用户 `webp/` 中五张同名文件复制到上述资源目录，保留原始文件。Hero 直接使用 Astro Image，作为全幅背景等比覆盖、响应式裁切；保留标题、导语、导航和两处按钮，以遮罩保证文字可读。四张细节图加入 `src/data/images.ts`，沿用 ProcessImage，分别位于四个行业原主图下方，正文自然高度、完整等比显示和懒加载。桌面维持左图右文，手机上下排列；RFQ 清单及既有复用图位不变，无新依赖或环境变量。

实际画面与原制作目标的差异：Hero 为轴、深色定位支承与金属轴承支架组合；自动化图可见定位销与压紧机构，但不凭图确认定位配合；机械图为轴承支承与联轴器，不将其描述为已核验的轴套配合；流体图为螺纹孔块、侧面凹槽及接头，不据图声称密封或压力验收；传感器图为夹持环及带长圆孔的支架。Alt 按实际画面填写，所有图片不作为客户项目、设备资产、精度或认证证明，公开来源与许可需业务负责人确认。

生产页交付 `production-separated-components-batch.webp` 后，已在 OEM & Low-Volume Production 卡片补齐此共享图；全部 13 个规划图位现已接入。共享源文件位于 `src/assets/images/pages/production/`，不重复复制。

验证结果：`npm run build` 通过，共生成 23 个页面；`node --test tests/industries.test.mjs tests/cross-page-image-reuse.test.mjs tests/image-labels.test.mjs` 的 3 项测试全部通过。页面测试覆盖 320–1440px 的九种视口宽度，并复核 390px 与 1440px 的 Hero 和行业配图截图；图片加载、正文原始比例、Hero 背景覆盖、文字与按钮边界及原有链接、FAQ 检查通过。本次未部署，未执行全站测试。


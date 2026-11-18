# Belaro Precision 客服业务知识库

版本：1.0；整理日期：2026-11-16；来源：当前工作区网站页面和公开配置。正式网站部署状态及真实业务能力需由企业核实。本文可用于审核后的客服检索，不能替代正式报价、订单确认、NDA 或制造合同。

## KB-01 品牌、公司与联系方式

Belaro Precision 是网站使用的业务品牌，英文法定名称为 Shenzhen GEEKMATE Technology Co., Ltd.，中文法定名称为深圳市极客码头科技有限公司。业务围绕工业 OEM 客户的按图 CNC 加工和零件供应，重点是小批量及重复订单。

| 项目 | 网站公开信息 |
| --- | --- |
| 官网 | https://belaroprecision.com |
| 业务邮箱 | sales@belaroprecision.com |
| WhatsApp | +86 186 8218 8709 |
| WhatsApp 链接 | https://wa.me/8618682188709 |
| 深圳办公室 | Shajing, Bao'an District, Shenzhen, Guangdong, China |
| 东莞 CNC 工厂 | Mingsheng Machinery Factory, Building A, Yonglida Smart Industrial Park, No. 115 Xinhua South Road, Xinhe Community, Wanjiang Subdistrict, Dongguan, Guangdong, China |
| 官网询价入口 | https://belaroprecision.com/contact/#rfq-form |

两个地点应分开说明，不将东莞地址写成深圳办公室地址。东莞地址保留网站公布的英文原文，不自行翻译未核实的企业或园区中文专名。深圳办公室尚未公开完整街道门牌。来访、审核或送货前，先通过邮箱或 WhatsApp 确认接待、收货联系人及地址。WhatsApp 号码不等于另外公开的普通联系电话；网站未公布营业时间，不承诺全天人工在线。

来源：https://belaroprecision.com/about/ 、https://belaroprecision.com/contact/ 、https://belaroprecision.com/terms-of-use/ ；公开配置：`src/config.ts`。

## KB-02 核心加工服务

网站介绍的自有核心加工能力包括 CNC Milling 和 CNC Turning。具体零件是否可以承接、哪些工序在内部完成，需要按图纸及报价确认；能力概览不是设备资产清单，也不保证每个特征都可自制。

### CNC Milling

- 3-axis CNC machining：适用于刀具可达的平面、型腔、孔系等特征，典型类别为支架、块体、板件和壳体。
- 3+2 positional milling：也称定位五轴，两旋转轴先定位，在三轴切削时保持固定角度；可评审倾斜面、斜孔及多面特征。
- Simultaneous 5-axis machining：切削期间线性轴与旋转轴联动，面向复杂曲面及需要多方向刀具可达性的几何。
- 3+2 与联动五轴是不同加工方式，不可混为同一种。最终选择考虑几何、装夹、刀具可达性、材料及关键尺寸。

### CNC Turning

可评审轴、轴套、衬套、连接件和其他回转零件。评审关注配合直径、轴肩、孔、螺纹、跳动、同轴要求、基准与功能表面。螺纹需注明标准、尺寸、等级或配合及内外螺纹。轴承位需提供直径、公差或配合、粗糙度和基准要求。

需要车铣组合时提交完整图纸，不仅提交局部外形；不确定工艺时，可在 RFQ 选择 `Not sure — please review`。不能仅凭照片或文字确定工艺或承诺可制造性。

来源：https://belaroprecision.com/services/ 、https://belaroprecision.com/services/cnc-milling/ 、https://belaroprecision.com/services/cnc-turning/ 、https://belaroprecision.com/about/ 。

## KB-03 二次工艺与外协范围

磨削、热处理、表面处理及其他二次工艺可以通过东莞、深圳制造生态与供应商网络协调。不能表述为所有工艺均在自有工厂完成。可将加工与后处理作为一份完整需求评审，但最终包含的工序、供应商范围、责任、验收标准、文件及交期以报价和订单为准。

询价请说明：准确材料牌号与状态、工艺或涂层标准、热处理与硬度、最终尺寸公差、表面粗糙度、遮蔽及禁止处理区域、处理后检测与记录需求、数量与目标交期。涂层厚度、热处理变形和磨削余量对最终尺寸的影响需要评审。

其他后处理不属于无条件固定服务目录。供应商资质、特定处理证书、特殊试验和记录均需单独确认，不能凭网页图片推断已具备某项工艺。

来源：https://belaroprecision.com/services/secondary-processes/ 、https://belaroprecision.com/about/ 。

## KB-04 六类代表性零件

| 类别 | 常见工艺 | 评审重点 |
| --- | --- | --- |
| Mounting Brackets（安装支架） | CNC Milling | 安装面、孔位、槽腔、装配间隙和刀具可达性 |
| Machined Blocks（加工块体） | CNC Milling | 基准、定位、孔深孔位、平面度及垂直度 |
| Precision Shafts（精密轴） | CNC Turning | 配合直径、轴肩、跳动、同轴要求及配合面粗糙度 |
| Bushings & Sleeves（衬套与轴套） | CNC Turning | 内外径配合、壁厚、长度、端面与倒角 |
| Custom Connectors（定制连接件） | CNC Turning | 螺纹标准、配合接口、轴肩、内孔及二次加工 |
| Plates & Housings（板件与壳体） | CNC Milling | 型腔、壁厚、安装孔、基准、功能面及外观面 |

这些是按图定制类别，不是标准件库存、现货 SKU、固定价目录或真实客户案例证明。图片不能用于推定材料牌号、尺寸、公差、设备归属或客户关系。请提交自己的图纸和需求进行评审。

来源：https://belaroprecision.com/machined-parts/ ；共享数据：`src/data/machined-parts.ts`。

## KB-05 应用方向

网站列出四类应用方向：工业自动化、工业机械、液压与气动设备、实验室与测试设备。未列出的行业也可提交图纸、材料、数量及应用背景评审。

行业页面描述的是应用语境，不代表已服务过某客户或已取得行业认证。液压/气动相关压力等级、泄漏试验、清洁度验证、系统合规均不是默认服务；须在询价中写明要求和所需证据，再确认可行性及责任。不能根据实验室应用介绍推断医疗、航空、汽车或其他受监管领域认证。

来源：https://belaroprecision.com/industries/ 。

## KB-06 材料、尺寸、公差和设备

材料、尺寸、几何、公差、加工路线和测量能力必须结合图纸逐项目确认。网站未发布统一保证的公差、最大加工包络、最小壁厚或完整且经核实的设备型号与数量清单。不得承诺任意材料或全部特征都能达到某个固定精度。

RFQ 的材料选择器提供以下需求填写选项，也允许自定义输入；这是表单词表，不是已验证的加工能力、备料或现货清单：

- Aluminium 6061、6082、7075、5052、2024。
- Stainless Steel 303、304、316、316L、17-4 PH。
- Carbon Steel 1018、1045；Alloy Steel 4140。
- Brass C360、Copper C110、Bronze C932。
- Titanium Grade 2、Grade 5。
- POM / Acetal、Nylon / PA、PEEK、PTFE、ABS、Polycarbonate / PC、PMMA / Acrylic。

询价中注明准确牌号、材料标准、状态、热处理及文件需求。材料不在列表中可以自行填写，也可以请求建议。替代材料、放宽公差或更改设计需客户批准，AI 不可直接决定。必须区分加工前与处理后尺寸要求，并约定验收依据。

来源：https://belaroprecision.com/contact/ 、https://belaroprecision.com/quality/ 、https://belaroprecision.com/services/cnc-milling/ 、https://belaroprecision.com/services/cnc-turning/ ；材料词表：`src/components/MaterialSelect.astro`。

## KB-07 数量、重复订单和报价时效

网站宣传 No MOQ，即不设统一最低起订量。可以提交单件、试制、小批量和重复 OEM 需求评审；这不等于任意单件都必然承接、免费打样或免收准备费用。服务总览中的约 20–500 件属于示例性批量，不是最低或最高订单限制。数量、价格、生产安排和是否承接仍需按零件确认。

对于资料完整的图纸询价，网站以 24 小时内报价回复为目标。这不是所有项目无条件在 24 小时内获得最终报价的保证，也不是 24 小时交货、24/7 人工在线或合同 SLA。复杂项目或缺失资料可能需要进一步澄清。

重复订单需重新确认图纸版本、材料、数量、验收及交期。年度需求、分批交付或框架订单可以提出讨论，不是已自动生效的商业安排。生产交期需评审后提供，不存在公开统一的固定生产天数。

来源：https://belaroprecision.com/ 、https://belaroprecision.com/services/ 、https://belaroprecision.com/services/production/ 。

## KB-08 询价资料和合作流程

推荐提交带尺寸的 PDF 图纸及可用的 STEP 或其他 3D 模型，注明零件号、图纸版本、单位、材料牌号、数量、关键公差、表面及后处理、检验文件、包装及目标交付地点和时间。只有 3D 外形通常不足以定义全部生产与验收要求；图纸与模型不一致时先澄清依据。

正常业务流程为：提交图纸及要求 → 技术评审与报价 → 书面确认生产范围 → 按约定检验与交付。首件审批、里程碑及变更通知方式需在项目中约定。

RFQ 表单必填：姓名、业务邮箱、公司、国家/地区，以及允许就本询价联系的同意。电话和图纸为可选；`Add details (optional)` 中的工艺、材料、数量、公差/关键要求、文件需求和项目备注均为可选。资料填写可选不代表正式报价无需技术要求。

表单没有单独目标交期字段，需要时可在项目备注填写，预计交期由评审后提供。不确定加工工艺可选 `Not sure — please review`。询价不等于下单、付款或生产已经开始。网站没有在线结账和订单状态查询功能。

来源：https://belaroprecision.com/contact/ 、https://belaroprecision.com/services/production/ 、https://belaroprecision.com/terms-of-use/ 。

## KB-09 上传与提交问题

网站 RFQ 当前一次接受一个附件，界面标注最大 20 MB，代码阈值为 20 MiB（20 × 1024 × 1024 字节）。支持 PDF、STEP、STP、IGES、IGS、X_T、DWG、DXF、ZIP 扩展名；多个相关文件可打包为一个 ZIP，仍受单附件大小限制。前端支持格式不代表所有真实文件均已验证通过后台；最终仍受服务器、格式和安全校验约束。

文件超限或上传失败时，检查扩展名、大小、网络及页面错误提示；可以联系业务邮箱安排合适的传输方式，不自行推荐未批准的公共网盘或要求访客关闭浏览器安全保护。敏感图纸先确认保密安排。网站 RFQ 限制不能直接套用于聊天附件，聊天大小和格式需按客服系统配置另行确认。

网站表单需要 JavaScript；启用人机验证时应完成验证。没有成功提示或网络异常时，不要据此断定后台必然未收件，也不要反复提交。保留错误信息、提交时间和业务邮箱，通过人工渠道核对。只有真实后台明确确认，AI 才能声称收到询价；聊天内收集信息不自动创建 RFQ。

来源：https://belaroprecision.com/contact/ ；表单实现：`src/pages/contact/index.astro`、`src/lib/gravity-forms.mjs`。

## KB-10 质量、检验与随货文件

生产前确认图纸版本、材料、基准、关键特征、一般及特殊公差、测量方法、检查频率、记录及验收条件。检验范围按项目约定，不能承诺默认每件每个尺寸全检。抽检需约定批次、样本、选取方式与接收规则，不假定统一 AQL。

首件确认的特征、样本数量、审批方式、联系人及是否暂停后续生产，需事先约定。对所有零件检查部分特征不等于对每个零件的所有图纸特征全检。首件批准也不自动等于整批验收。

询价表单可提出 FAI report、CMM / dimensional report、EN 10204 3.1 material cert 需求。是否可提供、文件内容、特征和样本覆盖、模板、语言、费用及交付时间均须确认，不是默认免费随货。CMM 文件选项不证明拥有 CMM；正式 FAI、PPAP、认可实验室测试及认证不能视为标准服务。网站未声明质量认证或认可实验室资质，不回答“已通过 ISO”等未经确认的断言。

网站尺寸报告为虚构零件与数据的样本，不是真实交付记录。仪器图片和方法示例不构成设备资产或校准证明；下单前按项目核实仪器类型、量程、分辨率、校准及内外部检测安排。

来源：https://belaroprecision.com/quality/ 、https://belaroprecision.com/contact/ 。

## KB-11 包装、异常和售后

网站描述的包装方式为零件单层加厚 EPE 珍珠棉包裹后装入结实瓦楞纸箱，额外防护按项目约定。防锈、清洁度、端盖、螺纹保护、独立包装及特殊运输要求需提前提出。标识内容如零件号、版本、数量、订单及批次信息按订单约定，图片空白标签不是实际出货追溯记录。

发现质量问题时提供订单参考、零件号、图纸版本、涉及批次与数量、要求值、实测值、测量方式及相关照片或报告，交由人工审核。偏差处置可能涉及返工、更换或客户书面让步接收，但 AI 不可擅自批准偏差、退款、赔偿或确定责任。已知不合格件不能无所需批准而作为合格件放行。

价格、币种、付款、运输、税费、Incoterms、交期、取消、退换、返工和退款等以适用的书面商业文件和法律要求为准；公开网站未提供统一政策，不能自行补充。

来源：https://belaroprecision.com/quality/ 、https://belaroprecision.com/terms-of-use/ 。

## KB-12 图纸、保密与隐私

网站政策说明，技术文件仅用于评估、报价及订单的生产检验，不用于营销或公开展示；技术文件按工作必要范围供相关人员及服务商处理，需要外协时仅共享必要技术信息并遵守保密要求。不能承诺图纸绝不向任何供应商共享，或所有文件永不离开内部系统。

提交询价不转移图纸所有权，也不自动构成已签署 NDA。敏感图纸应先约定 NDA、允许共享范围及处理方式；AI 不能代签协议或提供绝对安全保证。不要通过表单或聊天发送身份证明、银行卡、密码、敏感个人信息或未经约定的出口管制技术资料。

网站运营在中国；资料可能在中国及服务商所在国家处理。未公开统一固定保留年限、自动删除时间表或自助删除工具，不能承诺“30 天自动删除”“仅境内存储”“从不用于模型训练”等未核实平台事实。

隐私访问、更正、删除、停止跟进或保留期限问题，请发邮件至 sales@belaroprecision.com，主题可为 `Privacy request`，说明相关询价背景；人工可能需要核实身份和适用要求。清除浏览器本地聊天记录不等于删除服务端消息或已提交询价。

网站包含第三方在线客服，可能处理聊天消息、主动发送的附件及浏览器会话存储；该知识库本身不提供真实客服平台的存储期限、模型训练设置或服务器位置。相关问题需人工核验，不能将公开网页的爬虫/训练许可扩展至客户私密资料。提交询价不等于订阅营销邮件。

来源：https://belaroprecision.com/privacy-policy/ 、https://belaroprecision.com/cookie-policy/ 、https://belaroprecision.com/terms-of-use/ 。

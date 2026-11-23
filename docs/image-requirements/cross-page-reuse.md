# 跨页图片复用核对记录

核对日期：2026 年 11 月 23 日。检查所有需求文档中明确标记“复用”的 35 个图位，34 个已落地、1 个按可选规则不重复添加，无待图项。材料页没有额外明确的跨页新增资产复用任务；政策页不新增装饰图片。

2026 年 11 月 24 日补充：上述统计对应初始规划；Production 根据用户反馈额外补入 3 个复用图位，现共展示 11 图，详见 [Production 接入记录](production.md#5-实际接入记录)。追加图位复用现有源文件，不增加资产副本。

## 1. 本轮变更

在 9 个页面补齐或替换 19 处，其中 16 处复用已交付新增图，3 处补齐原有共享图。

| 页面 | 本轮图位与位置 | 数量 |
| --- | --- | ---: |
| 首页 | 能力概览：三轴、3+2、五轴、车削，位于说明及参数之后，桌面四列、手机两列 | 4 |
| Services | 配套工艺：以阶梯轴细节图替换旧综合拼图 | 1 |
| CNC Milling | 配套工艺：以阶梯轴细节图替换旧综合拼图 | 1 |
| CNC Turning | 配套工艺：补齐共享阶梯轴图 | 1 |
| About | 区域供应商网络：补齐壳体遮蔽图 | 1 |
| Industries | 铣削及车削能力卡片各一图，配套工艺区壳体遮蔽图 | 3 |
| Machined Parts | 图纸与修订栏审查图、材料检验栏尺寸检查图、配套工艺区壳体遮蔽图 | 3 |
| Production | 四步流程后审查图、交付要求下包装图、质量要求下批次标识图、配套工艺区壳体遮蔽图 | 4 |
| Quality | #requirements 的三项要求之前补齐图纸审查图 | 1 |

## 2. 未接入项及原因

- 原待交付的 `production-separated-components-batch.webp` 现已由用户提供，源文件位于 `src/assets/images/pages/production/`。Services 的 `#production` 已替换旧综合图，Industries 的 OEM 能力卡片已补图，共补齐 2 个复用图位。
- Contact 的 1 处是条件可选项。现有 `contact-rfq.webp` 已配合资料准备说明，不重复展示首页审查图，符合原需求规则。
- 本轮不制作其他尚未交付的新图；完成共享图位不等于所有页面新增需求全部完成。

## 3. 技术与来源

### 新增主资产与跨页依赖复查

本次再次核对全部 21 份页面需求（含六份材料页及三份政策页）、现有源文件和构建页面，未发现新的必需复用漏项，因此没有重复改动已接入的页面，也没有复制共享图片。

| 新增主资产 | 主页面 | 已接入的其他页面与位置 |
| --- | --- | --- |
| `home-drawing-led-component-review.webp` | 首页 | About 图纸评审、Machined Parts 图纸与修订、Production 需求分享、Quality 要求确认；Contact 按可选规则不重复添加 |
| `milling-three-axis-plate-setup.webp` | CNC Milling | 首页能力概览、Industries 铣削能力 |
| `milling-indexed-angled-bracket.webp` | CNC Milling | 首页能力概览 |
| `milling-five-axis-contoured-mount.webp` | CNC Milling | 首页能力概览 |
| `turning-shaft-shoulder-cut.webp` | CNC Turning | 首页能力概览、Industries 车削能力 |
| `production-separated-components-batch.webp` | Production | Services 生产支持、Industries OEM 能力 |
| `secondary-ground-shaft-detail.webp` | Secondary Processes | Services 配套工艺、CNC Milling 配套工艺、CNC Turning 配套工艺 |
| `secondary-finished-housing-masking-detail.webp` | Secondary Processes | About、Industries、Machined Parts、Production 的配套工艺区 |

上述 8 张新增主资产对应 19 个必需跨页复用图位，均已接入；另外 15 个必需图位复用原有图片，共 34 个。Quality 新交付的三张图片及 Industries 的新增接口细节图没有其他页面的明确复用需求，不自行扩展图位。六份材料页提到的 FAQ/RFQ 复用 Hero 均为本页可选规则，不属于跨页待办。

本次复查验证：`npm run build` 通过，生成 23 页；`node --test tests/cross-page-image-reuse.test.mjs tests/image-labels.test.mjs` 的 3 项测试通过。新增关联检查覆盖 34 项新增/替换主资产、8 项共享新增资产及其 19 个必需图位；浏览器逐项验证全部 34 个实际复用图位在 390px、1440px 的加载、防拉伸、Alt 和页面横向溢出，并保留综合加工页手机端隐藏 RFQ 辅助图的例外。首页手机端及 Industries 桌面端截图已人工复核。`git diff --check` 通过，仅提示已有换行符转换警告；未部署。

原非材料页清单的 34 项新增/替换主资产中，33 项已有源文件；`cnc-machining-oem-components-hero.webp` 专用图仍未交付，综合加工页当前按既有记录复用 Services Hero。这是专用主图的交付项，不是未完成的跨页复用项。

不改动或重复复制原始图片。首页审查图加入 `src/data/images.ts`，由各页面共享同一源文件。正文使用 Astro 响应式图片、自然高度、Alt 和懒加载；配套工艺通过 `SecondaryProcessSupport` 可选属性显式传入，不修改其他页面的默认行为。正文完整等比显示，不拉伸、不添加 AI 来源标签。

图片来源沿用原始交付记录。画面、文件名、跨页复用或构建通过，不等于企业设备归属、许可、制造能力及工艺真实性已核验。

## 4. 验证与维护

运行 `npm run build` 后执行 `node --test tests/cross-page-image-reuse.test.mjs`：逐条核对 35 个需求，检查 34 个实际复用图位及本轮新增的 2 处批次图在 390px、1440px 的解码、比例、Alt、响应式资源和横向溢出。截图输出到系统临时目录，结果以实际执行输出为准。

批次图已同时接入 Services 与 Industries，回归测试已取消对应缺图例外，并检查共享源文件仅保留一份。

本轮实测结果：`npm run build` 通过，共构建 23 个页面；交叉复用、About、Services 配图、CNC Turning 配图、CNC Milling、首页、Industries、Machined Parts、Quality、Secondary Processes 和来源标签检查共 11 项测试全部通过。`git diff --check` 通过。项目未配置独立 TypeScript 检查或 lint 脚本，本轮未新增依赖或环境变量。

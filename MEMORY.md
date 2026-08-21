# 17 Returns — 项目记忆

> 跨会话铁律与教训。开干前与 [`CURRENT.md`](./CURRENT.md)、[`AGENTS.md`](./AGENTS.md) 一起读。  
> 写在仓库里，不是本机私有记忆。

---

## 锁定面（不要悄悄改）

| ID | 面 | 规则 |
|----|----|------|
| **H1** | Hero CTA | `btn-switch`（Free Trial）+ `btn-demo`（Book a Demo）。不要换成别的按钮组。 |
| **H2** | Hero 插图 | 人像照片 + 三张玻璃浮卡（商品 / 原因 / 方式）+ 假鼠标自动演示。禁止退回 Safari 门户。 |
| **H3** | 自动演示 | 假鼠标循环：外套 → 原因 → Green Return。**悬停只做 3D 倾斜，禁止暂停演示。** |
| **H4** | 主题色 | 青绿 `#0d9488` / `#14b8a6` / `#0f766e`，对齐定价「订阅」按钮。 |
| **H5** | Hero 背景 | API 同款自研 WebGL（Swirl + ChromaFlow + FlutedGlass），**不走 npm `shaders` 包**。青绿：left `#0d9488`（替换 API 橙 `#FF3805`）、down `#14b8a6`、right `#0f766e`、up `#99f6e4`。**不要 FilmGrain**（白底发脏）；Swirl 副色 `#f0f7f3`（2026-08-17 两轮调出：近白 `#f7fffc` 静止时几乎看不见；`#e9f2ee` 又太亮抢插图，最终取中间值——静止可见、不压插图）。窄屏 / 减动效用静态青绿渐变。 |

---

## Hero 插图（2026-08-13 调过）

- 照片：Pexels 坐姿米色运动装（原参考金发墨镜图库没有授权可用源）。
- 人物卡：靠右；宽度约 **620px**（520 偏窄，铺满右栏 ~800 偏大）。
- 左两张浮卡（商品 + 原因）贴照片**左缘**，不要挡人脸。
- 方式卡在右下，可压腿，不要压脸。
- 节点连线是 flow 列里的真连接（两点 + 虚线），不要用绝对定位假虚线。
- 3D hover 挂在整块 `.rt-hero-visual` 上。

**踩坑：** 曾经在 `pointerenter` 里 `pause()` 自动演示，Park 两次明确不要。不要加回来。

## Hero CTA（2026-08-17）

- **阴影只向下投**：`.returns-page .btn-switch` 的外阴影要满足 offset ≥ blur − |spread|（现为 `0 2px 3px -1px`，hover `0 10px 18px -8px`）。原 `0 4px 14px` 的模糊晕圈会溢到胶囊顶上方，Retina 下叠着 wash 灰纹读成一条「黑边」（Park 截图反馈过）。
- **Border beam**：tracking 的 `.btn-switch` beam 由 `ai-lab.js` 的 `switchBtnFx` 挂，只在页面有 `#ai-lab` 时加载；Returns 没有 AI Lab 区块，所以单独建 `src/fx/modules/returns-cta-beam.js`。2026-08-18 起覆盖**全站** `.returns-page .btn-switch`（Hero / FeatureRows×4 / Plans / BrandsSay / BottomCta 共 8 颗；`FeaturesSection.jsx` 未被 LandingPage 引入不算），离屏实例 IntersectionObserver 加 `data-paused` 停动画（多实例已验证：任意滚动位置只有视口内的在转）。色板用 `border-beam.js` 新增的 **teal** 变体，`hueRange: 10` 锁色相，别用默认 colorful（会飘蓝紫）。常亮薄荷描边（含 hover / on-dark）统一 `rgba(204,251,241,.7)`、hover `.85`。
- **Beam 可见性踩坑**（同日 Park「效果没看到」）：光斑颜色必须用**亮 mint/冰青**（teal-100/200、cyan-200 档）——中深 teal 打在青绿按钮上同色隐身；参数要 `borderWidth: 2` + stroke 0.95 / inner 0.75 / bloom 0.65，首版 1px + 0.5 档肉眼看不出。挂载本身当时是通的（data-beam/style 都在），别只查挂载不查对比度。
- **端口对照**（勿混）：5173 = Tracking API · 5174 = Order Tracking · **5175 = Returns**。验证 Returns 一律打 5175，别信 vite 终端里旧的启动日志。
- **弱相位兜底**：beam 遮罩一圈里有约 1/3 弧段是暗区，扫到弱相位时整颗按钮会瞬间「没效果」。按钮静态描边提亮为常亮薄荷 `rgba(204,251,241,.7)`（原 .35 mint），任意瞬间边缘都点亮，beam 高光在其上扫动（对齐 tracking 常亮 rim 观感）。

---

## 布局约定

- Feature 四块：桌面每块高度 `viewport − topbar − 96`，块间距 12。文案/插图 `gap` 28，不要再拉回全屏 + 56 中缝。
- 画布 1440 · 左右 gutter 48（`returns-page.css` 顶部变量）。
- Hero 栅格：文案列 `minmax(0, 500px)`，插图列吃剩余并右对齐。
- Returns 专属覆盖写 `src/styles/returns-page.css`；共享壳/动效在 `src/styles/landing.css` 与 `src/fx/`。
- Stats 四象限底部边距比顶部多留一截（2026-08-17 Park）：`--rt-stats-gap-bottom = gap-y + 64px`（≤960 收成 +44px），别改回上下对称。

## ROI 区背景动效（2026-08-17）

- CSS 层：`.rt-roi::before/::after` 两团青绿 radial 光晕，纯 CSS keyframes（26s/34s 呼吸漂移）。必须淡（alpha ≤0.1），不抢白字/输入框。
- WebGL 层（同日 Park 追加）：shaders.com **Point Waves 1**（preset 569774bc）自研复刻 `src/fx/modules/roi-point-waves.js`，**不走 npm `shaders` 包**。配方来自页面 payload：SolidColor ← Surface3D(DotGrid ← LinearGradient 亮度 map)。关键参数：density 57 · amp .3 · freq 1.5 · octaves 2 · tilt 70° · zoom 1.05 · farCutoff .105 · light(.4,-.6,.7)。
- Park 三轮口味调整（勿回退）：dotSize=亮度×**0.14**（原 .21，嫌大）· 点透明度 ×**0.30**（0.62→0.38→0.30，两次嫌亮）· 高光 ×0.02（原 ×0.04）· 底色面板同色 `#141414` · **点屏幕半径封顶 CSS 2.6px**（近景大点会被波面畸变拉成不规则团块，封顶后畸变无放大空间，轮廓处导数异常也只会缩没不会成团）。
- **圆点判定改屏幕空间**（Park「不够圆」）：原版在贴附网格空间量 fract 距离，透视把点剪成斜杠（官方缩略图同样）。现用 Pass1 输出的 UV 雅可比（第三个 MRT 目标）逆变换到屏幕像素距离，点恒为正圆、半径按 √|detJ| 随距离衰减。两个坑：① 雅可比必须在 Pass1 全精度里 dFdx，别在半精度纹理上取 fwidth（量化噪声=雪花）；② uvMask 目标必须 **RGBA32F + NEAREST + shader 手动双线性**（32F 线性过滤是 OES_texture_float_linear 扩展；半精度 UV 的 ~5e-4 量化在点判定里是可见毛边）。
- 复刻架构：Pass1 raymarch（MRT×3：uvMask 32F + lit/jac 16F，内部长边 ≤**1024**）→ Pass2 全分辨率点阵合成。**需要 WebGL2 + EXT_color_buffer_float**（MaterialX 整数哈希要 uint 位运算）；不支持 / 弱 GPU / 减动效 / ≤768 → 不挂载，CSS 光晕就是降级。
- **鼠标涟漪交互已删**（Park 同日：「划过抖动太厉害，禁止鼠标滑动动画」）：指针监听 + 256² CPU 波动方程整段移除，shader 的 uCursorActive 恒 0、波场纹理保留全零。只留 animT 驱动的自动波浪。别加回来。
- 性能：原引擎 compute 长边 1600，WebGL fragment 跑同样数学在 M2 Pro 只有 ~12fps；降到 1024 + 30fps 节流后观感无损（UV 场平滑、点在 Pass2 全分辨率画）。别把 COMPUTE_MAX 加回 1600。
- 测试坑：Lenis 页面里 `scrollIntoView` 会被弹回顶部，IntersectionObserver 不触发；验证自动挂载要直接设 `scrollTop` 或真实滚动。

## 响应式断点（2026-08-17）

Park 要看的档：480 / 768 / 1024 / 1200 / 1440。Returns 专属写在 `returns-page.css`，不要改 `landing.css`。

| 宽度 | gutter | 布局 |
|------|--------|------|
| **1440** | 48 | 桌面：Hero 双栏、Feature sticky 双栏 |
| **1200** | 40 | 仍桌面构图，只收 gutter |
| **1024** | 32 | Hero 双栏改比例（文案可缩、插图吃更多）；Feature 仍 sticky 双栏；Stats 标题可换行、标签可折行 |
| **768** | 20 | Hero 堆叠；浮卡收进照片内，禁止 `left: -48px` 撑出横向滚动；shader 仍关；运单/FAQ 收紧 |
| **480** | 16 | 小屏：Stats 四象限改单列；ROI 单列；Feature 02 只留中间 AI 面板（规则卡会裁切）；CTA 全宽、热区 ≥44px |
| **960**（内部） | 24 | Feature sticky **在此改为堆叠**（CSS + `FeatureRows.jsx` `matchMedia` 必须一致）。Plans 单列。 |

移动端铁律：

- 不横向溢出。Hero 用 `overflow-x: clip`；功能行插图列 `overflow: hidden`。
- 窄屏浮卡贴照片内缘，不要为了「压左缘」伸出视口。
- Dock：`max-width: calc(100% - 24px)`，`--dock-bottom` 吃 `safe-area-inset-bottom`。
- 不要为了手机把 1200/1440 桌面构图改坏。

---

## Feature 板块布局（2026-08-17 Park 重排）

- 四块同构「太平平无奇」→ 用 `FEATURES[].reverse` 交错：2/4 块图左文右（`rt-feature-slide--flip`，grid 列互换 + order）。≤960 堆叠时翻转失效、恢复文上图下。
- 每块专属主题色 `--ft-accent/--ft-tint`（nth-child：青绿 #0d9488 / 紫 #7c5cfc / 琥珀 #d97706 / 蓝 #2563eb），现在**只有勾选圆点**在用。
- **已删除，别加回**：01/04 步进计数（`rt-feature-step`）、视口顶部白雾（`rt-feature-viewport::before`）、滚动离场 blur（`--fp-blur`/`is-leaving`）、插图后主题色衬底（`rt-feature-media::before`，Park：「features 都不需要背景」）、标题上方主题色短条（`rt-feature-copy::before`，Park：「不要这个横杠」）。滚动只留轻透明度衰减（--fp-op ≥0.4）。

---

## Feature 01 插图（2026-08-14）

照片铺满、无外框。浮件按旧工具构图：

- 右上 **Return center** 查询框（Order number / Email / Search）。
- 左侧真实 **Color picker**；选中色同步到 Search 按钮。
- Return center：鼠标拖出选框，松手后卡片出现 + 蚂蚁线。不要描边绕一圈。
- 同一只鼠标滑到 Color picker：先拖色相条，再去色板选色；Search 按钮全程跟随。
- Return center 居中。邮件往右、压在照片里。毛玻璃是 `backdrop-filter`。功能行禁止 mask-image / 常驻 transform / filter，否则玻璃失效。
- 左下 3.5x Customer LTV。
- 不要加回浏览器窗 / Brand experience / 商品卡。

---

## Feature 02 AI 插图（2026-08-14）

- **不要深色井**。`.rt-wf-scene` 保持透明，禁止 `#0b1020` 那坨黑底。
- 机器人必须 **纯 CSS**，禁止 image 生成图 / `<img>` 贴图。
- 造型锁定参考：白瓷圆头、粉→青描边面罩、两只白光眼；眼睛跟鼠标。
- 右侧 AI 面板拉高铺满插图列（top/bottom 钉住），不要矮卡片。
- 输入框打字 → 发送 → 左边规则卡逐条生成；循环播。
- 面板在左，三条规则卡在右，贴着面板右边略压上去；最上面一张毛玻璃。三条分开排。
- 内容要够：规则卡带 When/Then；下面 Trigger→Condition→Action 点亮；右下 Pending 队列随规则变成 Auto；面板里回显 Created。

---

## Feature 03 收入挽回插图（2026-08-14）

- **不要** tracking 那套 Request→Offer→Keep 路线图 / 货车。
- **不要深色井**。和 01/02 一样透明拼贴，白卡片直接浮在页面上。
- 内容锁定产品拦截 UI：Keep your item、Instant Refund $20、Store credit、Try an exchange。
- 20%+ Revenue Recovery Rate 青绿徽章画在插图里（`badgeInArt`），不要外面再叠一个。
- 背景是上升增长曲线（面积图），线下半透明青绿渐变，对到 20%+。不要品红连线。
- 曲线最后出现，沿线慢慢画（约 3.2s），画完留着不要收回。不要矩形裁切。悬停不要暂停。
- 拼贴居中成一团：Keep / credit 左，exchange 略压上去，20%+ 贴在换货卡上方。不要左栏居中、右栏贴顶那种一高一低。

---

## 整页兼容（2026-08-17）

Park：最大兼容，但效果与动画保持、不卡。不要用「更多设备关 shader / 砍动画」交差。

- **减动效约定不变**：`__reduceFx` / 窄屏 / `prefers-reduced-motion` 仍按现有门闩。不要再扩一圈「弱设备直接关」。
- **Hero shader**：WebGL1 能跑通（byte-packed 流场 + RGBA8 FBO）；WebGL2 / RGBA16F 仅探测后可选。fragment 精度：支持 `GL_FRAGMENT_PRECISION_HIGH` 就 `highp`，否则 `mediump`（2026-08-17：全 mediump + 低分辨率导致玻璃棱锯齿，Park 反馈后放开）。context lost / 编译失败 → `hero-shader-fallback`，不抛错。DPR cap 2 / 长边 ≤2880（弱 GPU 1.25 / ≤1920，别再全局压回 1.5，会出锯齿）；离屏与 `document.hidden` 停 rAF；resize debounce。弱 GPU 流场 96，其余 128。色板仍是青绿，无 FilmGrain。
- **滚动**：Lenis 切标签停 rAF，回来继续。Feature sticky 跟滚动/Lenis 合帧，不要整页常驻 rAF。
- **Dock**：Returns 用 frosted；无 WebGL2 / 编译失败仍走毛玻璃，不要白屏。
- **CSS**：`100vh` 写在 `100dvh` 前面；无 `backdrop-filter` 时玻璃卡白底更实。不要改 `landing.css`。
- **插图**：无 IntersectionObserver 时演示仍要播；不要改 Hero 构图，悬停仍不暂停自动演示。

## Feature 04 运单插图

- 运单按插图列拉高（纸面铺满左列，条码钉在底部），页脚留在纸上。
- 比价卡只贴运单**右缘**，禁止压条码。三张卡之间留空隙，不要叠在一起。
- 18%+ 改成青绿徽章，贴在比价卡上方。不要大号渐变字单独占一行。

## Explore Tracking 卡（2026-08-21）

- Returns 落地页的 Explore 左卡是 **17 Order Tracking**，底色必须是 **17TRACK 蓝** `#003a9b` 家族（`#1a5cd4 → #003a9b → #002a75`），**不要**用 Returns 青绿 `#20B195`。
- Hover 高光：指针跟随的白/冰蓝径向 spotlight（`::before`，`mix-blend-mode: normal`）。深蓝底必须用亮白/sky，中蓝会隐身。3D tilt 仍走 `.explore-card` 公共逻辑。
- 右侧面板：上面两张浮卡（WISMO / video）要小；下面是 17TRACK **Shipping Events** 竖轨（绿点最新 + 菱形历史），不是空白板。无衬线，浮卡实心白。
- Hover：两张浮卡同向，轨迹卡反向（`landing-inline.js` 里 board `px,py` vs wismo/video `ox,oy`）。禁止再把 video 和 board 设成同向。
- 类名 `explore-card-tracking` / `.track-ui-*`，样式只写 `returns-page.css`。不要改 `landing.css` 里的 `.explore-card-returns`（那是 tracking 站的 Returns 卡）。
- Tracking 卡 icon 是**包裹**（盒身/盖/中缝），不是时钟。hover 描边 play，对齐 Returns/API。
- Explore 动效必须盯 `.explore-grid` 挂 `landing-inline`（ASCII 底纹 + 3D tilt）。不要只观察 `#key-features`：Returns 的 FeatureRows 对不上旧 features DOM，脚本会永不挂载。

## 工程教训

- 本地曾不是 git 仓库；远程 `CalicoX/Returns` 从空仓推上，默认 `main`。
- 不要提交 `node_modules` / `dist`。
- 用户名 Park，角色设计师，改完给预览 URL，少讲实现细节。

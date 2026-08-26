# 17 Returns — 当前真相

> 保持短。规则见 [`AGENTS.md`](./AGENTS.md)，记忆见 [`MEMORY.md`](./MEMORY.md)。

| | |
|---|---|
| **Repo** | https://github.com/CalicoX/Returns |
| **栈** | React 19 + Vite 8 · 无 TypeScript |
| **预览** | `npm run dev` |
| **分支** | `main` |

---

## 产品

17TRACK 的 Returns 产品落地页：退货流程、ROI、功能行、定价、FAQ、客户评价。英文站。

### 页面顺序

Topbar → Hero → TrustBand → BrandsSay → StatsRow → RoiCalculator → FeatureRows → Plans → Faq → ExploreMore → Credentials → BottomCta → Footer + ProductDock

TrustBand：标题/副标题居中；logo 静态 **两排各 6**（Tracking 同款 12 家，列距 72）。不要跑马灯、不要 Shopify/SHEIN/Temu。

BrandsSay：紧跟 TrustBand，**白底**（标题/副标题深色）。卡片仍是照片+白字跑马灯；卡内 logo 偏暗（opacity 0.7），引用/署名更亮。不要深色底、不要放回 ExploreMore 后面。

ExploreMore Tracking 卡：标题/CTA 都是 **17TRACK Order Tracking**（不要 Explore）；17TRACK 蓝；正面包裹 icon；右侧是 **5175 tracking-react Hero 模块**（`os-status` + WISMO / Brand video 浮卡），不要自制 Shipping Events 板。API 卡源码对齐 5175（Lucide `</>`、终端毛玻璃、ASCII `translateY`、无 3D；768 也保留滚动）。768 卡内左右双列；≤480 上下布局，正文和 CTA 20px。卡是平面的，只要指针高光，不要 tilt。

RoiCalculator 背景：CSS 青绿光晕 + Point Waves 复刻（`roi-point-waves.js`，WebGL2-only，滚动到区块才挂载）。

FeatureRows：sticky 叠屏；2/4 块翻转（图左文右）；每块略矮于视口（下一块会露一点），文案/插图列间距收紧；每块主题色只体现在勾选圆点（青绿/紫/琥珀/蓝）；无 01/04 计数、无标题色条、无插图衬底、无顶部白雾、滚动无 blur（只有轻透明度衰减）。

### Hero 现状

- 左文案 / 右插图；人物卡约 620px、靠右。照片是欧美金发、二十多岁网球动作（`/assets/hero-returns.jpg`），参考 Baleaf 运动感；不要亚洲面孔、不要显老、不要坐姿棚拍、不要运动内衣。
- 三张玻璃浮卡 + 假鼠标自动演示；悬停不暂停。
- CTA：Free Trial + Book a Demo。全站 `.btn-switch`（Hero / Feature×4 / Plans / BrandsSay / BottomCta）带青绿 border beam（`returns-cta-beam.js`，teal 变体，离屏暂停）。
- 青绿自研 WebGL wash（API 同款双通道；无橙/紫/蓝；无 FilmGrain）。
- 整页兼容：WebGL1 主路径 + mediump；无 WebGL / context lost 走青绿 fallback。动画不砍，离屏/切标签才停 rAF。
- 响应式：1440/1200 桌面双栏；1024 双栏收比例；≤768 Hero 堆叠；≤480 Stats/ROI 单列。Feature sticky 在 960 改为堆叠。预览用 DevTools 切 480/768/1024/1200/1440。
- 页面文案字阶对齐 tracking 实际 `h2` / `.lead` / `--sec-*`。Hero 标题仍是展示级 56。

---

### Feature 01 插图

登山照是台面，山体要露出来。取色器 / Return center / 邮件 / 3.5x 轻微叠窗（不要盖满照片）。鼠标拖选框后出现 Return center；同一只鼠标滑到取色器，先色相再选色，Search 跟随。邮件实心白窗。

### Feature 02 插图

透明底，无深色井。面板在左。机器人纯 CSS。打字生成右侧规则卡，规则卡压住面板右沿；−80% 贴在拼贴**右侧**。四个功能块数字（3.5x / −80% / 20%+ / 18%+）都最后弹出。

### Feature 04 插图

运单拉高铺满插图列（条码钉在纸底）；比价卡压在运单右缘、不压条码；18%+ 贴在比价卡上方，和卡收成一团。

### Feature 03 插图

透明底。Keep / credit / exchange 叠成一团，exchange 压 Keep，20%+ 贴在右上靠近 Keep。背景上升曲线。自动演示：倒计时 → 点 Accept → 积分卡 → 换货卡 → 曲线最后出现并增长。

---

## 关键路径

```
src/components/LandingPage.jsx
src/components/sections/Hero.jsx
src/illustrations/ReturnsDomStages.jsx   # Hero + Feature 01 DomStagePortal
src/content/returnsCopy.js
src/styles/returns-page.css
src/fx/useLandingEffects.js
src/fx/modules/hero-wash-shader.js
src/fx/modules/roi-point-waves.js        # ROI 背景 Point Waves 复刻
```

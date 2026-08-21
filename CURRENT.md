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

Topbar → Hero → TrustBand → StatsRow → RoiCalculator → FeatureRows → Plans → Faq → ExploreMore → BrandsSay → Credentials → BottomCta → Footer + ProductDock

ExploreMore Tracking 卡：17TRACK 蓝；包裹 icon；右侧一张轨迹卡（进度条 + Shipping Events）+ 小浮卡 WISMO / video。API 卡 ASCII 底纹。hover 3D tilt。

RoiCalculator 背景：CSS 青绿光晕 + Point Waves 复刻（`roi-point-waves.js`，WebGL2-only，滚动到区块才挂载）。

FeatureRows：sticky 叠屏；2/4 块翻转（图左文右）；每块略矮于视口（下一块会露一点），文案/插图列间距收紧；每块主题色只体现在勾选圆点（青绿/紫/琥珀/蓝）；无 01/04 计数、无标题色条、无插图衬底、无顶部白雾、滚动无 blur（只有轻透明度衰减）。

### Hero 现状

- 左文案 / 右插图；人物卡约 620px、靠右。
- 三张玻璃浮卡 + 假鼠标自动演示；悬停不暂停。
- CTA：Free Trial + Book a Demo。全站 `.btn-switch`（Hero / Feature×4 / Plans / BrandsSay / BottomCta）带青绿 border beam（`returns-cta-beam.js`，teal 变体，离屏暂停）。
- 青绿自研 WebGL wash（API 同款双通道；无橙/紫/蓝；无 FilmGrain）。
- 整页兼容：WebGL1 主路径 + mediump；无 WebGL / context lost 走青绿 fallback。动画不砍，离屏/切标签才停 rAF。
- 响应式：1440/1200 桌面双栏；1024 双栏收比例；≤768 Hero 堆叠；≤480 Stats/ROI 单列。Feature sticky 在 960 改为堆叠。预览用 DevTools 切 480/768/1024/1200/1440。

---

### Feature 01 插图

登山照铺满。鼠标拖选框后出现 Return center；同一只鼠标滑到取色器，先色相再选色，Search 跟随。邮件毛玻璃。

### Feature 02 插图

透明底，无深色井。面板在左。机器人纯 CSS。打字生成右侧规则卡；When/Then + 流程条 + Pending 队列。

### Feature 04 插图

运单拉高铺满插图列（条码钉在纸底）；比价卡只贴右缘、不压条码；18%+ 青绿徽章贴在比价卡上方。

### Feature 03 插图

透明底，无路线图 / 无深色井。真实拦截 UI：Keep your item + Instant Refund、$20 store credit、Try an exchange。拼贴居中成一团，exchange 略压 Keep，20%+ 贴换货卡上方。背景是上升增长曲线，线下半透明青绿渐变。自动演示：倒计时 → 点 Accept → 积分卡 → 换货卡 → 曲线最后出现并增长，画完留着。

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

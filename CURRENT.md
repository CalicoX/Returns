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

### Hero 现状

- 左文案 / 右插图；人物卡约 620px、靠右。
- 三张玻璃浮卡 + 假鼠标自动演示；悬停不暂停。
- CTA：Free Trial + Book a Demo。
- 青绿自研 WebGL wash（API 同款双通道；无橙/紫/蓝；无 FilmGrain）。
- 整页兼容：WebGL1 主路径 + mediump；无 WebGL / context lost 走青绿 fallback。动画不砍，离屏/切标签才停 rAF。

---

### Feature 01 插图

登山照铺满。鼠标拖选框后出现 Return center；同一只鼠标滑到取色器，先色相再选色，Search 跟随。邮件毛玻璃。

### Feature 02 插图

透明底，无深色井。面板在左。机器人纯 CSS。打字生成右侧规则卡；When/Then + 流程条 + Pending 队列。

### Feature 03 插图

透明底，无路线图 / 无深色井。真实拦截 UI：Keep your item + Instant Refund、$20 store credit、Try an exchange。背景是上升增长曲线，线下半透明青绿渐变。20%+ 青绿徽章在画里。自动演示：倒计时 → 点 Accept → 积分卡 → 换货卡 → 曲线最后出现并增长，画完留着。

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
```

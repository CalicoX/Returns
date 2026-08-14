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
- 青绿 wash shader。

---

### Feature 01 插图

浅底网格门户：浏览器窗 + Merino 商品卡 + Brand experience + Label 胶囊（描边 / 实心蓝）+ 9 milestones。不是登山照旧构图。

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

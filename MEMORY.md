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
| **H5** | Hero 背景 | shaders.com Glass Agency Hero 同源，色调换成 Returns 青绿。窄屏 / 减动效用静态渐变。 |

---

## Hero 插图（2026-08-13 调过）

- 照片：Pexels 坐姿米色运动装（原参考金发墨镜图库没有授权可用源）。
- 人物卡：靠右；宽度约 **620px**（520 偏窄，铺满右栏 ~800 偏大）。
- 左两张浮卡（商品 + 原因）贴照片**左缘**，不要挡人脸。
- 方式卡在右下，可压腿，不要压脸。
- 节点连线是 flow 列里的真连接（两点 + 虚线），不要用绝对定位假虚线。
- 3D hover 挂在整块 `.rt-hero-visual` 上。

**踩坑：** 曾经在 `pointerenter` 里 `pause()` 自动演示，Park 两次明确不要。不要加回来。

---

## 布局约定

- 画布 1440 · 左右 gutter 48（`returns-page.css` 顶部变量）。
- Hero 栅格：文案列 `minmax(0, 500px)`，插图列吃剩余并右对齐。
- Returns 专属覆盖写 `src/styles/returns-page.css`；共享壳/动效在 `src/styles/landing.css` 与 `src/fx/`。

---

## Feature 01 插图（2026-08-14）

- 浏览器窗里是**生活照**（登山），不是空紫渐变。
- Brand experience 右侧贴着 Label/Live 浅蓝芯片 + Refund 方块。
- 9 milestones：描边胶囊 / 实心蓝 Label。
- 3.5x 用图二那种**实心青绿圆角标签**（`.is-solid-label`），不是渐变镂空字。
- 不要退回 Return center / 取色器 / 邮件卡那套旧浮卡。

---

## 工程教训

- 本地曾不是 git 仓库；远程 `CalicoX/Returns` 从空仓推上，默认 `main`。
- 不要提交 `node_modules` / `dist`。
- 用户名 Park，角色设计师，改完给预览 URL，少讲实现细节。

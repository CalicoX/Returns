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

照片铺满、无外框。浮件按旧工具构图：

- 右上 **Return center** 查询框（Order number / Email / Search）。
- 左侧真实 **Color picker**；选中色同步到 Search 按钮。
- Return center：鼠标拖出选框，松手后卡片出现 + 蚂蚁线。不要描边绕一圈。
- 同一只鼠标滑到 Color picker：先拖色相条，再去色板选色；Search 按钮全程跟随。
- Return center 必须水平居中。邮件自己再往右伸出照片。白色半透明毛玻璃，不要透出深色山体。
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
- 品红曲线连 Keep / credit / exchange；自动演示倒计时后点 Accept。悬停不要暂停。

---

## 工程教训

- 本地曾不是 git 仓库；远程 `CalicoX/Returns` 从空仓推上，默认 `main`。
- 不要提交 `node_modules` / `dist`。
- 用户名 Park，角色设计师，改完给预览 URL，少讲实现细节。

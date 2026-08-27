# 17 Returns — Agent 规则

## 开干前（必读）

1. [`CURRENT.md`](./CURRENT.md) — 当前产品/布局真相（短）。
2. 本文 — 硬规则与会话闭环。
3. [`MEMORY.md`](./MEMORY.md) — 跨会话记忆：锁定面、踩坑、设计决策。

改完若有新决策或踩坑，**立刻写回 MEMORY / CURRENT**，不要只留在对话里。

---

## 项目是什么

17 Returns 落地页（React + Vite）。从 tracking 落地页克隆，内容换成 Returns，主题色青绿。

- 预览：`npm run dev`（以终端实际端口为准，常见 `http://127.0.0.1:5173/` 或 `:5175/`）
- 远程：`https://github.com/CalicoX/Returns.git` · 默认分支 `main`
- 设计者 Park：直接改代码看效果，少空谈

回复用**简体中文**。

---

## 会话闭环（硬规则）

Agent 默认按此顺序执行，**无需用户每次再嘱咐**。用户明确说「先别提交」时可跳过对应步。

### 1. 开干前 — 先 pull

```sh
git pull --ff-only
```

有冲突先解决再改。只读问答、未准备改仓库时可不 pull。

### 2. 改完后 — 记记忆 → commit（本地，**默认不 push**）

凡本会话改了仓库文件（代码、样式、文案、规则、记忆），默认继续：

1. 有新决策 / 踩坑 / 锁定面 → 更新 `MEMORY.md`；现状变了 → 更新 `CURRENT.md`
2. 提交到本地：

```sh
git status && git diff && git log -5 --oneline
git add <相关文件>
git commit -m "$(cat <<'EOF'
<用 why 写的简短说明>

EOF
)"
```

**push 只在 Park 明确说「push / 推上去 / 部署」时执行**（`git push -u origin HEAD`）。原因：`main` 连着 Vercel 生产，每 push 一次就部署一次；日常迭代只攒本地 commit，由 Park 控制上线节奏。某笔 commit 想推但暂不部署时，message 里带 `[skip ci]`（Vercel 会跳过该次构建）。

- Commit message 写 **why**，不要只堆文件名。
- **不要**提交密钥、`.env`、`node_modules`、`dist`、无关的 `.cursor` 缓存。
- **不要**改 git config；**不要** force-push `main`；**不要** `--no-verify`。
- 纯问答、零文件改动：不要空 commit。

---

## 工程原则

1. 最小 diff。不要顺手重构、不要扩文档、不要加没要的抽象。
2. 视觉改动以页面上看见的效果为准；改完告诉 Park 刷新预览地址。
3. Returns 专属样式写在 `src/styles/returns-page.css`，不要把 tracking 的 `landing.css` 改乱。
4. Hero 插图逻辑在 `src/illustrations/ReturnsDomStages.jsx`；不要退回旧的 Safari 门户构图。
5. 新依赖先看现有包（`lenis` / `shaders` / `clsx`）能不能覆盖。

---

## 完成定义

| 改动 | 最低标准 |
|------|----------|
| 视觉 / 布局 | 预览里对上 Park 的描述；MEMORY 记尺寸/位置若成了约定 |
| 交互 / 动效 | 悬停不打断 Hero 自动演示；减动效 / 窄屏有降级 |
| 文案 | 走 `src/content/returnsCopy.js`，不要在 JSX 里散落长文案 |
| 规则 / 记忆 | 只改 md 也要 commit（push 仍按上面节奏） |

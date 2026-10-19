# 头顶的网 · The Net Above Us

一件关于武汉民主路社区巷道上空线缆网络的互动 3D 网页作品。
An interactive 3D web artwork about the overhead wire networks above the alleys of the Minzhu Road community, Wuhan.

> 一根电线杆，如何串起三十年的「头顶的网」。
> 核心提问：如何让一个沉默的支撑系统持续可读——不必等到失效，也不制造恐慌。

VIS5027 视觉设计语境 · 中期作业（Route C · 互动 HTML 网站）

---

## 在线预览 / Preview

本仓库可直接部署到 GitHub Pages（见下）。纯静态站点，无需构建。
This repo can be deployed to GitHub Pages as-is. Fully static, no build step.

## 本地运行 / Run locally

由于使用 ES Modules，需要通过本地静态服务器打开（双击 index.html 无法运行）：

```bash
# 任选其一 / any static server works
python3 -m http.server 8000
npx serve .
```

然后访问 `http://localhost:8000`。

## 部署到 GitHub Pages / Deploy

1. 将本仓库 push 到 GitHub（保持 `index.html` 在仓库根目录）。
2. 仓库 **Settings → Pages → Source** 选择 `Deploy from a branch`，分支选 `main` / `(root)`。
3. 保存后稍等片刻，访问 `https://<用户名>.github.io/<仓库名>/`。

## 操作 / Controls

| 操作 | 说明 |
| --- | --- |
| 拖拽 | 环视（相机恒在 1.6 m 眼高、巷道中线） |
| 滚轮 / 触屏滑动 | 沿折线巷道前进后退 |
| 点击线缆 | 打开该类线缆的说明卡 + 对应现场实拍 |
| 点击发光热点 | 打开证据卡（含实拍照片与来源） |
| 年代滑块 / 刻度 | 1980s → 2026 → 入地，逐层叠加/撤除线缆 |
| 日 / 夜 | 白天网隐形，夜晚灯下显形 |
| 权属 | 按产权方（电力/通信/监控/私拉）着色 |
| 依据 | 创作依据：巷道剖面俯视估算图 + 14 张现场实拍 |
| 中 / EN | 中英双语切换 |

## 证据分级 / Evidence grades

- **证据（绿）**：现场夜拍照片、可数核验的装置（本人拍摄，2026.10）。
- **推测 · 待核实（橙）**：依据形态与年代惯例的推断，需逐段核实。
- **模拟（红）**：3D 场景为 AI 辅助重建示意，不充当田野证据。

## 文件结构 / Structure

```
index.html          页面与 UI
js/main.js          交互、相机（眼高锁定、折线路径跟随）、证据卡、年代/权属/昼夜系统
js/scene.js         巷道与线缆的 3D 重建（折线巷道、分级线缆、电杆与设备）
js/content.js       全部中英双语文案、热点/线缆/年代数据、照片清单
assets/photos/      14 张现场实拍 + 巷道剖面俯视估算复原图
assets/audio/       昼夜环境音
vendor/             three.js 0.185.1 与 GSAP 3.15.0（本地化，无 CDN 依赖）
```

## 声明 / Statements

- 3D 场景为 **AI 辅助模拟（示意）**，并非现场摄影；所有标注「模拟」的内容不充当证据。
- 现场照片为作者本人夜拍；涉及的访谈内容均已获同意并作匿名化处理。
- 创作过程使用 AI 辅助（代码与文案起草），全部内容经作者核对与修改。

## 许可 / License

代码 MIT；现场照片与文案 © 作者本人，仅用于课程展示。

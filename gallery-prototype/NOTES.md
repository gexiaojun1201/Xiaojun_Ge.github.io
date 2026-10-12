# Gallery 动画原型 — 说明

来源：`D:\Gallery动画`（一个叫 "Lumen" 的影视陈列页，React + TanStack Start + Vite 项目）。
这里只放了和动画有关的**代码文件**（`.tsx .ts .css .json`），没有图片、字体、`node_modules`。

> 注意：这份拷贝是**给人看代码、抄动画用的**，单独放在这里**跑不起来**。
> `__root.tsx`、`router.tsx`、`vite.config.ts` 依赖原项目里没复制的文件（`src/lib/*`、`scripts/*`、`server/*`，是平台的登录/预览/PWA 代码，和动画无关）。
> 动画本身（`src/components/cinema/*` + `styles.css` + `catalog.ts`）只依赖 React、lucide-react 和图片，可以单独搬走。

## 1. 入口文件，怎么看到效果

- 页面入口：`src/routes/index.tsx` → 渲染 `src/components/cinema/CinemaApp.tsx`（总控）。
- 要看效果：在原项目 `D:\Gallery动画` 里运行 `npm install`，再 `npm run dev`，浏览器打开 `http://localhost:8080`。
- 想搬到别的项目：把 `src/components/cinema/`、`src/data/catalog.ts`、`src/styles.css` 拿走，再把 22 张图放到 `/art/` 下即可（见第 8 节）。

## 2. 哪个文件负责什么

| 功能 | 文件 | 说明 |
|---|---|---|
| 陈列布局 | `src/components/cinema/Shelf.tsx` + `src/data/catalog.ts`（`buildRows`）+ `styles.css`（`.shelf-row` `.scroller` `.poster-card` `.event-card`） | 多行横向滚动的海报架：Top 10（大海报）、Now showing（竖海报）、Continue watching（横图+进度条，看过才出现）、This week（活动卡片）、My list（收藏后才出现） |
| 点进去的动画 | `CinemaApp.tsx`（`openAt`）+ `DetailStage.tsx` + `styles.css`（`.detail.is-in ...` `.scrim` `.shelf-motion` `.chrome`） | 详情层淡入并从 1.035 倍缩到 1 倍；后面的陈列架缩到 0.965；文字信息延迟 640ms 后逐行模糊淡入。**注意：进入时不是从卡片位置飞出来，只有退出才是"飞回卡片"** |
| 退出动画 | `CinemaApp.tsx`（`requestClose` / `alignShelf` / `flyStageTo`）+ `styles.css`（`.detail.is-exit ...` `exit-fade` `settle`） | 先把对应卡片滚到该行中央，再用 Web Animations API 把整个详情窗口缩放飞回那张卡片的位置和大小，到位后淡出；卡片再做一次 `settle` 回弹淡入 |
| 左右切换动画 | `DetailStage.tsx`（`go` / `bright` / `nudge`）+ `styles.css`（`.reel` `.slide-card` `.slide-shade` `nudge-*`） | 一条横向"胶片"（`.reel`），用 CSS 变量 `--i` 控制 `translateX`；两侧各露出一小条（peek），侧边图片压暗；切换时新旧两张都变亮；到头了再按会"顶一下"（nudge） |
| 其他小动画 | `CinemaApp.tsx`（开场加载条 `boot`、提示条 `toast`）、`Art.tsx`（图片加载占位闪光 shimmer）、`DetailStage.tsx`（播放层 `player`） | 见第 5 节 |

## 3. 用了哪些外部库（全部来自 npm，没有用 CDN）

没有动画库（没有 framer-motion / GSAP 等），动画全靠 **CSS transition / @keyframes** 和浏览器自带的 **Web Animations API**（`element.animate`），以及 `requestAnimationFrame`。

| 库 | 版本（`package-lock.json` 实际安装） | 用途 |
|---|---|---|
| react / react-dom | 19.3.0 | 界面 |
| lucide-react | 0.510.0 | 图标（箭头、播放等） |
| @fontsource/outfit | 5.3.0 | 字体 Outfit（500 / 700 / 800 三个字重，`styles.css` 顶部 import） |
| @tanstack/react-router | 1.170.41 | 路由 |
| @tanstack/react-start | 1.168.60 | 框架（SSR） |
| tailwindcss | 4.3.3 | 只用了 `@import "tailwindcss"` 和 `@theme` 里的颜色/字体变量 |
| vite | 8.3.4 | 构建 |
| typescript | 5.9.3 | 类型 |

`package.json` 里写的是版本范围（如 `^19.2.0`），上表是锁文件里的真实版本。`package.json` 里大量依赖（radix、recharts、better-auth 等）和动画无关。

## 4. 触发方式

| 方式 | 在哪里 | 做什么 |
|---|---|---|
| **点击** | 陈列架上的海报/活动卡 | 打开详情（`onOpen`） |
| | 每行左右的圆形箭头 | 该行平滑滚动 0.72 个行宽 |
| | 详情页左右箭头 / 左上 Back / Play 按钮 | 切换上一张下一张 / 退出 / 打开播放层 |
| **键盘** | 陈列架（`CinemaApp` 的 `onKeyDown`） | ← → ↑ ↓ 移动焦点，Enter 打开 |
| | 详情页（`DetailStage` 在 `window` 上监听） | ← → 切换，Enter 播放，Esc 先关播放层、再退出详情 |
| **滚轮** | **没有自定义滚轮处理**，只有浏览器原生的：横向滚动条被隐藏，触控板横向滑动可滚动每一行；打开详情时页面禁止滚动（`body overflow: hidden`） | — |
| **鼠标拖动** | 陈列架每一行（`Shelf.tsx`） | 按住左键拖动行；移动超过 8px 才算拖动；拖动后的那次点击会被吞掉，不会误打开 |
| **滑动手势** | 详情页舞台（`DetailStage` 的 `onPointerDown/Up`） | 水平位移 ≥ 56px 且横向大于纵向才算一次滑动；向左滑 = 下一张，向右滑 = 上一张；按在按钮上不算 |
| **多指手势**（捏合等） | 无 | — |

注：滑动用的是 Pointer 事件，鼠标和手指通用；没有写 `touch-action`。

## 5. 动画时长 / 缓动 / 弹簧参数（代码里写死的）

**没有任何弹簧（spring）参数**，没有 stiffness / damping。全是时长 + 贝塞尔曲线。

先看 `styles.css` 里的三个全局变量：

| 变量 | 值 |
|---|---|
| `--travel` | `800ms`（左右切换时长；`DetailStage.tsx` 里 `TRAVEL = 800` 要和它保持一致） |
| `--slide` | `cubic-bezier(0.45, 0.05, 0.55, 1)`（左右切换用，两头慢中间快的 ease-in-out） |
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)`（几乎所有"弹出/回位"用，快进慢停，类似 easeOutQuint） |

### 点进去（进入）
- 详情舞台 `.stage`：透明度 360ms `ease`；缩放 1.035 → 1，520ms `--ease`
- 背景模糊图 `.ambient`：`blur(28px)`，透明度到 0.9，420ms `ease`
- 遮罩 `.scrim`：透明度到 0.4，480ms `ease`
- 后面的陈列架 `.shelf-motion`：缩放到 0.965，520ms `--ease`
- Back 按钮：透明度 240ms + 位移 320ms `--ease`，延迟 160ms；左右箭头延迟 180ms
- 文字信息 `.chrome`：JS 延迟 **640ms** 后显示；每个子项 **1100ms**（透明度 / 位移 22px / 模糊 8px），依次延迟 40 / 180 / 320 / 460 / 600 / 740ms

### 退出
- `EXIT_MS = 620`（`CinemaApp.tsx`）：到时才卸载详情层
- 飞回卡片（`flyStageTo`，Web Animations API）：620ms，`cubic-bezier(0.4, 0, 0.2, 1)`，`fill: forwards`；关键帧 offset 0.84 处到达卡片位置和大小，圆角 `1.35rem → 0.9rem`，最后一段透明度 1 → 0
- CSS 里同时有 `.reel` 的 `exit-fade`：580ms，`cubic-bezier(0.4, 0, 0.2, 1)`，前 74% 保持不透明，之后淡出
- `.ambient` 退出：160ms 淡出；Back / 箭头：立即淡出（延迟 0）
- 卡片回位 `settle`：560ms `--ease`（透明度 0.4→1，缩放 1.045→1）
- 陈列架缩放：退出时去掉过渡（`transition: none`），直接复位为原大小；遮罩仍按 480ms `ease` 淡出

### 左右切换
- 横向胶片 `.reel`：`transform 800ms var(--slide)`
- 两侧露出宽度 `--peek`：桌面 `6.4%`，手机 `9%`；卡片间距 `--gap`：`0.7rem` / 手机 `0.45rem`
- 侧边压暗 `.slide-shade`：不透明度 0.56，变暗过渡 220ms；切换期间新旧两张"变亮"（`is-bright`，无过渡），800ms 后恢复
- 文字信息：切换开始立即隐藏，`800 + 380 = 1180ms` 后重新显示
- 到头"顶一下"（nudge）：340ms `--ease`，在 40% 处位移 ±16px
- 切换期间（`navLock`）和播放层打开时，不响应新的切换

### 其他
- 开场加载 `boot`：至少显示 680ms（图片加载完才结束），最多 1800ms 强制结束；淡出 480ms，500ms 后移除；进度条宽度过渡 220ms
- 各行入场 `row-in`：680ms `--ease`，向上 18px 淡入，第 2~5 行延迟 90 / 170 / 250 / 320ms
- 卡片悬停/键盘焦点：上移 6px + 放大 1.035，220ms `--ease`；按下 `scale(0.99)`
- 图片加载：透明度 520ms `ease`，缩放 1.04→1 用 700ms `--ease`；占位闪光 `shimmer` 1.25s 循环
- 播放层（假播放）：淡入 280ms / 缩放 360ms `--ease`；关闭 220ms；背景图 `ken` 缓慢放大 1→1.08，16s `ease-out`；进度由 `requestAnimationFrame` 按影片秒数推进
- 提示条 `toast`：显示 1600ms，进出场 200ms `ease`
- 加入收藏按钮图标互换：200ms `ease`（缩放 0.25 + 模糊 4px）
- 按钮按下：`scale(0.96)`，150ms

## 6. 响应式 / 手机

- **只有一个宽度断点：`max-width: 800px`**（`styles.css` 末尾）。手机上变化：
  - 卡片尺寸从 `vh` 改成固定像素（海报 168px、Top10 210px、横图 128px、活动 108px）
  - 详情舞台去掉四周留白（`--stage-inset` 为 0）和圆角，铺满全屏
  - 两侧露出 `--peek` 变 9%，间距变小
  - 顶部键盘提示文字隐藏；文字信息区单列；标题字号 2rem
  - Back 按钮避开刘海（`env(safe-area-inset-top)`）
- `@media (hover: none)`：触屏设备上每行左右箭头常显（电脑上只有鼠标移上去才显示）
- `@media (prefers-reduced-motion: reduce)`：关闭卡片、舞台、胶片、背景、遮罩、开场等的过渡和动画
- **JS 里没有判断设备/屏幕宽度的逻辑**（没有 `matchMedia` / `innerWidth` / UA 判断），手机和电脑跑同一套代码，区别只来自 CSS。手机靠滑动手势切换，没有单独的"手机版"交互。

## 7. 其他值得知道的

- 收藏和观看进度存在 `localStorage`，key 是 `yinglang.library.v1`（`CinemaApp.tsx`）。
- 详情页文字颜色（深/浅）由 `DetailStage.tsx` 的 `measureTone` 决定：把图片缩成 48×27 的 canvas，取左下区域平均亮度，阈值 78。
- 海报的 `focus` 字段（如 `center 40%`）用来控制 `object-position`。

## 8. 代码引用到的图片（没有复制，只列文件名）

`catalog.ts` 里引用 22 张，原项目在 `public/art/`，页面用 `/art/<名字>.jpg` 访问：

southwind.jpg, gearstorm.jpg, coldlane.jpg, shoreline.jpg, rift.jpg, shaft.jpg, yellow.jpg, orbit.jpg,
tide.jpg, nightshift.jpg, amberwake.jpg, logbook.jpg, thundercrew.jpg, longroad.jpg, glasshouse.jpg, fieldnotes.jpg, paperboats.jpg, meridian.jpg,
gulf.jpg, youth.jpg, quali.jpg, sprint.jpg

另外 `__root.tsx` 引用了 `/favicon.svg`、`/__grok/manifest.webmanifest`、`/__grok/icon-180.png`（平台自带的图标/清单，和动画无关，没有复制）。

## 9. 复制了哪些文件

```
package.json            tsconfig.json          vite.config.ts
src/styles.css          src/router.tsx         src/data/catalog.ts
src/routes/__root.tsx   src/routes/index.tsx
src/components/cinema/{Art,CinemaApp,DetailStage,Frame,Shelf}.tsx
```

没复制：`src/lib/*`、`scripts/*`、`server/*`、`package-lock.json`、`AGENTS.md`、`routeTree.gen.ts`（自动生成）、`.grok/`、`attachments/`（含一个 81MB 的 .MOV）、`screenshots/`、`artifacts/`、`public/`。

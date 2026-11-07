# Zion website AI guide

代码继续通过 GitHub 管理。这里基于现有 `wrangler.toml`，把纯静态 Worker 扩展为静态网站加 `/api/ask` 接口。实例名称为 `self-website-rag`，默认命名空间为 `default`。

## 发布链路

GitHub `master` 推送 → Cloudflare Workers Builds (`xiaojun-ge-github-io`) → Wrangler 部署 → 静态网页与 Worker 接口一起发布。已通过现有提交的 GitHub 检查确认这条 Workers Builds 连接。

部署前在 Cloudflare「Workers 和 Pages」核实：

- Builds 关联 `gexiaojun1201/Xiaojun_Ge.github.io` 的 `master` 分支；部署后检查 `xiaojunge.com` 的页面和 `/api/ask`。
- 项目根目录是仓库根目录；部署命令使用锁定版本的 `npm run deploy`（依赖先安装）。
- `self-website-rag` 在同一 Cloudflare 账户的默认命名空间内，已有索引成功的公开资料与可用的生成模型。
- 限流命名空间 `12012026` 未被其他不相关的规则使用；若冲突，改为该账户内独立的正整数字符串。

本配置用于 Cloudflare Worker。仓库原有 GitHub Pages 工作流仍只发布静态镜像；在镜像中提问时，Zion 提供正式域名链接，因为 GitHub Pages 不执行 Worker。

## 本地检查

```sh
npm ci
npm test
npm run check:deploy
npx wrangler login
npm run dev
```

前三项无需 Cloudflare 凭据，不会部署。`wrangler login` 在浏览器授权后由 Wrangler 保存本机登录状态。`npm run dev` 的 AI Search 绑定使用 `remote = true`：网页和接口在本地运行，检索与生成调用真实云端实例，可能产生用量。

若使用 CI/API Token，凭据应由 Cloudflare Builds、CI Secret 或本机用户目录中项目外的私有配置提供。不要写入网页、仓库或静态资源目录。运行时使用 `SITE_SEARCH` 绑定，无需前端 API Token。

## 接入 pet 素材

使用用户上传的 `web.zip` 中抱着笔记本的水獭，网站名称为 **Zion**，界面及回答均使用英文。`pet/web/` 保存 9 个透明 WebP 动画（共 57 帧）和 `portrait.png` 静态立绘，均为 192×208 像素。文件与压缩包逐字节核对一致，未重绘或重新编码，也不包含临时下载链接。

网页直接播放对应动作：`idle.webp` 待机、`waving.webp` 打招呼、`running-right.webp` / `running-left.webp` 左右跑动、`running.webp` 思考、`review.webp` 查看回答、`failed.webp` 失败反馈。系统开启「减少动态效果」时使用静态立绘。

首次显示在右下角，输入框位于旁边；拖动 Zion 可移动整体，位置保存在浏览器本地。聚焦 Zion 后方向键也可移动。请求期间循环向右跑、思考、向左跑；回答完成切换检查动作，失败时切换失败动作。启用系统「减少动态效果」时保留静态姿态与文字状态。

答案使用可关闭的小气泡，不使用遮罩或大弹窗。气泡根据位置向上或向下展开。单个动画加载失败时退回静态立绘；全部素材不可用时保留文字入口。

## 问答行为与数据

- 单轮问题，最多 2,000 字符；用英文回答，介绍有资料支持的能力与具体贡献。
- 使用 AI Search 实例配置的生成模型，返回答案及检索到的来源。R2 文件名只作为文字展示，不猜测下载链接。
- 提示词要求不编造论文贡献、资历、成果或承诺。模型并不保证绝对正确，界面提示核对来源。
- 答案和来源名称只作为文本插入，不执行模型输出的 HTML。
- `/api/ask` 是公开接口，只应绑定允许公开查询的资料。来源检查不能替代身份验证。
- 每 IP 每分钟约 10 次，按 Cloudflare 节点分别计数；共享 IP 的访客共享限额。这不是严格的全球配额或费用上限。
- 应用不保存问答历史，也不输出问题或提供商错误详情到日志；Cloudflare/AI Gateway 的日志保留由账户设置决定。

网站重新部署与 AI Search 索引更新是两件事。网站数据源应确认同步/抓取成功；R2 数据源要先更新文件，再等待索引。当前站点通过 JavaScript 和 hash 导航展示部分内容，需在实例 Playground 检查是否覆盖论文、技能及项目详情；若缺漏，提供按主题整理的文本/Markdown 数据源。

## 验证边界

自动测试使用模拟的 AI Search 与限流绑定，覆盖输入、来源、错误与静态路由。Wrangler dry-run 仅检查配置与打包。上线前仍需用真实实例验证中文/英文问题、引用和索引覆盖，并检查正式域名 `/api/ask`；不能把模拟答案当作云端接通证明。

官方参考：

- https://developers.cloudflare.com/ai-search/api/search/workers-binding/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

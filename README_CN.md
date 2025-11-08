# discourse-qingwa-timelines

一个 Discourse 主题组件，实现自定义 BBCode `[timelines]...[/timelines]` 时间轴功能。

[English](README.md) | 中文

---

## 功能特性

- **自定义 BBCode**：使用 `[timelines]...[/timelines]` 标签创建时间轴布局
- **视觉设计**：左侧单根渐变竖线（橙色 #ff7a18 → 金色 #ffb800），右侧显示内容
- **极简主义**：干净透明的背景，没有多余装饰
- **Markdown 支持**：保留时间轴内所有 Markdown 格式（标题、列表、粗体等）
- **多用途**：适用于时间线、步骤说明、章节分隔等多种场景
- **响应式**：移动端友好的布局，自适应间距
- **主题兼容**：支持浅色和深色模式
- **安全**：防止 XSS 注入，安全处理 HTML
- **无依赖**：仅使用 Discourse 原生 API

## 截图展示

### 发布后效果
![发布后的展示效果](Screenshots/qingwa-timelines-1.jpg)

### 编辑器工具栏按钮
![编辑器按钮效果](Screenshots/qingwa-timelines-button.jpg)

### Markdown 编辑器
![Markdown 编辑器效果](Screenshots/qingwa-timelines-editor.jpg)

## 安装

### 方法一：从 Git 仓库安装（推荐）

1. 进入 Discourse 管理后台
2. 导航至 **定制** → **主题** → **安装**
3. 点击 **"从 git 仓库安装"**
4. 输入仓库地址：
   ```
   https://github.com/scavin/discourse-qingwa-timelines
   ```
5. 点击 **安装**
6. 在活动主题上启用该组件

### 方法二：手动上传

1. 下载或克隆本仓库
2. 进入 Discourse 管理后台
3. 导航至 **定制** → **主题** → **安装**
4. 点击 **"上传主题"**
5. 将整个文件夹打包为 ZIP 文件并上传
6. 在活动主题上启用该组件

## 使用方法

### 方法一：使用工具栏按钮（推荐）

1. 打开帖子编辑器
2. 点击工具栏的 **"⋮" (更多)** 按钮
3. 选择 **"插入时间轴"**
4. 编辑时间轴内容
5. 发布帖子

工具栏按钮会自动插入正确的 `[timelines]` 标签，不会被 Discourse 新编辑器转义。

### 方法二：手动输入（适用于旧编辑器）

在帖子中使用 `[timelines]` 和 `[/timelines]` 标签包裹内容：

```
[timelines]
## 2024年1月 - 项目启动
项目正式立项，组建团队...

## 2024年3月 - 第一版发布
完成核心功能开发...

## 2024年6月 - 2.0版本
新增功能：
- 功能 A
- 功能 B
- 功能 C
[/timelines]
```

**注意**：Discourse 新编辑器可能会自动转义手动输入的方括号。如果手动输入遇到问题，请使用工具栏按钮。

## 使用场景示例

### 时间线

```
[timelines]
## 2020年 - 成立
公司在硅谷成立。

## 2021年 - 成长
团队扩展到50人。

## 2022年 - 创新
推出旗舰产品。
[/timelines]
```

### 步骤说明

```
[timelines]
## 第一步：安装
从官网下载并安装软件。

## 第二步：配置
在设置面板中配置偏好选项。

## 第三步：启动
点击开始按钮使用应用程序。
[/timelines]
```

### 章节分隔

```
[timelines]
## 第一章：开端
很久很久以前，在一个遥远的地方...

## 第二章：旅程
英雄踏上了史诗般的征途...

## 第三章：终结
经历重重考验后，和平得以恢复。
[/timelines]
```

## 视觉效果

时间轴将显示为：
- 左侧 2px 宽的渐变线（橙色到金色）
- 所有内容对齐到线的右侧
- 适当的间距和排版
- 支持标题、段落、列表等 Markdown 元素

## 自定义配置

安装组件后，您可以在 Discourse 后台自定义时间轴的颜色：

1. 进入 **Admin** → **Customize** → **Themes**
2. 选择已安装的主题，点击 **Edit CSS/HTML**
3. 在 **Theme Components** 中找到 **discourse-qingwa-timelines**
4. 点击 **Settings**

### 可配置项

- **timeline_gradient_start**: 渐变线起始色（顶部），默认 `#ff7a18`
- **timeline_gradient_end**: 渐变线结束色（底部），默认 `#ffb800`
- **timeline_heading_color**: 标题文字颜色，默认 `#d96d14`
- **timeline_dot_color**: 节点圆点颜色，默认 `#ff7a18`
- **timeline_heading_color_dark**: 深色模式下的标题颜色，默认 `#ff9854`
- **timeline_dot_border_color_dark**: 深色模式下的圆点边框颜色（留空则使用主题默认）

### 示例配色方案

**蓝色系：**
- 渐变起始: `#1e90ff`
- 渐变结束: `#00bfff`
- 标题颜色: `#1873cc`
- 圆点颜色: `#1e90ff`

**绿色系：**
- 渐变起始: `#2ecc71`
- 渐变结束: `#27ae60`
- 标题颜色: `#229954`
- 圆点颜色: `#2ecc71`

**紫色系：**
- 渐变起始: `#9b59b6`
- 渐变结束: `#8e44ad`
- 标题颜色: `#7d3c98`
- 圆点颜色: `#9b59b6`

**红/粉色系：**
- 渐变起始: `#e74c3c`
- 渐变结束: `#c0392b`
- 标题颜色: `#a93226`
- 圆点颜色: `#e74c3c`

### 高级自定义

如需更高级的样式调整，您可以直接编辑 `common/common.scss` 文件：

**调整间距：**
```scss
.qingwa-timelines {
  padding-left: 3em; /* 增加线到内容的距离 */
  margin: 2em 0;     /* 增加垂直间距 */
}
```

**更改线条宽度：**
```scss
.qingwa-timelines::before {
  width: 3px; /* 加粗线条 */
}
```

## 兼容性

- **Discourse 版本**：2.8.0 或更高
- **其他 BBCode**：不与 `[details]`、`[quote]`、`[note]`、`[wrap]` 等冲突
- **主题支持**：适用于任何 Discourse 主题
- **浏览器支持**：所有现代浏览器

## 安全性

- 防止 XSS 注入
- 清理用户输入
- 使用安全的 HTML 结构
- 无内联事件处理器

## 许可证

MIT 许可证 - 详见 LICENSE 文件

## 支持

如有问题、疑问或功能请求，请访问：
- GitHub Issues: https://github.com/scavin/discourse-qingwa-timelines/issues

## 贡献

欢迎贡献！请随时提交拉取请求或提出问题。

---

## 技术文档

### 文件结构

```
discourse-qingwa-timelines/
├── javascripts/
│   └── discourse/
│       └── initializers/
│           └── qingwa-timelines.js.es6
├── common/
│   └── common.scss
├── locales/
│   ├── en.yml
│   ├── zh_CN.yml
│   ├── zh_TW.yml
│   ├── de.yml
│   ├── es.yml
│   ├── fr.yml
│   ├── ja.yml
│   ├── ko.yml
│   └── ru.yml
├── settings.yml
├── about.json
├── README.md
└── LICENSE
```

### 技术细节

- **初始化器**：使用 Discourse 的 `decorateCooked` API 解析和渲染时间轴
- **幂等性**：解析器是幂等的，重新渲染时不会创建嵌套结构
- **安全性**：跳过代码块、预格式化块和引用块以防止意外解析
- **多时间轴**：支持同一帖子中的多个时间轴块
- **多语言**：支持 9 种语言的界面翻译

### 更新日志

**v0.3.0** (编辑器工具栏按钮)
- 添加编辑器工具栏按钮，方便插入时间轴
- 解决 Discourse 新编辑器自动转义方括号的问题
- 支持包裹选中的文本到时间轴标签中
- 添加 9 种语言的本地化支持
- 按钮显示在"更多"菜单中，带有时钟图标

**v0.2.0** (可自定义颜色更新)
- 通过管理面板添加可配置的颜色设置
- 六个可自定义的颜色选项（渐变起始/结束、标题颜色、圆点颜色）
- 支持单独的深色模式颜色
- 文档中的示例配色方案
- 保持与默认颜色的向后兼容性

**v0.1.0** (初始版本)
- 自定义 BBCode `[timelines]` 实现
- 渐变竖线设计
- Markdown 保留
- 浅色/深色模式支持
- 移动端响应式布局
- XSS 防护

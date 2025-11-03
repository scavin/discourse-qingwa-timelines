# discourse-qingwa-timelines

[English](#english) | [中文](#中文)

---

## English

A Discourse theme component that implements custom BBCode `[timelines]...[/timelines]` for creating beautiful timeline layouts.

### Features

- **Custom BBCode**: Use `[timelines]...[/timelines]` tags to create timeline layouts
- **Visual Design**: Single vertical gradient line (orange #ff7a18 → gold #ffb800) on the left with content on the right
- **Minimalist**: Clean, transparent background with no unnecessary decorations
- **Markdown Support**: Preserves all Markdown formatting (headings, lists, bold, etc.) inside timelines
- **Multi-purpose**: Works for timelines, step-by-step guides, chapter divisions, and more
- **Responsive**: Mobile-friendly layout with adaptive spacing
- **Theme Compatible**: Supports both light and dark modes
- **Safe**: Prevents XSS injection and handles HTML securely
- **No Dependencies**: Uses only Discourse native APIs

### Supported Languages

This component includes interface translations for the following languages:

- 🇬🇧 English
- 🇨🇳 简体中文 (Simplified Chinese)
- 🇹🇼 繁體中文 (Traditional Chinese)
- 🇯🇵 日本語 (Japanese)
- 🇰🇷 한국어 (Korean)
- 🇫🇷 Français (French)
- 🇩🇪 Deutsch (German)
- 🇪🇸 Español (Spanish)
- 🇵🇹 Português (Portuguese)
- 🇷🇺 Русский (Russian)

Languages not listed above will automatically fall back to English.

### Installation

#### Method 1: Install from Git Repository (Recommended)

1. Go to your Discourse Admin panel
2. Navigate to **Customize** → **Themes** → **Install**
3. Click **"From a git repository"**
4. Enter the repository URL:
   ```
   https://gitlab.com/scavin/discourse-qingwa-timelines
   ```
5. Click **Install**
6. Enable the component on your active theme

#### Method 2: Manual Upload

1. Download or clone this repository
2. Go to your Discourse Admin panel
3. Navigate to **Customize** → **Themes** → **Install**
4. Click **"Upload a theme"**
5. Upload the entire folder as a ZIP file
6. Enable the component on your active theme

### Usage

#### Method 1: Using Toolbar Button (Recommended)

1. Open the post editor
2. Click the **"⋮" (More)** button in the toolbar
3. Select **"Insert Timeline"**
4. Edit the timeline content
5. Publish your post

The toolbar button will automatically insert the correct `[timelines]` tags without them being escaped by the new Discourse editor.

#### Method 2: Manual Input (For Legacy Editor)

Wrap your content with `[timelines]` and `[/timelines]` tags in your posts:

```
[timelines]
## January 2024 - Project Launch
The project was officially initiated, and the team was formed...

## March 2024 - First Release
Core functionality development completed...

## June 2024 - Version 2.0
Added new features:
- Feature A
- Feature B
- Feature C
[/timelines]
```

**Note**: The new Discourse editor may automatically escape manually typed square brackets. If you experience issues with manual input, please use the toolbar button instead.

#### Example Use Cases

**Timeline:**
```
[timelines]
## 2020 - Foundation
Company established in Silicon Valley.

## 2021 - Growth
Expanded to 50 employees.

## 2022 - Innovation
Launched flagship product.
[/timelines]
```

**Step-by-Step Guide:**
```
[timelines]
## Step 1: Installation
Download and install the software from our website.

## Step 2: Configuration
Set up your preferences in the settings panel.

## Step 3: Launch
Click the start button to begin using the application.
[/timelines]
```

**Chapter Divisions:**
```
[timelines]
## Chapter 1: The Beginning
Once upon a time, in a land far away...

## Chapter 2: The Journey
The hero embarked on an epic quest...

## Chapter 3: The Resolution
After many trials, peace was restored.
[/timelines]
```

### Visual Preview

The timeline will display with:
- A 2px wide gradient line on the left (orange to gold)
- All content aligned to the right of the line
- Proper spacing and typography
- Support for headings, paragraphs, lists, and other Markdown elements

### Customization

After installing the component, you can customize the timeline colors in the Discourse admin panel:

1. Go to **Admin** → **Customize** → **Themes**
2. Select your active theme and click **Edit CSS/HTML**
3. Find **discourse-qingwa-timelines** in the **Theme Components** section
4. Click **Settings**

#### Available Settings:

- **timeline_gradient_start**: Gradient line start color (top), default `#ff7a18`
- **timeline_gradient_end**: Gradient line end color (bottom), default `#ffb800`
- **timeline_heading_color**: Heading text color, default `#d96d14`
- **timeline_dot_color**: Timeline node dot color, default `#ff7a18`
- **timeline_heading_color_dark**: Heading color in dark mode, default `#ff9854`
- **timeline_dot_border_color_dark**: Dot border color in dark mode (leave empty to use theme default)

#### Example Color Schemes:

**Blue Theme:**
- Gradient start: `#1e90ff`
- Gradient end: `#00bfff`
- Heading color: `#1873cc`
- Dot color: `#1e90ff`

**Green Theme:**
- Gradient start: `#2ecc71`
- Gradient end: `#27ae60`
- Heading color: `#229954`
- Dot color: `#2ecc71`

**Purple Theme:**
- Gradient start: `#9b59b6`
- Gradient end: `#8e44ad`
- Heading color: `#7d3c98`
- Dot color: `#9b59b6`

**Red/Pink Theme:**
- Gradient start: `#e74c3c`
- Gradient end: `#c0392b`
- Heading color: `#a93226`
- Dot color: `#e74c3c`

#### Advanced Customization

For more advanced styling, you can edit the `common/common.scss` file directly:

**Adjust spacing:**
```scss
.qingwa-timelines {
  padding-left: 3em; /* Increase space from line to content */
  margin: 2em 0;     /* Increase vertical spacing */
}
```

**Change line width:**
```scss
.qingwa-timelines::before {
  width: 3px; /* Make line thicker */
}
```

### Compatibility

- **Discourse Version**: 2.8.0 or higher
- **Other BBCodes**: Does not conflict with `[details]`, `[quote]`, `[note]`, `[wrap]`, etc.
- **Theme Support**: Works with any Discourse theme
- **Browser Support**: All modern browsers

### Security

- Prevents XSS injection
- Sanitizes user input
- Uses safe HTML structures
- No inline event handlers

### License

MIT License - see LICENSE file for details

### Support

For issues, questions, or feature requests, please visit:
- GitLab Issues: https://gitlab.com/scavin/discourse-qingwa-timelines/-/issues

### Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

---

## 中文

一个 Discourse 主题组件，实现自定义 BBCode `[timelines]...[/timelines]` 时间轴功能。

### 功能特性

- **自定义 BBCode**：使用 `[timelines]...[/timelines]` 标签创建时间轴布局
- **视觉设计**：左侧单根渐变竖线（橙色 #ff7a18 → 金色 #ffb800），右侧显示内容
- **极简主义**：干净透明的背景，没有多余装饰
- **Markdown 支持**：保留时间轴内所有 Markdown 格式（标题、列表、粗体等）
- **多用途**：适用于时间线、步骤说明、章节分隔等多种场景
- **响应式**：移动端友好的布局，自适应间距
- **主题兼容**：支持浅色和深色模式
- **安全**：防止 XSS 注入，安全处理 HTML
- **无依赖**：仅使用 Discourse 原生 API

### 支持的语言

本组件支持以下语言的界面翻译：

- 🇬🇧 English（英语）
- 🇨🇳 简体中文
- 🇹🇼 繁體中文
- 🇯🇵 日本語（日语）
- 🇰🇷 한국어（韩语）
- 🇫🇷 Français（法语）
- 🇩🇪 Deutsch（德语）
- 🇪🇸 Español（西班牙语）
- 🇵🇹 Português（葡萄牙语）
- 🇷🇺 Русский（俄语）

其他语言会自动回退到英文显示。

### 安装

#### 方法一：从 Git 仓库安装（推荐）

1. 进入 Discourse 管理后台
2. 导航至 **定制** → **主题** → **安装**
3. 点击 **"从 git 仓库安装"**
4. 输入仓库地址：
   ```
   https://gitlab.com/scavin/discourse-qingwa-timelines
   ```
5. 点击 **安装**
6. 在活动主题上启用该组件

#### 方法二：手动上传

1. 下载或克隆本仓库
2. 进入 Discourse 管理后台
3. 导航至 **定制** → **主题** → **安装**
4. 点击 **"上传主题"**
5. 将整个文件夹打包为 ZIP 文件并上传
6. 在活动主题上启用该组件

### 使用方法

#### 方法一：使用工具栏按钮（推荐）

1. 打开帖子编辑器
2. 点击工具栏的 **"⋮" (更多)** 按钮
3. 选择 **"插入时间轴"**
4. 编辑时间轴内容
5. 发布帖子

工具栏按钮会自动插入正确的 `[timelines]` 标签，不会被 Discourse 新编辑器转义。

#### 方法二：手动输入（适用于旧编辑器）

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

#### 使用场景示例

**时间线：**
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

**步骤说明：**
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

**章节分隔：**
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

### 视觉效果

时间轴将显示为：
- 左侧 2px 宽的渐变线（橙色到金色）
- 所有内容对齐到线的右侧
- 适当的间距和排版
- 支持标题、段落、列表等 Markdown 元素

### 自定义配置

安装组件后，您可以在 Discourse 后台自定义时间轴的颜色：

1. 进入 **Admin** → **Customize** → **Themes**
2. 选择已安装的主题，点击 **Edit CSS/HTML**
3. 在 **Theme Components** 中找到 **discourse-qingwa-timelines**
4. 点击 **Settings**

#### 可配置项：

- **timeline_gradient_start**: 渐变线起始色（顶部），默认 `#ff7a18`
- **timeline_gradient_end**: 渐变线结束色（底部），默认 `#ffb800`
- **timeline_heading_color**: 标题文字颜色，默认 `#d96d14`
- **timeline_dot_color**: 节点圆点颜色，默认 `#ff7a18`
- **timeline_heading_color_dark**: 深色模式下的标题颜色，默认 `#ff9854`
- **timeline_dot_border_color_dark**: 深色模式下的圆点边框颜色（留空则使用主题默认）

#### 示例配色方案：

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

#### 高级自定义

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

### 兼容性

- **Discourse 版本**：2.8.0 或更高
- **其他 BBCode**：不与 `[details]`、`[quote]`、`[note]`、`[wrap]` 等冲突
- **主题支持**：适用于任何 Discourse 主题
- **浏览器支持**：所有现代浏览器

### 安全性

- 防止 XSS 注入
- 清理用户输入
- 使用安全的 HTML 结构
- 无内联事件处理器

### 许可证

MIT 许可证 - 详见 LICENSE 文件

### 支持

如有问题、疑问或功能请求，请访问：
- GitLab Issues: https://gitlab.com/scavin/discourse-qingwa-timelines/-/issues

### 贡献

欢迎贡献！请随时提交拉取请求或提出问题。

---

## Development

### File Structure

```
discourse-qingwa-timelines/
├── javascripts/
│   └── discourse/
│       └── initializers/
│           └── qingwa-timelines.js.es6
├── common/
│   └── common.scss
├── settings.yml
├── about.json
├── README.md
└── LICENSE
```

### Technical Details

- **Initializer**: Uses Discourse's `decorateCooked` API to parse and render timelines
- **Idempotency**: Parser is idempotent and won't create nested structures on re-render
- **Safety**: Skips code blocks, pre blocks, and blockquotes to prevent unintended parsing
- **Multiple Timelines**: Supports multiple timeline blocks in the same post

### Troubleshooting

#### Toolbar button displays translation key (e.g., `[zh_CN.timelines...]`)

**Cause**: Translation files not properly loaded or cached.

**Solution**:

1. **Rebuild theme** (Recommended):
   - Go to **Admin** → **Customize** → **Themes**
   - Select your theme → **Components**
   - Find `discourse-qingwa-timelines` → Click **Update** (if installed from Git)
   - Return to theme page → Click **Save** or **Rebuild**

2. **Check browser console**:
   - Press F12 to open Developer Tools
   - Check for any JavaScript errors in the Console tab

3. **Verify translation files**:
   - Ensure `locales/` directory exists in the component
   - Check file format (UTF-8 encoding, 2-space indentation, double quotes for strings)
   - Verify language code matches exactly (e.g., `zh_CN` not `zh-CN` or `zh_cn`)

4. **Clear cache** (Advanced - requires server access):
   ```bash
   cd /var/discourse
   ./launcher rebuild app
   ```

#### Button doesn't appear or doesn't work

**Possible causes**:
- Discourse version too old (requires ≥ 2.8.0)
- Component not properly installed on theme
- JavaScript errors in browser console

**Solution**:
- Check Discourse version in Admin panel
- Verify component is added to your active theme
- Check browser console for error messages
- Try disabling other theme components to identify conflicts

#### Timelines not rendering

**Possible causes**:
- BBCode tags being escaped by editor
- Content inside code blocks or quotes
- JavaScript not loaded properly

**Solution**:
- Use the toolbar button instead of manual input (prevents escaping)
- Ensure timelines are not nested inside code blocks, quotes, or other BBCode
- Check browser console for errors
- Try refreshing the page or clearing browser cache

#### Translation shows wrong language

**Cause**: Browser or Discourse language settings not matching expected language.

**Solution**:
- Check your Discourse user preferences → Interface → Language
- The component will automatically use the language set in Discourse preferences
- If your language is not supported, it will fall back to English
- Supported languages: English, 简体中文, 繁體中文, 日本語, 한국어, Français, Deutsch, Español, Português, Русский

### Changelog

**v0.3.0** (Composer Toolbar Button)
- Added composer toolbar button for easy timeline insertion
- Solves the issue of new Discourse editor auto-escaping square brackets
- Supports wrapping selected text in timeline tags
- Added English and Chinese localizations
- Button appears in the "More" menu with a stream icon

**v0.2.0** (Customizable Colors Update)
- Added configurable color settings via admin panel
- Six customizable color options (gradient start/end, heading colors, dot colors)
- Support for separate dark mode colors
- Example color schemes in documentation
- Maintained backward compatibility with default colors

**v0.1.0** (Initial Release)
- Custom BBCode `[timelines]` implementation
- Gradient vertical line design
- Markdown preservation
- Light/dark mode support
- Mobile responsive layout
- XSS protection

# Discourse Qingwa Timelines

为 Discourse 社区添加漂亮的时间轴功能。

## 功能

- 使用 `[timelines]...[/timelines]` BBCode 创建时间轴
- 渐变色竖线，圆点标记时间节点
- 响应式设计，桌面和移动端都显示完美
- 后台可自定义颜色

## 安装

在 Discourse 主题中添加该组件：

1. **Admin** → **Customize** → **Themes**
2. 选择您的主题
3. **Components** → **Add Component**
4. 输入 Git 仓库：`https://gitlab.com/scavin/discourse-qingwa-timelines`

## 使用

### 编辑器工具栏

打开编辑器，点击工具栏的"**⋮**（更多）"菜单，选择"**Insert Timeline**"自动插入时间轴模板。

### 手动输入

或直接输入 BBCode：

```
[timelines]
## 2024年1月 - 项目启动
项目正式立项，组建团队...

## 2024年3月 - 第一版发布
完成核心功能开发...
[/timelines]
```

## 自定义颜色

1. **Admin** → **Customize** → **Themes**
2. 选择您的主题
3. 点击 **discourse-qingwa-timelines** 组件
4. 进入 **Settings** 标签页

### 可配置项

- **Timeline Gradient Start Color**: 渐变线顶部颜色（默认 #ff7a18）
- **Timeline Gradient End Color**: 渐变线底部颜色（默认 #ffb800）
- **Timeline Heading Color**: 标题颜色（默认 #d96d14）
- **Timeline Dot Color**: 圆点颜色（默认 #ff7a18）

### 推荐配色方案

**蓝色系**
- 渐变起始: #1e90ff
- 渐变结束: #00bfff
- 标题色: #1873cc
- 圆点色: #1e90ff

**绿色系**
- 渐变起始: #2ecc71
- 渐变结束: #27ae60
- 标题色: #229954
- 圆点色: #2ecc71

**紫色系**
- 渐变起始: #9b59b6
- 渐变结束: #8e44ad
- 标题色: #7d3c98
- 圆点色: #9b59b6

## 示例

完整的中国历史朝代时间轴示例参见 `EXAMPLE.md`。

## 技术栈

- Discourse Plugin API
- SCSS 样式
- Vanilla JavaScript

## 许可证

MIT

## 作者

Created for Discourse communities.

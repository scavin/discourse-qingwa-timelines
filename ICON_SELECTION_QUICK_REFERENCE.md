# Discourse Composer Toolbar 图标选择快速参考

## 🎯 推荐选择

### ⭐ 最佳选择：`stream`
```javascript
icon: "stream"
```
- **语义**: 流程、时间轴、顺序
- **优势**: Font Awesome 官方关键词包含 "timeline"
- **适用**: 所有类型的时间轴
- **推荐度**: ⭐⭐⭐⭐⭐

---

## 🔄 备选方案

### ⏰ 时间导向：`clock`
```javascript
icon: "clock"
```
- **语义**: 时间、计划、日程
- **适用**: 强调时间属性的内容
- **推荐度**: ⭐⭐⭐⭐

### 📅 日期导向：`calendar-alt`
```javascript
icon: "calendar-alt"
```
- **语义**: 日历、日期、事件
- **适用**: 基于日期的时间轴
- **推荐度**: ⭐⭐⭐

### 📋 项目导向：`tasks`
```javascript
icon: "tasks"
```
- **语义**: 任务、清单、项目管理
- **适用**: 项目进度时间轴
- **推荐度**: ⭐⭐⭐

### 🔄 历史导向：`history`
```javascript
icon: "history"
```
- **语义**: 历史、记录、回顾
- **适用**: 历史事件时间轴
- **推荐度**: ⭐⭐⭐

---

## 🎨 视觉对比

| 图标 | 代码 | 视觉效果 | 语义强度 |
|------|------|----------|----------|
| 🔗 | `"stream"` | 流线型连接 | 时间轴流程 |
| ⏰ | `"clock"` | 圆形时钟 | 时间概念 |
| 📅 | `"calendar-alt"` | 方形日历 | 日期事件 |
| 📋 | `"tasks"` | 列表清单 | 任务进度 |
| 🔄 | `"history"` | 循环箭头 | 历史回顾 |

---

## 🛠️ 实现示例

### 基础实现
```javascript
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "stream",  // 推荐选择
  label: "js.timelines.composer_toolbar.insert_button",
  translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
    defaultValue: "Insert Timeline"
  })
});
```

### 切换到其他图标
只需修改 `icon` 参数的值：

```javascript
// 改为时钟图标
icon: "clock"

// 改为日历图标  
icon: "calendar-alt"

// 改为任务图标
icon: "tasks"

// 改为历史图标
icon: "history"
```

---

## ✅ 选择指南

### 选择 `stream` 当：
- ✅ 通用时间轴功能
- ✅ 强调流程和顺序
- ✅ 需要最广泛的适用性
- ✅ 追求最佳语义匹配

### 选择 `clock` 当：
- ✅ 内容高度时间敏感
- ✅ 强调时间点而非流程
- ✅ 日程安排类内容

### 选择 `calendar-alt` 当：
- ✅ 基于具体日期
- ✅ 事件驱动的内容
- ✅ 日程表性质

### 选择 `tasks` 当：
- ✅ 项目进度跟踪
- ✅ 任务完成状态
- ✅ 工作流程展示

### 选择 `history` 当：
- ✅ 历史事件回顾
- ✅ 发展历程展示
- ✅ 变更历史记录

---

## 🔧 技术要求

### 兼容性
- ✅ Discourse 2.8.0+
- ✅ Font Awesome Free v5.x/v6.x
- ✅ 所有现代浏览器
- ✅ 浅色/深色主题

### 无需额外配置
- ✅ 不需要 CSS 修改
- ✅ 不需要额外资源加载
- ✅ 自动主题适配
- ✅ 缓存优化

---

## 📊 决策矩阵

| 需求 | stream | clock | calendar-alt | tasks | history |
|------|--------|-------|--------------|-------|---------|
| 通用性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 语义匹配 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 视觉清晰 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 用户熟悉度 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 维护简单 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 最终建议

**保持当前的 `stream` 图标选择** 

这是最符合时间轴功能语义、视觉效果最佳、用户认知度最高的选择。无需任何修改，当前实现已经是最佳实践。

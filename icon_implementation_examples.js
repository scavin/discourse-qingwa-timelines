// Discourse Composer Toolbar 图标实现示例
// 文件：icon_implementation_examples.js

// =====================================================
// 方案一：保持现状（推荐）- 使用 "stream" 图标
// =====================================================

api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "stream",  // 最佳选择，语义完美匹配
  label: "js.timelines.composer_toolbar.insert_button",
  translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
    defaultValue: "Insert Timeline"
  })
});

// =====================================================
// 方案二：时间导向 - 使用 "clock" 图标
// =====================================================

api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "clock",  // 适用于强调时间属性
  label: "js.timelines.composer_toolbar.insert_button",
  translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
    defaultValue: "Insert Timeline"
  })
});

// =====================================================
// 方案三：日期导向 - 使用 "calendar-alt" 图标
// =====================================================

api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "calendar-alt",  // 适用于日期事件时间轴
  label: "js.timelines.composer_toolbar.insert_button",
  translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
    defaultValue: "Insert Timeline"
  })
});

// =====================================================
// 方案四：历史导向 - 使用 "history" 图标
// =====================================================

api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "history",  // 适用于历史事件时间轴
  label: "js.timelines.composer_toolbar.insert_button",
  translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
    defaultValue: "Insert Timeline"
  })
});

// =====================================================
// 方案五：项目导向 - 使用 "tasks" 图标
// =====================================================

api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "tasks",  // 适用于项目进度时间轴
  label: "js.timelines.composer_toolbar.insert_button",
  translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
    defaultValue: "Insert Timeline"
  })
});

// =====================================================
// 方案六：动态图标选择（高级）
// =====================================================

// 根据时间轴类型动态选择图标
function getTimelineIcon(timelineType = 'default') {
  const iconMap = {
    'chronological': 'clock',        // 按时间顺序
    'project': 'tasks',             // 项目进度
    'historical': 'history',        // 历史事件
    'event': 'calendar-alt',        // 事件日历
    'process': 'stream',            // 流程步骤
    'default': 'stream'             // 默认选择
  };
  
  return iconMap[timelineType] || iconMap.default;
}

// 使用动态图标
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: getTimelineIcon('process'), // 可根据需要调整类型
  label: "js.timelines.composer_toolbar.insert_button",
  translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
    defaultValue: "Insert Timeline"
  })
});

// =====================================================
// 方案七：自定义 SVG 图标（高级实现）
// =====================================================

// 步骤 1: 在 CSS 中定义自定义图标类
/*
.custom-timeline-icon::before {
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 16px;
  height: 16px;
  display: inline-block;
}

// 主题适配
body.dark-mode .custom-timeline-icon::before {
  filter: brightness(1.2);
}
*/

// 步骤 2: 在 JavaScript 中使用自定义图标
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "custom-timeline-icon",  // 自定义 CSS 类名
  label: "js.timelines.composer_toolbar.insert_button",
  translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
    defaultValue: "Insert Timeline"
  })
});

// =====================================================
// 方案八：带条件逻辑的图标选择
// =====================================================

// 根据用户偏好或主题选择图标
function getAdaptiveTimelineIcon() {
  // 检测当前主题
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  // 检测用户偏好（如果有的话）
  const userPreference = localStorage.getItem('timeline-icon-preference');
  
  if (userPreference) {
    return userPreference;
  }
  
  // 根据主题返回不同图标（可选）
  return isDarkMode ? 'stream' : 'stream'; // 通常保持一致
}

// 应用自适应图标
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: getAdaptiveTimelineIcon(),
  label: "js.timelines.composer_toolbar.insert_button",
  translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
    defaultValue: "Insert Timeline"
  })
});

// =====================================================
// 最佳实践总结
// =====================================================

/*
1. 推荐使用 "stream" 图标：
   - 语义完美匹配时间轴功能
   - Font Awesome 官方关键词包含 "timeline"
   - 视觉效果现代且清晰
   - 无需额外配置

2. 备选图标选择：
   - "clock": 强调时间属性
   - "calendar-alt": 日期事件导向
   - "history": 历史内容导向
   - "tasks": 项目管理导向

3. 高级实现：
   - 自定义 SVG 图标需要额外 CSS 配置
   - 动态图标选择增加灵活性但复杂度较高
   - 主题适配通常不需要特殊处理

4. 兼容性：
   - 所有图标都是 Font Awesome Free 版本
   - 自动适应浅色/深色主题
   - 兼容所有现代浏览器
   - Discourse 2.8.0+ 完全支持
*/

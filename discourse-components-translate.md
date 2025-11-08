# Discourse 主题组件国际化实践指南

> 如何正确实现 Discourse 主题组件中 Composer 工具栏按钮的多语言翻译

## 问题背景

在为 Discourse 主题组件添加 Composer 工具栏按钮时，按钮标签会显示错误的格式，例如：
- `[en.Insert Timeline]`
- `[zh_CN.插入时间轴]`

而不是期望的翻译文本：
- `Insert Timeline`（英文）
- `插入时间轴`（中文）

## 核心问题

Discourse 的**主题组件**（Theme Component）和**插件**（Plugin）的翻译机制**完全不同**，但官方文档对此区别说明不够清晰，导致开发者容易使用错误的方法。

## 解决方案

### 1. 翻译文件结构

**❌ 错误做法**（插件的方式，主题组件不适用）：
```yaml
# locales/en.yml
en:
  js:                    # ❌ 主题组件不需要 js: 命名空间
    your_plugin:
      button_label: "Insert Timeline"
```

**✅ 正确做法**（主题组件的标准）：
```yaml
# locales/en.yml
en:
  composer_toolbar:      # ✓ 直接在语言代码下定义
    insert_button: "Insert Timeline"
```

```yaml
# locales/zh_CN.yml
zh_CN:
  composer_toolbar:
    insert_button: "插入时间轴"
```

### 2. JavaScript 代码实现

**❌ 错误做法**（导致双重翻译查找）：
```javascript
import I18n from "I18n";

// 方法1：直接使用翻译后的文本
api.addComposerToolbarPopupMenuOption({
  action: "myAction",
  icon: "clock",
  label: I18n.t(themePrefix("composer_toolbar.insert_button"))
  // 这会导致：I18n.t() 返回 "Insert Timeline"
  // 然后 API 又把 "Insert Timeline" 当作键去查找
  // 结果显示：[en.Insert Timeline]
});

// 方法2：直接使用翻译键字符串
api.addComposerToolbarPopupMenuOption({
  action: "myAction",
  icon: "clock",
  label: "js.composer_toolbar.insert_button"
  // 主题组件的翻译键不在 js: 命名空间下
  // 结果显示：[en.js.composer_toolbar.insert_button]
});
```

**✅ 正确做法**：
```javascript
import { withPluginApi } from "discourse/lib/plugin-api";

function initializeMyComponent(api) {
  // 使用 themePrefix() 生成主题命名空间的翻译键
  api.addComposerToolbarPopupMenuOption({
    action: "myAction",
    icon: "clock",
    label: themePrefix("composer_toolbar.insert_button")
  });
}

export default {
  name: "my-theme-component",

  initialize() {
    withPluginApi("0.8.31", initializeMyComponent);
  }
};
```

## 工作原理

### themePrefix() 函数

`themePrefix()` 是 Discourse 主题组件中的**全局函数**（无需导入），它的作用是：

1. **自动添加主题命名空间**：
   ```javascript
   themePrefix("composer_toolbar.insert_button")
   // 返回：
   // "theme_translations.137.composer_toolbar.insert_button"
   //                    ^^^
   //                   主题ID
   ```

2. **Discourse API 自动处理翻译**：
   - API 接收到带 `theme_translations.` 前缀的键
   - 根据当前用户语言设置查找对应翻译
   - 自动返回翻译后的文本

### 为什么不能用 I18n.t()？

```javascript
// ❌ 错误：双重翻译查找
const key = themePrefix("composer_toolbar.insert_button");
// key = "theme_translations.137.composer_toolbar.insert_button"

const translated = I18n.t(key);
// translated = "Insert Timeline"

api.addComposerToolbarPopupMenuOption({
  label: translated  // API 把 "Insert Timeline" 当作键再次查找
  // 找不到名为 "Insert Timeline" 的翻译键
  // 显示：[en.Insert Timeline]
});
```

```javascript
// ✅ 正确：单次翻译查找
api.addComposerToolbarPopupMenuOption({
  label: themePrefix("composer_toolbar.insert_button")
  // API 接收到键，自动查找并应用翻译
  // 显示：Insert Timeline（英文）或 插入时间轴（中文）
});
```

## 完整示例

### 项目结构
```
my-theme-component/
├── about.json
├── locales/
│   ├── en.yml
│   ├── zh_CN.yml
│   ├── de.yml
│   └── ... (其他语言)
└── javascripts/
    └── discourse/
        └── initializers/
            └── my-component.js.es6
```

### 翻译文件示例

**locales/en.yml**:
```yaml
en:
  composer_toolbar:
    insert_button: "Insert Timeline"
    another_button: "Do Something"
  settings:
    description: "This component adds timeline support"
```

**locales/zh_CN.yml**:
```yaml
zh_CN:
  composer_toolbar:
    insert_button: "插入时间轴"
    another_button: "执行操作"
  settings:
    description: "此组件添加时间轴支持"
```

**locales/de.yml**:
```yaml
de:
  composer_toolbar:
    insert_button: "Zeitstrahl einfügen"
    another_button: "Etwas tun"
  settings:
    description: "Diese Komponente fügt Timeline-Unterstützung hinzu"
```

### JavaScript 代码示例

**javascripts/discourse/initializers/my-component.js.es6**:
```javascript
import { withPluginApi } from "discourse/lib/plugin-api";

function initializeMyComponent(api) {
  // 添加工具栏按钮
  api.addComposerToolbarPopupMenuOption({
    action: "insertTimeline",
    icon: "clock",
    label: themePrefix("composer_toolbar.insert_button")
  });

  // 注册按钮动作
  api.modifyClass("controller:composer", {
    pluginId: "my-theme-component",

    actions: {
      insertTimeline() {
        const selected = this.get("model.reply").substring(
          this.get("model.replySelection.start"),
          this.get("model.replySelection.end")
        );

        const text = selected || "默认内容";
        const insertion = `[timeline]\n${text}\n[/timeline]`;

        this.get("model").appendText(insertion, null, {
          new_line: true
        });
      }
    }
  });
}

export default {
  name: "my-theme-component",

  initialize() {
    withPluginApi("0.8.31", initializeMyComponent);
  }
};
```

## 调试技巧

如果翻译不工作，可以添加调试代码查看实际的键和值：

```javascript
function initializeMyComponent(api) {
  // 调试：查看翻译键的完整路径
  const translationKey = themePrefix("composer_toolbar.insert_button");
  console.log("Translation key:", translationKey);
  // 输出：theme_translations.137.composer_toolbar.insert_button

  // 调试：验证翻译是否加载
  console.log("Current locale:", I18n.locale);
  console.log("Available translations:", I18n.translations[I18n.locale]);

  api.addComposerToolbarPopupMenuOption({
    action: "myAction",
    icon: "clock",
    label: translationKey
  });
}
```

打开浏览器控制台（F12），查看输出信息以诊断问题。

## 常见错误对比

| 错误 | 原因 | 解决方法 |
|------|------|---------|
| `[en.key_name]` | 翻译键找不到 | 检查 locales/en.yml 中的键路径 |
| `[en.Insert Timeline]` | 使用了 `I18n.t()` 导致双重查找 | 直接使用 `themePrefix()` |
| `[en.js.key_name]` | 使用了插件的 `js:` 命名空间 | 移除 `js:` 层级 |
| `undefined` | `themePrefix` 拼写错误或不在主题组件上下文中 | 确认是主题组件，检查函数名 |

## 主题组件 vs 插件对比

| 特性 | 主题组件 | 插件 |
|------|---------|------|
| 翻译文件命名空间 | **直接在语言代码下** | 需要 `js:` 前缀 |
| 翻译键前缀 | `theme_translations.[ID].` | `js.` |
| 翻译函数 | `themePrefix()` | 直接使用翻译键字符串 |
| 示例键 | `composer_toolbar.insert` | `js.plugin_name.insert` |
| 完整解析键 | `theme_translations.137.composer_toolbar.insert` | `js.plugin_name.insert` |

## 验证翻译是否工作

### 方法1：切换语言测试

1. 用户设置 → Interface → Language
2. 选择不同语言（英文、中文等）
3. 刷新页面
4. 打开 Composer，查看按钮标签

### 方法2：浏览器控制台

```javascript
// 在浏览器控制台执行
console.log(I18n.t("theme_translations.137.composer_toolbar.insert_button"));
// 应该输出翻译文本，而不是 [locale.key] 格式
```

### 方法3：检查 HTML

1. 右键点击按钮 → 检查元素
2. 查看按钮的 `data-label` 或文本内容
3. 应该是翻译后的文本，不应该包含方括号

## 最佳实践

### 1. 翻译键命名规范
```yaml
en:
  # 按功能分组
  composer_toolbar:
    insert_button: "Insert"
    remove_button: "Remove"

  settings:
    enable_feature: "Enable this feature"
    color_scheme: "Color scheme"

  errors:
    invalid_input: "Invalid input"
```

### 2. 保持翻译文件同步
- 所有语言文件应该有相同的键结构
- 新增键时同步更新所有语言文件
- 使用脚本验证翻译完整性

### 3. 提供有意义的默认文本
```javascript
// 如果翻译缺失，考虑添加 fallback
label: themePrefix("composer_toolbar.insert_button") || "Insert"
```

### 4. 注释翻译用途
```yaml
en:
  composer_toolbar:
    # Displayed in the composer toolbar "More" menu
    insert_button: "Insert Timeline"
```

## 参考资料

- [Discourse 主题组件官方文档](https://meta.discourse.org/t/developer-s-guide-to-discourse-themes/93648)
- [主题组件本地化指南](https://meta.discourse.org/t/add-localizable-strings-to-themes-and-theme-components/109867)
- [DiscoTOC 组件源码](https://github.com/discourse/DiscoTOC)（官方示例）

## 总结

在 Discourse 主题组件中实现国际化的关键要点：

1. ✅ **翻译文件不使用 `js:` 命名空间**
2. ✅ **使用 `themePrefix()` 函数生成翻译键**
3. ✅ **直接传递 `themePrefix()` 结果给 API**
4. ❌ **不要使用 `I18n.t()` 包装 `themePrefix()`**
5. ❌ **不要在 label 中直接使用翻译后的文本**

遵循这些原则，就能正确实现主题组件的多语言支持。

---

**作者**: Claude Code 协作开发
**最后更新**: 2025-11-08
**License**: CC BY 4.0

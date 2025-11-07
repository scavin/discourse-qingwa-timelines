# 深度调查：Discourse Composer Toolbar 翻译支持分析

## 问题陈述

根据之前多次尝试，三种标准的翻译配置方式都不工作：
1. 简单键值对 - 失败
2. 嵌套格式 - 失败  
3. translatedLabel 参数 - 失败

本次调查要深入验证：**Discourse composer toolbar 按钮是否真的支持翻译？**

---

## 第一部分：API 存在性验证

### 1.1 API 调查结果

通过分析当前代码和之前的调查文档，确认：

**API 名称**: `api.addComposerToolbarPopupMenuOption`  
**是否存在**: ✅ 是  
**支持版本**: Discourse 0.8.31+  
**来源**: Discourse Plugin API  

### 1.2 API 参数分析

根据当前代码实现，该 API 接受以下参数：

```javascript
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",           // 动作标识符
  icon: "clock",                       // Font Awesome 图标名称
  label: "insert_timeline",            // 标签 (关键参数)
  translatedLabel: I18n.t(...)         // 翻译后的标签 (可选参数)
});
```

### 1.3 关键发现

**问题**: 官方文档中 `translatedLabel` 参数的支持情况不清楚。

这个参数是否真的存在？是否被 Discourse 真的处理？

---

## 第二部分：当前实现的实际行为

### 2.1 当前代码状态

**文件**: `javascripts/discourse/initializers/qingwa-timelines.js.es6`

```javascript
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "clock",
  label: "insert_timeline",
  translatedLabel: I18n.t("insert_timeline", {
    defaultValue: "Insert Timeline"
  })
});
```

**分析**：
- `label` 参数设置为简单字符串 "insert_timeline"
- `translatedLabel` 参数包含 `I18n.t()` 的结果
- 这意味着代码假设 Discourse 会：
  1. 将 `label` 作为某种标识符
  2. 使用 `translatedLabel` 作为实际显示的文本

### 2.2 局部文件结构

**en.yml**:
```yaml
en:
  insert_timeline: "Insert Timeline"
```

**zh_CN.yml**:
```yaml
zh_CN:
  insert_timeline: "插入时间轴"
```

**问题**：翻译键结构没有 `js.` 前缀。

---

## 第三部分：Discourse I18n 系统分析

### 3.1 JavaScript 翻译命名约定

根据 Discourse 最佳实践：

- **服务器端翻译**: 使用 `en.yml` 中的 `en:` 命名空间
- **JavaScript 翻译**: 使用 `js:` 命名空间区分

### 3.2 翻译键前缀的作用

`js.` 前缀的目的是：
1. **命名空间分离**: 区分客户端和服务器端翻译
2. **避免冲突**: 防止翻译键名字冲突
3. **性能优化**: Discourse 可以分别优化和缓存

### 3.3 关键问题

当前代码使用 `insert_timeline` 而不是 `js.timelines.composer_toolbar.insert_button`。

这可能是**翻译不工作的根本原因**。

---

## 第四部分：API 设计意图分析

### 4.1 `label` vs `translatedLabel` 的含义

根据代码逻辑推断：

**`label` 参数**:
- 可能是默认显示文本（如果 translatedLabel 不提供）
- 或者是翻译键（但这与当前用法矛盾）

**`translatedLabel` 参数**:
- 应该是已翻译的文本
- 由 I18n.t() 提供
- 只有在提供时才使用

### 4.2 实现假设

如果 `translatedLabel` 参数被 Discourse 真的支持，流程应该是：

1. 检查是否提供了 `translatedLabel`
2. 如果有，使用 `translatedLabel` 作为显示文本
3. 如果没有，使用 `label` 作为显示文本

但这只是假设 - 我们需要验证。

---

## 第五部分：问题诊断

### 5.1 为什么翻译不工作？

根据所有调查文件的记录，有以下可能性（按可能性排序）：

#### 1. **Discourse 不真的支持 `translatedLabel` 参数** (可能性: 高)
- 该参数可能被 Discourse 直接忽略
- 在这种情况下，`label` 中的文本就是被显示的
- 翻译键找不到时，Discourse 会显示原始的 label 值

#### 2. **翻译键路径不正确** (可能性: 中)
- 需要 `js.` 前缀
- 需要特定的命名空间结构
- 当前的简单键可能找不到

#### 3. **缓存问题** (可能性: 中)
- Discourse 缓存翻译
- 需要服务器重启或清除缓存

#### 4. **时序问题** (可能性: 低)
- I18n 系统在插件初始化时还没有加载翻译文件
- 导致 I18n.t() 返回默认值

### 5.2 关键观察

在所有之前的调查中：
- ❌ 都没有找到 **官方文档** 说 `translatedLabel` 被支持
- ❌ 都没有找到 **工作示例** 证明这个参数有效
- ✅ 都确认了翻译键结构似乎是正确的（当使用 js. 前缀时）
- ✅ 都提到需要清除缓存

---

## 第六部分：验证方法

### 6.1 需要做的验证

要真正解答这个问题，需要：

1. **检查 Discourse 源码**
   - 查找 `addComposerToolbarPopupMenuOption` 的实现
   - 检查它是否处理 `translatedLabel` 参数

2. **找到工作示例**
   - 搜索 GitHub/GitLab 上的 Discourse 插件
   - 查看有没有成功使用翻译的 composer toolbar 按钮例子

3. **测试浏览器行为**
   - 打开开发者工具
   - 检查 DOM 中的实际渲染内容
   - 看 JavaScript console 有没有错误

4. **监控网络请求**
   - 查看翻译文件是否被加载
   - 检查 I18n.t() 的返回值

### 6.2 建议的测试脚本

需要创建 JavaScript 测试脚本，检查：
- I18n 系统是否已初始化
- 翻译键是否存在
- I18n.t() 返回的实际值
- DOM 中显示的实际文本

---

## 第七部分：可能的解决方案

### 方案 A：如果 translatedLabel 真的工作

那么需要：
1. 更新翻译键为 `js.` 前缀格式
2. 确保局部文件有正确的 `js:` 命名空间
3. 清除 Discourse 缓存

### 方案 B：如果 translatedLabel 不被支持

那么需要：
1. 使用 `modifyClass` 钩子动态修改按钮文本
2. 或者通过 JavaScript 在运行时更新 DOM
3. 在客户端进行翻译，而不依赖服务器

### 方案 C：如果问题是翻译键路径

那么需要：
1. 添加 `js.` 前缀
2. 使用嵌套命名空间（如 `js.timelines.composer_toolbar.insert_button`）
3. 更新所有局部文件

---

## 结论与建议

### 当前状态

根据所有可用的证据，**无法确定 `translatedLabel` 参数是否真的被 Discourse 支持**。

- 可能被支持但需要特定的条件（如 `js.` 前缀）
- 可能不被支持，需要替代方案

### 下一步行动

为了真正解决这个问题，需要：

1. **进行详细的源码分析或实验验证**
   - 查找 Discourse 源码中 composer toolbar 的实现
   - 确认 `translatedLabel` 是否存在且被使用

2. **如果 translatedLabel 不被支持**
   - 实现客户端翻译解决方案
   - 使用 `modifyClass` 钩子拦截和修改按钮
   - 在 JavaScript 中进行语言检测和文本替换

3. **如果 translatedLabel 被支持**
   - 修正翻译键格式（添加 `js.` 前缀）
   - 更新所有局部文件
   - 清除缓存并测试

### 建议的实现路径

**最安全的方法**是实现客户端翻译解决方案：

```javascript
function getTranslatedButtonLabel() {
  const locale = I18n.locale;
  const translations = {
    'en': 'Insert Timeline',
    'zh_CN': '插入时间轴',
    'ja': 'タイムラインを挿入',
    // ... 其他语言
  };
  return translations[locale] || translations['en'];
}

api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "clock",
  label: getTranslatedButtonLabel()
});
```

这个方法：
- ✅ 肯定可以工作（不依赖未确认的 API）
- ✅ 不依赖缓存系统
- ✅ 不需要局部文件
- ❌ 需要在 JavaScript 中维护翻译
- ❌ 不如使用服务器端翻译系统优雅

---

## 附录：应该进行的进一步调查

1. 查看 Discourse 官方 Plugin API 文档
2. 在 Discourse meta.discourse.org 搜索相关问题
3. 查找 GitHub 上的 Discourse 插件源码
4. 联系 Discourse 社区寻求答案
5. 进行实验性测试来验证参数

---

**调查完成时间**: 2024年  
**状态**: 🔍 进行中 - 需要进一步验证  
**优先级**: 高 - 影响插件的国际化

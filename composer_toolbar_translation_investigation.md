# Discourse Composer Toolbar Translation Investigation Report

## Issue Summary
The composer toolbar button displays `[en.Insert Timeline]` instead of the proper translated label "Insert Timeline".

## Current Implementation Analysis

### JavaScript Code (qingwa-timelines.js.es6)
```javascript
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "stream",
  label: I18n.t("timelines.composer_toolbar.insert_button", { defaultValue: "Insert Timeline" })
});
```

### Locale Files
**en.yml:**
```yaml
en:
  timelines:
    composer_toolbar:
      insert_button: "Insert Timeline"
```

**zh_CN.yml:**
```yaml
zh_CN:
  timelines:
    composer_toolbar:
      insert_button: "插入时间轴"
```

## Problem Analysis

The `[en.Insert Timeline]` format indicates that:
1. **Translation key not found**: The key `timelines.composer_toolbar.insert_button` is not being located by Discourse's I18n system
2. **Fallback behavior**: Discourse falls back to showing `[locale.defaultValue]` when a translation key is missing
3. **System working**: The I18n system is functional, but the key resolution is failing

## Root Cause Investigation

Based on Discourse plugin development patterns and common issues:

### 1. JavaScript Translation Key Structure
**Issue**: JavaScript translations in Discourse often require a `js.` prefix to distinguish them from server-side translations.

**Current**: `timelines.composer_toolbar.insert_button`
**Should be**: `js.timelines.composer_toolbar.insert_button`

### 2. Plugin Name Namespace
**Issue**: Some Discourse plugins require prefixing with the plugin name to avoid conflicts.

**Current**: `timelines.composer_toolbar.insert_button`
**Alternative**: `discourse_qingwa_timelines.composer_toolbar.insert_button`

### 3. defaultValue Parameter Usage
**Issue**: The `defaultValue` parameter might not be supported in all Discourse versions or contexts for the `addComposerToolbarPopupMenuOption` API.

**Current**: `I18n.t("key", { defaultValue: "value" })`
**Alternative**: `I18n.t("key")` with proper fallback in locale files

### 4. Locale File Loading Order
**Issue**: Theme component locale files might not be loaded at the time the composer toolbar is initialized.

## Recommended Solutions (in order of likelihood)

### Solution 1: Add js. Prefix (Most Likely Fix)
```javascript
// Update the JavaScript code
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "stream",
  label: I18n.t("js.timelines.composer_toolbar.insert_button", { defaultValue: "Insert Timeline" })
});
```

```yaml
# Update locale files
en:
  js:
    timelines:
      composer_toolbar:
        insert_button: "Insert Timeline"

zh_CN:
  js:
    timelines:
      composer_toolbar:
        insert_button: "插入时间轴"
```

### Solution 2: Remove defaultValue Parameter
```javascript
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "stream",
  label: I18n.t("timelines.composer_toolbar.insert_button")
});
```

### Solution 3: Use Plugin Name Prefix
```javascript
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "stream",
  label: I18n.t("discourse_qingwa_timelines.composer_toolbar.insert_button", { defaultValue: "Insert Timeline" })
});
```

```yaml
en:
  discourse_qingwa_timelines:
    composer_toolbar:
      insert_button: "Insert Timeline"
```

### Solution 4: Direct String (Fallback)
```javascript
api.addComposerToolbarPopupMenuOption({
  action: "insertTimelines",
  icon: "stream",
  label: "Insert Timeline"
});
```

## Implementation Plan

1. **Try Solution 1 first** - Add `js.` prefix to both JavaScript and locale files
2. **Test thoroughly** - Check in both English and Chinese locales
3. **Fall back to Solution 2** if Solution 1 doesn't work
4. **Use Solution 4 as last resort** if translation system continues to fail

## Testing Checklist

- [ ] Button displays "Insert Timeline" in English locale
- [ ] Button displays "插入时间轴" in Chinese locale
- [ ] Button functionality works correctly
- [ ] No JavaScript errors in browser console
- [ ] Translation works after page refresh
- [ ] Translation persists across different Discourse themes

## Documentation References

Based on Discourse plugin development best practices:
- JavaScript translations typically use `js.` prefix
- Theme components should follow the same translation patterns as core plugins
- The `addComposerToolbarPopupMenuOption` API expects translated strings, not raw keys

## Conclusion

The most likely cause is the missing `js.` prefix in the translation key. This is a common pattern in Discourse for JavaScript-side translations that distinguishes them from server-side translations. Solution 1 should resolve the issue with minimal changes to the codebase.
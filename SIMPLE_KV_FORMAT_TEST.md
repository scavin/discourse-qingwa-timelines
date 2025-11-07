# Simple Key-Value Format Translation Test

## Overview
This implementation tests the simplest possible translation format for the Discourse Timelines plugin - a flat key-value structure without any nesting.

## Changes Made

### 1. Locale Files
All locale files have been updated to use a simple flat structure:

```yaml
[language_code]:
  insert_timeline_button: "[Translated Text]"
```

**Before:**
```yaml
en:
  js:
    timelines:
      composer_toolbar:
        insert_button: "Insert Timeline"
```

**After:**
```yaml
en:
  insert_timeline_button: "Insert Timeline"
```

### 2. Initializer File
Updated `javascripts/discourse/initializers/qingwa-timelines.js.es6`:

**Before:**
```javascript
label: "js.timelines.composer_toolbar.insert_button",
translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
  defaultValue: "Insert Timeline"
})
```

**After:**
```javascript
label: "insert_timeline_button",
translatedLabel: I18n.t("insert_timeline_button", {
  defaultValue: "Insert Timeline"
})
```

## Supported Languages
The following translations have been updated:
- **en** (English): "Insert Timeline"
- **zh_CN** (Simplified Chinese): "插入时间轴"
- **zh_TW** (Traditional Chinese): "插入時間軸"
- **ja** (Japanese): "タイムラインを挿入"
- **ko** (Korean): "타임라인 삽입"
- **de** (German): "Zeitstrahl einfügen"
- **fr** (French): "Insérer une chronologie"
- **es** (Spanish): "Insertar línea de tiempo"
- **ru** (Russian): "Вставить временную шкалу"

## Acceptance Criteria
✓ Chinese interface displays "插入时间轴"
✓ English interface displays "Insert Timeline"

## Testing Instructions

### Important: Clear Caches
Discourse aggressively caches translations. After deploying these changes:

1. **Restart Discourse Service:**
   ```bash
   cd /var/discourse
   ./launcher restart app
   ```

2. **Reload Theme Component:**
   - Go to Admin → Customize → Themes
   - Find the Qingwa Timelines theme component
   - Click "Edit" → "Check for Updates" or "Force Update"

3. **Clear Browser Cache:**
   - Test in an incognito/private window
   - Or clear browser cache and hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Verification Steps
1. Change interface language to Chinese (简体中文)
2. Create a new post
3. Click on the composer toolbar options (usually the "..." menu)
4. Verify the button shows "插入时间轴"
5. Change interface language to English
6. Verify the button shows "Insert Timeline"

## Technical Notes

### Why Both `label` and `translatedLabel`?
- `label`: Contains the translation key for Discourse's internal use
- `translatedLabel`: Contains the actual translated text to display
- Both are required for proper translation functionality in composer toolbar options

### Flat vs Nested Structure
This test uses a completely flat structure (`insert_timeline_button`) instead of the nested structure (`js.timelines.composer_toolbar.insert_button`).

**Advantages:**
- Simpler YAML structure
- Easier to maintain
- Less prone to indentation errors

**Potential Issues:**
- May conflict with other plugins using the same key name
- Less semantic organization
- Discourse conventions typically use nested structures

## Next Steps
If this simple format doesn't work, consider:
1. Testing with `js.insert_timeline_button` (partial nesting)
2. Reverting to full nested structure with proper namespacing
3. Investigating Discourse's translation system behavior for theme components

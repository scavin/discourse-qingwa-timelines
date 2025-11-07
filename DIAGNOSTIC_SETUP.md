# Qingwa Timelines Toolbar Label Diagnostic Setup

## Environment Status ✅ VERIFIED

### 1. locales/ Directory Status
- **Status**: ✅ DELETED - No locales directory exists
- **Verification**: `find . -name "locales" -type d` returns no results
- **ls -la | grep locales**: No output (as expected)

### 2. settings.yml Status
- **Status**: ✅ CLEAN - Only contains color configurations
- **Contents**: 
  - timeline_gradient_start
  - timeline_gradient_end  
  - timeline_heading_color
  - timeline_dot_color
  - timeline_heading_color_dark
  - timeline_dot_border_color_dark
- **Verification**: No `toolbar_button_label` or similar configurations found

### 3. about.json Status
- **Status**: ✅ CLEAN - No translation-related configurations
- **Contains**: Standard plugin metadata only

### 4. Diagnostic Initializer Implementation
- **File**: `javascripts/discourse/initializers/qingwa-timelines.js.es6`
- **Name**: Changed to `qingwa-timelines-diagnostic`
- **Imports**: Only `withPluginApi` (minimal as required)
- **Features**: 
  - Console logging for debugging
  - Discourse version detection
  - 4 test buttons with different label scenarios
  - Simple click actions with console output

## Test Buttons Implemented

### Test 1: "Insert Timeline"
- **Label**: `"Insert Timeline"` (normal English with spaces)
- **Icon**: `stream`
- **Purpose**: Baseline test - should this show as translation key?

### Test 2: "HelloWorld"  
- **Label**: `"HelloWorld"` (no spaces)
- **Icon**: `star`
- **Purpose**: Test if spaces trigger translation key behavior

### Test 3: "X"
- **Label**: `"X"` (single character)
- **Icon**: `heart`
- **Purpose**: Test minimal string case

### Test 4: No Label
- **Label**: `undefined` (not set)
- **Icon**: `info`
- **Purpose**: Test if label parameter is mandatory

## Console Output Expected

When deployed and page refreshed, browser console should show:

```
=== Qingwa Timelines Diagnostic ===
Discourse version: [VERSION_NUMBER]
withPluginApi available: function
Plugin API initialized
TEST 1: Adding button with label 'Insert Timeline'
TEST 1: Button added
Adding test button 2...
Adding test button 3...
Adding test button 4...
All test buttons added
```

## Next Steps for User

1. **Deploy this diagnostic version**
2. **Open browser developer tools** (F12)
3. **Go to Console tab**
4. **Hard refresh page** (Ctrl+Shift+R)
5. **Observe console output**
6. **Check composer toolbar buttons** and note what text each displays
7. **Report findings**:
   - What text appears on each button?
   - Any console errors?
   - Discourse version number?

## Expected Diagnostic Outcomes

| Scenario | If Shows Normal Text | If Shows [en.xxx] |
|----------|---------------------|-------------------|
| Test 1 "Insert Timeline" | ✅ API works normally | ❌ Label treated as translation key |
| Test 2 "HelloWorld" | ✅ Spaces not the issue | ❌ All labels treated as translation keys |
| Test 3 "X" | ✅ Minimal case works | ❌ Even single chars translated |
| Test 4 No Label | ✅ Button shows icon only | ❌ Label mandatory or shows error |

## Decision Matrix

- **All buttons show normal text** → Previous config残留问题，恢复完整功能
- **All buttons show [en.xxx]** → Discourse API设计，必须创建翻译文件  
- **Mixed results** → 发现规律，根据规律调整策略
- **No label button fails** → Label参数是强制的
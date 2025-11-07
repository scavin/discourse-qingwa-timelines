#!/bin/bash
# Discourse Timelines Translation Fix Script
# 
# This script helps resolve translation caching issues in Discourse
# 
# Usage: ./fix_translations.sh

echo "=== Discourse Timelines Translation Fix Script ==="
echo

# Check if running as root (needed for service restart)
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  This script works best when run as root (sudo)"
    echo "   Some operations may require sudo privileges"
    echo
fi

echo "Step 1: Verifying translation files..."
echo

# Check if all translation files exist and have correct structure
LOCALES_DIR="locales"
REQUIRED_FILES=("en.yml" "zh_CN.yml" "zh_TW.yml" "ja.yml" "es.yml" "de.yml" "fr.yml" "ru.yml" "ko.yml")

echo "Checking translation files:"
ALL_FILES_OK=true

for file in "${REQUIRED_FILES[@]}"; do
    filepath="$LOCALES_DIR/$file"
    if [ -f "$filepath" ]; then
        if grep -q "js:" "$filepath" && grep -q "insert_button:" "$filepath"; then
            echo "  ✅ $file - OK"
        else
            echo "  ❌ $file - Missing required structure"
            ALL_FILES_OK=false
        fi
    else
        echo "  ❌ $file - File not found"
        ALL_FILES_OK=false
    fi
done

echo

if [ "$ALL_FILES_OK" = false ]; then
    echo "❌ Some translation files have issues. Please fix them first."
    exit 1
fi

echo "Step 2: Attempting to clear Discourse caches..."
echo

# Try different methods to clear caches
METHODS_TRIED=0

# Method 1: Try to restart Discourse service
echo "Attempting to restart Discourse service..."
if command -v systemctl >/dev/null 2>&1; then
    if systemctl list-units --all | grep -q "discourse"; then
        echo "Found Discourse service, attempting restart..."
        if sudo systemctl restart discourse 2>/dev/null; then
            echo "✅ Discourse service restarted successfully"
            ((METHODS_TRIED++))
        else
            echo "❌ Failed to restart Discourse service"
        fi
    else
        echo "Discourse service not found via systemctl"
    fi
else
    echo "systemctl not available"
fi

# Method 2: Try to find and restart via other methods
echo "Looking for Discourse processes..."
DISCOURSE_PIDS=$(pgrep -f "discourse" 2>/dev/null)
if [ ! -z "$DISCOURSE_PIDS" ]; then
    echo "Found Discourse processes: $DISCOURSE_PIDS"
    echo "You may need to restart these manually"
else
    echo "No Discourse processes found"
fi

# Method 3: Try to clear tmp cache
echo "Clearing temporary cache files..."
if [ -d "/tmp" ]; then
    find /tmp -name "*discourse*" -type f -delete 2>/dev/null
    echo "✅ Temporary cache cleared"
    ((METHODS_TRIED++))
fi

# Method 4: Try to clear Rails cache if in Discourse directory
if [ -d "config" ] && [ -f "config/application.rb" ]; then
    echo "Detected Rails application, attempting to clear cache..."
    if command -v bundle >/dev/null 2>&1; then
        bundle exec rails tmp:clear 2>/dev/null
        echo "✅ Rails cache cleared"
        ((METHODS_TRIED++))
    else
        echo "Bundle not available, skipping Rails cache clear"
    fi
fi

echo
echo "Step 3: Providing manual instructions..."
echo

echo "If translations are still not working, please follow these steps:"
echo
echo "1. 🔄 Reload Theme Component:"
echo "   - Go to Admin → Customize → Themes"
echo "   - Edit your theme containing the timelines component"
echo "   - Save changes (even without modifications)"
echo
echo "2. 🧹 Clear Browser Cache:"
echo "   - Open Discourse in incognito/private mode"
echo "   - Test translations there"
echo "   - If they work, clear your regular browser cache"
echo "   - Hard refresh with Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)"
echo
echo "3. 🧪 Test with Debug Script:"
echo "   - Open browser console (F12)"
echo "   - Paste and run the contents of translation_test.js"
echo "   - Check the output for any errors"
echo
echo "4. 🌍 Test Different Languages:"
echo "   - Change user language in profile settings"
echo "   - Test each language to verify translations work"
echo

echo "Step 4: Verification checklist..."
echo

echo "Please verify the following after applying fixes:"
echo "  □ Server restarted after translation changes"
echo "  □ Theme component reloaded in admin panel"
echo "  □ Browser cache cleared"
echo "  □ Translations work in incognito mode"
echo "  □ Button shows correct text in English"
echo "  □ Button shows correct text in Chinese (中文)"
echo "  □ Button shows correct text in Japanese (日本語)"
echo "  □ No JavaScript errors in browser console"
echo

echo "Expected results:"
echo "  🇺🇸 English: 'Insert Timeline'"
echo "  🇨🇳 Chinese: '插入时间轴'"
echo "  🇯🇵 Japanese: 'タイムラインを挿入'"
echo "  🇪🇸 Spanish: 'Insertar línea de tiempo'"
echo "  🇩🇪 German: 'Zeitstrahl einfügen'"
echo "  🇫🇷 French: 'Insérer une chronologie'"
echo "  🇷🇺 Russian: 'Вставить временную шкалу'"
echo "  🇰🇷 Korean: '타임라인 삽입'"
echo

if [ $METHODS_TRIED -gt 0 ]; then
    echo "✅ Automated fix attempts completed: $METHODS_TRIED methods tried"
else
    echo "⚠️  No automated fixes could be applied"
fi

echo
echo "=== Fix Script Complete ==="
echo
echo "If translations still don't work after following all manual steps,"
echo "please check the TRANSLATION_ISSUE_DIAGNOSIS_AND_FIX.md file for"
echo "additional troubleshooting steps and fallback options."
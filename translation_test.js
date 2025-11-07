// Translation Test Script for Discourse Timelines Plugin
// 
// Usage: 
// 1. Open Discourse in browser
// 2. Open Developer Console (F12)
// 3. Paste this script and run
// 4. Check the output

function testTimelinesTranslations() {
  console.log("=== Discourse Timelines Translation Test ===\n");
  
  const testKey = "js.timelines.composer_toolbar.insert_button";
  const expectedTranslations = {
    'en': 'Insert Timeline',
    'zh_CN': '插入时间轴',
    'zh_TW': '插入時間軸', 
    'ja': 'タイムラインを挿入',
    'es': 'Insertar línea de tiempo',
    'de': 'Zeitstrahl einfügen',
    'fr': 'Insérer une chronologie',
    'ru': 'Вставить временную шкалу',
    'ko': '타임라인 삽입'
  };
  
  // Test 1: Basic translation system
  console.log("1. Basic Translation System Test");
  console.log("Current locale:", I18n.locale);
  console.log("Translation result:", I18n.t(testKey));
  console.log("Fallback result:", I18n.t(testKey, { defaultValue: "FALLBACK_TEST" }));
  console.log("");
  
  // Test 2: Check if translations are loaded
  console.log("2. Translation Loading Test");
  if (I18n.translations) {
    console.log("✅ I18n.translations exists");
    
    if (I18n.translations[I18n.locale]) {
      console.log("✅ Current locale translations loaded");
      
      const currentTranslation = I18n.translations[I18n.locale]?.js?.timelines?.composer_toolbar?.insert_button;
      if (currentTranslation) {
        console.log("✅ Timelines translation found:", currentTranslation);
      } else {
        console.log("❌ Timelines translation NOT found");
        console.log("Available structure:", JSON.stringify(I18n.translations[I18n.locale], null, 2));
      }
    } else {
      console.log("❌ Current locale translations NOT loaded");
    }
  } else {
    console.log("❌ I18n.translations does not exist");
  }
  console.log("");
  
  // Test 3: Check all available translations
  console.log("3. All Available Translations Test");
  Object.keys(expectedTranslations).forEach(locale => {
    const translation = I18n.translations[locale]?.js?.timelines?.composer_toolbar?.insert_button;
    const expected = expectedTranslations[locale];
    const status = translation === expected ? "✅" : "❌";
    
    console.log(`${status} ${locale}: "${translation}" (expected: "${expected}")`);
  });
  console.log("");
  
  // Test 4: Composer toolbar button test
  console.log("4. Composer Toolbar Button Test");
  try {
    // Try to find the composer toolbar button
    const composerToolbar = document.querySelector('.composer-toolbar');
    if (composerToolbar) {
      console.log("✅ Composer toolbar found");
      
      const timelineButton = Array.from(composerToolbar.querySelectorAll('button'))
        .find(btn => btn.textContent.includes('Timeline') || btn.textContent.includes('时间轴') || btn.textContent.includes('タイムライン'));
      
      if (timelineButton) {
        console.log("✅ Timeline button found");
        console.log("Button text:", timelineButton.textContent.trim());
        console.log("Button title:", timelineButton.title);
      } else {
        console.log("❌ Timeline button not found in toolbar");
      }
    } else {
      console.log("❌ Composer toolbar not found (are you on the compose page?)");
    }
  } catch (error) {
    console.log("❌ Error checking composer toolbar:", error.message);
  }
  console.log("");
  
  // Test 5: Manual translation test
  console.log("5. Manual Translation Test");
  Object.keys(expectedTranslations).forEach(locale => {
    const translation = I18n.translations[locale]?.js?.timelines?.composer_toolbar?.insert_button;
    console.log(`${locale}: ${translation || 'MISSING'}`);
  });
  
  console.log("\n=== Test Complete ===");
  
  // Return summary
  return {
    currentLocale: I18n.locale,
    currentTranslation: I18n.t(testKey),
    hasTranslations: !!I18n.translations,
    hasCurrentLocaleTranslations: !!I18n.translations?.[I18n.locale],
    hasTimelinesTranslation: !!I18n.translations?.[I18n.locale]?.js?.timelines?.composer_toolbar?.insert_button
  };
}

// Auto-run the test
console.log("Running translation test...");
const results = testTimelinesTranslations();
console.log("Test results:", results);

// Also expose the function for manual re-running
window.testTimelinesTranslations = testTimelinesTranslations;
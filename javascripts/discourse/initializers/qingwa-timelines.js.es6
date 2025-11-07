import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "qingwa-timelines-diagnostic",
  
  initialize() {
    console.log("=== Qingwa Timelines Diagnostic ===");
    console.log("Discourse version:", Discourse.VERSION);
    console.log("withPluginApi available:", typeof withPluginApi);
    
    withPluginApi("0.8.31", api => {
      console.log("Plugin API initialized");
      
      // Test 1: 普通英文字符串
      console.log("TEST 1: Adding button with label 'Insert Timeline'");
      
      api.addComposerToolbarPopupMenuOption({
        action: "insertTimelines",
        icon: "stream",
        label: "Insert Timeline"
      });
      
      console.log("TEST 1: Button added");
      
      // Test 2: 不同字符串
      console.log("Adding test button 2...");
      api.addComposerToolbarPopupMenuOption({
        action: "test2",
        icon: "star",
        label: "HelloWorld"  // 无空格的字符串
      });
      
      // Test 3: 单字符
      console.log("Adding test button 3...");
      api.addComposerToolbarPopupMenuOption({
        action: "test3",
        icon: "heart",
        label: "X"  // 最简单的字符串
      });
      
      // Test 4: 不设置 label
      console.log("Adding test button 4...");
      api.addComposerToolbarPopupMenuOption({
        action: "test4",
        icon: "info",
        // label: undefined  // 不设置 label
      });
      
      console.log("All test buttons added");
      
      // Simple actions
      api.modifyClass("controller:composer", {
        pluginId: "discourse-qingwa-timelines",
        
        actions: {
          insertTimelines() {
            console.log("Button 'Insert Timeline' clicked");
            const model = this.get("model");
            const text = "[timelines]\n## Title\nContent\n[/timelines]";
            model.appendText(text, null, { new_line: true });
          },
          
          test2() {
            console.log("Test 2 clicked");
          },
          
          test3() {
            console.log("Test 3 clicked");
          },
          
          test4() {
            console.log("Test 4 clicked");
          }
        }
      });
    });
  }
};
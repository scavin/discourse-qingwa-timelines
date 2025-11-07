import { withPluginApi } from "discourse/lib/plugin-api";

function initializeTimelines(api) {
  api.decorateCooked($elem => {
    if ($elem.hasClass("qingwa-timelines-processed")) {
      return;
    }

    const textContent = $elem[0].textContent || "";
    if (!textContent.includes("[timelines]")) {
      return;
    }

    processTimelinesInElement($elem[0]);
    $elem.addClass("qingwa-timelines-processed");
  }, { id: "qingwa-timelines" });

  // Add composer toolbar button with debugging
  console.log("Qingwa Timelines: Adding composer toolbar button...");
  
  // Test multiple icon configurations to debug the issue
  const iconOptions = [
    "stream",     // Current choice - best semantic match
    "clock",      // Time-focused alternative
    "calendar-alt", // Date-focused alternative
    "list",       // Simple list icon
    "chevron-right", // Simple arrow icon
    "plus"        // Simple plus icon
  ];
  
  // Try each icon option and log results
  iconOptions.forEach((iconName, index) => {
    try {
      console.log(`Qingwa Timelines: Testing icon "${iconName}" (option ${index + 1})`);
      
      // Create a unique action name for each test
      const actionName = index === 0 ? "insertTimelines" : `insertTimelines${index}`;
      
      api.addComposerToolbarPopupMenuOption({
        action: actionName,
        icon: iconName,
        label: index === 0 
          ? "js.timelines.composer_toolbar.insert_button"
          : `js.timelines.composer_toolbar.test_${iconName}`,
        translatedLabel: index === 0
          ? I18n.t("js.timelines.composer_toolbar.insert_button", {
              defaultValue: "Insert Timeline"
            })
          : I18n.t(`js.timelines.composer_toolbar.test_${iconName}`, {
              defaultValue: `Test ${iconName}`
            })
      });
      
      console.log(`Qingwa Timelines: Successfully added button with icon "${iconName}"`);
      
    } catch (error) {
      console.error(`Qingwa Timelines: Failed to add button with icon "${iconName}":`, error);
    }
  });
  
  // Original button (kept for compatibility)
  api.addComposerToolbarPopupMenuOption({
    action: "insertTimelines",
    icon: "stream",
    label: "js.timelines.composer_toolbar.insert_button",
    translatedLabel: I18n.t("js.timelines.composer_toolbar.insert_button", {
      defaultValue: "Insert Timeline"
    })
  });
  
  // Additional debugging: Check Font Awesome availability
  setTimeout(() => {
    console.log("Qingwa Timelines: Checking Font Awesome availability...");
    
    // Check if Font Awesome is loaded
    if (typeof FontAwesome !== 'undefined') {
      console.log("Qingwa Timelines: FontAwesome object found:", FontAwesome);
    } else {
      console.warn("Qingwa Timelines: FontAwesome object not found");
    }
    
    // Check for common Font Awesome CSS classes
    const testElement = document.createElement('i');
    testElement.className = 'fa fa-stream';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const hasFontAwesome = computedStyle.fontFamily.includes('Font Awesome');
    
    console.log("Qingwa Timelines: Font Awesome CSS test result:", hasFontAwesome);
    document.body.removeChild(testElement);
    
    // Check existing toolbar buttons for comparison
    const toolbarButtons = document.querySelectorAll('.composer-popup-menu-options .btn');
    console.log("Qingwa Timelines: Found toolbar buttons:", toolbarButtons.length);
    
    toolbarButtons.forEach((button, i) => {
      const icon = button.querySelector('.d-icon');
      if (icon) {
        console.log(`Qingwa Timelines: Button ${i} icon classes:`, icon.className);
      }
    });
    
  }, 2000);

  // Register the insert action
  api.modifyClass("controller:composer", {
    pluginId: "discourse-qingwa-timelines",
    
    actions: {
      insertTimelines() {
        console.log("Qingwa Timelines: insertTimelines action called");
        this._insertTimelineContent();
      },
      
      // Debug actions for testing different icons
      insertTimelines1() {
        console.log("Qingwa Timelines: insertTimelines1 (clock) action called");
        this._insertTimelineContent();
      },
      
      insertTimelines2() {
        console.log("Qingwa Timelines: insertTimelines2 (calendar-alt) action called");
        this._insertTimelineContent();
      },
      
      insertTimelines3() {
        console.log("Qingwa Timelines: insertTimelines3 (list) action called");
        this._insertTimelineContent();
      },
      
      insertTimelines4() {
        console.log("Qingwa Timelines: insertTimelines4 (chevron-right) action called");
        this._insertTimelineContent();
      },
      
      insertTimelines5() {
        console.log("Qingwa Timelines: insertTimelines5 (plus) action called");
        this._insertTimelineContent();
      },
      
      // Helper method to insert timeline content
      _insertTimelineContent() {
        const selected = this.get("model.reply").substring(
          this.get("model.replySelection.start"),
          this.get("model.replySelection.end")
        );
        
        const text = selected || "## 标题\n内容...";
        const insertion = `[timelines]\n${text}\n[/timelines]`;
        
        this.get("model").appendText(insertion, null, {
          new_line: true
        });
      }
    }
  });
}

function processTimelinesInElement(element) {
  // Get the HTML content
  let html = element.innerHTML;
  
  // Check if already processed (idempotency check)
  if (html.includes('class="qingwa-timelines"')) {
    return;
  }
  
  // Process the HTML to replace [timelines] blocks
  // This regex handles multiline content between the tags
  const timelinesRegex = /\[timelines\]([\s\S]*?)\[\/timelines\]/g;
  
  // Replace all occurrences
  html = html.replace(timelinesRegex, function(match, content) {
    // Skip if this is inside a code or pre block
    // We'll check this by looking at the context in the HTML
    return '<div class="qingwa-timelines">' + content.trim() + '</div>';
  });
  
  // Only update if changes were made
  if (html !== element.innerHTML) {
    // Create a temporary element to parse the new HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Check and remove any timelines blocks inside code/pre/blockquote elements
    const forbiddenContainers = temp.querySelectorAll('code .qingwa-timelines, pre .qingwa-timelines, blockquote .qingwa-timelines');
    forbiddenContainers.forEach(container => {
      // Revert back to BBCode text
      const originalText = '[timelines]' + container.innerHTML + '[/timelines]';
      const textNode = document.createTextNode(originalText);
      container.parentNode.replaceChild(textNode, container);
    });
    
    // Apply the cleaned HTML
    element.innerHTML = temp.innerHTML;
  }
}

export default {
  name: "qingwa-timelines",
  
  initialize() {
    withPluginApi("0.8.31", initializeTimelines);
  }
};

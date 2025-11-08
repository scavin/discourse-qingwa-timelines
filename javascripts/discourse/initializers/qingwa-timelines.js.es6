import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

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

  // DEBUG: Log translation key information
  const translationKey = themePrefix("composer_toolbar.insert_button");
  const translatedValue = I18n.t(translationKey);
  console.log("=== Timeline Button Translation Debug ===");
  console.log("themePrefix() returned:", translationKey);
  console.log("I18n.t() returned:", translatedValue);
  console.log("Current locale:", I18n.locale);
  console.log("=========================================");

  // Add composer toolbar button - trying multiple approaches
  // Attempt 1: Direct themePrefix
  api.addComposerToolbarPopupMenuOption({
    action: "insertTimelines",
    icon: "clock",
    label: translationKey
  });

  // Register the insert action
  api.modifyClass("controller:composer", {
    pluginId: "discourse-qingwa-timelines",
    
    actions: {
      insertTimelines() {
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

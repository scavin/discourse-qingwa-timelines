import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

function initializeTimelines(api) {
  // Decorate cooked content to process [timelines] BBCode
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

  // Add composer toolbar button with translated label
  // themePrefix() generates theme-namespaced translation key
  // e.g., "theme_translations.137.composer_toolbar.insert_button"
  api.addComposerToolbarPopupMenuOption({
    action: "insertTimelines",
    icon: "clock",
    label: themePrefix("composer_toolbar.insert_button")
  });

  // Register the insert action for the toolbar button
  api.modifyClass("controller:composer", {
    pluginId: "discourse-qingwa-timelines",

    actions: {
      insertTimelines() {
        const selected = this.get("model.reply").substring(
          this.get("model.replySelection.start"),
          this.get("model.replySelection.end")
        );

        // Get localized default template
        const defaultTemplate = I18n.t(
          themePrefix("composer_toolbar.default_template")
        );
        const text = selected || defaultTemplate;
        const insertion = `[timelines]\n${text}\n[/timelines]`;

        this.get("model").appendText(insertion, null, {
          new_line: true
        });
      }
    }
  });
}

function processTimelinesInElement(element) {
  try {
    // Null/undefined check
    if (!element || !element.innerHTML) {
      return;
    }

    let html = element.innerHTML;

    // Content size limit (1MB) to prevent performance issues
    if (html.length > 1000000) {
      console.warn('[qingwa-timelines] Content too large, skipping processing');
      return;
    }

    // Check if already processed (idempotency)
    if (html.includes('class="qingwa-timelines"')) {
      return;
    }

    // Process [timelines]...[/timelines] blocks
    const timelinesRegex = /\[timelines\]([\s\S]*?)\[\/timelines\]/g;
    html = html.replace(timelinesRegex, (match, content) => {
      return '<div class="qingwa-timelines">' + content.trim() + '</div>';
    });

    // Only update if changes were made
    if (html !== element.innerHTML) {
      const temp = document.createElement('div');
      temp.innerHTML = html;

      // Remove timelines blocks inside code/pre/blockquote elements
      const forbiddenContainers = temp.querySelectorAll('code .qingwa-timelines, pre .qingwa-timelines, blockquote .qingwa-timelines');
      forbiddenContainers.forEach(container => {
        const originalText = '[timelines]' + container.innerHTML + '[/timelines]';
        const textNode = document.createTextNode(originalText);
        container.parentNode.replaceChild(textNode, container);
      });

      // Convert image links to actual images
      const imageLinks = temp.querySelectorAll('.qingwa-timelines a');
      imageLinks.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();

        // Only convert if:
        // 1. href uses http/https protocol (security)
        // 2. href points to an image (by extension, SVG removed for security)
        // 3. link text equals URL (pure URL paste, not custom text)
        // Supported formats: png, jpg, jpeg, gif, webp, bmp, avif
        if (href &&
            text === href &&
            /^https?:\/\//i.test(href) &&
            /\.(png|jpe?g|gif|webp|bmp|avif)(\?.*)?$/i.test(href)) {
          const img = document.createElement('img');
          img.src = href;
          img.alt = '';
          img.loading = 'lazy';  // Native lazy loading
          link.parentNode.replaceChild(img, link);
        }
      });

      element.innerHTML = temp.innerHTML;
    }
  } catch (error) {
    // Error handling - log but don't break other functionality
    console.error('[qingwa-timelines] Error processing timelines:', error);
  }
}

export default {
  name: "qingwa-timelines",

  initialize() {
    withPluginApi("0.8.31", initializeTimelines);
  }
};

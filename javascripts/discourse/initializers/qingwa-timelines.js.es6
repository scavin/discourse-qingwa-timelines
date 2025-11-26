import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

function initializeTimelines(api) {
  const composerApi = api.composer || api;

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

  // Add composer toolbar button using composer API (new RTE compatible)
  composerApi.addComposerToolbarPopupMenuOption({
    id: "insert-timelines",
    icon: "clock",
    label: themePrefix("composer_toolbar.insert_button"),
    perform(toolbarEvent) {
      insertTimelinesFromToolbar(toolbarEvent);
    }
  });

  // New editor: register action if available; fallback remains for older environments
  if (typeof composerApi.addComposerAction === "function") {
    composerApi.addComposerAction("insert-timelines", insertTimelinesFromToolbar);
  } else {
    ensureComposerAction(composerApi);
  }
}

function ensureComposerAction(api) {
  try {
    const controller =
      (api?.container && api.container.lookup?.("controller:composer")) || null;

    if (controller && typeof controller.insertTimelines !== "function") {
      controller.insertTimelines = function(toolbarEvent) {
        insertTimelinesFromToolbar(toolbarEvent);
      };
    }
  } catch (e) {
    // Silence lookup errors; toolbar perform handler will still work where available
  }
}

function insertTimelinesFromToolbar(toolbarEvent) {
  const defaultTemplate = I18n.t(
    themePrefix("composer_toolbar.default_template")
  );
  const openingTag = "[timelines]\n";
  const closingTag = "\n[/timelines]\n";

  const model =
    toolbarEvent?.model ||
    toolbarEvent?.composer?.model ||
    toolbarEvent?.controller?.model ||
    toolbarEvent?.composer ||
    toolbarEvent?.controller ||
    this;

  appendTimelinesViaComposer(
    model,
    openingTag,
    closingTag,
    defaultTemplate
  );
}

function appendTimelinesViaComposer(
  composerController,
  openingTag,
  closingTag,
  defaultTemplate
) {
  if (!composerController) {
    return;
  }

  const model =
    composerController.model ||
    (typeof composerController.get === "function" &&
      composerController.get("model")) ||
    (typeof composerController.appendText === "function" && composerController);

  if (!model || typeof model.appendText !== "function") {
    return;
  }

  const reply = model.reply || "";
  const selection = model.replySelection;
  let selectedText = "";

  if (
    selection &&
    typeof selection.start === "number" &&
    typeof selection.end === "number"
  ) {
    selectedText = reply.substring(selection.start, selection.end);
  }

  const content = selectedText || defaultTemplate;
  const insertion = `${openingTag}${content}${closingTag}`;

  if (typeof model.applySurround === "function") {
    model.applySurround(openingTag, closingTag, defaultTemplate);
  } else {
    model.appendText(insertion, null, {
      new_line: true
    });
  }
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

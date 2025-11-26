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

  // Add composer toolbar button using the same pattern as DiscoTOC (action as function)
  composerApi.addComposerToolbarPopupMenuOption({
    id: "insert-timelines",
    icon: "clock",
    label: themePrefix("composer_toolbar.insert_button"),
    action(toolbarEvent) {
      insertTimelinesFromToolbar(toolbarEvent);
    }
  });
}

function insertTimelinesFromToolbar(toolbarEvent) {
  const defaultTemplate = getDefaultTimelineTemplate();
  const openingTag = "[timelines]\n";
  const closingTag = "\n[/timelines]\n";

  if (toolbarEvent && typeof toolbarEvent.applySurround === "function") {
    toolbarEvent.applySurround(openingTag, closingTag, defaultTemplate);
    return;
  }

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

function getDefaultTimelineTemplate() {
  const translation = I18n.t(themePrefix("composer_toolbar.default_template"));
  const trimmed = typeof translation === "string" ? translation.trim() : "";
  const looksMissing =
    trimmed.startsWith("[") && trimmed.endsWith("]") && trimmed.includes(".");

  if (looksMissing || !trimmed) {
    // Neutral fallback across locales to avoid showing raw translation keys
    return "## Heading 1\nContent...\n## Heading 2\nContent...";
  }

  return translation;
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

  // Try modern APIs first, then fall back to legacy appendText/setValue
  if (typeof model.applySurround === "function") {
    model.applySurround(openingTag, closingTag, defaultTemplate);
    return;
  }

  if (typeof model.appendText === "function") {
    model.appendText(insertion, null, { new_line: true });
    return;
  }

  if (typeof model.insertText === "function") {
    model.insertText(insertion);
    return;
  }

  if (typeof model.setValue === "function") {
    const current =
      typeof model.getValue === "function"
        ? model.getValue()
        : model.value || "";
    model.setValue(`${current}${insertion}`);
    return;
  }

  // Last resort: mutate known reply/value properties
  if ("reply" in model) {
    model.reply = `${model.reply || ""}${insertion}`;
  } else if ("value" in model) {
    model.value = `${model.value || ""}${insertion}`;
  } else {
    console.warn(
      "[qingwa-timelines] Unable to insert timelines: no supported composer methods found"
    );
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

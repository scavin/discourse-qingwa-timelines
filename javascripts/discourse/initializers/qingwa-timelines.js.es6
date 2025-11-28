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
  const placeholderKey = ensurePlaceholderTranslation(defaultTemplate);
  const openingTag = "[timelines]\n";
  const closingTag = "\n[/timelines]\n";
  const model =
    toolbarEvent?.model ||
    toolbarEvent?.composer?.model ||
    toolbarEvent?.controller?.model ||
    toolbarEvent?.composer ||
    toolbarEvent?.controller ||
    this;

  // Rich text composer: skip applySurround and insert full block directly
  const isRichText = model && (model.rteEnabled || model.richTextEnabled);
  if (isRichText) {
    appendTimelinesViaComposer(
      model,
      openingTag,
      closingTag,
      defaultTemplate,
      /* skipApplySurround */ true
    );
    return;
  }

  if (toolbarEvent && typeof toolbarEvent.applySurround === "function") {
    toolbarEvent.applySurround(openingTag, closingTag, placeholderKey);
    return;
  }

  appendTimelinesViaComposer(
    model,
    openingTag,
    closingTag,
    defaultTemplate,
    /* skipApplySurround */ false
  );
}

function getDefaultTimelineTemplate() {
  const fallback = "## One\nContent...\n## Two\nContent...";

  try {
    const translation = I18n.t(themePrefix("composer_toolbar.default_template"));
    const trimmed = typeof translation === "string" ? translation.trim() : "";
    if (!trimmed) {
      return fallback;
    }
    const looksMissing =
      /^\[.*\]$/s.test(trimmed) ||
      /translation missing/i.test(trimmed) ||
      trimmed.includes("composer_toolbar.default_template");
    return looksMissing ? fallback : translation;
  } catch (e) {
    return fallback;
  }
}

function ensurePlaceholderTranslation(defaultTemplate) {
  const locale =
    (typeof I18n.currentLocale === "function" && I18n.currentLocale()) ||
    I18n.locale ||
    "en";

  I18n.translations[locale] = I18n.translations[locale] || {};
  I18n.translations[locale].js = I18n.translations[locale].js || {};
  I18n.translations[locale].js.composer =
    I18n.translations[locale].js.composer || {};

  const key = "timelines_default_template";
  I18n.translations[locale].js.composer[key] = defaultTemplate;
  // applySurround expects a composer.* key (without duplicating the namespace)
  return key;
}

function appendTimelinesViaComposer(
  composerController,
  openingTag,
  closingTag,
  defaultTemplate,
  skipApplySurround = false
) {
  if (!composerController) {
    return;
  }

  const model =
    composerController.model ||
    (typeof composerController.get === "function" &&
      composerController.get("model")) ||
    composerController;

  const hasAnyInsertMethod =
    (model && typeof model.appendText === "function") ||
    typeof model.insertText === "function" ||
    typeof model.setValue === "function" ||
    typeof model.applySurround === "function" ||
    "reply" in model ||
    "value" in model;

  if (!model || !hasAnyInsertMethod) {
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
  if (!skipApplySurround && typeof model.applySurround === "function") {
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

      // Convert custom pseudo-headings inside timelines:
      // Lines starting with "##!" -> styled as H2, "###!" -> styled as H3
      const timelineContainers = temp.querySelectorAll('.qingwa-timelines');
      timelineContainers.forEach(container => {
        const nodes = Array.from(container.childNodes);
        nodes.forEach(node => {
          // Only handle element or text nodes
          const rawText =
            node.nodeType === Node.TEXT_NODE
              ? node.textContent
              : node.nodeType === Node.ELEMENT_NODE
                ? node.textContent
                : "";

          if (!rawText) {
            return;
          }

          const match = rawText.trim().match(/^(#{2,3})!\s*(.*)$/);
          if (!match) {
            return;
          }

          const level = match[1].length;
          const headingText = match[2] || "";
          const replacement = document.createElement('div');
          replacement.className = `qingwa-timeline-heading h${level}`;
          replacement.textContent = headingText;

          if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
            node.parentNode.replaceChild(replacement, node);
          } else if (node.nodeType === Node.ELEMENT_NODE && node.parentNode) {
            node.parentNode.replaceChild(replacement, node);
          }
        });
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

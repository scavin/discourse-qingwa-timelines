import I18n from "I18n";
import { withPluginApi } from "discourse/lib/plugin-api";
import { themeSettings } from "discourse/lib/theme-settings";

const DEFAULT_BUTTON_LABEL = "Insert Timeline";

function resolveToolbarButtonLabel(container) {
  console.log("=== Qingwa Timelines Debug ===");

  let resolvedLabel;

  if (themeSettings && typeof themeSettings === "object") {
    const themeTimelineKeys = Object.keys(themeSettings).filter(key =>
      key.includes("timeline")
    );
    console.log(
      "Theme settings keys containing 'timeline':",
      themeTimelineKeys
    );
    console.log(
      "toolbar_button_label from theme settings:",
      themeSettings.toolbar_button_label
    );

    if (themeSettings.toolbar_button_label) {
      resolvedLabel = themeSettings.toolbar_button_label;
    }
  } else {
    console.warn("themeSettings module is not available");
  }

  let siteSettings;

  try {
    siteSettings = container.lookup?.("site-settings:main");
  } catch (error) {
    console.error("Failed to lookup site settings:", error);
  }

  console.log("Site settings lookup success:", !!siteSettings);

  if (siteSettings) {
    let siteTimelineKeys = [];

    try {
      siteTimelineKeys = Object.keys(siteSettings).filter(key =>
        key.includes("timeline")
      );
    } catch (error) {
      console.warn("Unable to enumerate site settings keys:", error);
    }

    console.log(
      "Site settings keys containing 'timeline':",
      siteTimelineKeys
    );
    console.log(
      "toolbar_button_label from site settings:",
      siteSettings.toolbar_button_label
    );

    if (!resolvedLabel && siteSettings.toolbar_button_label) {
      resolvedLabel = siteSettings.toolbar_button_label;
    }
  }

  if (typeof resolvedLabel !== "string") {
    resolvedLabel = resolvedLabel ? String(resolvedLabel) : "";
  }

  if (!resolvedLabel.trim()) {
    resolvedLabel = DEFAULT_BUTTON_LABEL;
  }

  const finalLabel = I18n.t(resolvedLabel, { defaultValue: resolvedLabel });

  console.log("Final composer toolbar button label:", finalLabel);

  return finalLabel;
}

function initializeTimelines(api, container) {
  api.decorateCooked(
    $elem => {
      if ($elem.hasClass("qingwa-timelines-processed")) {
        return;
      }

      const textContent = $elem[0].textContent || "";
      if (!textContent.includes("[timelines]")) {
        return;
      }

      processTimelinesInElement($elem[0]);
      $elem.addClass("qingwa-timelines-processed");
    },
    { id: "qingwa-timelines" }
  );

  const buttonLabel = resolveToolbarButtonLabel(container);

  api.addComposerToolbarPopupMenuOption({
    action: "insertTimelines",
    icon: "stream",
    label: buttonLabel
  });

  api.modifyClass("controller:composer", {
    pluginId: "discourse-qingwa-timelines",

    actions: {
      insertTimelines() {
        const selected = this.get("model.reply").substring(
          this.get("model.replySelection.start"),
          this.get("model.replySelection.end")
        );

        const defaultTemplate = `## 2024年1月 - 项目启动
项目正式立项，组建团队...

## 2024年3月 - 第一版发布
完成核心功能开发...`;

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
  let html = element.innerHTML;

  if (html.includes('class="qingwa-timelines"')) {
    return;
  }

  const timelinesRegex = /\[timelines\]([\s\S]*?)\[\/timelines\]/g;

  html = html.replace(timelinesRegex, function (match, content) {
    return '<div class="qingwa-timelines">' + content.trim() + "</div>";
  });

  if (html !== element.innerHTML) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const forbiddenContainers = temp.querySelectorAll(
      "code .qingwa-timelines, pre .qingwa-timelines, blockquote .qingwa-timelines"
    );
    forbiddenContainers.forEach(container => {
      const originalText = "[timelines]" + container.innerHTML + "[/timelines]";
      const textNode = document.createTextNode(originalText);
      container.parentNode.replaceChild(textNode, container);
    });

    element.innerHTML = temp.innerHTML;
  }
}

export default {
  name: "qingwa-timelines",

  initialize(container) {
    withPluginApi("0.8.31", api => initializeTimelines(api, container));
  }
};

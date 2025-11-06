import { withPluginApi } from "discourse/lib/plugin-api";

function initializeTimelines(api) {
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

  api.addComposerToolbarPopupMenuOption({
    action: "insertTimelines",
    icon: "stream",
    label: "Insert Timeline"
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

  initialize() {
    withPluginApi("0.8.31", api => initializeTimelines(api));
  }
};

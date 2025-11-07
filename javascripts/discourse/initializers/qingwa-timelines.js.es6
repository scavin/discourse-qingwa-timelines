import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

export default {
  name: "qingwa-timelines",
  
  initialize() {
    withPluginApi("0.8.31", api => {
      // Render timelines
      api.decorateCooked(($elem) => {
        // Find all elements containing timeline BBCode
        const timelineBlocks = $elem.find("*").filter(function() {
          const text = $(this).text();
          return text.includes("[timelines]") && text.includes("[/timelines]");
        });
        
        timelineBlocks.each(function() {
          const $block = $(this);
          const text = $block.text();
          const match = text.match(/\[timelines\]([\s\S]*?)\[\/timelines\]/);
          
          if (match) {
            const content = match[1];
            const $timeline = $('<div class="qingwa-timelines"></div>');
            
            const lines = content.split('\n').filter(line => line.trim());
            let html = '';
            lines.forEach(line => {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith('## ')) {
                html += `<h2>${trimmedLine.substring(3).trim()}</h2>`;
              } else if (trimmedLine) {
                html += `<p>${trimmedLine}</p>`;
              }
            });
            
            $timeline.html(html);
            $block.replaceWith($timeline);
          }
        });
      });
      
      // Toolbar button - use translation with defaultValue
      api.addComposerToolbarPopupMenuOption({
        action: "insertTimelines",
        icon: "stream",
        label: I18n.t("timelines.composer_toolbar.insert_button", { defaultValue: "Insert Timeline" })
      });
      
      // Button action
      api.modifyClass("controller:composer", {
        pluginId: "discourse-qingwa-timelines",
        
        actions: {
          insertTimelines() {
            const model = this.get("model");
            const selected = model.get("reply").substring(
              model.get("replySelection.start"),
              model.get("replySelection.end")
            );
            
            const defaultTemplate = `## 2024年1月 - 项目启动
项目正式立项，组建团队...

## 2024年3月 - 第一版发布
完成核心功能开发...`;
            
            const content = selected || defaultTemplate;
            const insertion = `[timelines]\n${content}\n[/timelines]`;
            
            model.appendText(insertion, null, { new_line: true });
          }
        }
      });
    });
  }
};
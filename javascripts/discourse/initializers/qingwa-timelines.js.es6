import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

export default {
  name: "qingwa-timelines",
  
  initialize() {
    withPluginApi("0.8.31", api => {
      // Helper function to render timeline from content
      function renderTimeline(content) {
        const $timeline = $('<div class="qingwa-timelines"></div>');
        
        const lines = content.split('\n').filter(line => line.trim());
        let timelineHtml = '';
        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('## ')) {
            timelineHtml += `<h2>${trimmedLine.substring(3).trim()}</h2>`;
          } else if (trimmedLine) {
            timelineHtml += `<p>${trimmedLine}</p>`;
          }
        });
        
        $timeline.html(timelineHtml);
        return $timeline;
      }

      // Helper to process timeline in text
      function processTimeline(text) {
        if (!text || typeof text !== 'string') return text;
        
        const match = text.match(/\[timelines\]([\s\S]*?)\[\/timelines\]/);
        if (!match) return text;
        
        const content = match[1];
        const $timeline = renderTimeline(content);
        return text.replace(/\[timelines\][\s\S]*?\[\/timelines\]/, $timeline[0].outerHTML);
      }

      // Render timelines - using decorateCooked
      api.decorateCooked(($elem) => {
        if (!$elem || !$elem[0]) {
          return;
        }
        
        // Get the HTML content
        let html = $elem.html();
        if (!html) {
          return;
        }
        
        // Convert text nodes and HTML to plain text for searching
        // This handles cases where newlines are converted to <br> tags
        const textContent = $elem.text();
        
        // Check if timeline BBCode exists in the text content
        if (!textContent.includes('[timelines]')) {
          return;
        }
        
        // Try to extract BBCode from text content (handles <br> tags in content)
        const textMatch = textContent.match(/\[timelines\]([\s\S]*?)\[\/timelines\]/);
        if (!textMatch) {
          return;
        }
        
        const content = textMatch[1];
        const $timeline = renderTimeline(content);
        
        // Replace in HTML by finding the [timelines] opening tag and [/timelines] closing tag
        // Handle case where they might be separated by HTML tags like <br>
        const htmlWithoutBr = html.replace(/<br\s*\/?>/gi, '\n');
        
        // Try direct replacement first
        let newHtml = htmlWithoutBr.replace(/\[timelines\]([\s\S]*?)\[\/timelines\]/,
          $('<div>').append($timeline.clone()).html());
        
        if (newHtml !== htmlWithoutBr) {
          $elem.html(newHtml);
          return;
        }
        
        // Fallback: Search for [timelines] and [/timelines] separately
        const openIndex = html.indexOf('[timelines]');
        const closeIndex = html.indexOf('[/timelines]');
        
        if (openIndex !== -1 && closeIndex !== -1 && closeIndex > openIndex) {
          const beforeOpen = html.substring(0, openIndex);
          const afterClose = html.substring(closeIndex + '[/timelines]'.length);
          const contentBetween = html.substring(openIndex + '[timelines]'.length, closeIndex);
          
          // Clean up the content between tags
          const cleanContent = contentBetween
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]*>/g, '')
            .trim();
          
          const cleanedTimeline = renderTimeline(cleanContent);
          const replacement = $('<div>').append(cleanedTimeline.clone()).html();
          
          const finalHtml = beforeOpen + replacement + afterClose;
          $elem.html(finalHtml);
        }
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
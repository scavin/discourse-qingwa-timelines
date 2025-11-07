# Timeline Rendering Regression Analysis

## Summary of Findings
- **Regression introduced** when the timeline rendering logic was rewritten to operate on individual DOM nodes (commit `0ccf2d768a6523275cc902a3f59cad533673cd91`, merged via `0abb254e5fbd41a53fd75dc1ffab807aeeaef6ef`).
- **Post-stream compatibility update** in commit `f4fc65e4253cab5e388a94ead4896ed8871bade0` did not fix the root issue; timelines still fail to render because the parser still requires the opening and closing BBCode tags to live inside the same element.
- **CSS changes** (conversion to CSS custom properties) and translation updates are not responsible for the regression—they only affect presentation and labeling once a timeline block exists.

## Historical Context
1. **Working implementation (`a28bcb894a85cdc3958709b519e07b1262e7dae8` and earlier)**
   - Used `processTimelinesInElement` to run a global regex replacement over the cooked HTML string:
     ```js
     const timelinesRegex = /\[timelines\]([\s\S]*?)\[\/timelines\]/g;
     html = html.replace(timelinesRegex, (match, content) =>
       '<div class="qingwa-timelines">' + content.trim() + '</div>'
     );
     ```
   - Because it worked on the full HTML string, it did **not** depend on how Discourse split the BBCode across paragraph tags; it handled multiple elements inside the block safely.

2. **Rewrite to paragraph scanning (`0ccf2d768a6523275cc902a3f59cad533673cd91`)**
   - Replaced the string-level processor with per-element scanning:
     ```js
     const timelineBlocks = $elem.find("p").filter(function() {
       return $(this).text().includes("[timelines]");
     });
     ```
   - Parsing then relied on `$(this).text()` to contain **both** `[timelines]` and `[/timelines]`. This only works when the entire BBCode block survives inside a single `<p>` after cooking. It silently fails whenever Discourse splits the opening/closing tags into separate sibling nodes.

3. **Post-stream compatibility attempt (`f4fc65e4253cab5e388a94ead4896ed8871bade0`)**
   - Broadened the selector to `find("*")` and explicitly required both tags:
     ```js
     const text = $(this).text();
     return text.includes("[timelines]") && text.includes("[/timelines]");
     ```
   - Although this was meant to handle the new post-stream markup, the fundamental assumption remained: a single node must carry both tags. In the latest Discourse builds the cooked markup is split across multiple elements, so **no node satisfies this condition** and the replacement never runs. The raw `[timelines]` BBCode is left in the post.

## Root Cause
The regression stems from the **move away from global string replacement to per-node parsing**. Once Discourse's new post-stream renderer started splitting the timeline BBCode into multiple DOM nodes, the per-node approach could no longer locate a complete `[timelines]...[/timelines]` block, causing the renderer to skip conversion entirely.

## Recommended Fix
- Restore a structure-agnostic parser—either revert to the earlier `processTimelinesInElement` implementation or implement a collector that walks siblings until it assembles the full block before parsing.
- Keep the useful improvements from later commits (translation default values, CSS variable fallbacks, removal of the `helper.widget` guard) while re-introducing a robust block parser.

By re-establishing a DOM-structure-independent extractor, timelines will render correctly regardless of how the post-stream component chunks the cooked HTML.

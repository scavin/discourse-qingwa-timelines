# Discourse Timelines - Custom BBCode for Beautiful Timeline Layouts

I'm excited to share a new theme component that adds elegant timeline layouts to your Discourse community!

This is my first theme component, built with the assistance of LLM.

## What is it?

**Discourse Timelines** is a theme component that implements custom BBCode `[timelines]...[/timelines]` for creating beautiful, minimalist timeline layouts. Perfect for project roadmaps, step-by-step guides, company histories, chapter divisions, and more.

## Screenshots

### Published Timeline Effect
![Published timeline display](Screenshots/qingwa-timelines-1.jpg)

### Composer Toolbar Button
![Composer toolbar button](Screenshots/qingwa-timelines-button.jpg)

### Markdown Editor View
![Markdown editor view](Screenshots/qingwa-timelines-editor.jpg)

## Key Features

:white_check_mark: **Custom BBCode** - Simple `[timelines]` syntax
:white_check_mark: **Composer Toolbar Button** - No need to type tags manually (solves the new editor bracket escaping issue!)
:white_check_mark: **Beautiful Design** - Vertical gradient line with clean, minimalist aesthetic
:white_check_mark: **Markdown Support** - Preserves all formatting inside timelines
:white_check_mark: **Multilingual** - Built-in translations for 9 languages (EN, ZH_CN, ZH_TW, DE, ES, FR, JA, KO, RU)
:white_check_mark: **Theme Compatible** - Works with both light and dark modes
:white_check_mark: **Customizable** - Easily change colors via admin settings
:white_check_mark: **Responsive** - Mobile-friendly layout
:white_check_mark: **Safe** - XSS protection built-in
:white_check_mark: **No Dependencies** - Uses only Discourse native APIs

## Installation

### Via Git Repository (Recommended)

1. Go to **Admin** → **Customize** → **Themes** → **Install**
2. Click **"From a git repository"**
3. Enter: `https://github.com/scavin/discourse-qingwa-timelines`
4. Click **Install**
5. Enable the component on your active theme

:link: **Repository**: https://github.com/scavin/discourse-qingwa-timelines

## Usage

### Using the Toolbar Button (Easiest!)

1. Open the composer
2. Click the **"⋮" (More)** menu button
3. Select **"Insert Timeline"**
4. Edit your content
5. Publish!

The toolbar button solves the issue where the new Discourse editor auto-escapes manually typed square brackets.

### Example Syntax

```
[timelines]
## January 2024 - Project Launch
The project was officially initiated, and the team was formed.

## March 2024 - First Release
Core functionality development completed and beta testing began.

## June 2024 - Version 2.0
Major update with new features:
- Feature A
- Feature B
- Feature C
[/timelines]
```

## Customization

All colors can be customized via theme settings:

- **timeline_gradient_start** - Top gradient color (default: `#ff7a18`)
- **timeline_gradient_end** - Bottom gradient color (default: `#ffb800`)
- **timeline_heading_color** - Heading text color (default: `#d96d14`)
- **timeline_dot_color** - Timeline dot color (default: `#ff7a18`)
- **timeline_heading_color_dark** - Dark mode heading color (default: `#ff9854`)
- **timeline_dot_border_color_dark** - Dark mode dot border (optional)

### Example Color Schemes

**Blue Theme**: `#1e90ff` → `#00bfff`
**Green Theme**: `#2ecc71` → `#27ae60`
**Purple Theme**: `#9b59b6` → `#8e44ad`
**Red/Pink Theme**: `#e74c3c` → `#c0392b`

## Use Cases

This component is versatile and works great for:

- :calendar: **Project timelines** and roadmaps
- :book: **Step-by-step guides** and tutorials
- :office: **Company history** and milestones
- :newspaper: **Blog post chapters** and long-form content
- :mortar_board: **Course curricula** and lesson plans
- :rocket: **Product release** notes and changelogs

## Technical Details

- **Minimum Discourse Version**: 2.8.0
- **Current Version**: 0.3.0
- **License**: MIT
- Uses `decorateCooked` API for parsing
- Idempotent parser (safe for re-renders)
- Skips code blocks, pre blocks, and blockquotes
- Supports multiple timeline blocks per post

### Multilingual Support

The component includes complete translations for:
- English (en)
- Simplified Chinese (zh_CN)
- Traditional Chinese (zh_TW)
- German (de)
- Spanish (es)
- French (fr)
- Japanese (ja)
- Korean (ko)
- Russian (ru)

Community contributions for additional languages are welcome!

## Changelog

**v0.3.0** (Latest - Composer Toolbar Button)
- Added composer toolbar button for easy insertion
- Solves new editor bracket escaping issues
- Supports wrapping selected text
- Added 9 language translations
- Button appears in "More" menu with clock icon

**v0.2.0** (Customizable Colors)
- Configurable color settings via admin panel
- Six customizable color options
- Separate dark mode colors
- Example color schemes

**v0.1.0** (Initial Release)
- Custom BBCode implementation
- Gradient line design
- Markdown preservation
- Light/dark mode support
- XSS protection

## Contributing

Contributions are welcome! Feel free to:
- :bug: Report bugs or issues
- :bulb: Suggest new features
- :globe_with_meridians: Add translations for more languages
- :art: Share your custom color schemes

**GitHub Repository**: https://github.com/scavin/discourse-qingwa-timelines
**Issues**: https://github.com/scavin/discourse-qingwa-timelines/issues

## Credits

Developed with :heart: using Discourse's powerful theme component system.

Special thanks to the Discourse team for creating such an extensible platform!

---

**Installation Link**: `https://github.com/scavin/discourse-qingwa-timelines`

I hope you find this component useful! Please let me know if you have any questions, feedback, or suggestions. :blush:

#theme-component #timelines #bbcode #customization

# 浅色色系样式规范：Architectural Light

> 源自 Stitch 设计系统 "Architectural Light"（`stitch/05-design-system-architectural-light/`）。
> 本文件是浅色色系的唯一样式事实来源；配套完整 token 见 `docs/design-tokens-light.json`。
> 新增/修改样式、模板、组件前必须先读本文件；新增组件须同时给出双主题表现（深色规范见 `docs/style-guide-dark.md`）。

## Brand & Style

This design system expresses the discipline, analytical rigor, and clarity of modern cloud architecture and AI systems. It merges the deliberate pacing of an intellectual editorial journal with the engineering precision of high-performance developer tooling.

The aesthetic philosophy centers on:
- **Restrained Modernism:** Intentional white space, crisp structural lines, and absence of visual clutter.
- **Micro-Atmospherics:** Translucent frosted surfaces, fine 1px hairline dividers, and precision glow indicators that signal vitality without cognitive noise.
- **Intellectual Directness:** High-contrast slate typography that values long-form readability, technical diagrams, and computational literacy.

## Layout & Spacing

The spatial architecture balances centered long-form reading chambers with expansive technical canvases for architecture diagrams and multidimensional garden graphs.

### Spatial Rhythm
- **The Core Garden Track:** Deep reading pages utilize `container-prose` (45rem / 720px) centered to eliminate scanning fatigue.
- **Split Architectural Canvas:** Interactive multi-pane views (e.g., interactive system designs, reference tables) scale up to `container-wide` (72rem / 1152px).
- **8pt Base Grid:** All margins, paddings, and component bounds align strictly to multiples of 4px and 8px to enforce modular engineering consistency.

### Breakpoints
- **Mobile (< 768px):** Single-column stack, edge margins of `gutter-mobile`, pinned top compact nav, code blocks overflow horizontally with custom minimal scroll rails.
- **Tablet (768px – 1024px):** Single-column layout with expanded `gutter-desktop`, contextual floating table of contents collapsed to bottom sheet.
- **Desktop (> 1024px):** Asymmetric 3-column arrangement: Persistent left identity & garden index (240px), primary reading stream (720px), and dynamic right metadata/TOC rail (220px).

## Elevation & Depth

Visual depth is achieved through optical filtration rather than dark Drop Shadows. Surfaces feel like finely milled architectural acrylic sheets resting upon clean industrial paper.

### Depth Hierarchy
1. **Base Plate (0dp):** Solid `#f8fafc` background. Flat, static, structural.
2. **Surface Layer (1dp):** `#ffffff` with a subtle hairline perimeter (`1px solid #e2e8f0`). Shadow: `0 1px 3px rgba(15, 23, 42, 0.03)`. Used for article cards, list items, and standard panels.
3. **Glass Flight Layer (2dp):** Translucent white (`rgba(255, 255, 255, 0.80)`) with backdrop blur (`backdrop-filter: blur(12px)`), hairline stroke (`rgba(255, 255, 255, 0.9)` top/left, `rgba(226, 232, 240, 0.6)` bottom/right), and an ambient drop shadow (`0 8px 30px -4px rgba(15, 23, 42, 0.05)`). Used for sticky navigation headers, command bars, floating palettes, and garden node cards.
4. **Active Focus Layer (3dp):** Elevated tooltips and modal dialogs. Supported by a dual-stage shadow (`0 20px 40px -8px rgba(15, 23, 42, 0.08)`) and a subtle cerulean glow rim (`box-shadow: 0 0 0 1px rgba(2, 132, 199, 0.25)`).

## Components

### Buttons
- **Primary Action:** Solid deep slate fill (`#0f172a`), crisp white text, `8px` corner radius. On hover: shifts smoothly to `#1e293b` with a subtle elevation shift.
- **Secondary Ghost:** Frosted glass surface (`rgba(255, 255, 255, 0.8)`), subtle 1px border (`#e2e8f0`), `#0f172a` label. Hover activates subtle blue outline (`#0284c7`).
- **Accent Action:** Cerulean cyan fill (`#0284c7`), white text, faint matching glow (`0 0 16px rgba(2, 132, 199, 0.3)` on hover).

### Code Blocks & Architecture Modules
- **Terminal Execution Block:** Deep slate obsidian body (`#090d16`), soft white code typography (`#e2e8f0`), syntax tokens rendered in cerulean, steel, and mint. 
- **Header Strip:** Clean top meta-strip displaying language runtime (`JetBrains Mono`, 12px), active copy glyph, and an optional mock terminal dot matrix.
- **Inline Code:** Recessed slate pill (`#f1f5f9`), 1px border (`#e2e8f0`), `#0369a1` ink tone.

### Digital Garden Taxonomy Chips
- **Status Pills:** Pill-shaped (`rounded-full`), micro typography (`JetBrains Mono`, 11px), 1px border.
  - *Seedling:* Subdued slate dot with `#64748b` text.
  - *Cultivated:* Cerulean dot with pulsing micro-beacon (`#0284c7`).
  - *Evergreen:* Crisp deep teal indicator.

### Article & Thought Stream Cards
- **Card Anatomy:** Pure white frosted surface, 1px perimeter boundary (`#e2e8f0`), 16px corner radius, internal padding of 24px.
- **Hover Micro-interaction:** Subtle vertical lift (-2px), boundary illuminates to `#cbd5e1`, title transitions to `#0284c7`.

### Inputs & Command Palette
- **Omnibox / Search:** Translucent white input panel, inset placeholder in `#94a3b8`, keyboard navigation shortcuts styled with tactile mono badges (`⌘K`). Focus state invokes `2px` focus ring in `#0284c7` with zero offset blur.
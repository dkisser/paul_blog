# 深色色系样式规范：Glacial Synapse

> 源自 Stitch 设计系统 "Glacial Synapse"（`stitch/06-design-system-glacial-synapse/`）。
> 本文件是深色色系的唯一样式事实来源；配套完整 token 见 `docs/design-tokens-dark.json`。
> 新增/修改样式、模板、组件前必须先读本文件；新增组件须同时给出双主题表现（浅色规范见 `docs/style-guide-light.md`）。

## Brand & Style
The design system reflects the intellectual precision of high-performance computing, neural networks, and glacial serenity. Designed specifically for an elite AI software architect’s personal blog and digital garden, the aesthetic merges technical rigor with an ethereal, crystalline atmosphere.

The style fuses **Neural Glassmorphism** with **Minimalist Technical Futurism**:
- **Atmosphere:** Deep abyssal depths illuminated by faint neural luminescence, evocative of sub-zero data centers, silicon, and arctic ice sheets.
- **Audience:** Senior software engineers, AI researchers, systems architects, and engineering leaders seeking deep technical signal without visual noise.
- **Emotional Response:** Clarity, mastery, high cognitive bandwidth, and aesthetic composure.

## Layout & Spacing
The layout leverages a centered 12-column architectural grid with adaptive constrained reading lanes.

- **Content Constraints:**
  - Long-form essays and garden notes are restricted to `container-prose` (768px / 48rem) for optimal line-length and zero reading fatigue.
  - Interactive tools, multi-column dashboard views, code showcases, and index listings expand to `container-wide` (1152px / 72rem).
- **Responsive Adaptations:**
  - **Mobile (< 768px):** Single-column stack, `1rem` screen margin gutters, full-bleed code blocks with horizontal touch scrolling.
  - **Tablet (768px – 1024px):** 6-column structure, `1.5rem` gutters, sticky micro-navigation bar.
  - **Desktop (> 1024px):** 12-column grid with `2rem` gutters, side-pinned metadata tables of contents, and floating action panels.
- **Grid Rhythms:** Vertical margins on sections follow multiples of `2rem` (`space-xl` through `space-4xl`), creating airy, monastic breathing room between dense technical concepts.

## Elevation & Depth
Elevation is achieved purely through translucent neural layering, selective diffusion, and edge light reflection rather than conventional drop shadows.

- **Surface Level 0 (Canvas):** Pure `#0B0F17` base layer with an optional radial gradient background wash centered at top: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56, 189, 248, 0.08), transparent 70%)`.
- **Surface Level 1 (Static Cards & Containers):**
  - Background: `rgba(15, 23, 42, 0.65)`
  - Backdrop Blur: `12px`
  - Border: 1px hairline solid `rgba(51, 65, 85, 0.45)` (Slate 700 tone).
- **Surface Level 2 (Floating Glass, Hover States & Code Blocks):**
  - Background: `rgba(30, 41, 59, 0.60)`
  - Backdrop Blur: `16px`
  - Border: 1px hairline solid `rgba(56, 189, 248, 0.25)` (Cyan glow boundary).
  - Shadow: `0 8px 32px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)`.
- **Surface Level 3 (Sticky Nav & Modals):**
  - Background: `rgba(11, 15, 23, 0.82)`
  - Backdrop Blur: `20px`
  - Border: 1px hairline border bottom `rgba(56, 189, 248, 0.15)`.
  - Ambient Glow: Faint bottom drop shadow `0 4px 20px -2px rgba(14, 165, 233, 0.05)`.

## Components

### Buttons
All buttons strictly employ flexbox centering (`inline-flex items-center justify-center gap-2`), fixed height tokens, and `rounded-lg` geometry.
- **Primary Action:**
  - Height: `2.5rem` (40px) | Horizontal Padding: `1.25rem`.
  - Background: Linear gradient `135deg, #0EA5E9 0%, #6366F1 100%`.
  - Typography: `Inter`, 0.875rem, font-weight 600, color `#FFFFFF`.
  - Hover: Subtle brightness boost (`1.08`) and delicate outer glow `0 0 16px rgba(56, 189, 248, 0.4)`.
- **Secondary (Glass):**
  - Background: `rgba(30, 41, 59, 0.5)`.
  - Border: 1px hairline `rgba(56, 189, 248, 0.2)`.
  - Text: `#F8FAFC`.
  - Hover: Background shifts to `rgba(30, 41, 59, 0.8)`, border to `rgba(56, 189, 248, 0.5)`.

### Code Blocks & Architecture Windows
- **Frame Styling:** Dual-tier container featuring a terminal title header (`h-9`, flex items-center, border-b hairline) housing language badges and copy-to-clipboard trigger.
- **Syntax Aesthetics:** Deep carbon background `rgba(15, 23, 42, 0.95)`, `rounded-lg`, border 1px `rgba(51, 65, 85, 0.6)`. Syntax highlighting leans into ice blues (`#38BDF8`), muted sage (`#34D399`), neon purple (`#C084FC`), and dusk gray (`#64748B`).
- **Line Numbers:** Right-aligned with fixed gutter width, rendered in `#475569`, non-selectable.

### Chips & Garden Tags
- **Appearance:** Inline-flex, height `1.5rem` (24px), font `JetBrains Mono` at `0.75rem`.
- **Palette:** Translucent pill base `rgba(99, 102, 241, 0.12)` with hairline border `rgba(99, 102, 241, 0.3)`. Text tinted in `#818CF8` for speculative thoughts, or cyan-tinted `rgba(56, 189, 248, 0.12)` for stable/evergreen architectural notes.

### Cards & Garden Nodes
- **Structure:** Translucent panel, `rounded-lg`, backdrop-blur-md, inner padding `1.5rem`.
- **Hover Micro-interaction:** Smooth transition (`200ms cubic-bezier(0.16, 1, 0.3, 1)`) with subtle vertical lift (`translate-y-[-2px]`), border color shifting from neutral slate to active cyan (`rgba(56, 189, 248, 0.45)`).

### Input Fields & Search Bars
- **Style:** Flex items-center, background `rgba(15, 23, 42, 0.8)`, hairline border `rgba(71, 85, 105, 0.6)`, text `#F8FAFC`, placeholder `#64748B`.
- **Focus State:** 1px ring and border in `#38BDF8` alongside a gentle `0 0 12px rgba(56, 189, 248, 0.25)` outer aura.

### Checkboxes & Radios
- **Design:** Geometric squares/circles (`1rem` diameter) with `rgba(30, 41, 59, 0.8)` background, 1px border in `#475569`.
- **Active:** Filled with `#0EA5E9`, centered white check mark, subtle cyan drop shadow.

### Sticky Navigation Header
- **Layout:** Fixed top-0, width 100%, height `4rem` (64px).
- **Surface:** Glassmorphic background `rgba(11, 15, 23, 0.8)` with backdrop-filter blur `16px` and border-b hairline `rgba(56, 189, 248, 0.12)`.
- **Contents:** Logo/monogram pinned left, centered link group with subtle underline indicators, right-aligned status indicator (e.g., green pulsating dot next to "Systems Operational" in JetBrains Mono).

### Footer
- **Layout:** Perfectly centered vertical column stack, maximum width `48rem`, padding `4rem 0 3rem`.
- **Content:** Minimalist architectural signature, GPG fingerprint key indicator in `label-code` typography, and muted social link list with cyan hover transitions.
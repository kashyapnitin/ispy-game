# I Spy Digital Game — Visual Guidelines

This document describes the visual design system for the I Spy game so that new UI and assets stay consistent with the existing look and feel. It is aimed at developers and designers working on the project.

---

## 1. Design principles

- **Playful and clear**: Rounded shapes, chunky controls, and high contrast so young kids (roughly 2–6) can see and tap easily.
- **Friendly**: Soft background, warm primary colour, and readable body text.
- **Hierarchy**: Main actions (scene choice, primary buttons) are bold; secondary controls (toggles, labels) are smaller and less dominant.
- **Consistency**: Same fonts, radius scale, and interaction patterns across screens.

---

## 2. Colour palette

### Primary and secondary (brand and actions)

| Token | Hex | Usage |
|-------|-----|--------|
| **Primary** | `#FF5722` | Main title (“I Spy…”), primary buttons, language dropdown border |
| **Primary hover** | `#E64A19` | Primary button and carousel arrow hover |
| **Secondary** | `#2196F3` | Headings, scene card borders, scene labels, secondary buttons, “Find These!” |
| **Secondary hover** | `#1976D2` | Secondary button hover |

### Semantic

| Token | Hex | Usage |
|-------|-----|--------|
| **Success** | `#4CAF50` | Found state (object list, hitbox), timer On selected, tick icon |
| **Error** | `#F44336` | Errors / wrong tap (if shown) |

### Surfaces and text

| Token / name | Hex | Usage |
|--------------|-----|--------|
| **Background** | `#F0F8FF` (AliceBlue) | App background, main menu gradient end |
| **Surface** | `#FFFFFF` | Cards, sidebar, menu content, scene cards |
| **Text** | `#333333` | Body text |
| **Text muted** | `#6b7280` | Toggle labels, secondary copy |
| **Text soft** | `#5c6b7a` / `#37474f` | Unselected toggle text, hover |

### Toggle pills (menu options)

| State | Hex | Usage |
|-------|-----|--------|
| **Pill border** | `#4a5568` | Single neutral dark border around entire pill (top layer) |
| **Unselected** | `#e8ecf0` bg, `#5c6b7a` text | Default segment |
| **Unselected hover** | `#d4e1ed` bg, `#37474f` text | Hover |
| **Timer Off selected** | `#455a64` (hover: `#37474f`) | Timer = Off |
| **Timer On selected** | `#4CAF50` (hover: `#43a047`) | Timer = On |
| **Easy selected** | `#66bb6a` (hover: `#5cb860`) | Game mode Easy |
| **Hard selected** | `#8e2a3a` (hover: `#7a2331`) | Game mode Hard |

### Found state (object list in sidebar)

| Element | Value |
|---------|--------|
| Found card border | `var(--success-color)` |
| Found card background | `#E8F5E9` |
| Found card opacity | `0.6` |
| Thumbnail (found) | `grayscale(80%)` |
| Tick icon | `var(--success-color)`, thick rounded SVG stroke |

---

## 3. Typography

### Fonts

- **Headings / UI chrome**: `Fredoka One` — rounded, bold, friendly. Used for title, scene names, sidebar heading, buttons, language dropdown, progress text.
- **Body / secondary UI**: `Nunito` (400, 700, 900) — readable, soft. Used for body text, subtitles, toggle labels and option text.

### Scale (reference)

| Use | Size | Weight | Font |
|-----|------|--------|------|
| Main title (“I Spy…”) | 3xl → 5xl responsive | — | Fredoka One |
| Subtitle | sm → lg responsive | 600 (semibold) | Nunito |
| Scene card label | sm → base | — | Fredoka One |
| Sidebar “Find These!” | base → 2xl | bold | Fredoka One |
| Object list item name | 0.9rem | 700 | — |
| Progress text (e.g. “3 / 15 Found”) | — | — | Fredoka One, primary colour |
| Toggle label & option text | **0.8rem** | 600 | Nunito (same size for both) |
| Language dropdown | 1.1rem | — | Fredoka One |

---

## 4. Border radius

Use the CSS variables for consistency:

| Variable | Value | Typical use |
|----------|--------|-------------|
| `--border-radius-sm` | 8px | Thumbnails, small chips |
| `--border-radius-md` | 16px | Target (object) cards, buttons |
| `--border-radius-lg` | 24px | Menu content card |
| `--border-radius-round` | 50% | Carousel arrows, circular controls |

**Toggle pills**: 8px outer radius; inner segment radius 6px (first segment: 6px 0 0 6px; last: 0 6px 6px 0).

---

## 5. Shadows

| Token / use | Value |
|-------------|--------|
| **Soft** | `0 4px 6px rgba(0, 0, 0, 0.1)` — cards, scene buttons |
| **Button “chunky”** | `0 4px 0 rgba(0, 0, 0, 0.15)` — primary/secondary buttons, carousel arrows, lang dropdown |
| **Button active** | `0 0 0` (shadow removed), `translateY(4px)` — pressed state |
| **Sidebar** | `2px 0 10px rgba(0, 0, 0, 0.1)` |
| **Title** | `2px 2px 0 rgba(0, 0, 0, 0.1)` (drop-shadow) |
| **Found tick** | `0 1px 2px rgba(0, 0, 0, 0.2)` |

---

## 6. Components

### 6.1 Main menu card (`.menu-content`)

- Background: white (`--surface-color`).
- Radius: `--border-radius-lg` (24px).
- Shadow: `--shadow-soft`.
- Padding: responsive (e.g. 3–6, 4–8).
- Max-width: md → xl → 3xl by breakpoint; `min-w-0` / `box-border` to avoid overflow on small screens.

### 6.2 Scene cards (`.scene-btn`)

- White background, **3px** border in secondary colour.
- Radius: `rounded-xl` (12px).
- Thumbnail: `rounded-lg`, aspect ratio square or 4/3.
- Label: Fredoka One, secondary colour, truncate.
- Hover: lift `translateY(-5px)`, stronger shadow, background tint `--bg-color`.

### 6.3 Carousel arrows

- Primary colour, round (50% radius).
- Size ~50px (smaller on tablet).
- Chunky shadow; on active: translateY(4px), shadow removed.

### 6.4 Toggle pills (Game mode, Timer)

- **One pill = one border**: Neutral dark border (`#4a5568`, 2px) as a **single top layer** (e.g. `::after` with `inset: 0`, `pointer-events: none`) so it never looks different on selected vs unselected sides.
- Outer radius 8px; segments have no gap (radius 6px on inner corners).
- Label and option text: **same font size** (0.8rem), Nunito 600; label colour `#6b7280`.
- Unselected: light grey bg; selected: per-option colours (see Colour palette).
- No focus outline (or neutral) so no blue ring.

### 6.5 Language dropdown (`.lang-dropdown`)

- Fredoka One, white background.
- **3px** primary-colour border, “chunky” shadow (4px offset primary).
- Radius: 20px (pill-like).
- Active: translateY(4px), shadow removed.

### 6.6 Buttons (primary / secondary)

- **Primary**: primary colour, chunky shadow; hover = primary-hover.
- **Secondary**: secondary colour, same shadow pattern.
- Active: translateY(4px), shadow to 0.
- Font: Fredoka One, white.

### 6.7 Sidebar and object list

- **Sidebar**: White, left shadow, flex column.
- **Target item (object card)**:
  - Default: light grey bg `#f9f9f9`, 3px border `#eee`, radius md, padding 10px.
  - Found: success border, green-tinted bg `#E8F5E9`, opacity 0.6, grayscale thumb, centred green tick (thick rounded stroke SVG, success colour).
- **Progress text**: Fredoka One, primary colour.

### 6.8 Scene and hitboxes

- **Scene container**: Dark grey `#333` for letterboxing; scene wrapper scaled by JS, white background.
- **Hitboxes**: Transparent, circular cursor; when found: success state + animation (e.g. bounce/pop).

### 6.9 Win screen

- White card, large title, subtitle, optional time message (if timer on), primary/secondary buttons.
- Confetti and win styling align with primary/success and shadows above.

---

## 7. Motion and interaction

- **Buttons**: Short transition (e.g. 0.1s) on transform and box-shadow; active = push down.
- **Scene cards**: Hover lift and shadow (e.g. 0.2s ease).
- **Target items**: Transition on border/background (e.g. 0.3s); hint shake and “recently found” pulse as needed.
- **Toggles**: No transform on active; 0.2s ease on background/color.
- **Touch**: `user-select: none`, `touch-action: manipulation` to avoid accidental zoom/select.

---

## 8. Responsive behaviour

- **Menu**: Card and toggles use flex-wrap and `min-w-0` / `max-width` so content doesn’t spill on narrow viewports.
- **Toggles**: On small screens, stack vertically (e.g. flex-col); label and option text stay 0.8rem.
- **Scene carousel**: Horizontal scroll, snap; arrows hidden on very small screens.
- **Sidebar**: On narrow/tablet, often below scene (column-reverse), horizontal object strip with smaller thumbs and text.

---

## 9. Assets and imagery

- **Scenes**: High-resolution background images; aspect ratio preserved; letterboxing in dark grey when needed.
- **Object thumbnails**: Cropped from scene or provided assets; `object-fit: contain`; small drop-shadow.
- **Icons**: Prefer simple, thick strokes, rounded caps (e.g. found tick) to match the chunky style.
- **Voice/audio**: Stored under `assets/audio/voices/<lang>/`; no visual guidelines beyond being clearly playable.

---

## 10. Implementation notes

- Colours and radius are defined in `css/style.css` under `:root` and reused via variables.
- Toggle pill border is implemented as a pseudo-element overlay so it stays one continuous frame on top of segment colours.
- Fonts loaded from Google Fonts: Fredoka One, Nunito (weights 400, 700, 900).
- Tailwind CDN is used for layout/utilities; custom styles live in `css/style.css`.

When adding new screens or components, reuse these colours, type scale, radius, and shadow patterns so the game feels consistent and on-brand.

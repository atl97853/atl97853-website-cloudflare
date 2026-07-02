# CSS Architecture Notes

Notes for the CSS organization and refactor workflow.

This document explains the current component-driven CSS architecture used by the site, what each CSS file is responsible for, what should stay out of each file, and how to decide where new styles should go.

The goal of this refactor is to move away from a single large `global.css` file and toward a clearer architecture where each file has one responsibility.

---

## Current Architecture

```text
src/styles/
  global.css
  tokens.css
  base.css
  layout.css
  components/
    card.css
```

### Current File Responsibilities

| File | Responsibility | Current status |
|---|---|---|
| `global.css` | Imports CSS files only. | Active |
| `tokens.css` | Reusable design values and theme variables. | Active |
| `base.css` | Default browser and HTML element behavior. | Active |
| `layout.css` | Page structure, wrappers, grids, and major layout regions. | Active |
| `components/card.css` | Reusable component styles and card-like component patterns. | Active |
| `themes.css` | Old theme-specific override file. | Removed |
| `utilities.css` | Optional helper class file. | Not part of the current active architecture |

### Main Rule

```text
Global CSS connects the system.
Tokens define the values.
Base defines default element behavior.
Layout defines page structure.
Components define reusable objects.
Page styles define exceptions.
```

Another useful way to think about it:

```text
Values      -> tokens.css
Defaults    -> base.css
Structure   -> layout.css
Objects     -> components/card.css
Imports     -> global.css
Overrides   -> avoid unless truly necessary
```

---

## Import Order

**File:** `src/styles/global.css`

`global.css` should only import the rest of the CSS system.

Recommended current import order:

```css
@import "./tokens.css";
@import "./base.css";
@import "./layout.css";
@import "./components/card.css";
```

### Why This Order Matters

The order is intentional:

1. `tokens.css` comes first because all other files depend on the variables defined there.
2. `base.css` comes second because it sets the default behavior for HTML elements.
3. `layout.css` comes third because it defines the page structure.
4. `components/card.css` comes last because component styles are more specific than base and layout rules.

### What Goes in `global.css`

Only imports:

```css
@import "./tokens.css";
@import "./base.css";
@import "./layout.css";
@import "./components/card.css";
```

### What Should Not Go in `global.css`

Do not add selectors, component styles, layout styles, resets, or theme overrides here.

Bad example:

```css
@import "./tokens.css";
@import "./base.css";

body {
    background: black;
}

.c-card {
    padding: 1rem;
}
```

The `body` rule belongs in `base.css`, and the `.c-card` rule belongs in `components/card.css`.

### Rule of Thumb

If `global.css` becomes longer than the import list, something is probably in the wrong file.

---

## Design Tokens

**File:** `src/styles/tokens.css`

### Summary

`tokens.css` contains reusable design values.

Design tokens are CSS custom properties for colors, fonts, spacing, sizes, borders, shadows, radii, and other values that may be reused or changed later.

This file is the visual foundation of the site.

### Purpose

The goal of `tokens.css` is to avoid hard-coding repeated visual values directly inside layout or component files.

Instead of writing the same values many times, define them once and reuse them with `var(...)`.

This makes the design easier to maintain because large visual changes can happen from one file.

### What Goes in `tokens.css`

Use this file for reusable values such as:

```css
:root {
    /* Colors */
    --clr-bg-page: #0b0b0f;
    --clr-bg-container: #121217;
    --clr-bg-card: #181820;
    --clr-text-main: #f4f4f5;
    --clr-text-muted: #a1a1aa;
    --clr-accent: #ff7abf;
    --clr-border: #2a2a33;

    /* Fonts */
    --ff-main: "Inter", system-ui, sans-serif;
    --ff-mono: "JetBrains Mono", monospace;

    /* Font sizes */
    --fs-xs: 0.75rem;
    --fs-sm: 0.875rem;
    --fs-md: 1rem;
    --fs-lg: 1.25rem;
    --fs-xl: 1.5rem;

    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;

    /* Borders */
    --br-sm: 0;
    --br-md: 0;
    --bw-frame: 1px;

    /* Effects */
    --shadow-card: 0 0 0 1px var(--clr-border);
}
```

Theme-level variable overrides also belong in `tokens.css`.

Example:

```css
:root {
    --clr-bg-page: #050505;
    --clr-text-main: #f5f5f5;
    --clr-accent: #ff7abf;
}

[theme="light"] {
    --clr-bg-page: #f8f8fb;
    --clr-text-main: #111111;
    --clr-accent: #d63384;
}

[theme="special"] {
    --clr-bg-page: #101827;
    --clr-text-main: #e8eefc;
    --clr-accent: #8ab4ff;
}
```

### What Should Not Go in `tokens.css`

`tokens.css` should contain values, not component styling.

Bad example:

```css
[theme="dark"] .c-card {
    background: transparent;
    border: 1px solid white;
}
```

This is styling a component directly, so it does not belong in `tokens.css`.

Instead, define the values in `tokens.css`:

```css
[theme="dark"] {
    --clr-bg-card: transparent;
    --clr-border: white;
}
```

Then consume those values in the component file:

```css
.c-card {
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
}
```

### Naming Guidelines

Use semantic names that describe purpose, not appearance.

Good examples:

```css
--clr-bg-page
--clr-bg-card
--clr-text-main
--clr-text-muted
--clr-accent
--clr-border
--space-md
--fs-sm
--ff-main
```

Avoid names tied to one temporary design choice:

```css
--pink-navbar
--dark-footer-border
--blue-about-card
--special-theme-button-color
```

A semantic token can change value without changing its meaning.

For example, `--clr-accent` can be pink in the dark theme, blue in the special theme, and black in a minimal theme.

### Token Categories

A clean `tokens.css` can be organized by category:

```css
:root {
    /* Colors */

    /* Typography */

    /* Spacing */

    /* Borders */

    /* Effects */

    /* Layout values */
}
```

Layout values can live in `tokens.css` if they are reusable across layout rules.

Example:

```css
:root {
    --size-content-max: 68rem;
    --size-sidebar: 14rem;
    --size-page-gutter: var(--space-md);
}
```

### Workflow

When editing `tokens.css`:

1. Add reusable visual values here.
2. Use semantic names.
3. Avoid one-off variables unless they are likely to be reused.
4. Do not style components directly.
5. Keep theme changes at the variable level whenever possible.
6. Use the same token names across all themes.

### Example Use

Define values once:

```css
:root {
    --clr-accent: #ff7abf;
    --space-card: 1rem;
}
```

Use them elsewhere:

```css
.c-card {
    padding: var(--space-card);
    border-color: var(--clr-accent);
}
```

---

## Base Styles

**File:** `src/styles/base.css`

### Summary

`base.css` defines reset rules and default element behavior.

This file controls how normal HTML elements behave before layout and component styles are applied.

### Purpose

Browsers apply their own default styles to elements like `body`, `a`, `p`, `ul`, `button`, and `img`.

Those defaults can create inconsistent spacing, colors, font behavior, and image sizing.

The purpose of `base.css` is to create a predictable foundation for the whole site.

### What Goes in `base.css`

Use this file for broad HTML element rules:

```css
*,
*::before,
*::after

html
body
main

h1,
h2,
h3,
h4,
h5,
h6

p

a
a:hover
a:focus-visible

ul,
ol
li

img,
picture,
svg,
canvas

button,
input,
textarea,
select

code,
pre

strong,
b
```

General browser behavior rules may also go here:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
    }
}
```

### Good Examples

```css
*,
*::before,
*::after {
    box-sizing: border-box;
}

html {
    min-height: 100%;
    scroll-behavior: smooth;
}

body {
    min-height: 100vh;
    margin: 0;
    background: var(--clr-bg-page);
    color: var(--clr-text-main);
    font-family: var(--ff-main);
    font-size: var(--fs-md);
    line-height: 1.5;
}

a {
    color: var(--clr-accent);
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
}

img,
picture,
svg,
canvas {
    display: block;
    max-width: 100%;
}

button,
input,
textarea,
select {
    font: inherit;
}
```

These rules apply broadly across the site.

### What Should Not Go in `base.css`

Do not add layout classes, component classes, page-specific selectors, or theme-specific component overrides.

Bad example:

```css
.l-main-wrapper {
    max-width: 70rem;
    margin-inline: auto;
}

.c-card {
    padding: var(--space-md);
}

.c-site-header {
    text-align: center;
}

.p-about-page {
    padding: var(--space-lg);
}
```

These belong somewhere else:

| Selector | Correct file |
|---|---|
| `.l-main-wrapper` | `layout.css` |
| `.c-card` | `components/card.css` |
| `.c-site-header` | `components/card.css` or another component file |
| `.p-about-page` | page-level CSS or a future page CSS file |

### Relationship With `tokens.css`

`base.css` should use tokens instead of hard-coded visual values.

Prefer this:

```css
body {
    color: var(--clr-text-main);
    background: var(--clr-bg-page);
}
```

Avoid this:

```css
body {
    color: #ffffff;
    background: #000000;
}
```

This allows the theme to change through `tokens.css` without rewriting base rules.

### Workflow

When editing `base.css`:

1. Ask whether the rule affects a default HTML element.
2. Keep rules broad and predictable.
3. Use tokens for visual values.
4. Do not solve component spacing problems here.
5. Do not add page-specific exceptions here.

---

## Layout Styles

**File:** `src/styles/layout.css`

### Summary

`layout.css` defines the structure of the page.

It controls wrappers, grids, columns, content width, page spacing, major regions, and responsive layout behavior.

### Purpose

The purpose of `layout.css` is to answer structural questions:

```text
Where does this section live?
How wide is the page?
How are the main and sidebar areas arranged?
How much space exists between major regions?
How does the layout change on smaller screens?
```

Layout styles should not define the detailed appearance of individual components.

### Naming Convention

Layout classes use the `l-` prefix.

Examples:

```css
.l-main-wrapper
.l-layout-grid
.l-content
.l-sidebar
.l-section
.l-stack
```

The `l-` prefix means the class exists to position or structure content, not to decorate it.

### What Goes in `layout.css`

Use this file for page-level structure:

```css
.l-main-wrapper {
    width: min(100% - var(--space-md), var(--size-content-max));
    margin-inline: auto;
}

.l-layout-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--size-sidebar);
    gap: var(--space-lg);
    align-items: start;
}

.l-content {
    min-width: 0;
}

.l-sidebar {
    position: sticky;
    top: var(--space-md);
}
```

Responsive layout rules also belong here:

```css
@media (max-width: 768px) {
    .l-layout-grid {
        grid-template-columns: 1fr;
    }

    .l-sidebar {
        position: static;
    }
}
```

### What Should Not Go in `layout.css`

Do not define component appearance here.

Bad example:

```css
.l-content .c-card {
    background: var(--clr-bg-card);
    border: 1px solid var(--clr-border);
    padding: var(--space-md);
}
```

This mixes layout and component styling.

Better:

```css
/* layout.css */
.l-content {
    display: grid;
    gap: var(--space-md);
}

/* components/card.css */
.c-card {
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
    padding: var(--space-md);
}
```

### Good Layout Questions

A rule probably belongs in `layout.css` if it answers one of these questions:

- Is this about the main page wrapper?
- Is this about the grid or column structure?
- Is this about the spacing between major page regions?
- Is this about the width of the content area?
- Is this about responsive behavior for the page shell?
- Is this about positioning the sidebar, main content, header, or footer region?

### Bad Layout Questions

A rule probably does not belong in `layout.css` if it answers one of these questions:

- What background does this card have?
- What border does this button use?
- What font size does this component title use?
- What hover style does this navigation link use?
- What padding does this specific component need internally?

Those belong in component CSS.

### Relationship With Components

Layout controls the outside relationship between regions.

Components control their own inside appearance.

Example:

```css
/* layout.css */
.l-content {
    display: grid;
    gap: var(--space-lg);
}

/* components/card.css */
.c-card {
    padding: var(--space-md);
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
}
```

In this example:

- `.l-content` decides the space between cards.
- `.c-card` decides how each card looks internally.

### Workflow

When editing `layout.css`:

1. Use `l-` classes only.
2. Keep rules structural.
3. Avoid styling individual components.
4. Keep responsive page behavior here.
5. Use layout tokens when possible.
6. Do not create highly specific descendant selectors unless the structure requires it.

---

## Component Styles

**File:** `src/styles/components/card.css`

### Summary

`card.css` contains reusable component styles.

In the current architecture, this file is the main component layer. It contains the shared card-like patterns and the `.c-` component selectors that were moved out of `global.css`.

### Purpose

The purpose of `card.css` is to define reusable visual objects.

A component is something that can be placed inside a layout region and should bring its own internal styling.

Examples:

```text
Header
Footer
Navbar
Profile card
Blog post card
Library book card
Logs component
Webmaster component
Website button component
General card component
```

### Naming Convention

Component classes use the `c-` prefix.

Examples:

```css
.c-card
.c-card__title
.c-card__body
.c-card__meta

.c-site-header
.c-site-footer
.c-nav-list
.c-pfp
.c-blog-post-card
.c-library-book-card
.c-website-button
```

The `c-` prefix means the class describes a reusable visual component.

### What Goes in `card.css`

Use this file for component appearance and component-level structure.

Good examples:

```css
.c-card {
    padding: var(--space-md);
    color: var(--clr-text-main);
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
    border-radius: var(--br-md);
}

.c-card__title {
    margin: 0 0 var(--space-sm);
    font-size: var(--fs-lg);
    line-height: 1.25;
}

.c-card__body {
    color: var(--clr-text-muted);
}
```

Component-specific rules also belong here:

```css
.c-site-header {
    padding: var(--space-lg) var(--space-sm);
    color: var(--clr-text-main);
    background: transparent;
    border: none;
    text-align: center;
}

.c-site-header__title {
    margin: 0;
    font-size: var(--fs-lg);
    line-height: 1.25;
    font-weight: 700;
}

.c-site-footer {
    padding: var(--space-md);
    color: var(--clr-text-muted);
    text-align: center;
}
```

Navigation component rules can also live here:

```css
.c-nav-list {
    display: grid;
    gap: var(--space-xs);
    margin: 0;
    padding: 0;
    list-style: none;
}

.c-nav-list__link {
    display: block;
    padding: var(--space-sm) var(--space-md);
    color: var(--clr-text-main);
    border: var(--bw-frame) solid var(--clr-border);
    text-decoration: none;
}

.c-nav-list__link:hover,
.c-nav-list__link:focus-visible {
    color: var(--clr-accent);
    border-color: var(--clr-accent);
}
```

### General Card Component

The general card component is the reusable base object for repeated panel/card styles.

Use it when multiple components share the same visual shell:

```css
.c-card {
    padding: var(--space-md);
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
    border-radius: var(--br-md);
}
```

Then specific components can extend the pattern by using their own selector:

```css
.c-blog-post-card {
    display: grid;
    gap: var(--space-sm);
}

.c-library-book-card {
    display: grid;
    gap: var(--space-xs);
}
```

In the Astro component markup, this can look like:

```astro
<article class="c-card c-blog-post-card">
    <h2 class="c-card__title">Post title</h2>
    <p class="c-card__body">Post description.</p>
</article>
```

This approach keeps the shared card shell reusable while allowing each component to define its own internal needs.

### What Should Not Go in `card.css`

Do not add global resets, page layout wrappers, or one-off page exceptions.

Bad example:

```css
body {
    background: var(--clr-bg-page);
}

.l-layout-grid {
    display: grid;
    grid-template-columns: 1fr 14rem;
}

.p-about-page .c-card {
    margin-top: 4rem;
}
```

These belong somewhere else:

| Rule | Correct place |
|---|---|
| `body` default styling | `base.css` |
| `.l-layout-grid` page structure | `layout.css` |
| `.p-about-page .c-card` one-off exception | page-level CSS or future page CSS file |

### Component Scope Rule

A component should own:

- its internal spacing
- its background
- its border
- its typography hierarchy
- its internal grid or flex structure
- its hover/focus behavior
- its child elements

A component should not own:

- the full page width
- the main layout grid
- the position of the sidebar
- spacing between unrelated major page regions
- page-specific exceptions

### Relationship With `tokens.css`

Components should consume tokens instead of hard-coding values.

Prefer this:

```css
.c-card {
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
    padding: var(--space-md);
}
```

Avoid this:

```css
.c-card {
    background: #181820;
    border: 1px solid #2a2a33;
    padding: 16px;
}
```

### Relationship With `layout.css`

Layout controls where the component is placed.

The component controls how it looks.

Example:

```css
/* layout.css */
.l-sidebar {
    display: grid;
    gap: var(--space-md);
}

/* components/card.css */
.c-navbar {
    padding: var(--space-md);
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
}
```

### When to Split Component Files Later

Right now, `card.css` is the main component file.

If it becomes too large, the component layer can be split later:

```text
src/styles/components/
  card.css
  header.css
  footer.css
  navbar.css
  profile.css
  buttons.css
```

That should only happen when the file becomes difficult to scan or when a component family becomes large enough to justify its own file.

Until then, keeping component rules in `card.css` is simple and easier to maintain.

### Workflow

When editing `card.css`:

1. Add styles for `.c-` component classes.
2. Use shared `.c-card` styles when possible.
3. Use tokens for colors, spacing, fonts, borders, and effects.
4. Keep component styles independent from page layout.
5. Avoid theme-specific component overrides when a token can solve the problem.
6. Preserve existing class names unless the markup is intentionally being refactored too.

---

## Removed Theme File

**File:** `src/styles/themes.css`

### Current Status

`themes.css` has been removed from the current architecture.

Theme-specific styling should now be handled primarily through variables in `tokens.css`.

### Why `themes.css` Was Removed

The old theme file created a separate place for theme-specific overrides.

That can become hard to maintain because the same idea may exist in two places:

```text
tokens.css  -> defines theme values
themes.css  -> overrides component styles directly
```

This can create duplicated logic and make it harder to know where a visual change should happen.

The new architecture is cleaner:

```text
tokens.css      -> theme values
component files -> consume theme values
```

### Old Pattern to Avoid

```css
[theme="dark"] .c-card {
    background: #000000;
    color: #ffffff;
    border-color: #ff7abf;
}

[theme="light"] .c-card {
    background: #ffffff;
    color: #111111;
    border-color: #d63384;
}
```

This repeats component rules per theme.

### New Pattern

Define theme values in `tokens.css`:

```css
:root {
    --clr-bg-card: #000000;
    --clr-text-main: #ffffff;
    --clr-border: #ff7abf;
}

[theme="light"] {
    --clr-bg-card: #ffffff;
    --clr-text-main: #111111;
    --clr-border: #d63384;
}
```

Use those values once in `card.css`:

```css
.c-card {
    background: var(--clr-bg-card);
    color: var(--clr-text-main);
    border: var(--bw-frame) solid var(--clr-border);
}
```

Now the component does not need to know which theme is active.

### When a Theme-Specific Selector Might Be Acceptable

Theme-specific selectors should be rare.

They may be acceptable only when a visual behavior cannot be expressed cleanly through tokens.

Example:

```css
[theme="special"] .c-pfp {
    image-rendering: pixelated;
}
```

Even then, first ask whether a token or component variant would be cleaner.

### Rule of Thumb

Prefer this:

```text
Change values in tokens.css.
Let components automatically inherit those values.
```

Avoid this:

```text
Write separate component rules for every theme.
```

---

## Optional Future Utilities File

**File:** `src/styles/utilities.css`

### Current Status

`utilities.css` is not part of the current active architecture.

It can be reintroduced later if the project starts needing many small helper classes.

### Purpose

A utility class is a small single-purpose helper.

It should do one thing and be reusable across different components and pages.

### Examples of Valid Utilities

```css
.u-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.u-text-muted {
    color: var(--clr-text-muted);
}

.u-full-width {
    width: 100%;
}
```

### What Should Not Become a Utility

Avoid creating utility classes for every small visual decision.

Bad example:

```css
.u-pink-border {
    border: 1px solid pink;
}

.u-navbar-padding {
    padding: 0.625rem 1.125rem;
}
```

These are too specific or too visual.

A utility file should not become a replacement for component CSS.

### When to Reintroduce `utilities.css`

Reintroduce it only when:

- the same tiny helper is needed in many places
- adding a full component class would be unnecessary
- the helper is truly generic
- the helper does not depend on one specific component

If `utilities.css` is reintroduced, import it after `layout.css` and before component files:

```css
@import "./tokens.css";
@import "./base.css";
@import "./layout.css";
@import "./utilities.css";
@import "./components/card.css";
```

---

## Page-Level Styles

### Summary

Page-level styles are exceptions.

They should be used only when a style belongs to one specific page and does not belong to the global system, base layer, layout layer, or reusable component layer.

### Where Page Styles Can Live

For now, page-specific styles can live inside the Astro page component when they are truly local.

Example:

```astro
<style>
    .p-about-page {
        display: grid;
        gap: var(--space-lg);
    }
</style>
```

If page styles grow too much later, a page CSS folder could be introduced:

```text
src/styles/pages/
  about.css
  blog.css
  library.css
```

This is not necessary unless page-level CSS becomes large.

### Naming Convention

Page-level classes can use the `p-` prefix.

Examples:

```css
.p-about-page
.p-blog-index
.p-library-page
```

### What Should Not Become Page CSS

Do not use page CSS to style reusable components globally.

Bad example:

```css
.p-about-page .c-card {
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
    padding: var(--space-md);
}
```

If every card needs that style, it belongs in `components/card.css`.

Use page CSS only for page-specific composition.

---

## Selector Prefixes

The project uses prefixes to make responsibility clear.

| Prefix | Meaning | Example | File |
|---|---|---|---|
| `l-` | Layout | `.l-layout-grid` | `layout.css` |
| `c-` | Component | `.c-card` | `components/card.css` |
| `p-` | Page-specific | `.p-about-page` | page-level CSS |
| `u-` | Utility | `.u-sr-only` | optional `utilities.css` |

### Why Prefixes Help

Prefixes make it easier to know where a selector belongs.

Example:

```css
.l-content
```

This should be in `layout.css`.

```css
.c-site-footer
```

This should be in the component CSS layer.

```css
.p-about-page
```

This should be local to the page unless it becomes reusable.

---

## How to Decide Where a Rule Goes

Use this decision flow:

```text
Is it a reusable value?
  -> tokens.css

Is it default browser or HTML element behavior?
  -> base.css

Is it page structure, wrapper, grid, column, or major region spacing?
  -> layout.css

Is it a reusable visual object or component?
  -> components/card.css

Is it a tiny reusable helper class?
  -> optional utilities.css

Is it specific to one page only?
  -> page-level CSS
```

### Examples

| Rule | Correct file | Why |
|---|---|---|
| `--clr-accent` | `tokens.css` | Reusable value |
| `body { margin: 0; }` | `base.css` | Browser default behavior |
| `.l-layout-grid` | `layout.css` | Page structure |
| `.c-card` | `components/card.css` | Reusable component |
| `.c-nav-list__link:hover` | `components/card.css` | Component interaction |
| `.u-sr-only` | `utilities.css` if reintroduced | Generic helper |
| `.p-about-page` | page-level CSS | Page-specific exception |
| `[theme="light"] { --clr-accent: ... }` | `tokens.css` | Theme variable override |
| `[theme="light"] .c-card { ... }` | Avoid if possible | Theme-specific component override |

---

## Refactor Workflow

Use this workflow when moving or adding CSS.

### 1. Identify the Selector Type

Look at the selector prefix.

```css
.l-main-wrapper     -> layout.css
.c-card             -> components/card.css
.p-about-page       -> page-level CSS
.u-sr-only          -> utilities.css if reintroduced
body                -> base.css
:root               -> tokens.css
```

### 2. Check Whether the Rule Uses Hard-Coded Values

Bad:

```css
.c-card {
    padding: 16px;
    border: 1px solid #ff7abf;
}
```

Better:

```css
.c-card {
    padding: var(--space-md);
    border: var(--bw-frame) solid var(--clr-border);
}
```

If a value is reused, move it to `tokens.css`.

### 3. Remove Duplicate Theme Rules

Before adding a theme-specific selector, check whether a token can solve the problem.

Bad:

```css
[theme="light"] .c-site-footer {
    color: #333333;
}

[theme="dark"] .c-site-footer {
    color: #cccccc;
}
```

Better:

```css
/* tokens.css */
:root {
    --clr-text-muted: #cccccc;
}

[theme="light"] {
    --clr-text-muted: #333333;
}

/* components/card.css */
.c-site-footer {
    color: var(--clr-text-muted);
}
```

### 4. Keep Layout and Components Separate

Bad:

```css
.c-card {
    max-width: 68rem;
    margin-inline: auto;
}
```

Better:

```css
/* layout.css */
.l-main-wrapper {
    max-width: var(--size-content-max);
    margin-inline: auto;
}

/* components/card.css */
.c-card {
    padding: var(--space-md);
}
```

### 5. Preserve Existing Selectors During Refactors

When refactoring CSS without changing markup, preserve existing class names, element selectors, IDs, and theme selectors.

This avoids breaking Astro components that already depend on those selectors.

Only rename selectors when the component markup is being intentionally updated at the same time.

---

## Adding a New Component

When adding a new component, follow this process.

### 1. Create or Reuse Markup Classes

Example:

```astro
<article class="c-card c-project-card">
    <h2 class="c-card__title">Project title</h2>
    <p class="c-card__body">Project description.</p>
</article>
```

### 2. Reuse Existing Component Patterns

Use `.c-card` for the shared shell.

```css
.c-card {
    padding: var(--space-md);
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
}
```

### 3. Add Only the Component-Specific Differences

```css
.c-project-card {
    display: grid;
    gap: var(--space-sm);
}

.c-project-card__meta {
    color: var(--clr-text-muted);
    font-size: var(--fs-sm);
}
```

### 4. Avoid One-Off Tokens

Do not create a token unless the value is reusable.

Bad:

```css
:root {
    --project-card-title-margin-special: 0.375rem;
}
```

Better:

```css
.c-project-card__title {
    margin-block-end: var(--space-xs);
}
```

---

## Adding a New Theme Value

Theme values belong in `tokens.css`.

### Good Pattern

```css
:root {
    --clr-link: var(--clr-accent);
}

[theme="light"] {
    --clr-link: #c2255c;
}

[theme="special"] {
    --clr-link: #8ab4ff;
}
```

Then use the token in another file:

```css
a {
    color: var(--clr-link);
}
```

### Bad Pattern

```css
[theme="light"] a {
    color: #c2255c;
}

[theme="special"] a {
    color: #8ab4ff;
}
```

This repeats the selector and spreads theme logic outside the token layer.

---

## Anti-Patterns to Avoid

### 1. Turning `global.css` Back Into a Dumping Ground

Bad:

```css
/* global.css */
@import "./tokens.css";

.c-card {
    padding: var(--space-md);
}
```

Keep `global.css` as imports only.

### 2. Styling Components in `base.css`

Bad:

```css
/* base.css */
.c-navbar {
    padding: var(--space-md);
}
```

Component styles belong in `components/card.css`.

### 3. Styling Layout in Component CSS

Bad:

```css
/* card.css */
.c-card {
    width: min(100% - var(--space-md), 68rem);
    margin-inline: auto;
}
```

Page width belongs in `layout.css`.

### 4. Recreating `themes.css` Through Many Theme Selectors

Bad:

```css
[theme="dark"] .c-card { ... }
[theme="light"] .c-card { ... }
[theme="special"] .c-card { ... }
```

Prefer variable overrides in `tokens.css`.

### 5. Creating Tokens for Everything

Bad:

```css
--blog-card-third-line-gap
--navbar-first-link-padding
--footer-special-border-width
```

Tokens should be reusable and meaningful.

---

## Maintenance Checklist

Use this checklist before committing CSS changes.

```text
[ ] global.css contains imports only.
[ ] tokens.css contains reusable values and theme variables only.
[ ] base.css contains default element behavior only.
[ ] layout.css contains structure and layout rules only.
[ ] card.css contains component rules only.
[ ] themes.css has not been reintroduced.
[ ] Hard-coded values were replaced with tokens when reusable.
[ ] Component styles do not control page layout.
[ ] Layout styles do not define component appearance.
[ ] Theme differences are handled with variables when possible.
[ ] Existing selectors were preserved unless markup was intentionally changed.
```

---

## Final Mental Model

```text
tokens.css
  Defines what values exist.

base.css
  Defines how raw HTML behaves.

layout.css
  Defines where major regions go.

components/card.css
  Defines how reusable interface objects look.

global.css
  Connects the CSS files together.
```

The system should stay simple:

```text
Change the design through tokens.
Change browser defaults through base.
Change page structure through layout.
Change reusable UI objects through components.
Keep global as imports only.
```
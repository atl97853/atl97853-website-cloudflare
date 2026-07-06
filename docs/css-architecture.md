# CSS Architecture

This document explains the CSS architecture used by the site: what each CSS file is responsible for, how the layers interact, and how to decide where new styles should go.

The goal is to keep CSS predictable by separating reusable values, default HTML behavior, layout structure, reusable component primitives, small utilities, and component-specific styles.

---

## 1. Current structure

```text
src/styles/
  global.css
  tokens.css
  base.css
  layout.css
  utilities.css
  components/
    card.css
```

Astro components may also contain local `<style>` blocks when the styles belong only to that component or page.

Recommended import order:

```css
@import "./tokens.css";
@import "./base.css";
@import "./layout.css";
@import "./utilities.css";
@import "./components/card.css";
```

This order matters because later layers depend on earlier layers. Tokens must load first. Base establishes raw HTML behavior. Layout creates the page shell. Utilities provide small helpers. Component styles come last because they are more specific than base and layout rules.

---

## 2. File responsibilities

| File | Responsibility | Should contain |
|---|---|---|
| `global.css` | Imports only | `@import` rules |
| `tokens.css` | Reusable values and theme values | colors, font families, font sizes, spacing, borders, shared line heights, theme overrides |
| `base.css` | Raw HTML behavior | reset rules, `html`, `body`, links, paragraphs, lists, images, buttons, code, selection |
| `layout.css` | Page structure | wrappers, grids, content/sidebar regions, major layout spacing, responsive layout behavior |
| `utilities.css` | Generic helpers | `.u-flex`, `.u-text-center`, `.u-sr-only`, or other small reusable helpers |
| `components/card.css` | Shared component primitives | `.c-card`, `.c-card__header`, `.c-card__body`, `.c-nav-list`, `.c-nav-list__link`, shared header/footer component styles |
| `Component.astro` styles | Component-specific styles | local content classes, page-specific styles, one-component overrides, hook-class rules when needed |

---

## 3. Mental model

```text
Values       -> tokens.css
Defaults     -> base.css
Structure    -> layout.css
Helpers      -> utilities.css
Primitives   -> components/card.css
Local styles -> Component.astro
Imports      -> global.css
```

Another way to think about it:

```text
tokens.css answers: what values exist?
base.css answers: how should raw HTML behave?
layout.css answers: where do major page regions go?
utilities.css answers: do we need a tiny reusable helper?
components/card.css answers: how do shared interface primitives look?
Component.astro answers: what does this specific component need?
global.css answers: in what order is the CSS system loaded?
```

---

## 4. `global.css`

`global.css` should only connect the CSS files.

Good:

```css
@import "./tokens.css";
@import "./base.css";
@import "./layout.css";
@import "./utilities.css";
@import "./components/card.css";
```

Avoid:

```css
@import "./tokens.css";

body {
    background: black;
}

.c-card {
    padding: 1rem;
}
```

The `body` rule belongs in `base.css`, and the `.c-card` rule belongs in `components/card.css`.

Rule of thumb:

```text
If global.css becomes longer than the import list, something is probably in the wrong file.
```

---

## 5. `tokens.css`

`tokens.css` contains reusable CSS custom properties. Tokens are the design language of the site. They describe values, not selectors.

Good token categories:

```css
:root {
    /* Colors */
    --clr-bg-page: #0a0a0a;
    --clr-bg-container: #0a0a0a;
    --clr-bg-card: transparent;
    --clr-text-main: #e0e0e0;
    --clr-text-muted: #888888;
    --clr-text-strong: #ffffff;
    --clr-accent: #ffffff;
    --clr-border: transparent;

    /* Typography */
    --ff-main: Arial, Helvetica, sans-serif;
    --fs-xs: 0.875rem;
    --fs-sm: 1rem;
    --fs-md: 1.35rem;
    --fs-lg: 1.75rem;

    /* Spacing */
    --space-none: 0;
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 40px;

    /* Borders */
    --br-sm: 0;
    --bw-frame: 0;
}
```

Theme values also belong here:

```css
[theme="light"] {
    --clr-bg-page: #ffffff;
    --clr-text-main: #000000;
    --clr-link-main: #0000ee;
}
```

Do not style components directly in `tokens.css`.

Avoid:

```css
[theme="light"] .c-card {
    background: white;
    border: 1px solid black;
}
```

Prefer:

```css
[theme="light"] {
    --clr-bg-card: white;
    --clr-border: black;
}

.c-card {
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
}
```

### Token policy during the current refactor

Use this conservative rule:

```text
Use existing tokens when they clearly match.
Do not create new tokens for one component only.
Only add a token if the value is clearly reusable across multiple components.
```

Safe replacements:

```css
margin: 0;
padding: 0;
font-weight: 700;
line-height: 1.5;
```

can become:

```css
margin: var(--space-none);
padding: var(--space-none);
font-weight: var(--fw-bold);
line-height: var(--lh-text);
```

Only do this if those tokens already exist.

Leave unique values hardcoded until a later token-audit refactor decides they are reusable:

```css
max-width: 48rem;
grid-template-columns: 120px minmax(0, 1fr);
letter-spacing: 0.03em;
text-underline-offset: 0.14em;
padding: 0.1rem 0.45rem;
```

---

## 6. `base.css`

`base.css` defines broad HTML behavior. It is for raw elements, not components.

Good:

```css
*,
*::before,
*::after {
    box-sizing: border-box;
}

body {
    min-height: 100vh;
    background-color: var(--clr-bg-page);
    color: var(--clr-text-main);
    font-family: var(--ff-main);
}

a {
    color: var(--clr-link-main);
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

Avoid:

```css
.c-card {
    padding: var(--space-md);
}

.l-layout-grid {
    display: grid;
}

.p-about-page {
    margin-top: var(--space-lg);
}
```

Those belong in `components/card.css`, `layout.css`, and page/component styles.

---

## 7. `layout.css`

`layout.css` defines page structure. It controls the outer shell, major regions, grids, columns, and responsive structure.

Good:

```css
.l-main-wrapper {
    width: 100%;
    max-width: clamp(320px, 95vw, 900px);
    margin: 0 auto;
}

.l-layout-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);
}

@media (min-width: 48em) {
    .l-layout-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .l-content {
        grid-column: 1 / span 2;
    }

    .l-sidebar {
        grid-column: 3;
    }
}
```

Avoid styling component appearance in `layout.css`.

Bad:

```css
.l-content .c-card {
    background: var(--clr-bg-card);
    border: var(--bw-frame) solid var(--clr-border);
}
```

Layout decides where components go. Components decide how they look.

---

## 8. `utilities.css`

`utilities.css` is for small generic helper classes. A utility should be small, reusable, and not tied to one component.

Good:

```css
.u-flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.u-text-center {
    text-align: center;
}

.u-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

Avoid:

```css
.u-blog-post-title
.u-navbar-pink-border
.u-library-book-cover
```

Those are component-specific, not utilities.

---

## 9. `components/card.css`

`card.css` is the shared component layer. It should contain reusable component primitives and small global components.

Good examples:

```css
.c-card { ... }
.c-card__header { ... }
.c-card__body { ... }

.c-nav-list { ... }
.c-nav-list__link { ... }

.c-site-header { ... }
.c-site-footer { ... }
```

Avoid putting one-component overrides here.

Bad:

```css
.c-card--welcome .c-card__body {
    align-items: center;
}

.c-blog-post__body {
    line-height: 1.72;
}
```

Those belong inside the component that needs them, unless the pattern is truly reusable.

---

## 10. Component-local styles

Astro component styles should contain styles that belong only to that component or page.

Good:

```astro
<style>
    .c-coursework {
        max-width: 48rem;
        line-height: var(--lh-body);
    }

    .c-season-title {
        margin: var(--space-none) var(--space-none) var(--space-sm);
        font-weight: var(--fw-bold);
    }
</style>
```

This works because the component owns `.c-coursework` and `.c-season-title`.

Component-local styles are the best place for internal content spacing, component-only typography, page-specific prose styling, local state styles, component-local CSS variables, and hook-class rules when needed.

---

## 11. Selector prefixes

| Prefix | Meaning | Example |
|---|---|---|
| `l-` | Layout | `.l-layout-grid` |
| `c-` | Component | `.c-card`, `.c-library-book` |
| `u-` | Utility | `.u-sr-only`, `.u-text-center` |
| `p-` | Page-specific | `.p-about-page` |

The prefix should usually tell you where the selector belongs.

---

## 12. Theme strategy

Theme differences should usually be expressed through tokens.

Prefer:

```css
[theme="light"] {
    --clr-bg-page: #ffffff;
    --clr-text-main: #000000;
}
```

Then let components consume those values:

```css
.c-card {
    background: var(--clr-bg-card);
    color: var(--clr-text-main);
}
```

Avoid:

```css
[theme="light"] .c-card {
    background: #ffffff;
    color: #000000;
}
```

Theme-specific component selectors are allowed only when a behavior cannot be represented cleanly as a value.

---

## 13. Decision flow

```text
Is it a reusable value?
  -> tokens.css

Is it raw HTML behavior?
  -> base.css

Is it page structure?
  -> layout.css

Is it a tiny generic helper?
  -> utilities.css

Is it a shared component primitive?
  -> components/card.css

Is it specific to one component/page?
  -> that component/page style block

Does it need to style markup generated by Card.astro?
  -> consider a hook class
```

---

## 14. Architecture checklist

```text
[ ] global.css contains imports only.
[ ] tokens.css contains reusable values and theme values only.
[ ] base.css contains raw HTML behavior only.
[ ] layout.css contains page structure only.
[ ] utilities.css contains generic helpers only.
[ ] card.css contains shared component primitives only.
[ ] Component-specific styles stay in the component.
[ ] No unused selectors remain after markup changes.
[ ] Card.astro classes are not duplicated unnecessarily.
[ ] Hook classes are used only when needed.
[ ] Hardcoded values are replaced only when a matching token already exists.
[ ] Visual behavior was preserved unless the change was intentional.
```
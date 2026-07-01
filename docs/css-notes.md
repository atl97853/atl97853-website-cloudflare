# CSS Notes

Notes for the CSS organization and refactor workflow.

These notes describe what each CSS file is responsible for, what should go in it, what should stay out of it, and how to use it during future refactors.

## General CSS Organization

The CSS is being split by responsibility:

```text
src/styles/
  global.css
  tokens.css
  base.css
  layout.css
  utilities.css
  themes.css
  components/
    card.css
```

### Main Rule

```text
Global CSS should define the system.
Component CSS should define the object.
Page CSS should define the exception.
```

### File Responsibilities

| File | Responsibility |
|---|---|
| `global.css` | Import file only. |
| `tokens.css` | Reusable design values and theme variables. |
| `base.css` | Browser/default element behavior. |
| `layout.css` | Page structure and layout classes. |
| `utilities.css` | Small reusable helper classes. |
| `themes.css` | Temporary theme-specific overrides while refactoring. |
| `components/*.css` | Shared component patterns used in multiple places. |

---

## Design Tokens

**File:** `src/styles/tokens.css`

### Summary

Design tokens are CSS variables for colors, fonts, spacing, sizes, borders, and other values that may change.

This file defines the visual foundation of the site through reusable CSS variables. These variables are shared across base styles, layouts, components, pages, and themes.

### Purpose

The goal of `tokens.css` is to avoid hard-coding repeated visual values directly inside component, layout, or page-specific styles.

Instead of writing fixed values many times, define them once in `tokens.css` and reuse them with `var(...)`.

This makes it easier to change the overall look of the site later without editing many separate selectors.

### What Goes in `tokens.css`

Use this file for reusable visual values such as:

```css
--clr-bg-page
--clr-bg-container
--clr-bg-card
--clr-text-main
--clr-text-muted
--clr-accent
--clr-border

--ff-main

--fs-xs
--fs-sm
--fs-md
--fs-lg

--space-xs
--space-sm
--space-md
--space-lg
--space-xl

--br-sm
--bw-frame
```

Theme-level variable overrides also belong here:

```css
:root {
    --clr-bg-page: #ffffff;
    --clr-text-main: #000000;
    --clr-accent: #0000ee;
}

[theme="dark"] {
    --clr-bg-page: #0a0a0a;
    --clr-text-main: #e0e0e0;
    --clr-accent: #ffffff;
}
```

### What Should Not Go in `tokens.css`

This file should contain values only, not actual styling rules.

Do not add selectors for components, layouts, pages, or HTML elements unless they are used only to define theme variables.

This belongs somewhere else:

```css
[theme="dark"] .c-card {
    background: transparent;
    border: none;
}
```

This kind of rule belongs in a component file, layout file, page-specific file, or temporary theme override file.

### Workflow

When working with `tokens.css`:

1. Add reusable visual values here.
2. Use semantic variable names that describe purpose, not appearance.
3. Reference these variables with `var(...)` in other CSS files or component styles.
4. Change values here when updating the site theme or visual direction.
5. Avoid creating tokens for one-off component details unless the value is reused elsewhere.

### Naming Guidelines

Use semantic names that describe what the value is for.

Good examples:

```css
--clr-bg-page
--clr-text-main
--clr-accent
--ff-main
--space-md
--br-sm
```

Avoid names tied to a specific component or temporary visual style:

```css
--navbar-blue
--footer-gray
--about-page-pink
```

A semantic token makes redesigns easier because the value can change without changing the meaning of the variable.

For example, `--clr-accent` can be blue in one theme, white in another, and pink later.

### Example

Define the token in `tokens.css`:

```css
:root {
    --clr-accent: #0000ee;
}

[theme="dark"] {
    --clr-accent: #ffffff;
}
```

Then use it elsewhere:

```css
a {
    color: var(--clr-accent);
}
```

If the accent color changes later, only the token value needs to change.

---

## Base Styles

**File:** `src/styles/base.css`

### Summary

Base styles define reset rules, `html`, `body`, links, paragraphs, images, forms, and browser/default element behavior.

This file contains the default styling rules for common HTML elements before any layout, component, page, or theme-specific styles are applied.

### Purpose

The goal of `base.css` is to create a clean and predictable foundation for the whole site.

Browsers apply their own default styles to elements like `body`, `ul`, `a`, `p`, `button`, and `img`. Those defaults can vary slightly between browsers and can also create unwanted spacing, colors, or sizing behavior.

The base file resets or standardizes those defaults so the rest of the CSS can be written from a stable starting point.

### What Goes in `base.css`

Use this file for general HTML and browser-level behavior, such as:

```css
*,
*::before,
*::after

html

body

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

a,
a:visited,
a:hover,
a:focus-visible

p

b,
strong

code,
pre
```

General browser preference rules may also go here:

```css
@media (prefers-reduced-motion: reduce)
```

### What Should Not Go in `base.css`

This file should not contain layout, component, page, or theme-specific styling.

Do not add styles for classes like:

```css
.l-main-wrapper
.l-layout-grid
.c-card
.c-site-header
.c-site-footer
.c-nav-list
.c-pfp
.p-about-page
```

Those belong in layout files, component files, page-specific files, or theme override files.

### Workflow

When editing `base.css`:

1. Add rules only when they affect common HTML elements or default browser behavior.
2. Use design tokens from `tokens.css` instead of hard-coded values.
3. Keep the styles broad and reusable.
4. Avoid adding styles that only make sense for one component or one page.
5. Do not use this file to solve component-specific spacing or visual problems.

### Example

Good use of `base.css`:

```css
body {
    min-height: 100vh;
    background-color: var(--clr-bg-page);
    color: var(--clr-text-main);
    font-family: var(--ff-main);
    line-height: 1.45;
}

a {
    color: var(--clr-accent);
    text-decoration: underline;
}

img,
picture,
svg,
canvas {
    display: block;
    max-width: 100%;
}
```

These rules apply broadly across the whole site.

Bad use of `base.css`:

```css
.c-card {
    margin-bottom: var(--space-lg);
}

.c-nav-list__link {
    display: block;
}

.p-about-page {
    padding: var(--space-lg);
}
```

These are not base styles. They belong to components, layout, or page-specific CSS.

### Relationship With `tokens.css`

`base.css` should use variables from `tokens.css`.

Instead of writing:

```css
body {
    color: #000000;
}
```

write:

```css
body {
    color: var(--clr-text-main);
}
```

This keeps base styles flexible. When the theme changes, the value in `tokens.css` changes, and `base.css` automatically follows.

### Current Responsibility

At this stage of the CSS refactor, `base.css` owns the reset and browser/default element behavior that was previously inside `global.css`.

The `global.css` file should import it like this:

```css
@import "./tokens.css";
@import "./base.css";
```

Layout, utilities, components, and theme-specific rules can be moved into their own files in later refactor steps.
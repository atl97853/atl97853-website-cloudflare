# CSS Notes

## Design Tokens

**File:** `src/styles/tokens.css`
---
Summary: 
 * Design tokens
 * CSS variables: colors, fonts, spacing, sizes, borders.
 * Values that may change.
 
 * This file stores the reusable CSS variables that define the visual foundation of the site: colors, fonts, font sizes, spacing, borders, border radius, and other values shared across pages and components.
 
 * Keep theme-level values here instead of hard-coding them inside component or layout styles. This makes it easier to change the overall look of the site later without editing many separate selectors.
 
 * Use this file for values, not for actual styling rules.
 * Example: define --clr-accent here, then use var(--clr-accent) in base.css, layout.css, component styles, or page-specific styles.
---
Design tokens are CSS variables used to define the visual foundation of the site.

They include values such as:

- colors
- fonts
- font sizes
- spacing
- borders
- border radius

These are values that may change when the visual style, theme, or design direction of the site changes.

## Purpose

The `tokens.css` file stores reusable CSS variables shared across:

- base styles
- layouts
- components
- pages
- themes

The goal is to avoid hard-coding repeated visual values directly inside component, layout, or page-specific styles.

Instead of writing fixed values many times, define them once in `tokens.css` and reuse them with `var(...)`.

## Workflow

When working with design tokens:

1. Add reusable visual values to `tokens.css`.
2. Use semantic variable names that describe purpose, not appearance.
3. Reference these variables with `var(...)` in other CSS files or component styles.
4. Change values in `tokens.css` when updating the site theme or visual direction.

## What Goes in `tokens.css`

Use this file for reusable values such as:

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

## Naming Guidelines

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

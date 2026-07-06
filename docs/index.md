# Documentation Index

## Reading order

1. **`css-architecture.md`** — CSS layers, file responsibilities, selector prefixes, theme strategy, and where new rules should go.
2. **`reusable-components.md`** — how `Card.astro`, `LinkList.astro`, and `components/card.css` interact with other components.
3. **`hook-classes.md`** — what hook classes are, why `:global()` is sometimes needed, and when a hook should or should not be used.
4. **`css-refactor-workflow.md`** — practical checklist for removing unused classes, removing unnecessary Card overrides, and replacing hardcoded values with existing tokens.

## Current mental model

```text
tokens.css
  Defines reusable values and theme values.

base.css
  Defines raw HTML and browser/default element behavior.

layout.css
  Defines page structure, wrappers, grids, columns, and major regions.

utilities.css
  Defines small generic helpers.

components/card.css
  Defines shared component primitives and small global components.

Component.astro styles
  Define component-specific content styles and carefully scoped overrides.

global.css
  Imports the CSS system only.
```

## Related documents

- [`css-architecture.md`](./css-architecture.md)
- [`reusable-components.md`](./reusable-components.md)
- [`hook-classes.md`](./hook-classes.md)
- [`css-refactor-workflow.md`](./css-refactor-workflow.md)
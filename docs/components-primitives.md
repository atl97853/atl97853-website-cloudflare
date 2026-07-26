# `Panel.astro`

`Panel.astro` is a polymorphic primitive component that provides the shared structure and visual appearance used by panel-like feature components.

It standardizes:

* The outer panel container
* The border, background, radius, shadow, and padding
* An optional `h1` or `h2` title
* The accessible relationship between the panel and its title
* The forwarding of standard HTML attributes
* A default slot for feature-specific content

Feature components remain responsible for their own content, data, behavior, internal markup, and specialized styles.

---

## Basic usage

```astro
---
import Panel from "../components/primitives/Panel.astro";
---

<Panel
    as="section"
    title="Update log"
    titleID="update-log-title"
>
    <p>Panel content</p>
</Panel>
```

The approximate rendered HTML is:

```html
<section
    class="c-panel"
    aria-labelledby="update-log-title"
>
    <h2
        id="update-log-title"
        class="c-panel__heading"
    >
        Update log
    </h2>

    <p>Panel content</p>
</section>
```

---

## Example with a page title

Use `headingLevel="h1"` when the panel contains the main title of the page.

```astro
<Panel
    as="section"
    title="Welcome to my site!"
    titleID="home-title"
    headingLevel="h1"
    class="intro-panel"
>
    <p>Introduction content</p>
</Panel>
```

The approximate rendered HTML is:

```html
<section
    class="c-panel intro-panel"
    aria-labelledby="home-title"
>
    <h1
        id="home-title"
        class="c-panel__heading"
    >
        Welcome to my site!
    </h1>

    <p>Introduction content</p>
</section>
```

---

# Responsibilities

## What `Panel.astro` owns

`Panel.astro` is responsible for:

* Selecting the semantic root element
* Applying the permanent `c-panel` class
* Applying the shared panel appearance
* Rendering an optional title
* Selecting whether the title uses `h1` or `h2`
* Connecting the panel to its title with `aria-labelledby`
* Forwarding standard HTML attributes
* Providing a slot for feature-owned content

## What feature components own

Feature components are responsible for:

* Data
* Content
* Internal markup
* Feature-specific CSS
* Interactive behavior
* Scripts
* Responsive content layouts
* Content passed through the default slot

For example:

```astro
<Panel
    as="section"
    title="Currently"
    titleID="currently-title"
    class="currently-panel"
>
    <p class="currently-summary">
        Studying slowly and writing notes.
    </p>

    <dl>
        <!-- Feature-specific content -->
    </dl>
</Panel>
```

In this example:

* `Panel.astro` owns the outer `<section>` and its title.
* The feature component owns the paragraph and description list.

---

# Component API

## `as`

Selects the semantic HTML element used as the panel root.

```astro
<Panel as="section" />
<Panel as="article" />
<Panel as="aside" />
<Panel as="nav" />
<Panel as="div" />
```

Supported values:

| Value     | Typical use                                        |
| --------- | -------------------------------------------------- |
| `section` | A named section of a page                          |
| `article` | Independent or reusable content                    |
| `aside`   | Supplementary content                              |
| `nav`     | A navigation region                                |
| `div`     | A container with no more specific semantic element |

The `as` prop is required.

---

## `title`

Provides optional visible title text.

```astro
<Panel
    as="section"
    title="Update log"
>
    ...
</Panel>
```

The title is rendered using the element selected through `headingLevel`.

When `title` is omitted, no title element is rendered:

```astro
<Panel
    as="aside"
    aria-label="Website notice"
>
    <p>The website is currently being reorganized.</p>
</Panel>
```

---

## `titleID`

Assigns an `id` to the generated title element.

```astro
<Panel
    as="section"
    title="Update log"
    titleID="update-log-title"
>
    ...
</Panel>
```

When both `title` and `titleID` are present, the component automatically uses `titleID` as the panel’s `aria-labelledby` value.

The result is approximately:

```html
<section aria-labelledby="update-log-title">
    <h2 id="update-log-title">
        Update log
    </h2>
</section>
```

This creates an accessible relationship between the panel and its title.

The value of `titleID` should be unique within the page.

---

## `headingLevel`

Selects the HTML heading element used to render the title.

Supported values:

```ts
"h1" | "h2"
```

The default value is:

```ts
"h2"
```

Use `h1` when the title represents the main subject of the page:

```astro
<Panel
    as="section"
    title="Welcome to my site!"
    titleID="home-title"
    headingLevel="h1"
>
    ...
</Panel>
```

Use `h2` when the title introduces a section of the page:

```astro
<Panel
    as="section"
    title="Update log"
    titleID="update-log-title"
>
    ...
</Panel>
```

The heading level should be selected according to the document structure, not according to the desired visual size.

---

## `class`

Adds a feature-specific class to the panel root.

```astro
<Panel
    as="section"
    class="currently-panel"
>
    ...
</Panel>
```

The feature class is combined with the primitive’s permanent class:

```html
<section class="c-panel currently-panel">
```

The `c-panel` class provides the shared primitive styles.

The `currently-panel` class provides feature-specific customization.

---

## Standard HTML attributes

The component forwards attributes that are not consumed as component-specific props.

Examples include:

* `id`
* `aria-label`
* `aria-labelledby`
* `data-*`
* Other attributes supported by the selected root element

```astro
<Panel
    as="section"
    id="recent-images"
    data-layout="masonry"
    aria-label="Recent image gallery"
>
    ...
</Panel>
```

The approximate output is:

```html
<section
    id="recent-images"
    class="c-panel"
    data-layout="masonry"
    aria-label="Recent image gallery"
>
    ...
</section>
```

---

# Props definition

The component defines its custom props inside the `Polymorphic` type:

```ts
type Props<Tag extends PanelTag> = Polymorphic<{
    as: Tag;
    title?: string;
    titleID?: string;
    headingLevel?: HeadingTag;
}>;
```

The props have the following responsibilities:

```text
as             selects the panel root element
title          provides the visible title text
titleID        assigns an ID to the title
headingLevel   selects h1 or h2
```

---

# Prop destructuring

The component extracts its props from `Astro.props`:

```ts
const {
    as: Tag,
    title,
    titleID,
    headingLevel: Heading = "h2",
    class: parentClass,
    "aria-labelledby": ariaLabelledBy,
    ...attributes
} = Astro.props;
```

## `as: Tag`

```ts
as: Tag
```

Reads the `as` prop and stores its value in a local variable named `Tag`.

Given:

```astro
<Panel as="section" />
```

The local value is:

```ts
Tag = "section";
```

`<Tag>` then renders as a real `<section>`.

---

## `title`

```ts
title
```

Contains the optional visible title passed to the component.

Given:

```astro
<Panel title="Update log" />
```

The local value is:

```ts
title = "Update log";
```

---

## `titleID`

```ts
titleID
```

Contains the optional ID assigned to the generated title element.

Given:

```astro
<Panel titleID="update-log-title" />
```

The local value is:

```ts
titleID = "update-log-title";
```

---

## `headingLevel: Heading = "h2"`

```ts
headingLevel: Heading = "h2"
```

Reads the `headingLevel` prop and stores it in a local variable named `Heading`.

When no value is supplied, it defaults to `"h2"`.

Given:

```astro
<Panel headingLevel="h1" />
```

The local value is:

```ts
Heading = "h1";
```

Given no `headingLevel`:

```astro
<Panel as="section" />
```

the local value is:

```ts
Heading = "h2";
```

The value can then be used as a dynamic heading element:

```astro
<Heading>{title}</Heading>
```

---

## `class: parentClass`

```ts
class: parentClass
```

Reads the `class` prop and stores its value in a local variable named `parentClass`.

Given:

```astro
<Panel class="currently-panel" />
```

the local value is:

```ts
parentClass = "currently-panel";
```

---

## `"aria-labelledby": ariaLabelledBy`

```ts
"aria-labelledby": ariaLabelledBy
```

Reads an explicitly supplied `aria-labelledby` attribute and stores it in a local variable named `ariaLabelledBy`.

Given:

```astro
<Panel aria-labelledby="external-title" />
```

the local value is:

```ts
ariaLabelledBy = "external-title";
```

An explicitly supplied value takes precedence over the value inferred from `titleID`.

---

## `...attributes`

```ts
...attributes
```

Collects all remaining HTML attributes that were not already extracted.

Given:

```astro
<Panel
    as="section"
    id="intro"
    data-layout="wide"
/>
```

`attributes` contains approximately:

```ts
{
    id: "intro",
    "data-layout": "wide",
}
```

These attributes are forwarded to the rendered root element.

---

# Accessible title relationship

The component determines the value of `aria-labelledby` with:

```ts
const labelledBy =
    ariaLabelledBy ?? (title && titleID ? titleID : undefined);
```

The logic works as follows:

1. Use an explicit `aria-labelledby` value when one was supplied.
2. Otherwise, use `titleID` when both `title` and `titleID` exist.
3. Otherwise, do not add `aria-labelledby`.

## Automatically inferred value

```astro
<Panel
    as="section"
    title="Update log"
    titleID="update-log-title"
>
    ...
</Panel>
```

The resulting relationship is:

```html
<section aria-labelledby="update-log-title">
    <h2 id="update-log-title">
        Update log
    </h2>
</section>
```

## Explicit value

```astro
<Panel
    as="section"
    title="Recent activity"
    titleID="visible-title"
    aria-labelledby="external-title"
>
    ...
</Panel>
```

Because the explicit attribute takes precedence, the resulting root uses:

```html
<section aria-labelledby="external-title">
```

---

# Rendering the title

The title is rendered only when the `title` prop contains a value:

```astro
{
    title && (
        <Heading
            id={titleID}
            class="c-panel__heading"
        >
            {title}
        </Heading>
    )
}
```

When:

```ts
title = "Update log";
Heading = "h2";
titleID = "update-log-title";
```

Astro renders:

```html
<h2
    id="update-log-title"
    class="c-panel__heading"
>
    Update log
</h2>
```

When `title` is undefined, no heading element is rendered.

---

# CSS customization

The panel exposes CSS custom properties for controlled customization.

## `--panel-padding`

Overrides the default panel padding.

The default value is:

```css
var(--space-md)
```

Example:

```astro
<Panel
    as="section"
    class="currently-panel"
>
    ...
</Panel>

<style>
    .currently-panel {
        --panel-padding: 0;
    }
</style>
```

This is useful when the feature’s internal sections provide their own padding.

---

## `--panel-overflow`

Overrides the default overflow behavior.

The default value is:

```css
hidden
```

Example:

```astro
<Panel
    as="section"
    class="dialog-panel"
>
    ...
</Panel>

<style>
    .dialog-panel {
        --panel-overflow: visible;
    }
</style>
```

---

# Astro concepts used

## Polymorphic components

A polymorphic component can render as different HTML elements through an `as` prop.

```astro
<Panel as="section" />
<Panel as="article" />
<Panel as="nav" />
```

The component uses Astro’s `Polymorphic` type:

```ts
import type { Polymorphic } from "astro/types";
```

This combines the component’s custom props with the valid HTML attributes for the element selected through `as`.

Official documentation:

[Astro: Polymorphic component types](https://docs.astro.build/en/guides/typescript/#polymorphic-type)

---

## Dynamic tags

The `as` prop is renamed to `Tag`:

```ts
as: Tag
```

The renamed value is used as a dynamic HTML element:

```astro
<Tag>
    <slot />
</Tag>
```

Given:

```astro
<Panel as="section">
    ...
</Panel>
```

Astro renders:

```html
<section>
    ...
</section>
```

---

## Passing a class to a child component

A feature component passes a custom class to `Panel.astro`:

```astro
<Panel
    as="section"
    class="currently-panel"
>
    ...
</Panel>
```

The child component receives the class explicitly:

```ts
class: parentClass
```

It then applies the class to the rendered root element.

Official documentation:

[Astro: Passing a class to a child component](https://docs.astro.build/en/guides/styling/#passing-a-class-to-a-child-component)

---

## Combining classes with `class:list`

The component combines its permanent class with the optional feature class:

```astro
<Tag class:list={["c-panel", parentClass]}>
```

Given:

```astro
<Panel class="currently-panel" />
```

Astro renders:

```html
class="c-panel currently-panel"
```

When no custom class is provided, `parentClass` is undefined and Astro renders:

```html
class="c-panel"
```

Official documentation:

[Astro: `class:list` directive](https://docs.astro.build/en/reference/directives-reference/#classlist)

---

## Attribute forwarding

Remaining HTML attributes are forwarded through:

```astro
<Tag {...attributes}>
```

Given:

```astro
<Panel
    as="section"
    id="intro"
    data-layout="wide"
/>
```

Astro renders approximately:

```html
<section
    id="intro"
    data-layout="wide"
>
```

---

## Slots

The default `<slot />` marks where feature-owned content is rendered.

```astro
<Panel as="section">
    <p>Panel content</p>
</Panel>
```

The paragraph is rendered inside the panel:

```html
<section class="c-panel">
    <p>Panel content</p>
</section>
```

Official documentation:

[Astro: Slots](https://docs.astro.build/en/basics/astro-components/#slots)

---

## Scoped CSS

Styles inside `Panel.astro` are scoped by Astro.

They apply to elements created by the primitive without leaking into unrelated components.

Official documentation:

[Astro: Scoped styles](https://docs.astro.build/en/guides/styling/#scoped-styles)

---

# Recommended usage patterns

## Introduction panel

```astro
<Panel
    as="section"
    title="Welcome to my site!"
    titleID="home-title"
    headingLevel="h1"
    class="intro-panel"
>
    <div class="intro-content">
        <img
            src="/images/avatar.jpg"
            alt="Atl's avatar"
            width="100"
            height="100"
        />

        <p>
            Hello there! I’m Atl, and this is my digital garden.
        </p>
    </div>
</Panel>
```

---

## Update log

```astro
<Panel
    as="section"
    title="Update log"
    titleID="update-log-title"
    class="update-log"
>
    <ol class="log-list">
        <li>
            <time datetime="2026-07-13">13.07.26</time>
            Refactored the panel primitive.
        </li>
    </ol>
</Panel>
```

---

## Navigation panel

```astro
<Panel
    as="nav"
    title="Navigation"
    titleID="navigation-title"
    class="site-navigation"
>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about/">About</a></li>
        <li><a href="/posts/">Posts</a></li>
    </ul>
</Panel>
```

---

## Panel without a title

```astro
<Panel
    as="aside"
    aria-label="Website notice"
>
    <p>
        The website is currently being reorganized.
    </p>
</Panel>
```

---

# Design boundaries

`Panel.astro` should remain focused on shared panel behavior.

Do not add props for feature-specific concepts such as:

```text
isNavigation
isGallery
isProfile
isCurrently
onlineStatus
musicPlayer
```

Add a new prop or CSS custom property only when:

* Multiple feature components require the same capability
* The capability belongs to the shared panel contract
* It cannot be represented cleanly through slotted content
* It does not make the primitive aware of a particular feature

The primitive should remain small enough that its purpose can be described as:

> Render a semantic, accessible, and consistently styled panel shell for feature-owned content.

---

# Official Astro documentation

* [Astro components](https://docs.astro.build/en/basics/astro-components/)
* [Component props](https://docs.astro.build/en/basics/astro-components/#component-props)
* [Slots](https://docs.astro.build/en/basics/astro-components/#slots)
* [Polymorphic component types](https://docs.astro.build/en/guides/typescript/#polymorphic-type)
* [Scoped styles](https://docs.astro.build/en/guides/styling/#scoped-styles)
* [Passing a class to a child component](https://docs.astro.build/en/guides/styling/#passing-a-class-to-a-child-component)
* [`class:list` directive](https://docs.astro.build/en/reference/directives-reference/#classlist)
* [CSS variables](https://docs.astro.build/en/guides/styling/#css-variables)

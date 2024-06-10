---
title: Writing components in Astro with Tailwind & variants
preface: Learn how to write clean and reusable componets with Astro, Tailwind & tailwind-variants
tags: ["astro", "tailwind"]
date: 2024-06-10
---

# Writing components in Astro with Tailwind & variants

When writing components for your project using any given library/framework (React, Vue, Svelte, Solid), you will most likely be finding yourself battling handling props. Let's take a look at an example using [Astro](https://astro.build).

```astro
---
interface Props {
    text: string;
}

const { text } = Astro.props;
---

<button class="rounded-md bg-blue-500 px-4 py-2 text-white">
    {text}
</button>
```

_💡 You could use `<slot/>` instead of a prop too_

With the above, we have a nice reusable button component, that can be used as such:

```astro
<Button text="Click me" />
```

## The prop problem

The term "reusable" here is a bit loose, because the component is actually not truly reusable. For instance we have left no room to change the type of the button, as the props are explicitly passed. This is not the case for some libraries such as Vue, as it has what is called [fallthrough attributes](https://vuejs.org/guide/components/attrs). This is however very specific for Vue, whereas other libraries are more explicit and doesn't let attributes fall through by default. So you have to pass them explicitly:

```astro
---
interface Props {
    text: string;
    type: string;
}

const { text } = Astro.props;
---

<button
    class="rounded-md bg-blue-500 px-4 py-2 text-white"
    type={type}
>
    {text}
</button>
```

The above however is not very useful, as we've now allowed _any_ string to be passed as a type. This is not the case for buttons that only allow 3 types:

-   submit (the default)
-   button
-   reset

We can "fix" this by being more strict in our props interface:

```astro
---
interface Props {
    text: string;
    type: "submit" | "button" | "reset";
}

const { text } = Astro.props;
---

<button
    class="rounded-md bg-blue-500 px-4 py-2 text-white"
    type={type}
>
    {text}
</button>
```

Now our button allows for us to change the type, while only allowing the 3 valid types. Great! Or is it?

You might be thinking to yourself that the problem is solved, you might also have spotted where this is going. Let's look closer. What about other attributes that a button can have, such as `disabled`?

You might be thinking to yourself, well let's just add the prop to the interface and pass it to the component! While this is a solution, it's not a very good one, as we would be writing our interface from scratch for every component that extends upon base HTML tags, which would be the case 99.9% of the time. There has to be a better way, right? Luckily there is.

## Props: The smart way

When working with [Astro](https://astro.build), there is a type exported from `astro/types` called `HTMLAttributes`. This is a [generic type](https://www.typescriptlang.org/docs/handbook/2/generics.html), that allows us to fetch the default types for certain HTML elements. We can use this as an extension to our own props interface:

```astro
---
import type { HTMLAttributes } from "astro/types";

interface Props extends HTMLAttributes<"button"> {
    text: string;
}

const { text } = Astro.props;
---

<button class="rounded-md bg-blue-500 px-4 py-2 text-white">
    {text}
</button>
```

Since we are now extending upon the base `button` HTML element, we need to spread the props to our component. This can be done via spreading the `attrs`:

```astro
---
import type { HTMLAttributes } from "astro/types";

interface Props extends HTMLAttributes<"button"> {
    text: string;
}

const { text, ...attrs } = Astro.props;
---

<button
    class="rounded-md bg-blue-500 px-4 py-2 text-white"
    {...attrs}
>
    {text}
</button>
```

And just like that, we now have a truly reusable component, that allows us to pass any of the base `button` attributes:

```astro
<Button
    text="Click me"
    type="button"
    disabled
/>
```

## Going further with styles and variants

When creating components, we often refer to a term called `variants`. Variants are a way of switching the intent of the button, it looks like this:

```astro
<Button text="Click me" />
<Button
    text="Click me"
    variant="secondary"
/>
<Button
    text="Click me"
    variant="ghost"
/>
```

As you can see, we have our primary button, a secondary and one referred to as "ghost". Ghost is essentially a primary button, but with a transparent background and maybe some slight changes in colors.

There are several ways to handle this. In [Astro](https://astro.build) we can use `class:list` - there's options such as [CVA (Class Variance Authority)](https://cva.style/docs) combined with [tailwind-merge](https://github.com/dcastil/tailwind-merge) if you're using Tailwind. This stategy is used in the popular React UI library: [shadcn/ui](https://ui.shadcn.com/).

However, there's a single package that covers all of this and more that I would like to bring some attention to: [Tailwind Variants](https://www.tailwind-variants.org/).

## Composing components with variants

To get started, we first need to install tailwind-variants:

```bash
npm install tailwind-variants
```

_💡 You can use any other package manger that supports NPM_

Let's start by moving our base styles to the variants package according to the [documentation](https://www.tailwind-variants.org/docs/getting-started):

```astro
---
import type { HTMLAttributes } from "astro/types";
import { tv } from "tailwind-variants";

interface Props extends HTMLAttributes<"button"> {
    text: string;
}

const styles = tv({
    base: "bg-blue-500 px-4 py-2 text-white rounded-md",
});

const { text, ...attrs } = Astro.props;
---

<button
    class={styles()}
    {...attrs}
>
    {text}
</button>
```

Now we successfully are utilizing the package to apply our styles, but what about the variants we discussed earlier? Let's add them to our `tv` function:

```astro
---
const styles = tv({
    base: "bg-blue-500 px-4 py-2 text-white rounded-md",
    variants: {
        variant: {
            secondary: "bg-orange-500",
            ghost: "bg-transparent border",
        },
    },
});
---
```

Next, in order to actually apply these variants we will need to pass the props in to our `styles()` call on the component. Here we will again need to leverage extending interfaces using the `VariantProps` type from the library.

```astro
---
import type { HTMLAttributes } from "astro/types";
import { tv, type VariantProps } from "tailwind-variants";

interface Props extends HTMLAttributes<"button">, VariantProps<typeof styles> {
    text: string;
}

const styles = tv({
    base: "bg-blue-500 px-4 py-2 text-white rounded-md",
    variants: {
        variant: {
            secondary: "bg-orange-500",
            ghost: "bg-transparent border",
        },
    },
});

const { text, variant, ...attrs } = Astro.props;
---

<button
    class={styles({ variant })}
    {...attrs}
>
    {text}
</button>
```

Now our component is extending the `VariantProps` type, that will inherit give us the props from our variants definition on our `tv` function. This utility is really helps us writing typesafe and reusable components with Tailwind CSS.

## Overriding our variants

Before wrapping up, let's add one last thing that I believe every component should offer: the ability to override any pre-defined styles. Our variants library allows us to pass a `class` prop to the function that applies our style, but since `class` often is a reserved word, we need to alias it. Luckily our chosen variants library has us covered yet again, as it supports both `class` and `className` to be passed, so we can alias our class to `className`.

_💡 Another great thing about this library, is that it comes with tailwind-merge out of the box._

```astro
---
import type { HTMLAttributes } from "astro/types";
import { tv, type VariantProps } from "tailwind-variants";

interface Props extends HTMLAttributes<"button">, VariantProps<typeof styles> {
    text: string;
}

const styles = tv({
    base: "bg-blue-500 px-4 py-2 text-white rounded-md",
    variants: {
        variant: {
            secondary: "bg-orange-500",
            ghost: "bg-transparent border",
        },
    },
});

const { text, variant, class: className, ...attrs } = Astro.props;
---

<button
    class={styles({ variant, className })}
    {...attrs}
>
    {text}
</button>
```

And that should be it.

## Wrapping up

Congratulations, you've now written a proper resuable component that allows for variants and overriding styles!

```astro
<!-- Using our "primary" button with a defined type -->
<Button type="button" />

<!-- Applying our variant -->
<Button
    type="button"
    variant="secondary"
/>

<!-- Applying our variant, and overriding the style -->
<Button
    type="button"
    variant="ghost"
    class="font-semibold italic"
/>
```

I highly encourage that you read through the documentation of the [Tailwind Variants library](https://www.tailwind-variants.org/), as it offers way more features than what was covered here.

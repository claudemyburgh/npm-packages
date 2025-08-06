# Alpine Headroom Plugin

A lightweight Alpine.js directive that toggles CSS classes based on scroll position, powered by Tailwind CSS v4 only, it handles pinned, unpinned, top, bottom, frozen states with custom options for offset and tolerance

[![npm version](https://badge.fury.io/js/@designbycode%2Falpine-headroom.svg)](https://badge.fury.io/js/@designbycode%2Falpine-headroom)
![npm](https://img.shields.io/npm/dt/%40designbycode/alpine-headroom)
![NPM](https://img.shields.io/npm/l/%40designbycode%2Falpine-headroom)
![npm bundle size](https://img.shields.io/bundlephobia/min/%40designbycode%2Falpine-headroom)
![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)
[![GitHub stars](https://img.shields.io/github/stars/DesignByCode/alpine-headroom?style=social)](https://github.com/DesignByCode/alpine-headroom/stargazers)

## Features

* Easy setup with Alpine.js directive
* Customizable options for offset, tolerance, classes
* Supports Tailwind CSS v4 classes only
* Performance optimised with requestAnimationFrame, passive event listeners
* Optional `frozen` modifier for static state

## Installation

Install via npm or bun in your JavaScript project root directory:

```bash
npm install @designbycode/alpine-headroom
# or
bun add @designbycode/alpine-headroom
```

> Ensure you use Tailwind CSS v4 only in your build config

## Usage

Import and register the plugin in your entry point (eg `main.js`):

```js
import Alpine from "alpinejs"
import Headroom from "@designbycode/alpine-headroom"

Alpine.plugin(Headroom)
Alpine.start()
```

### HTML Markup

Add the `x-headroom` directive to any element:

```html
<header x-data x-headroom="{ offset: 50, tolerance: 10, classes: { pinned: 'bg-white shadow', unpinned: 'opacity-75', frozen: 'bg-gray-500' } }">
  <!-- header content -->
</header>
```

* `offset` (number) minimum scroll Y before toggling pinned/unpinned
* `tolerance` (number) scroll delta threshold to ignore small moves
* `classes` (object) override default Tailwind CSS v4 class names

Use modifiers in the directive to apply `frozen` state at init:

```html
<nav x-data x-headroom.frozen="">
  <!-- nav content -->
</nav>
```

## Options

Default options are:

```js
{
  offset: 0,
  tolerance: 0,
  classes: {
    initial: "headroom",
    pinned: "headroom--pinned",
    unpinned: "headroom--unpinned",
    top: "headroom--top",
    notTop: "headroom--not-top",
    bottom: "headroom--bottom",
    notBottom: "headroom--not-bottom",
    frozen: "headroom--frozen"
  }
}
```

Override any of these by passing an object to `x-headroom="..."` expression, customising only what you need, classes supports multiple Tailwind utility classes separated by spaces

## Code Example

```ts
// headroom.ts
import Alpine from "alpinejs"
import Headroom from "@designbycode/alpine-headroom"

Alpine.plugin(Headroom)
Alpine.start()
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alpine Headroom Demo</title>
  <link href="/dist/output.css" rel="stylesheet">
</head>
<body>
  <header x-data x-headroom.x="{ offset: 100, tolerance: 20 }" class="fixed top-0 w-full p-4 transition-all duration-300">
    <h1 class="text-xl font-bold">My Site</h1>
  </header>
  <main class="mt-20 p-4">
    <p>Scroll down to see header hide, scroll up to show</p>
    <!-- more content -->
  </main>
  <script src="/dist/main.js"></script>
</body>
</html>
```

## Contributing

1, fork the repo
2, install dependencies
3, make your changes
4, open a pull request

Please follow best practises, use Tailwind CSS v4 only, write clean code

## License

MIT

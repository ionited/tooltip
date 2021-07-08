# Tooltip

> A simple and lightweight tooltip library 

A library under 4KB to display informative texts as known as tooltips.

## Quick start

Choose your favorite option below:

### Install with NPM

```
npm i @ionited/tooltip
```

### Get from UNPKG

[https://unpkg.com/@ionited/tooltip@latest/dist/tooltip.js](https://unpkg.com/@ionited/tooltip@latest/dist/tooltip.js)

---

## Usage

To basic usage you can simply call:

```js
Tooltip(document.querySelector('button')); // Defaults to get title attribute content
```

### Options

```ts
Tooltip(el: HTMLElement, options?: TooltipOptions): TooltipCore

interface TooltipOptions {
  content?: string;
  contentAttr: string = 'title';
}

interface TooltipCore {
  destroy(): void;
  hide(): void;
  show(): void;
  update(): void;
}
```

## License

Copyright (c) 2021 Ion. Licensed under [Mit License](LICENSE).

# vue-sting

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

# StWidget

Embed the messaging app as a widget:

1. Include stwidget.js.
```
<script src="/stwidget.js"></script>
```

2. Example of usage:
```
<template>
    <button @click="toggleWidget()"> Toggle Widget</button>
    <div ref="widget" hidden></div>
</template>
<script setup>
const widget = ref();

function initWidget() {
    //Let widget use keychain.
    StWidget.enableKeychainPassthrough();
    
    //specify the url of the widget
    var stwidget = new StWidget('https://sting-message-frontend.pages.dev/home');
    var element = stwidget.createElement()
    stwidget.setStyle({ top: '51px', right: '32px' }); //add custom styles

    var e = widget.value;
    e.appendChild(element);
}
var init = true;
function toggleWidget() {
    if(init) { init = false; initWidget(); }
    var e = widget.value;
    if(e) e.hidden = !e.hidden;
}
</script>
```














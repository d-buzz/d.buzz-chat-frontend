# vue-sting

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn run start --host
```

### Compile and Minify for Production

```sh
yarn run build
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
    //specify the url of the widget
    var stwidget = new StWidget('https://chat.peakd.com/t/hive-163399/0');
    //if you would like to not let widget to use keychain passthrough, you can disable it with:
    //stwidget.enableKeychainPassthrough = false;

    var element = stwidget.createElement();
    stwidget.setStyle({ direction: 'rtl', top: '51px', right: '32px' }); //add custom styles
    //add direction: 'rtl' if you would like the widget to be expandable by dragging the 
    //bottom-left corner instead of bottom-right corner

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

Check out the examples folder for examples of embedding and overlaying the widget in javascript and vue.













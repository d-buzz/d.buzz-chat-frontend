<template>
    <p>Widget Overlay example <button @click="toggleWidget()"> Click to hide/show widget</button></p>
    <div ref="widget" hidden></div>
    <p>You can further customize by tweaking properties. Check out the 
        <a href="https://chat.peakd.com/widgettest">property editor</a>, send feedback and 
        feature requests in the chat window above or 
        <a href="https://chat.peakd.com/t/hive-163399/0">open in new window.</a></p>
</template>
<script setup>
const widget = ref();

function initWidget() {
    //specify the url of the widget
    var stwidget = new StWidget('https://chat.peakd.com/t/hive-163399/0');
    stwidget.properties = { "requireLogin": false, "sidebar": 2};    
    //if you would like to not let widget to use keychain passthrough, you can disable it with:
    //stwidget.enableKeychainPassthrough = false;

    var element = stwidget.createElement('450px', '556px', true/*overlay*/, true /*resizable*/);
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

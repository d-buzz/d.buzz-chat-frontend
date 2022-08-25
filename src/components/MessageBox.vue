<template>
    <div 
      class="shadow appearance-none border border-gray-700 rounded-xl w-[calc(100%-4rem)] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      ref="box"
      @keydown.enter.exact.prevent="enterMessage"
      role="textbox"
      contenteditable>
    </div>
</template>
<script setup type="ts">
const box = ref(null);
const emit = defineEmits(["entermessage"]);
function focus() {
    box.value.focus();
}
function setText(text) {
    box.value.innerText = text;
    setCaretAtEnd(box.value);
}
function enterMessage(e) {
    emit("entermessage", e.target.innerText);
}
function setCaretAtEnd(element) {
    var range,selection;
    if(document.createRange) {
        range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    else if(document.selection) { 
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.collapse(false);
        range.select();
    }
}
defineExpose({
    setText,
    focus
});
</script>
<style scoped>

</style>

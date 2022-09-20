<template>
    <div>
        <div v-if="images.length > 0" class="p-1 flex gap-x-1">
            <span v-for="image in images" >
                <span>      
                    <img :src="image" class="imgBorder">
                </span>
            </span>
        </div>
        <div class="flex">
            <div 
              class="shadow appearance-none border border-gray-700 rounded-xl w-[calc(100%-1rem)] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-1"
              ref="box"
              @keydown.enter.exact.prevent="enterMessage"
              role="textbox"
              contenteditable>
            </div>
            <span class="cursor-pointer oi oi-image" style="font-size: 1.125rem;" title="add image"></span>
        </div>
    </div>
</template>
<script setup type="ts">
const box = ref(null);
const images = ref([]);
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
.imgBorder {
    display: inline-block;
    border: 1px solid #aaa;
    background-color: #e0e0e0;
    padding: 3px;
}
</style>

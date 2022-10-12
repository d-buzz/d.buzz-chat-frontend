<template>
    <div>
        <TransitionRoot :show="showAddImageModal">
            <AddImageModal @oninput="addImage" @close="toggleAddImageModal"></AddImageModal>
        </TransitionRoot>
        <div v-if="images.length > 0" class="p-1 flex gap-x-1">
            <span v-for="(image,i) in images" class="imgPreview">
                <span class="oi oi-x closeButton" @click="delImage(i)"></span>
                <img :src="image" class="imgBorder">
            </span>
        </div>
        <div class="flex">
            <div tex
              class="fg70 shadow appearance-none border border-gray-700 rounded-xl w-[calc(100%-1rem)] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mr-1"
              ref="box"
              @keydown.enter.exact.prevent="enterMessage"
              role="textbox"
              contenteditable>
            </div>
            <span class="cursor-pointer oi oi-image" style="font-size: 1.125rem;"
                @click="toggleAddImageModal()" title="add image"></span>
        </div>
    </div>
</template>
<script setup type="ts">
const box = ref(null);
const images = ref([]);
const emit = defineEmits(["entermessage"]);
const showAddImageModal = ref(false);
function toggleAddImageModal() {
    showAddImageModal.value = !showAddImageModal.value;
}
function addImage(link) {
    images.value.push(link);
}
function delImage(i) {
    if(i >= 0 && i < images.value.length)
        images.value.splice(i, 1);
}
function focus() {
    box.value.focus();
}
function setText(text) {
    box.value.innerText = text;
    setCaretAtEnd(box.value);
}
function enterMessage(e) {
    if(images.value.length > 0) {
        var msg = { type: stlib.Content.Images.TYPE, images: images.value};
        emit("entermessage", null, msg, true, false, ()=>{
            images.value = [];
            enterMessage(e);
        });
    }
    else {
        var text = e.target.innerText;
        if(text && text.length > 0) {
            emit("entermessage", text);
        }
    }
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
.imgPreview {
    @apply relative;
}
.imgPreview:hover .closeButton {
    display: inline-block;
}
.closeButton {
    display: none;
    @apply absolute;
    font-size:10px;
    top: 0;
    right: 0;
    padding: 1px;
    cursor: pointer;
}
.imgBorder {
    display: inline-block;
    border: 1px solid #aaa;
    background-color: #e0e0e0;
    padding: 3px;
    max-height: 200px;
}
</style>

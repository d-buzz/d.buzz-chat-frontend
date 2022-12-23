<template>
    <div>
        <TransitionRoot :show="showAddImageModal">
            <AddImageModal @oninput="addImage" @close="toggleAddImageModal"></AddImageModal>
        </TransitionRoot>
        <TransitionRoot :show="showAddEmoteModal">
            <AddEmoteModal @oninput="addEmote" @close="toggleAddEmoteModal"></AddEmoteModal>
        </TransitionRoot>
        <div v-if="images.length > 0" class="p-1 flex gap-x-1">
            <span v-for="(image,i) in images" class="imgPreview">
                <span class="oi oi-x closeButton" @click="delImage(i)"></span>
                <img :src="image" class="imgBorder">
            </span>
        </div>
        <div class="flex">
            <div class="flex fg70 shadow appearance-none border border-gray-700 rounded-xl w-[calc(100%-1rem)] leading-tight mr-1">
                <div tex
                  class="appearance-none w-[calc(100%-1rem)] py-2 px-3 focus:outline-none focus:shadow-outline"
                  ref="box"
                  @keyup="onChange"
                  @paste="onChange"
                  @copy="onChange"
                  @cut="onChange"
                  @keydown.enter.exact.prevent="enterMessage"
                  role="textbox"
                  contenteditable>
                </div>
                <div @click="enterMessage(null)" class="float-right my-2 mx-3 cursor-pointer oi oi-envelope-open envelope" title="send"></div>
            </div>
            <div class="flex gap-x-1" style="max-height: 38px;">
                <span @click="toggleAddEmoteModal()" class="cursor-pointer" style="font-size: 22px;" title="add emote">&#x263a;</span>
                <span class="cursor-pointer oi oi-image" style="padding-top:5px;font-size: 1.125rem;"
                    @click="toggleAddImageModal()" title="add image"></span>
            </div>
        </div>
    </div>
</template>
<script setup type="ts">
const box = ref(null);
const images = ref([]);
const emit = defineEmits(["entermessage", "fullorblank"]);
const showAddImageModal = ref(false);
const showAddEmoteModal = ref(false);
function toggleAddImageModal() {
    showAddImageModal.value = !showAddImageModal.value;
}
const toggleAddEmoteModal = () => {
    var value = !showAddEmoteModal.value;
    if(value) {

    }
    showAddEmoteModal.value = value;
};
function addImage(link) {
    images.value.push(link);
}
function addEmote(emote) {
    focus();
    //if(!document.execCommand("insertText", false, emote))
    console.log("innerText", box.value.textContent, "'"+box.value.textContent+"'");
    box.value.innerText = box.value.textContent + emote.trim();
    setCaretAtEnd(box.value);
}
function delImage(i) {
    if(i >= 0 && i < images.value.length)
        images.value.splice(i, 1);
}
function focus() {
    box.value.focus();
}
var lastNonBlank = false;
function setText(text) {
    box.value.innerText = text;
    setCaretAtEnd(box.value);
}
function onChange(e) {
    var text = e.target.innerText;
    var nonBlank = text && text.trim() != '';
    if(nonBlank !== lastNonBlank) {
        lastNonBlank = nonBlank;
        emit("fullorblank", nonBlank);
    } 
}
function enterMessage(e) {
    var target = box.value;
    if(images.value.length > 0) {
        var msg = { type: stlib.Content.Images.TYPE, images: images.value};
        emit("entermessage", null, msg, true, false, ()=>{
            images.value = [];
            enterMessage(e);
        });
    }
    else {
        var text = target.innerText;
        if(text && text.length > 0) {
            emit("entermessage", text);
        }
    }
    target.blur();
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
.envelope:hover::before {
    content:'\e05c';
}
.envelope:hover {
    padding-top:2px;
}
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

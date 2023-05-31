<template>
    <div>
        <TransitionRoot :show="loginModalOpen">
            <LoginModal @close="toggleLoginModal()"></LoginModal>
        </TransitionRoot>
        <TransitionRoot :show="showAddImageModal">
            <AddImageModal @oninput="addImage" @close="toggleAddImageModal"></AddImageModal>
        </TransitionRoot>
        <TransitionRoot :show="showAddEmoteModal">
            <AddEmoteModal @oninput="addEmote" @close="toggleAddEmoteModal"></AddEmoteModal>
        </TransitionRoot>
        <div v-if="uploads.length + images.length > 0" class="p-1 flex gap-x-1">
            <span v-for="(upload,i) in uploads" class="imgPreview">
                <span class="oi oi-x closeButton" @click="delUpload(i)"></span>
                <div><div>{{upload.name}}</div>
                <div><img v-if="upload.image" :src="upload.image" class="imgBorder"></div>
                </div>
            </span>
            <span v-for="(image,i) in images" class="imgPreview">
                <span class="oi oi-x closeButton" @click="delImage(i)"></span>
                <img :src="image" class="imgBorder">
            </span>
        </div>
        <div class="flex">
            <div class="flex relative fg70 shadow appearance-none border border-gray-700 rounded-xl w-[calc(100%)] leading-tight mr-1">
                <div v-if="canWrite"
                  class="box whitespace-pre-wrap appearance-none w-[calc(100%)] py-2 px-3 focus:outline-none focus:shadow-outline"
                  style="overflow-wrap: normal; word-break: break-word;"
                  ref="box"
                  @keyup="onChange"
                  @paste="onPaste"
                  @copy="onChange"
                  @cut="onChange"
                  @keydown.enter.exact.prevent="enterMessage"
                  role="textbox"
                  contenteditable>
                </div>
                <div v-else-if="!isLoggedIn"
                    class="text-gray-400 appearance-none w-[calc(100%)] py-2 px-3 focus:outline-none focus:shadow-outline"
                    @click="toggleLoginModal"
                >
                    login to messsage
                </div>
                <div v-else
                    class="text-gray-400 appearance-none w-[calc(100%)] py-2 px-3 focus:outline-none focus:shadow-outline"
                    >
                    Permission required
                </div>
                <div class="absolute float-right flex gap-x-3 pr-3" style="right: 0; max-height: 38px;">
                    <div @click="IfCanWrite(()=>enterMessage(null))" class="my-2 cursor-pointer oi oi-envelope-open envelope" 
                    @mouseenter="tooltip($event.target, $t('MessageBox.Send'))"></div>
                    <span @click="IfCanWrite(toggleAddEmoteModal)" class="flipY my-2 cursor-pointer" 
                        @mouseenter="tooltip($event.target, $t('MessageBox.AddEmote'))">
                        <img class="flipYItem" src="/src/assets/images/icons/emoteicon.svg" style="max-width: 21px;">
                    </span>
                    <span class="flipY my-2 cursor-pointer" style="font-size: 1.125rem;"
                        @click="IfCanWrite(toggleAddImageModal)" 
                        @mouseenter="tooltip($event.target, $t('MessageBox.AddImage'))">
                        <span class="flipYItem oi oi-image"></span></span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup type="ts">
const tooltip = ref(window.tooltip);
const props = defineProps({
    canWrite: {type: Boolean, default: true},
    isLoggedIn: {type: Boolean, default: true}
});
const box = ref(null);
const images = ref([]);
const emit = defineEmits(["entermessage", "fullorblank"]);
const showAddImageModal = ref(false);
const showAddEmoteModal = ref(false);
const uploads = ref([]);

const loginModalOpen = ref(false);
function toggleLoginModal() {
    loginModalOpen.value = !loginModalOpen.value;
}
function IfLoggedIn(fn) {
    if(!props.isLoggedIn) toggleLoginModal();
    else fn();
}
function IfCanWrite(fn) {
    IfLoggedIn(()=>{
        if(props.canWrite) fn();
    });
}
function addFile(file) {
    if(stlib.Utils.isGuest(getManager().user)) return;
    if(!file.type.startsWith("image/")) return;
    console.log("add file", file);
    var obj = { file, name: file.name, image: null };
    obj.image = URL.createObjectURL(file);
    setTimeout(() => {
        URL.revokeObjectURL(obj.image);
    }, 1000);
    uploads.value.push(obj);
}
window.ondropfile.set("MessageBox.vue", addFile);
function delUpload(i) {
    if(i >= 0 && i < uploads.value.length)
        uploads.value.splice(i, 1);
}
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
    var nonBlank = text && text.trim() != '';
    box.value.style.marginTop = (nonBlank)?"20px":"0px";
    lastNonBlank = nonBlank;
}
function onPaste(e) {
    console.log("paste", e, e.clipboardData);
    var clipboard = e.clipboardData || window.clipboardData;
    if(clipboard) {
        console.log("files", clipboard.files, clipboard.files.length);
        if(clipboard.files && clipboard.files.length > 0) {
            console.log("paste files");
            for(var file of clipboard.files) 
                addFile(file);
            e.preventDefault()
            return;
        }
    }
    let paste = (e.clipboardData || window.clipboardData).getData("text");
    console.log("paste", paste);
    onChange(e);
}
function onChange(e) {
    var text = e.target.innerText;
    var nonBlank = text && text.trim() != '';
    if(nonBlank !== lastNonBlank) {
        e.target.style.marginTop = (nonBlank)?"20px":"0px";
        lastNonBlank = nonBlank;
        emit("fullorblank", nonBlank);
    } 
}
async function enterMessage(e) {
    var target = box.value;
    if(uploads.value.length > 0) {
        const manager = getManager();
        var user = manager.user;
        if(!stlib.Utils.isGuest(user)) {
            var onlineKey = null;//await getManager().getKeyFor("$");
            for(var upload of uploads.value) {
                var file = upload.file;
                var name = upload.name;
                var upload = await stuploader.uploadImage(user, file, name);
                var signature = (onlineKey != null)?(await upload.signWithKey(onlineKey)):(await upload.signWithKeychain());
                if(signature == null) return;
                upload = await upload.upload();
                if(upload) images.value.push(upload.link);
            }
        }
        uploads.value = [];
    }
    if(images.value.length > 0) {
        var msg = { type: stlib.Content.Images.TYPE, images: images.value};
        emit("entermessage", null, msg, true, false, ()=>{
            images.value = [];
            enterMessage(e);
        });
    }
    else {
        var text = target.innerText;
        if(text && text.trim().length > 0) {
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
.box {
    transition: margin 250ms ease-in-out;
}
</style>

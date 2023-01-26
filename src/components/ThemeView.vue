<template>
    <TransitionRoot :show="showThemeEditorModal">
        <ThemeEditorModal :name="name" @close="toggleThemeEditorModal"></ThemeEditorModal>
    </TransitionRoot>
    <TransitionRoot :show="showDeleteModal">
        <DeleteThemeModal :name="name" @close="toggleDeleteModal"></DeleteThemeModal>
    </TransitionRoot>
    <div class="cursor-pointer" @click="pick()"><b>“{{name}}„</b></div>
    <div ref="root"  class="flex flex-wrap row rounded cursor-pointer" style="max-width: 753px;" @click="pick()">
        <div class="appbg0 appfg0 border-default mrb1" style="width:63px;height:50px;" 
            :style="`background:${style[0]};color:`">
            <div class="w-full text-center mt-1" style="padding-left: 1px;">
                <span class="oi oi-menu" style="font-size:30px;"></span>
            </div>
        </div>
        <div class="appbg1 appfg1 border-default grow mrb1" style="width:200px;height:50px;">
            <div class="flex justify-between pr-1 pl-1">
                <b class="border-b-1">Direct Messages</b>
                <a class="text-sm">
                    <span class="oi oi-plus"></span>
                </a>
            </div>
        </div>
        <div class="flex" style="flex-grow:10000;height:50px;">
            <div class="appbg2 appfg2 border-default grow pr-3 pl-3 mrb1" style="width:210px;height:50px;">
                <b>Action </b> <button class="btn ml-1" @click="pick()">Pick</button> 
                <button class="btn2" @click="action()">{{edit?'Edit':'Clone'}}</button>
                <button v-if="edit" class="cursor-pointer" @click=toggleDeleteModal() title="Delete"><span class="oi oi-x"></span></button>
                
            </div>
            <div class="appbg3 appfg3 border-default pr-1 pl-1" style="width:100px;height:50px;">
                <b>Users</b>
            </div>
        </div>
    </div>
</template>
<script setup>
const emit = defineEmits(["update"]);
const props = defineProps({
    name: String,
    style: Object,
    edit: Boolean
});
const root = ref();
const theme = defaultTheme.newTheme();
const showThemeEditorModal = ref(false);
const showDeleteModal = ref(false);
function toggleThemeEditorModal() {
    showThemeEditorModal.value = !showThemeEditorModal.value;
    if(!showThemeEditorModal.value) emit("update");
}
function toggleDeleteModal() {
    showDeleteModal.value = !showDeleteModal.value;
    if(!showDeleteModal.value) emit("update");
}
theme.set(props.style);
onMounted(() => { 
    if(!root.value) return;
    theme.applyTheme(root.value);
});
function generateNewThemeName() {
    var name = props.name + " (Clone)";
    for(var i = 2; i < 100; i++) {
        if(!defaultTheme.findThemeByName(name)) return name;
        name = props.name + " (Clone " + i + ")";
    }
    return null;
}
function action() {console.log("action", props.edit);
    if(props.edit) {
        toggleThemeEditorModal();
    }
    else {
        defaultTheme.userThemes[generateNewThemeName()] = theme.toJSON();
        defaultTheme.saveUserThemes();
        emit("update");
    }
}
function pick() {
    defaultTheme.setTheme(props.name);
    theme.applyTheme();
}
</script> 
<style scoped>
.mrb1 {
    margin-right: -1px;
    margin-bottom: -1px;
}
</style>


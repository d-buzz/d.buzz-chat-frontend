<template>
    emote picker
    <div>
        emote data &#x1F31F;	
    </div>

    <div v-for="category in emoteData">
        <div>{{category[0]}}</div>
        <div class="flex">
            <div v-for="emote in category[1]" class="cursor-pointer" :title="emote[1]" @click="action(emote[0])">
                {{emote[0]}}
            </div>        
        </div>
    </div>
    <div v-for="community in communityList">
        {{community.name}} {{community.title}}
    </div>
</template>
<script setup>
const emit = defineEmits(["action"]);
const communityList = ref([]);
async function init() {
    const manager = getManager();
    var communities = await manager.getCommunities();
    var result = [];
    for(var community of communities) {
        var name = community[0];
        var title = community[1];
        var data = await stlib.Community.load(name);
        result.push({name, title, data});
    }
    communityList.value = result;
}
init();
function action(emote) {
    emit("action", emote);
}
const emoteData = [
    ["emotes", [
        ["263a", "smiling"],
        ["2639", "sad"],
        ["1F642", "little smiling"]
    ]]
];
function initEmoteData() {
    for(var categoryName in emoteData) {
        var category = emoteData[categoryName];
        console.log("category", category);
        for(var index in category[1]) {
            var emote = category[1][index];
            emote[0] = String.fromCodePoint(parseInt(emote[0], 16)); 
        }
    }
}
initEmoteData();
/*const emit = defineEmits(["update"]);
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
}*/
</script> 

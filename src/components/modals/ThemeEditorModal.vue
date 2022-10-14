<template>
  <DefaultModal>
        <div>
            <b>Theme Editor</b>
            <div class="flex gap-x-1 float-right">
                <button class="cursor-pointer" @click="exportColors()" title='export colors to JSON'><span class="oi oi-clipboard"></span></button>
                <!--<button class="cursor-pointer" @click="importColors()" title='import colors from JSON in clipboard'><span class="oi oi-briefcase"></span></button> -->       
            </div>        
        </div>        
        <table class="mt-1">
            <tr>
                <td>
                    <div><b>Name</b></div>
                    <div><small>Unique theme name</small></div>
                </td>
                <td>
                    <div><input class="inputText" type="text" v-model="themeName"></div>
                </td>
            </tr>
            <tr v-for="item in themeObject.defaultColors">
                <td>
                    <div><b>{{item[1]}}</b></div>
                    <div><small>{{item[2]}}</small></div>
                </td>
                <td>
                    <div><input class="inputText" type="text" v-model="colors['bg'+item[0]]" size="7"></div>
                    <div><input class="w-full" type="color" v-model="colors['bg'+item[0]]"></div>
                </td>
            </tr>
        </table>
        <div>
            <button class="btn" @click="setColors()">Update</button>
            <!--<button class="btn2" @click="loadColors()">Reset</button>-->
        </div>


        <div><small>{{errorMessage}}</small></div>
    </DefaultModal>
</template>

<script setup lang="ts">
const emit = defineEmits();
const props = defineProps<{
    name: String,
}>();
const isLoading = ref(false);
const themeName = ref(props.name);
const errorMessage = ref("");
const themeObject = ref(defaultTheme);
const style = ref(defaultTheme.findThemeByName(props.name));
const colors = ref({
    "bg0":"#ffffff",
    "bg1":"#ffffff",
    "bg2":"#ffffff",
    "bg3":"#ffffff",
    "bgbtn1":"#059669",
    "bgbtn2":"#eab308"
});
function init() {
    if(style.value) {
        for(var name in style.value) {
            var color = defaultTheme.colorHexString(style.value[name]);
            colors.value[name] = color;
        }
    }
}
init();

function setColors() {
    for(var name in colors.value) {
        var color = colors.value[name];
        style.value[name] = color; 
    }
    var existingName = props.name;
    var newName = themeName.value;
    if(existingName != newName) {
        if(defaultTheme.findThemeByName(newName)) {
            errorMessage.value = `Theme named '${newName}' already exists.`
            return; 
        }
        defaultTheme.userThemes[newName] = style.value;
        delete defaultTheme.userThemes[existingName];
    } 
    defaultTheme.saveUserThemes();
    defaultTheme.loadTheme();
    emit("close");
}
function exportColors() {
    console.log(style.value);
    copyToClipboard(JSON.stringify(style.value));
}
function copyToClipboard(text: string) {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(text) 
    }
}
function importColors() {
    try {
        
    }
    catch(e) {
        console.log(e);
    }
}
/*function loadColors() {
    var root = document.querySelector(':root');
    var style = getComputedStyle(root);
    var colorsValue = colors.value;
    for(var prop in colorsValue) {
        colorsValue[prop] = style.getPropertyValue('--app'+prop);
    }
}*/
</script>

<template>
    <div class="mt-1">
        <div class="font-bold">
            {{name}}
            <div>
                <input class="inputText inline-block p-1 mr-3" v-model="fontFamily" />
                <select class="inputSelect1 inline-block" @change="setFontFamily">
                    <option style="font-family:'Arial';" value="Arial">Arial</option>
                    <option value="Century Schoolbook L" selected>Century Schoolbook L</option>
                    <option style="font-family:'New Heterodox Mono';" value="New Heterodox Mono,mono">New Heterodox Mono</option>
                </select>
            </div>
            <div class="flex flex-row mt-3">
                <input class="mr-3" v-model="fontSize" type="range" min="1" max="77" /> 
                Size <input class="inputText text-center" v-model="fontSize" style="width:30px;margin:0px 3px;"/>px
                <!--. Weight <input class="inputText text-center" v-model="fontWeight" style="width:45px;margin:0px 3px;"/>
                 bold <input class="inputText text-center" v-model="fontWeightBold" style="width:45px;margin:0px 3px;"/>
                -->                
            </div>
        </div>
        <small class="font-bold fg70">preview</small>
        <div ref="fontPreview" class="border-default p-3 rounded">
            <div>The quick dog jumps over the lazy brown fox.</div>
            <div class="font-bold">The quick dog jumps over the lazy brown fox.</div>
        </div>
        <div class="mt-1">
            <button class="btn" @click="applyFont">Apply</button>
            <button class="btn2" @click="applyFontDefault">Reset to Default</button>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    name: String,
    css: String
});
const fontPreview = ref(null);
const fontFamily = ref("Century Schoolbook L");
const fontSize = ref(16);
const DEFAULT_FALLBACK_FONT = ',"Century Schoolbook L",Arial,sans-serif';
//const fontWeight = ref(400);
//const fontWeightBold = ref(800);
function setFontFamily(e) {
    fontFamily.value = e.target.value;
}
function applyFont() {
    var css = props.css;
    var root = document.querySelector(':root');
    var family = fontFamily.value+DEFAULT_FALLBACK_FONT;
    root.style.setProperty('--'+css+'Family', family);
    root.style.setProperty('--'+css+'Size', fontSize.value+'px');
    var obj = {};
    obj['--'+css+'Family'] = family;
    obj['--'+css+'Size'] = fontSize.value+'px';
    window.defaultTheme.saveCssOverrides(obj, true);
}
function applyFontDefault() {
    fontFamily.value = "Century Schoolbook L";
    fontSize.value = 16;
    applyFont();
}
function init() {
    try {
        var css = props.css;
        var root = document.querySelector(':root');
        var family = root.style.getPropertyValue('--'+css+'Family');
        if(family.endsWith(DEFAULT_FALLBACK_FONT)) 
            family = family.substring(0, family.length-DEFAULT_FALLBACK_FONT.length);
        var size = root.style.getPropertyValue('--'+css+'Size');
        if(size.endsWith('px')) size = Number(size.substring(0, size.length-2));
        nextTick(()=>{
            if(family && family != "") fontFamily.value = family;
            if(size && size != "") fontSize.value = size;
        });
    }
    catch(e) { console.log(e); }
}
init();
watch(() => fontFamily.value, (family) => {
   fontPreview.value.style.setProperty('font-family', family);
});
watch(() => fontSize.value, (size) => {
    fontPreview.value.style.setProperty('font-size', size+'px');
});
</script>

<template>
    <div v-if="profileLetter" class="textIcon" :class="`${imgCss}`"
        :style="`${randomColor(name)}`">
        <span>{{profileLetter}}</span>
    </div>
    <div v-else class="relative">
        <img v-if="size != 'small'" class="absolute rounded-full" :class="`${imgCss}`" :src="`https://images.hive.blog/u/${name}/avatar/${size}`"/>     
        <img class="rounded-full" :class="`${imgCss}`" :src="`https://images.hive.blog/u/${name}/avatar/small`" @error="imgLoadError()" alt="" />     
    </div>
</template>
<script setup>
const props = defineProps({
    name: String,
    imgCss: {type: String, default: 'avMessage'},
    letterIcon: {type: String, default: null},
    name2: {type: String, default: null},
    size: {type: String, default: 'small'}
});
const profileLetter = ref(null);
const backupLetter = ref("Hi");
async function initProfileImage() {
    var name = props.name;
    if(!name) return true;
    var letterIcon = props.letterIcon;
    console.log(name, letterIcon);
    if(letterIcon !== undefined && letterIcon !== null) {
        profileLetter.value = letterIcon?letterIcon:
                (name.substring(0, 1).toUpperCase()+name.substring(1, 2));
        return true;
    }
    try {
        var data = await stlib.Utils.getAccountData(name);
        if(data === undefined) {
            console.log("data is undefined ", name, data);
            return;
        }
        var json = data.posting_json_metadata;
        var name2 = props.name2;
        if(!name2 || name2.length < 1) name2 = name;
        var text = '';
        if(name2.length > 0) text += name2[0].toUpperCase();
        if(name2.length > 1) text += name2[1].toLowerCase();
        backupLetter.value = text;
        if(json && json.length > 0) {
            json = JSON.parse(json);
            if(json.profile && json.profile.profile_image)
                return true;
        }  
        profileLetter.value = text;
        return false;
    }
    catch(e) { console.log(e); return true; }
}
initProfileImage();
function imgLoadError() {
    profileLetter.value = backupLetter.value;
}
function hash(text) {
  var h = 0;
  for(var i = 0; i < text.length; i++) h = (((h << 5) - h) + text.charCodeAt(i))|0;
  return h;
}
function randomColor(text) {
    var h = hash(text)%360;
    return `color:hsl(${h+60}, 100%, 25%); background-color:hsl(${h}, 100%, 85%);`;
}
</script>
<style scoped>
.textIcon {
    @apply flex justify-center content-center rounded-full text-center;
    font-style: italic;
}
.textIcon span { align-self: center; margin-top: -2px; }
</style>

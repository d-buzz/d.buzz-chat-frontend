<template>
    <div class="relative">
        <div v-if="profileLetter" class="textIcon iconborder" :class="`${imgCss}`"
            :style="`${randomColor(name || profileLetter)}`">
            <span>{{profileLetter}}</span>
        </div>
        <div v-else class="">
            <img v-if="size != 'small'" class="absolute iconborder hidden sm:block" :class="`${imgCss}`" :src="`https://images.hive.blog/u/${name}/avatar/${size}`"/>     
            <img class="iconborder" :class="`${imgCss}`" :src="`https://images.hive.blog/u/${name}/avatar/small`" @error="imgLoadError()" alt="" />     
        </div>
        <div v-if="online" class="onlineIcon"></div>
        <div v-if="group" class="groupIcon"><span class="oi oi-people"></span></div>
    </div>
</template>
<script setup>
const props = defineProps({
    name: String,
    imgCss: {type: String, default: 'avMessage'},
    letterIcon: {type: String, default: null},
    name2: {type: String, default: null},
    size: {type: String, default: 'small'},
    online: {type: Boolean, default: null},
    group: {type: Boolean, default: false}
});
const profileLetter = ref(null);
const backupLetter = ref("Hi");
async function initProfileImage() {
    var name = props.name;
    var letterIcon = props.letterIcon;
    if(letterIcon !== undefined && letterIcon !== null) {
        profileLetter.value = letterIcon;
        return true;
    }
    if(!name) return true;
    try {
        var name2 = props.name2;
        if(!name2 || name2.length < 1) name2 = name;
        var text = '';
        if(name2.length > 0) text += name2[0].toUpperCase();
        if(name2.length > 1) text += name2[1].toLowerCase();
        if(stlib.Utils.isGuest(name)) {
            profileLetter.value = text;
            return false;    
        }

        var data = await stlib.Utils.getAccountData(name);
        if(data === undefined) {
            console.log("data is undefined ", name, data);
            return true;
        }
        var json = data.posting_json_metadata;
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
    return `color:hsl(${h+60}, 100%, 21%); background-color:hsl(${h}, 100%, 95%);`;
}
</script>
<style scoped>
.textIcon {
    @apply flex justify-center content-center rounded-full text-center;
    font-style: italic;
}
.iconborder {
    @apply border border-solid rounded-full;
    border-color: #0003;
    background-color: #313338;
}
.textIcon span { align-self: center; margin-top: -2px; }
.onlineIcon {
    position: absolute;
    width: 11px;
    height: 11px;
    border: 2px solid #313338;
    border-radius: 7px;
    background-color: green;
    left: 0;
    bottom: 0;
}
.groupIcon {
    display: block;
    position: absolute;
    font-size: 12px;
    bottom: -3px;
    right: 0px;
    z-index: 1;
    mix-blend-mode: difference;
    color: #aaaaaaaa;
}
</style>

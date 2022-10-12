<template>
  <div class="flex nameParent relative items-center justify-start" v-if="hasImg || getImgCss() == 'avMini'">
    <small class="name"><b>{{name}}</b></small>
    <small v-if="number && number != '0'" class="number"><b>{{number}}</b></small>
    <div class="flex-shrink-0" :class="{selected: $route.params.user == img, 'p-1': getImgCss() !== 'avMini'}" 
            :title="`${name} (${img})`">
        <span class="cursor-pointer" @click="onClick(img)">
            <img
            :class="`rounded-full ${getImgCss()} border border-solid borderColor`"
            :src="`https://images.hive.blog/u/${img}/avatar/small`"
            alt="@"
            />
        </span>
    </div>
  </div>
  <div class="flex relative items-center justify-start" v-else>
    <div class="flex-shrink-0" :class="{selected: $route.params.user == img, 'p-1': getImgCss() !== 'avMini'}" 
            :title="`${name} (${img})`">
         <small class="name2"><b>{{name}}</b></small>
        <router-link :to="`/i/${img}/about`">
            <img
            :class="`rounded-full ${getImgCss()} border border-solid borderColor`"
            :src="`https://images.hive.blog/u/${img}/avatar/small`"
            alt="@"
            />
        </router-link>
    </div>
  </div>
</template>
<script setup>
const router = useRouter();
const props = defineProps({
    img: String,
    name: String,
    community: Object,
    imgCss: String,
    number: String
});
const hasImg = ref(hasProfileImage(props.community));
function onClick(community) {
    const manager = getManager();
    router.push(manager.getSelectedCommunityPage(community, `/i/${community}/about`));
}
function hasProfileImage(community) {
    if(!community) return true;
    try {
        var json = community.account.posting_json_metadata;
        if(json && json.length > 0) {
            json = JSON.parse(json);
            if(json.profile && json.profile.profile_image)
                return true;
        }
        return false;
    }
    catch(e) { console.log(e); return true; }
}
function getImgCss() {
    return props.imgCss === undefined?"avCommunity":props.imgCss;
}
</script> 
<style scoped>
.name {
    display: none;
    pointer-events: none;
    min-width: 54px;
    color: white;
}
.number {
    display: block;
    position: absolute;
    pointer-events: none;
    color: white;
    z-index: 5;
    background: rgb(0, 113, 12);
    top: 0;
    right: 0;
    margin-right: 3px;
    border-radius: 10px;
    padding: 2px 4px;
    line-height: 1;
}
.nameParent:hover .name{
    display: block;
    position: absolute;
    z-index: 7;
    /*background: rgba(0,0,0,0.25);*/
    /*background: rgba(227, 19, 55, 0.65);*/
    background: rgba(0, 0, 0, 0.37);
    padding: 1px;
    margin: 0;
    align-self: flex-start;
    border-radius: 3px;
}
.selected { 
    @apply rounded;
    background: rgba(255,255,255,0.37);
}
.name2 {
    pointer-events: none;
    display: table;
    position: absolute;
    z-index: 7;
    color: #3c0404bd;
    background: rgba(255,255,255,0.67);
    padding: 0;
    margin: 0;
    border-radius: 32px;
    width: 54px;
    height: 54px;
    text-align: center;
    line-height: 1.15;
}
.name2 b {
    display:table-cell;
    vertical-align: middle;
}
.borderColor {
    border-color: #0003;
}
</style>

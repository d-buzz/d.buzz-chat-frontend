<template>
  <div class="flex nameParent relative items-center justify-start" v-if="hasImg">
    <small class="name"><b>{{name}}</b></small>
    <div class="flex-shrink-0 p-1" :class="{selected: $route.params.user == img}" 
            :title="`${name} (${img})`">
        <router-link :to="`/i/${img}/about`">
            <img
            class="rounded-full avCommunity border border-solid borderColor"
            :src="`https://images.hive.blog/u/${img}/avatar/small`"
            alt="@"
            />
        </router-link>
    </div>
  </div>
  <div class="flex relative items-center justify-start" v-else>
   
    <div class="flex-shrink-0 p-1" :class="{selected: $route.params.user == img}" 
            :title="`${name} (${img})`">
         <small class="name2"><b>{{name}}</b></small>
        <router-link :to="`/i/${img}/about`">
            <img
            class="rounded-full avCommunity border border-solid borderColor"
            :src="`https://images.hive.blog/u/${img}/avatar/small`"
            alt="@"
            />
        </router-link>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
    img: String,
    name: String,
    community: Object
});
const hasImg = ref(hasProfileImage(props.community));
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
</script> 
<style scoped>
.name {
    display: none;
    pointer-events: none;
}
.nameParent:hover .name{
    display: block;
    position: absolute;
    z-index: 7;
    /*background: rgba(0,0,0,0.25);*/
    background: rgba(227, 19, 55, 0.5);
    padding: 0;
    margin: 0;
    align-self: flex-start;
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

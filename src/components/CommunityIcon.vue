<template>
    <TransitionRoot :show="showJoinModal">
        <JoinModal :community="img" @close="toggleJoinModal" @closeAll="emit('closeAll')"></JoinModal>
    </TransitionRoot>
  <div class="flex nameParent relative items-center justify-start" 
  :class="{fade:fade}" v-if="hasImg || getImgCss() == 'avMini'">
    <!--<small class="name"><b>{{name}}</b></small>-->
    <small v-if="number && number != '0'" class="number"><b>{{number}}</b></small>
    <small v-if="number2 && number2 != '0'" class="number2"><b>{{number2}}</b></small>
    <div class="flex-shrink-0" :class="{selected: $route.params.user == img, 'p-1': getImgCss() !== 'avMini'}" 
            >
        <span class="cursor-pointer" @click="onClick(img)" @mouseenter="tooltip($event.target, `C/${name} (${img})`)">
            <UserIcon :name="img" :imgCss="getImgCss()" :name2="name" />
        </span>
    </div>
  </div>
  <div class="flex relative items-center justify-start" v-else>
    <div class="flex-shrink-0" :class="{fade:fade, selected: $route.params.user == img, 'p-1': getImgCss() !== 'avMini'}" 
             @click="toggleJoinModal">
         <!-- <small class="name2"><b>{{name}}</b></small>-->
            <img @mouseenter="tooltip($event.target, `C/${name} (${img})`)"
            :class="`rounded-full ${getImgCss()} border border-solid borderColor`"
            :src="`https://images.hive.blog/u/${img}/avatar/small`"
            alt=""
            />
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(["closeAll"]);
const tooltip = ref(window.tooltip);
const router = useRouter();
const props = defineProps({
    img: String,
    name: String,
    community: Object,
    imgCss: String,
    number: String,
    number2: String,
    fade: {type: Boolean, default: false},
    joinModal: {type: Boolean, default: true}
});

const showJoinModal = ref(false);
function toggleJoinModal() {
    if(props.joinModal)
        showJoinModal.value = !showJoinModal.value;
}

const hasImg = ref(hasProfileImage(props.community));
async function onClick(community) {
    //const manager = getManager();
    //router.push(manager.getSelectedCommunityPage(community, `/i/${community}/about`));
    toggleJoinModal();
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
.fade { opacity: 0.5; }
.fade:hover { opacity: 1; }
.number {
    display: block;
    position: absolute;
    pointer-events: none;
    color: white;
    z-index: 5;
    background: #a00000;
    top: 0;
    right: 0;
    margin-right: 3px;
    border-radius: 10px;
    padding: 2px 4px;
    line-height: 1;
}
.number2 {
    display: block;
    position: absolute;
    pointer-events: none;
    z-index: 5;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 1;
    text-align: center;
}
.number2 b {
    background: rgb(58, 79, 60);
    padding: 2px 4px;
    border-radius: 10px;
    color: white;
}
.nameParent:hover .name{
    display: block;
    position: absolute;
    z-index: 7;
    /*background: rgba(0,0,0,0.25);*/
    /*background: rgba(227, 19, 55, 0.65);*/
    background: rgba(0, 0, 0, 0.42);
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

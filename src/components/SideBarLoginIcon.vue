<template>
  <LoginModal :show="loginModalOpen" @close="toggleLoginModal(false)"></LoginModal>

  <div class="relative flex items-center justify-start pt-1 pr-1 pl-1 pb-1" :class="{selected: $route.name == 'Home'}">
    <small v-if="number && number != '0'" class="number"><b>{{number}}</b></small>
    <div class="flex-shrink-0" style="width:54px;height:54px;">
      <div v-if="accountStore.account.authenticated" class="nameParent" :title="accountStore.account.name">
        <!--<small class="name"><b>{{accountStore.account.name}}</b></small>-->
        <span class="cursor-pointer" @click="onClick()" @mouseenter="tooltip($event.target, accountStore.account.name)">
            <UserIcon :name="accountStore.account.name" imgCss="avCommunity"/>
        </span>
      </div>
      <div v-else>
        
            <img class="rounded-full w-16" :src="Login" alt="+" @click="toggleLoginModal" />
        
      </div>
    </div>
  </div>
</template>
<script setup>
import Login from "../assets/images/icons/login.svg";
import { useAccountStore } from "../stores/account";
const emit = defineEmits(["toggleStreambar"]);
const router = useRouter();
const accountStore = useAccountStore();
const tooltip = ref(window.tooltip);

const props = defineProps({
    number: String
});
function onClick() {
    const manager = getManager();
    var link = '/home';
    if(link === router.currentRoute._value.fullPath) emit('toggleStreambar');
    else router.push(link);
}
let loginModalOpen = ref(false);
const toggleLoginModal = () => {
  loginModalOpen.value = !loginModalOpen.value;
};
</script>
<style scoped>
.name {
    display: none;
    pointer-events: none;
    min-width: 54px;
    color: white;
    text-align: center;
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
    bottom: 5px;
}
.selected { 
    @apply rounded;
    background: var(--appsg0);
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
</style>

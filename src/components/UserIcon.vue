<template>
    <TransitionRoot :show="showUserModal">
        <UserModal @close="toggleUserModal(null)" :user="userRef" :community="community"></UserModal>
    </TransitionRoot>
    <img
        @click="toggleUserModal(name)"
        @click.right.prevent.stop="clickOnIcon($event)"
        class="cursor-pointer rounded-full avMessage"
        :src="`https://images.hive.blog/u/${name}/avatar/small`"
        alt="@"
        />
    <vue-simple-context-menu
                v-if="!displayOnly"
              element-id="iconMenuId"
              :options="iconMenuOptions"
              ref="iconMenu"
              @option-clicked="clickOnIconOption"
            />

    <!--<div class="flex nameParent relative items-center justify-start" v-if="hasImg || getImgCss() == 'avMini'">
    <small class="name"><b>{{name}}</b></small>
    <div class="flex-shrink-0" :class="{selected: $route.params.user == img, 'p-1': getImgCss() !== 'avMini'}" 
            :title="`${name} (${img})`">
        <router-link :to="`/i/${img}/about`">
            <img
            :class="`rounded-full ${getImgCss()} border border-solid borderColor`"
            :src="`https://images.hive.blog/u/${img}/avatar/small`"
            alt="@"
            />
        </router-link>
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
  </div>-->
</template>
<script setup>
const props = defineProps({
    name: String,
    community: Object,
    displayOnly: Boolean
});
const showUserModal = ref(false);
const userRef = ref();
function toggleUserModal(user) {
    if(user == null) showUserModal.value = false;
    else {
        userRef.value = user;
        showUserModal.value = true;
    }
}    
const iconMenuOptions = [
    {name:"message"},{name:"blog"}
];
const iconMenu = ref(null);
function clickOnIcon(event) { iconMenu.value.showMenu(event, "item"); }
</script> 
<style scoped>

</style>

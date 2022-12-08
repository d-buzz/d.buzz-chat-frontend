<template>
    <TransitionRoot :show="showUserModal">
        <UserModal @close="toggleUserModal(null)" :user="userRef" :community="community"></UserModal>
    </TransitionRoot>
    <div @click="toggleUserModal(name)"
        @click.right.prevent.stop="clickOnIcon($event)"
        class="cursor-pointer relative">
        <UserIcon :name="name" :imgCss="imgCss"/>
        <div v-if="displayOnlineStatus" class="onlineIcon"></div>
    </div>
    <vue-simple-context-menu
                v-if="!displayOnly"
              element-id="iconMenuId"
              :options="iconMenuOptions"
              ref="iconMenu"
              @option-clicked="clickOnIconOption"
            />
</template>
<script setup>
import VueSimpleContextMenu from 'vue-simple-context-menu';
const props = defineProps({
    name: String,
    community: String,
    displayOnly: Boolean,
    displayOnlineStatus: {type: Boolean, default: false},
    imgCss: {type: String, default: 'avMessage'} 
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
function clickOnIcon(event) { 
    console.log("iconMenu ", iconMenu.value);
    iconMenu.value.showMenu(event, "item");
}
function clickOnIconOption(item) {
    console.log("click", item);
}
</script>
<style scoped>
.onlineIcon {
    position: absolute;
    width: 11px;
    height: 11px;
    border: 2px solid white;
    border-radius: 5px;
    background-color: green;
    bottom: 0;
}
</style>

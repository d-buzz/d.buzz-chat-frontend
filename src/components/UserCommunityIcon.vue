<template>
    <TransitionRoot :show="showUserModal">
        <UserModal @close="toggleUserModal(null)" :user="userRef" :community="community"></UserModal>
    </TransitionRoot>
    <div @click.prevent.stop="toggleUserModal(name)"
        @click.right.prevent.stop="clickOnIcon($event)"
        class="cursor-pointer relative">
        <UserIcon :name="name" :imgCss="imgCss"/>
        <div v-if="displayOnlineStatus" class="onlineIcon"></div>
    </div>
</template>
<script setup>
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
    border: 2px solid var(--appbg3);
    border-radius: 7px;
    background-color: green;
    left: 0;
    bottom: 0;
}
</style>

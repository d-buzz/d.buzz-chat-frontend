<template>
    <TransitionRoot :show="showUserModal">
        <UserModal @close="toggleUserModal(null)" :user="userRef" :community="community"></UserModal>
    </TransitionRoot>
    <div @click="toggleUserModal(name)"
        @click.right.prevent.stop="clickOnIcon($event)"
        class="cursor-pointer">
        <UserIcon :name="name" :imgCss="imgCss"/>
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

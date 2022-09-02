<template>
    <TransitionRoot :show="addTitleModal">
        <AddTitleModal @oninput="onAddTitle" @close="closeModal()"></AddTitleModal>
    </TransitionRoot>

    <div>
        <select class="inputSelect1" v-model="set.role">
            <option value="">Any</option>
            <option value="onboard">Onboard</option>
            <option value="joined">Joined</option>
            <option value="guest">Guest</option>
            <option value="member">Member</option>
            <option value="mod">Mod</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
        </select>
        <span class="ml-2">
        <button class="btn" @click="addTitle()"><span class="oi oi-plus"></span> title</button> </span>
    </div>
    <span v-for="title in set.titles">
        <button class="btn" @click="delTitle(title)">{{title}} <span class="oi oi-circle-x"></span></button>
    </span>
</template>
<script setup type="ts">
const props = defineProps({
    set: Object
});
const addTitleModal = ref(false);
const set = props.set;
function addTitle() {
    addTitleModal.value = true;
}
function delTitle(title) {
    set.delTitle(title);
}
function onAddTitle(title) {
    set.addTitle(title);
}
function closeModal() { addTitleModal.value = false; }
function setJSON(set) {
    return set.toJSON();
}
</script>

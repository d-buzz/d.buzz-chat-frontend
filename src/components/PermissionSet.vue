<template>
    <AddTitleModal :show="addTitleModal" @oninput="onAddTitle" @close="closeModal()"></AddTitleModal>
    <div>
        <select class="inputSelect1" v-model="set.role">
            <option value="">Any</option>
            <option value="Onboard">Onboard</option>
            <option value="Joined">Joined</option>
            <option value="Guest">Guest</option>
            <option value="Member">Member</option>
            <option value="Mod">Mod</option>
            <option value="Admin">Admin</option>
            <option value="Owner">Owner</option>
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

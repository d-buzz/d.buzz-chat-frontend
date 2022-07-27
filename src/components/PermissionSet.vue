<template>
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
        <span class="float-right">
        <button class="btn" @click="addTitle()"><span class="oi oi-plus"></span> title</button> </span>
    </div>
     <input id="permissions" type="text" class="inputText1" v-bind:value="setJSON(set)"> 
</template>
<script setup type="ts">
const props = defineProps({
    set: Object
});
console.log("set is ", props.set);
const set = props.set;
function addTitle() {

}
function setJSON(set) {
    return set.toJSON();
}
</script>

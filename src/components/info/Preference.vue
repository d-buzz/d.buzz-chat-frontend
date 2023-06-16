<template>
    <div v-if="item.options">
        <div>
            <div><b>{{item.display}}</b></div>
            <div><small>{{item.desc}}</small></div>
        </div>
        <div>
            <select v-model="item.newvalue" class="inputSelect1">
                <option v-for="option in item.options" :value="option[0]">{{option[1]}}</option>
            </select>
        </div>
    </div>
    <div v-else class="mb-1">
        <div>
            <div><input type="checkbox" v-model="item.newvalue"> <b>{{item.display}}</b></div>
            <small class="block">{{item.desc}}</small>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    item: Object
});
</script>



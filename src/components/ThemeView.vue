<template>
    <div><b>{{name}}</b></div>
    <div ref="root"  class="flex row border rounded border-gray-400" style="height:50px;">
        <div class="appbg0 appfg0 border-r-1" style="width:63px;" 
            :style="`background:${style[0]};color:`">
            <div class="w-full text-center mt-1" style="padding-left: 1px;">
                <span class="oi oi-menu" style="font-size:30px;"></span>
            </div>
        </div>
        <div class="appbg1 appfg1 border-r-1" style="width:200px;">
            <div class="flex justify-between pr-1 pl-1">
                <b class="border-b-1">Direct Messages</b>
                <button class="text-sm">
                    <span class="oi oi-plus"></span>
                </button>
            </div>
        </div>
        <div class="appbg2 appfg2 border-r-1 grow pr-3 pl-3" style="width:200px;">
            <b>Main </b> <button class="btn ml-1" @click="pick()">Pick</button> <button class="btn2">Edit</button>
        </div>
        <div class="appbg3 appfg3 pr-1 pl-1" style="width:100px;">
            <b>Users</b>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    name: String,
    style: Object,
});
const root = ref();
const theme = defaultTheme.newTheme();
theme.set(props.style);
onMounted(() => { 
    if(!root.value) return;
    theme.applyTheme(root.value);
});
function pick() {
    theme.applyTheme();
}
</script> 

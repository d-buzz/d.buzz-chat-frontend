<template>
    <div class="flex style" :class="{selected: $route.path == path}">
        <div v-if="stream.getPathType() === null">
            <b class="text-sm">{{stream.getName()}}</b>
        </div>
        <div v-else-if="stream.getPathType() === 't'">
            <router-link :to="`${path}`">
                <div>
                    <div class="pl-2 font-bold"><span class="oi oi-chat"></span> {{stream.getName()}}</div>
                </div>
            </router-link>
        </div>
        <div v-else-if="stream.getPathType() === 'i'">
            <a v-if="path.startsWith('https://')" :href="path" target="_blank" rel="noreferrer noopener">
                <div>
                    <div class="font-bold"><span class="oi oi-external-link text-sm"></span> {{stream.getName()}}</div>
                </div>
            </a>
            <router-link v-else :to="`${path}`">
                <div>
                    <div class="font-bold"><span class="oi oi-info text-center" style="width:14px;"></span> {{stream.getName()}}</div>
                </div>
            </router-link>
        </div>
        <div v-else>
            <div>
                <div>{{stream.getName()}}</div>
            </div>
        </div>
    </div>
</template>
<script setup type="ts">
const props = defineProps({
    stream: Object
});
function getPath() {
    var path = props.stream.getPath();
    if(path==null) return '';
    if(path.getType() === 't')
        return '/t/'+path.getUser()+'/'+path.getPath();
    if(path.getType() === 'i') {
        if(path.getPath() === 'created')
            return 'https://peakd.com/c/'+path.getUser()+'/created';

        return '/i/'+path.getUser()+'/'+path.getPath();
    }
    return '';
}
const path = getPath(); 
console.log("stream is");
console.log(props.stream);
</script>
<style scoped>
.style {
    border: 1px solid transparent;
    padding:0px;
}
.selected { 
    @apply rounded;
    /*background: linear-gradient(rgba(255,255,255,0.25), rgba(0,0,0,0.1));*/
    background: rgba(255,255,255,0.37);
    border: 1px solid rgba(0,0,0,0.1);
    border-top-color: rgba(255,255,255,0.1);
}
</style>

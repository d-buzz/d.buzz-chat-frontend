<template>
    <div class="flex style" :class="{selected: $route.path == path}">
        <div v-if="stream.getPathType() === null">
            <b class="text-sm"><StreamName :name="stream.getName()" /></b>
        </div>
        <div class="grow" v-else-if="stream.getPathType() === 't'">
            <router-link :to="`${path}`">
                <div class="flex">
                    <div class="flex gap-x-1 pl-2 font-bold grow"><img :src="HashIcon" class="w-5 h-5 appfg1" aria-hidden="true" /> <StreamName :name="stream.getName()" /></div>
                    <div v-if="number && number != '0'"> 
                        <small class="number"><b>{{number}}</b></small>
                    </div>   
                </div>
            </router-link>
        </div>
        <div class="grow" v-else-if="stream.getPathType() === 'g'">
            <router-link :to="`${path}`">
                <div class="flex">
                    <div class="flex gap-x-1 pl-2 font-bold grow"><img :src="HashLockIcon" class="w-5 h-5 appfg1" aria-hidden="true" /> <StreamName :name="stream.getName()" /></div>
                    <div v-if="number && number != '0'"> 
                        <small class="number"><b>{{number}}</b></small>
                    </div>   
                </div>
            </router-link>
        </div>
        <div v-else-if="stream.getPathType() === 'u'">
            <a :href="path" target="_blank" rel="noreferrer noopener">
                <div @mouseenter="tooltip($event.target, path)">
                    <div class="flex gap-x-1 fg70"><span class="oi oi-globe text-sm"></span> <StreamName :name="stream.getName()" /></div>
                </div>
            </a>
        </div>
        <div v-else-if="stream.getPathType() === 'i'">
            <a v-if="path.startsWith('https://')" :href="path" target="_blank" rel="noreferrer noopener">
                <div @mouseenter="tooltip($event.target, path)">
                    <div class="flex gap-x-1 fg70"><span class="oi oi-external-link text-sm"></span> <StreamName :name="stream.getName()" /></div>
                </div>
            </a>
            <router-link v-else :to="`${path}`">
                <div>
                    <div class="fg70"><span class="oi oi-info text-center" style="width:14px;"></span> <StreamName :name="stream.getName()" /></div>
                </div>
            </router-link>
        </div>
        <div v-else>
            <div>
                <div><StreamName :name="stream.getName()" /></div>
            </div>
        </div>
    </div>
</template>
<script setup type="ts">
import HashIcon from "../assets/images/icons/hashicon.svg";
import HashLockIcon from "../assets/images/icons/hashlockicon.svg";
const tooltip = ref(window.tooltip);
const props = defineProps({
    stream: Object,
    community: String,
    number: String
});
function getPath() {
    var path = props.stream.getPath();
    if(path==null) return '';
    if(path.getType() === 't')
        return '/t/'+path.getUser()+'/'+path.getPath();
    if(path.getType() === 'g')
        return '/g/'+props.community+'/'+path.getUser()+'/'+path.getPath();
    if(path.getType() === 'i') {
        if(path.getPath() === 'created')
            return 'https://peakd.com/c/'+path.getUser()+'/created';

        return '/i/'+path.getUser()+'/'+path.getPath();
    }
    if(path.getType() === 'u') return path.getPath();
    return '';
}
const path = getPath(); 
</script>
<style scoped>
.style {
    border: 1px solid transparent;
    padding:3px;
}
.selected { 
    @apply rounded;
    /*background: linear-gradient(rgba(255,255,255,0.25), rgba(0,0,0,0.1));*/
    /*background: rgba(255,255,255,0.37);*/
    background: #404249;
    border: 1px solid rgba(0,0,0,0.01);
    border-top-color: rgba(255,255,255,0.1);
    color: white;
}
.number {
    display: block;
    pointer-events: none;
    color: white;
    background: rgb(0, 113, 12);
    border-radius: 10px;
    margin-top: 5px;
    padding: 2px 4px;
    line-height: 1;
}
</style>

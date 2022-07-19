<template>
    <div class="flex pt-1">
        <div v-if="stream.getPathType() === null">
            <b>{{stream.getName()}}</b>
        </div>
        <div v-else-if="stream.getPathType() === 't'">
            <router-link :to="`/${path}`">
                    <div>
                        <div class="pl-2"><b>{{stream.getName()}}</b></div>
                    </div>
            </router-link>
        </div>
        <div v-else>
            <div>
                <div><b>{{stream.getName()}}</b></div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    stream: Object
});
function getPath() {
    var path = props.stream.getPath();
    if(path==null) return '';
    if(path.getType() === 't') {
        return 't/'+path.getUser()+'/'+path.getPath();
    }
    return '';
}
const path = getPath(); 
console.log("stream is");
console.log(props.stream);
</script>
<style>

</style>

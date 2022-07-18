<template>
    <router-link :to="`/c/${conversation}`">
        <div class="flex pt-1">
            <div>
                <div><b>{{stream.getName()}}</b></div>
            </div>
        </div>
    </router-link>
</template>
<script setup>
const props = defineProps({
    stream: Object
});
const conversation = props.stream.getPath()==null?'':props.stream.getPath().toString();
console.log("stream is");
console.log(props.stream);
</script>
<style>

</style>

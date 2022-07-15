<template>
    <router-link :to="`/${conversation}`">
        <div class="flex pt-1">
            <div> 
                <div>{{name}}</div>
            </div>    
        </div>
    </router-link>
</template>
<script setup>
const props = defineProps({
    name: String,
    conversation: String,
});
</script>

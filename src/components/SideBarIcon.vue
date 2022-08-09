<template>
  <div class="flex nameParent relative items-center justify-start">
    <small class="name"><b>{{name}}</b></small>
    <div class="flex-shrink-0 p-1" :class="{selected: $route.params.user == img}" 
            :title="`${name} (${img})`">
        <router-link :to="`/i/${img}/about`">
            <img
            class="rounded-full avCommunity"
            :src="`https://images.hive.blog/u/${img}/avatar/small`"
            alt="@"
            />
        </router-link>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
    img: String,
    name: String,
});
</script> 
<style scoped>
.name {
    display: none;
    pointer-events: none;
}
.nameParent:hover .name{
    display: block;
    position: absolute;
    z-index: 7;
    /*background: rgba(0,0,0,0.25);*/
    background: rgba(227, 19, 55, 0.5);
    padding: 0;
    margin: 0;
    align-self: flex-start;
}
.selected { 
    @apply rounded;
    background: rgba(255,255,255,0.37);
}
</style>

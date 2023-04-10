<template>
   <DefaultModal>
        <Join :showCommunity="false" @onjoin="onJoin"></Join>
   </DefaultModal>          
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
var nextPage = '/home';
function initPath() {
    var path = route.path;
    if(path.startsWith('/t/') && stlib.Utils.isCommunityConversation(path.substring(3)))
        nextPage = path;
}
initPath();
function onJoin() {
    window.refreshApp();
    router.push(nextPage);
}
</script>

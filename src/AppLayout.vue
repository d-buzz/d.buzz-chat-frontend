<template>
    <div class="tooltip" ref="tooltipRef" hidden></div>
  <div class="flex min-h-full h-screen appbg2 appfg2" :key="updateKey">
    <div class="h-screen flex flex-col appbg0 appfg0">
        <SideBar2 v-if="globalProperties.sidebar === 2" @toggleStreambar="toggleStreambar()"></SideBar2>
        <SideBar v-else @toggleStreambar="toggleStreambar()"></SideBar>
    </div>
    <div class="streambar flex flex-col appbg1 appfg1 border-r-1" ref="streamBar">
        <StreamBar :key="getKey(route.path)"></StreamBar>
    </div>
    <div class="grow" @click="hideStreambar()">
        <router-view :key="getKey(route.path)"></router-view>
    </div>
  </div>
</template>
<script setup>
const tooltipRef = ref();
const updateKey = ref('#'+stlib.Utils.nextId());
const globalProperties = ref(window.globalProperties);
const streamBar = ref(null);
const route = useRoute();
function getKey(path) {
    return path + stlib.Utils.nextId();
}
function toggleStreambar() {
    var value = streamBar.value.dataset.show;
    streamBar.value.dataset.show = !("true" === value);
}
function showStreambar(visible=true) {
    streamBar.value.dataset.show = visible;
}
window.onclickoutside = new stlib.EventQueue();
function hideStreambar() {
    streamBar.value.dataset.show = false;
    window.onclickoutside.post();
}
function showTooltip(element, text) {
    var el = tooltipRef.value;  
    if(el == null) return;
    el.innerText = text;
    var pos = element.getBoundingClientRect();
    var x = 0.5*(pos.left+pos.right);
    var y = pos.bottom;

    el.setAttribute('style','left:'+x+'px;'+'top:'+y+'px;')
    el.hidden = false;
    el.currentElement = element;

    var listener = null;
    listener = ()=>{
        element.removeEventListener("mouseleave", listener);
        el.hidden = true;
    };
    element.addEventListener("mouseleave", listener);
    setTimeout(()=>{
        if(el.currentElement == element) {
            listener();
        }
    }, 5000);
}
window.tooltip = showTooltip;
window.showStreambar = showStreambar;
window.toggleStreambar = toggleStreambar;
window.refreshApp = ()=>{ updateKey.value = '#'+stlib.Utils.nextId(); }; //debug purpose
</script>
<style scoped>
@media (max-width: 767px) {
    .streambar {
        display: none;
        position: fixed;
        z-index: 7;
        left: 63px;
        top: 23px;
        border-top: 1px solid #0000002e;
        border-bottom: 1px solid #0000002e;
        padding-bottom: 20px;
    }
    .streambar[data-show="true"] {
        display: block;
    }
}
.tooltip {
    position: fixed;
    z-index: 100;
    color:white;
    background-color:#111111aa;
    border-radius:5px;
    font-size: 16px;
    padding: 2px 7px;
}
</style>

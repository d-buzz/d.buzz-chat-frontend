<template>
<div class="appbg2 appfg2" style="height:100%;">
  <section>
    <nav class="navbar navbar-expand-lg shadow-md py-2 appbg0 relative flex items-center w-full justify-between">
      <div class="px-6 w-full flex flex-wrap items-center justify-between">
        <div class="flex items-center">
          <a class="navbar-brand" href="/">
            <span class="oi oi-menu"></span>
          </a>
        </div>
        <div class="grow items-center" id="navbarSupportedContentY">
          <ul class="navbar-nav mr-auto flex flex-row">
            <li class="nav-item">
              <a class="nav-link block pr-2 px-2 py-2 text-gray-600 hover:text-gray-700 focus:text-gray-700 transition duration-150 ease-in-out" href="/" data-mdb-ripple="true" data-mdb-ripple-color="light"><span class="appfg1">Home</span></a>
            </li>
          </ul>
        </div>
     
      </div>
    </nav>

    <div class="flex min-h-full h-screen flex-row appbg2 appfg2 text-left">
        <div class="appbg1 appfg1 px-3 pt-5 pb-2 border-r-1 font-lg" style="min-width: 150px ">
            <b>Contents</b>
            <hr class="mb-1"/>
            <div v-for="section in sections" class="cursor-pointer mt-1 mb-1 fg70 hover:opacity-100" @click="visit(section[1])">
                {{section[0]}}
            </div>
        </div>
        <div class="grow overflow-y-scroll scrollBox">
            <div class="scrollBoxContent">
                <div class="px-5 pt-2 pb-10 mb-10 md mdh" ref="page"></div>
            </div>
        </div>
    </div>   
  </section>
</div>
</template>
<script setup>
import intro from '../../docs/introduction-welcome.md?raw'
import quickstart from '../../docs/quickstart.md?raw'
var page = ref(null);
var sections = [
    ["Introduction", intro],
    ["Quickstart", quickstart],
    ["Tutorial", "*to be added*"],
    ["API", "*to be added*"],
    ["Image Uploader", "*to be added*"],
    ["Widget", "*to be added*"]
];
function visit(text) {
    var element = page.value;
    element.innerHTML = "";
    stlib.Markdown.simpleMarkdown(text, element);
}
function init() { 
    visit(intro);
}
nextTick(init);
</script>
<style scoped>

</style>


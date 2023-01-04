<template>
<div>
  <section class="mb-40">
    <nav class="navbar navbar-expand-lg shadow-md py-2 bg-white relative flex items-center w-full justify-between">
      <div class="px-6 w-full flex flex-wrap items-center justify-between">
        <div class="flex items-center">
          <a class="navbar-brand text-green-700" href="#!">
            <span class="oi oi-chat"></span>
          </a>
        </div>
        <div class="grow items-center" id="navbarSupportedContentY">
          <ul class="navbar-nav mr-auto flex flex-row">
            <li class="nav-item">
              <a class="nav-link block pr-2 px-2 py-2 text-gray-600 hover:text-gray-700 focus:text-gray-700 transition duration-150 ease-in-out" href="#" data-mdb-ripple="true" data-mdb-ripple-color="light">Home</a>
            </li>
          </ul>
        </div>
        <div class="flex items-center lg:ml-auto">
          <span class="inline-block px-6 py-2 mr-2 bg-green-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="light"
             role="button" @click="toggleWidget()">
                <span class="oi oi-envelope-open"></span> Open Widget
          </span>
        </div>
      </div>
    </nav>

    <div class="px-6 py-12 md:px-12 bg-gray-50 text-gray-800 text-center lg:text-left">
      <div class="container mx-auto xl:px-32">
        <div class="grid lg:grid-cols-2 gap-12 flex items-center">
          <div class="mt-12 lg:mt-0">
            <h1 class="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-12">Widget test page.</h1>
          </div>
          <div class="mb-12 lg:mb-0">
             
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
    <div ref="widget" class="widget"></div>
</template>
<script setup>
import { nextTick } from 'vue';
const widget = ref();
function initWidget() {
    var e = widget.value;
    e.hidden = true;
    var iframe = document.createElement('iframe');
    iframe.src = '/home';
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    e.appendChild(iframe);
}
nextTick(initWidget);

function toggleWidget() {
    var e = widget.value;
    if(e) {
        e.hidden = !e.hidden;
    }
}
</script>
<style scoped>
.widget {
    position: absolute;
    z-index: 10000;
    border: 1px solid gray;
    width: 400px;
    height: 556px;
    top: 51px;
    right: 32px;
}
</style>


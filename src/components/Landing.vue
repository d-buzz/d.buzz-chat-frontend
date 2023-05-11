<template>
<div class="appbg1 appfg1" style="height:100%;">
  <section class="b-40">
    <nav class="navbar navbar-expand-lg shadow-md py-2 appbg0 appfg0 relative flex items-center w-full justify-between">
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
        <div class="flex items-center gap-5 lg:ml-auto">
          <span class="cursor-pointer oi oi-contrast" @click="toggleTheme" @mouseenter="tooltip($event.target, 'Switch between Light/Dark themes.')"></span>
          <button class="btn" data-mdb-ripple="true" data-mdb-ripple-color="light" @click="setAppAB('a')" role="button">{{$t("Landing.openApp")}}</button>
        </div>
      </div>
    </nav>

    <div class="appbg1 appfg1 px-6 py-12 md:px-12 text-center lg:text-left">
      <div class="container mx-auto xl:px-32">
        <div class="grid lg:grid-cols-2 gap-12 flex">
          <div class="mt-12 lg:mt-0">
            <h1 class="text-5xl md:text-6xl xl:text-7xl font-bold mb-12"><span class="">A place </span><br /><span class="text-green-600">for your community</span></h1>
            <div>
                <div><small class="fg70">Alpha release: A/B testing two interfaces</small>  </div>          
                <div>
                    <button class="btn" data-mdb-ripple="true" data-mdb-ripple-color="light" @click="setAppAB('a')" role="button">{{$t("Landing.openApp")}}</button>
                    <button class="btn" data-mdb-ripple="true" data-mdb-ripple-color="light" @click="setAppAB('b')" role="button">Open with different UI</button>
                </div>
                <div><small class="fg70">Widget test page:</small></div>          
                <a class="btn2" data-mdb-ripple="true" data-mdb-ripple-color="light" href="/widgettest" role="button">Widget test page</a>
            
                <div class="mt-20 fg70"><small>Frequently Asked Questions:</small></div> 
                <div class="mt-1"><b>What is the app about?</b></div>
                <div>This app brings decentralized messaging for hive users, guests and hive communities.</div>
                <div class="mt-1"><b>Is hive keychain required?</b></div>
                <div>Currently, hive keychain is used for signing, encoding and decoding messages. It is not required for guests.</div>             
                <div class="mt-1"><b>What are the core features?</b></div>
                <div>Direct and group encrypted messaging, public community messaging. Each hive community's admin can customize their chat space including the use of roles, titles and visibility/write permissions.</div>             
                <div class="mt-1"><b>Where are the message stored?</b></div> 
                <div>The messages are stored on decentralized messaging backend nodes.</div> 
                <div class="mt-1"><b>Does messaging use Hive RC?</b></div> 
                <div>Messaging does not use RC, however some activities such as setting up community channels, setting roles and titles uses hive and RC.</div>         
                <div class="mt-1"><b>How are messages authenticated?</b></div>
                <div>Each message is signed by a posting key and verified both by the backend nodes and by the frontend UI.</div>             
            </div>
          </div>
          <div class="mb-12 lg:mb-0">
             <img
                    class="w-full rounded-full"
                    :src="`https://images.hive.blog/u/peakd/avatar/large`"
                    alt="@"
                    />
            
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
</template>
<script setup>
import { applyTheme } from "../Theme"
import { nextTick } from 'vue';
const tooltip = ref(window.tooltip);
const router = useRouter();
function toggleTheme() {
    var name = defaultTheme.themeName === 'Light'?'Dark':'Light';
    defaultTheme.setTheme(name);
    applyTheme(name);
}
function setAppAB(type) {
    window.localStorage.setItem("apptype", type);
    nextTick(async () => {
        window.location = '/home';    
    });
}
</script>

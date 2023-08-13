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
        <div class="appbg1 appfg1 px-3 pt-5 pb-2 border-r-1 font-lg overflow-y-scroll scrollBox" style="min-width: 200px ">
            <div class="scrollBoxContent">
                <b>Contents</b>
                <hr class="mb-1"/>
                <div v-for="section in sections" class="mt-1 mb-1">
                    <div class="cursor-pointer fg70 hover:opacity-100" @click="visit(section[1], section[2])">{{section[0]}}</div>
                    <div v-if="section.length > 3 && route.params.page === section[2]" class="ml-3">
                        <div class="cursor-pointer fg70 hover:opacity-100" v-for="subsection in section[3]" @click="">
                            <a class="break-none" :href="`#${subsectionHref(subsection)}`">{{subsection}}</a>
                        </div>
                    </div>
                </div>
                <div class="pb-10 mb-10"></div>
            </div>
        </div>
        <div class="grow overflow-y-scroll scrollBox">
            <div class="scrollBoxContent">
                <div class="px-5 pt-2 md mdh" ref="page" style="max-width: 750px;"></div>
                <div class="px-5 pt-2 md mdh" v-if="route.params.page === 'api'">
                    <div v-for="cls in stlibClassObjs">
                        <ApiClass :cls="cls"></ApiClass>
                    </div>
                </div>
                <div class="pb-10 mb-10"></div>
            </div>
        </div>
    </div>   
  </section>
</div>
</template>
<script setup>
import intro from '../../docs/introduction.md?raw'
import quickstart from '../../docs/quickstart.md?raw'
import restapi from '../../docs/restapi.md?raw'
import websocketapi_helloworld from '../../docs/websocketapi_helloworld.md?raw'
import widget from '../../docs/widget.md?raw'
import docsRaw from '../../docs/stlibdocs.json?raw'
const docs = JSON.parse(docsRaw);
window.docs = docs;
var stlibClasses = null;
var stlibClassObjs = ref([]);
var stlibIntro = null;
const router = useRouter();
const route = useRoute();
var page = ref(null);
function toText(summary) {
    var text = "";
    for(var item of summary)
        text += item.text;
    return text;
}
function subsectionHref(name) {
    return "api_"+(name.startsWith("↳ ")?name.substring(2):name);
}
function initDocs() {
    var classArr = [];
    var arr = [];    
    for(var item of docs.children) {
        if((item.kind & 0x84) !== 0) {
            arr.push(item.name);
            classArr.push(item);
            if(item.children) {
                for(var item2 of item.children) {
                    if((item2.kind & 0x84) !== 0) {
                        arr.push("↳ "+item2.name); 
                        classArr.push(item2);
                    }
                }   
            }
        }
    }
    stlibClasses = arr;
    stlibClassObjs.value = classArr;

    stlibIntro = "# API\n";
    /*for(var item of classArr) {
        stlibIntro += `## ${item.name } \n`;
        stlibIntro += `*${item.sources[0].fileName }* \n`;
        if(item.comment) {
            stlibIntro += toText(item.comment.summary) + '\n';
        }
        if(item.children) {
            for(var item2 of item.children) {
                if((item2.kind & 0x84) === 0) {
                    stlibIntro += `**${item2.name }**`;
                    if(item2.signatures) {  
                        stlibIntro += `(`;
                        var params = item2.signatures[0].parameters;
                        if(params) {
                            for(var param of params)
                                stlibIntro += `${param.name}: ${param.type.name}, `;
                        }
                        stlibIntro += `)\n`;
                        
                        if(item2.signatures[0].comment)
                            stlibIntro += toText(item2.signatures[0].comment.summary) + '\n';
                    }
                    else stlibIntro += `\n`;
                }
            }
        }
    }*/
}
initDocs();
var sections = [
    ["Introduction", intro, "intro"],
    ["Quickstart", quickstart, "quickstart"],
    ["Tutorial", websocketapi_helloworld, "tutorial"],
    ["API", stlibIntro, "api", stlibClasses],
    ["Rest API", restapi, "restapi"],
    ["Image Uploader", "*to be added*", "uploader"],
    ["Widget", widget, "widget"]
];
function visit(text, url) {
    if(url != null) {
        router.replace('/docs/'+url);
    }
    var element = page.value;
    element.innerHTML = "";
    stlib.Markdown.simpleMarkdown(text, element);
}
function init() { 
    var page = route.params.page;
    for(var section of sections) {
        if(section[2] === page) {
            visit(section[1]);
            return;
        }
    }
    visit(intro);
}
nextTick(init);
</script>
<style scoped>

</style>


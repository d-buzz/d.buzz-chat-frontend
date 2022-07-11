import { createHead, renderHeadToString } from '@vueuse/head'
import { ViteSetupModule } from '~/config/types/ViteSetupModule'

export const priority = 1

function addScripts(scripts) {
    var headTag = document.getElementsByTagName("head")[0];
    for(var script of scripts) {
        var stlibTag = document.createElement("script");
        stlibTag.src = script;
        headTag.appendChild(stlibTag);
    }
}
export const install: ViteSetupModule = ({ app }) => {
    const head = createHead()
    app.use(head);

    addScripts(["/stlib.js", "/dhive.js", "/hive.min.js", "/socket.io.js"]);
}

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { ViteSetupModule } from "../config/types/ViteSetupModule";
import { useModulesStore } from "../stores/modules";
import { useAccountStore } from "../stores/account";

export const priority = 98;

var initStarted = false;
async function initApp() {
    if(initStarted) return;
    initStarted = true;
    console.log("init app");
    const NETWORK_NAME = import.meta.env.VITE_APP_NETWORK_NAME?import.meta.env.VITE_APP_NETWORK_NAME:null;
    //const STING_NODES = import.meta.env.VITE_APP_STING_NODES ? import.meta.env.VITE_APP_STING_NODES.split(",") : ["http://localhost:3001"];
    /*var currentManager = null;
    window.getManager = function () {
      if (currentManager == null) {
        currentManager = new stlib.MessageManager();
        currentManager.setNodes(STING_NODES);
      }
      return currentManager;
    };*/
    document.addEventListener('visibilitychange', async function (event) {
        var manager = getManager();
        if (document.hidden) {
            manager.pauseAutoDecode = true;
        } else {
            manager.pauseAutoDecode = false;
            var prefs = await manager.getPreferences();
            if(prefs !== null) {
                var isAutoDecode = prefs.getValueBoolean("autoDecode", false);
                if(isAutoDecode) await manager.decodeSelectedConversations();
            }
        }
    });
    if(NETWORK_NAME == null) {
        try {
            const manager = getManager();
            var result = await manager.getClient().readInfo();
            if(result.isSuccess()) 
                stlib.Utils.setNetworkname(result.getResult().name);
        }
        catch(e) {
            console.log(e);
        }
    }
    else stlib.Utils.setNetworkname(NETWORK_NAME);

    try {
        await stlib.Utils.synchronizeTime();
        console.log("local time ", new Date());
        console.log("utc time ", new Date(stlib.utcTime()));
    }
    catch(e) {
        console.log(e);
    }
    console.log("init done");
}

export const install: ViteSetupModule = ({ app }) => {
  const modulesStore = useModulesStore();
  const accountStore = useAccountStore();
  const routes: Array<RouteRecordRaw> = modulesStore.enabledModules.flatMap((module: any) =>
    module.config.routes.map((route: RouteRecordRaw) => {
      const enriched = { ...route };
      if (!enriched.meta) {
        enriched.meta = {};
      }

      enriched.meta.module = module.config.name;
      return enriched;
    })
  );

    const router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        history: createWebHistory(),
        routes,
    });
    router.beforeEach(async (to, from, next) => {
        //redirect if not logged and login is required
        if(!to.name || !to.name.startsWith('@!')) await initApp();
        if(to.name && !to.name.startsWith('@')) {
            if(accountStore.account.authenticated === null) await accountStore.initStore();
            if(accountStore.account.authenticated === null || accountStore.account.authenticated === false) {
                next('/join');
                return;
            }
        }
        next();
    });
    app.router = router;
    app.use(router);
};

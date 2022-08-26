import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { ViteSetupModule } from "../config/types/ViteSetupModule";
import { useModulesStore } from "../stores/modules";
import { useAccountStore } from "../stores/account";

export const priority = 98;

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
    router.beforeEach((to, from, next) => {
        //redirect if not logged and login is required
        if(to.name && !to.name.startsWith('@') && !accountStore.account.authenticated) {
            next('/join');
            return;
        }
        next();
    });
    app.router = router;
    app.use(router);
};

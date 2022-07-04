import { acceptHMRUpdate, defineStore } from "pinia";

export const useModulesStore = defineStore("modules", () => {
  const modules = import.meta.globEager("../**/config.ts");

  const enabledModules = computed(() => Object.values(modules).filter((m) => m.config?.enabled));

  return {
    enabledModules,
  };
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useModulesStore, import.meta.hot));

import { ViteSetupModule } from "../config/types/ViteSetupModule";

export const priority = 0;

export const install: ViteSetupModule = async ({ app }) => {
  const { registerSW } = await import("virtual:pwa-register");
  registerSW({ immediate: true });
};

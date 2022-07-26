import { RouteRecordRaw } from "vue-router";

const name = "sting";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Sting",
    component: () => import("./Landing.vue"),
  },
  {
    path: "/controlpanel",
    name: "Control Panel",
    component: () => import("./ControlPanel.vue"),
  },
  {
    path: "/s/:user",
    name: "CommunitySettings",
    component: () => import("./CommunitySettings.vue"),
  },
  {
    path: "/c/:user",
    name: "Community",
    component: () => import("./Community.vue"),
  },
  {
    path: "/t/:user/:path",
    name: "CommunityPath",
    component: () => import("./Community.vue"),
  },
  {
    path: "/i/:user/about",
    name: "CommunityAbout",
    component: () => import("./info/CommunityAbout.vue"),
  },
  {
    path: "/p/:user",
    name: "PrivateChat",
    component: () => import("./Community.vue"),
  },
];

export const config = {
  name: name,
  enabled: true, // this module cannot be disabled
  routes: routes,
};

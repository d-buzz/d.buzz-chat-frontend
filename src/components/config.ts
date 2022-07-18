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
    path: "/c/:user",
    name: "Community",
    component: () => import("./Community.vue"),
  },
  {
    path: "/c/:user/:path",
    name: "CommunityPath",
    component: () => import("./Community.vue"),
  },
  {
    path: "/p/@:user",
    name: "Private Chat",
    component: () => import("./PrivateChat.vue"),
  },
];

export const config = {
  name: name,
  enabled: true, // this module cannot be disabled
  routes: routes,
};

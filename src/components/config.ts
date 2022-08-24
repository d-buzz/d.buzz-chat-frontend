import { RouteRecordRaw } from "vue-router";

const name = "sting";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Landing",
    component: () => import("./Landing.vue"),
  },
  {
    path: "/join/:user",
    name: "Join",
    component: () => import("./Join.vue"),
  },
  {
    path: "/",
    component: () => import("../AppLayout.vue"),
    children: [
      {
        path: "/home",
        name: "Control Panel",
        component: () => import("./Home.vue"),
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
        path: "/g/:user/:path",
        name: "Group",
        component: () => import("./Community.vue"),
      },
      {
        path: "/p/:user",
        name: "PrivateChat",
        component: () => import("./Community.vue"),
      },
      {
        path: "/p/:user/:user2",
        name: "PrivateChat2",
        component: () => import("./Community.vue"),
      },
      {
        path: "/p/:user/:user2/:user3",
        name: "PrivateChat3",
        component: () => import("./Community.vue"),
      },

    ]
  }
];

export const config = {
  name: name,
  enabled: true, // this module cannot be disabled
  routes: routes,
};

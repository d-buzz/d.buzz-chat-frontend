import { RouteRecordRaw } from "vue-router";

const name = "sting";

/*
Paths with names not beginning with @ will
redirect to login page if user is not logged in.
*/
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "@!Landing",
    component: () => import("./Join.vue"),
  },
  {
    path: "/widgettest",
    name: "@!WidgetTest",
    component: () => import("./WidgetEditor.vue"),
  },
  {
    path: "/widgeteditor",
    name: "@!WidgetEditor",
    component: () => import("./WidgetEditor.vue"),
  },
  {
    path: "/docs/:page?",
    name: "@!ApiDocs",
    component: () => import("./ApiDocs.vue"),
  },
  {
    path: "/signbuffertestpage",
    name: "@!SignBufferTestPage",
    component: () => import("./SignBufferTestPage.vue"),
  },
  {
    path: "/join",
    name: "@Join0",
    component: () => import("./Join.vue"),
  },
  {
    path: "/join/:user",
    name: "@Join",
    component: () => import("./Join.vue"),
  },
  {
    path: "/",
    component: () => import("../AppLayout.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("./Home.vue"),
      },
      {
        path: "/mentions",
        name: "Mentions",
        component: () => import("./Page.vue"),
      },
      {
        path: "/preferences",
        name: "Preferences",
        component: () => import("./Page.vue"),
      },
      // {
      //   path: "/themes",
      //   name: "Themes",
      //   component: () => import("./Page.vue"),
      // },
      // {
      //   path: "/fonts",
      //   name: "Fonts",
      //   component: () => import("./Page.vue"),
      // },
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
        path: "/g/:community/:user/:path",
        name: "CommunityGroup",
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

import { createRouter, createWebHistory } from "vue-router";
import ControlPanel from "../components/ControlPanel.vue";

const routes = [
  {
    path: "/",
    name: "ControlPanel",
    component: ControlPanel,
  },
  {
    path: "/privatechat",
    name: "PrivateChat",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/PrivateChat.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

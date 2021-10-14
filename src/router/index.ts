import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Home from "../views/Home.vue"
import ChooseChosenCard from "../views/ChooseChosenCard.vue"
import Session from "../views/Session.vue"
import ReviewCard from "../views/ReviewCard.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/session",
    name: "Session",
    component: Session
  },
  {
    path: "/review",
    name: "Review",
    component: ChooseChosenCard
  },
  {
    path: "/review_card",
    name: "ReviewCard",
    component: ReviewCard,
    props: true
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

// {
//   path: "/about",
//   name: "About",
//   // route level code-splitting
//   // this generates a separate chunk (about.[hash].js) for this route
//   // which is lazy-loaded when the route is visited.
//   component: () =>
//     import(/* webpackChunkName: "about" */ "../views/About.vue"),
// },

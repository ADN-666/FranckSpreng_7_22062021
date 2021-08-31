import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";
import Signup from "../views/Signup";
import Login from "../views/Login";
import Posts from "../views/Posts";
import MyPosts from "../views/MyPosts";
import Profil from "../views/Profil";
import Users from "../views/Users";
import store from "../store/index";
import jwtDecode from "jwt-decode";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: (to, from, next) => {
      store.state.userInfos.isLog ? next({ name: "Posts" }) : next();
    },
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/users/all",
    name: "Users",
    component: Users,
  },
  {
    path: "/users/me/:id",
    name: "Profil",
    component: Profil,
  },

  {
    path: "/posts/all",
    name: "Posts",
    component: Posts,
    beforeEnter: (to, from, next) => {
      let token = jwtDecode(store.state.userInfos.token);
      if (token.exp > new Date().getTime() / 1000) {
        next();
      }
      next({ name: "Home" });
    },
  },
  {
    path: "/posts/:id",
    name: "MyPosts",
    component: MyPosts,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

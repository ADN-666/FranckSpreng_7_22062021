import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";
import Signup from "../views/Signup";
import Login from "../views/Login";
import Posts from "../views/Posts";
import MyPosts from "../views/MyPosts";
import Profil from "../views/Profil";
import Users from "../views/Users";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/users/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/users/login",
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

import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import instance from "../axios/configAxios";
import router from "../router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    upKey: 0,

    like: {
      userId: "",
      postId: "",
      isLike: "",
      isDislike: "",
    },
    userInfos: {
      isLog: false,
      loader: false,
      userId: "",
      username: "",
      avatar: "",
      token: "",
    },
  },
  mutations: {
    TOKEN(state, payload) {
      state.userInfos.token = payload;
    },
    ISLOG(state, payload) {
      state.userInfos.isLog = payload;
    },
    LOADER(state, payload) {
      state.userInfos.loader = payload;
    },
    USERID(state, payload) {
      state.userInfos.userId = payload;
    },
    USERNAME(state, payload) {
      state.userInfos.username = payload;
    },
    AVATAR(state, payload) {
      state.userInfos.avatar = payload;
    },
    POSTS(state, payload) {
      state.posts = payload;
    },
    COMMENTS(state, payload) {
      state.comments = payload;
    },
    NEWPOST(state, payload) {
      state.posts = payload;
    },
    KEY(state) {
      state.upKey += 1;
    },
    KEYDEL(state) {
      state.upKey = 0;
    },
  },
  getters: {
    getToken: (state) => {
      return state.userInfos.token;
    },
  },
  actions: {
    signup({ commit }, formData) {
      instance
        .post("/users/signup", formData)
        .then((response) => {
          commit("TOKEN", response.data.token);
          commit("ISLOG", true);
          commit("USERID", response.data.userId);
          commit("USERNAME", response.data.username);
          commit("AVATAR", response.data.avatar);
          localStorage.setItem("token", response.data.token);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    login({ commit }, form) {
      instance
        .post("/users/login", form)
        .then((response) => {
          commit("TOKEN", response.data.token);
          commit("ISLOG", true);
          commit("USERID", response.data.userId);
          commit("USERNAME", response.data.username);
          commit("AVATAR", response.data.avatar);
          localStorage.setItem("token", response.data.token);
          router.push({ name: "Posts" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    allposts({ commit }) {
      instance
        .get("/posts/all", {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          commit("POSTS", response.data);
        })
        .catch((error) => {
          error;
        });
    },
    newPost({ commit }, form) {
      instance
        .post("/posts/", form)
        .then(() => {
          commit("KEY");
        })
        .catch((error) => {
          error;
        });
    },
  },

  plugins: [createPersistedState()],
});

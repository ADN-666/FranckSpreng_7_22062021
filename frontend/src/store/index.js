import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });
import instance from "../axios/configAxios";
import router from "../router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    comments: [],

    upKey: 0,
    errors: "",

    userInfos: {
      isLog: false,
      isAdmin: false,
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
    ISLOG(state, value) {
      value ? (state.userInfos.isLog = value) : (state.userInfos.isLog = "");
    },
    ISADMIN(state, payload) {
      state.userInfos.isAdmin = payload;
    },
    USERID(state, value) {
      value ? (state.userInfos.userId = value) : (state.userInfos.userId = "");
    },
    USERNAME(state, value) {
      value ? (state.userInfos.username = value) : (state.userInfos.username = "");
    },
    AVATAR(state, value) {
      value ? (state.userInfos.avatar = value) : (state.userInfos.avatar = "");
    },
    POSTS(state, payload) {
      state.posts = payload;
    },
    COMMENTS(state, payload) {
      state.comments = payload;
    },
    KEY(state) {
      state.upKey += 1;
    },
    KEYDEL(state) {
      state.upKey = 0;
    },
    ERRORS(state, value) {
      value ? (state.errors = value) : (state.errors = "");
    },
  },

  actions: {
    signup({ commit }, formData) {
      instance
        .post("/users/signup", formData)
        .then((response) => {
          commit("TOKEN", response.data.token);
          commit("ISLOG", true);
          commit("ISADMIN", response.data.isAdmin);
          commit("USERID", response.data.userId);
          commit("USERNAME", response.data.username);
          commit("AVATAR", response.data.avatar);
          commit("ERRORS");
          router.push({ name: "Posts" });
        })
        .catch((error) => {
          commit("ERRORS", JSON.stringify(error.response.data));
        });
    },
    login({ commit }, form) {
      instance
        .post("/users/login", form)
        .then((response) => {
          commit("TOKEN", response.data.token);
          commit("ISLOG", true);
          commit("ISADMIN", response.data.isAdmin);
          commit("USERID", response.data.userId);
          commit("USERNAME", response.data.username);
          commit("AVATAR", response.data.avatar);
          commit("ERRORS");
          router.push({ name: "Posts" });
        })
        .catch((error) => {
          commit("ERRORS", JSON.stringify(error.response.data));
        });
    },
    allPosts({ commit }) {
      instance
        .get("/posts/all", {
          headers: { Authorization: `bearer ${this.state.userInfos.token}` },
        })
        .then((response) => {
          commit("POSTS", response.data);
        })
        .catch((error) => {
          error;
        });
    },
    allComs({ commit }) {
      instance
        .get(`/posts/comments/all`, {
          headers: { Authorization: `bearer ${this.state.userInfos.token}` },
        })
        .then((response) => {
          commit("COMMENTS", response.data);
        })
        .catch((error) => {
          error;
        });
    },
  },

  plugins: [
    createPersistedState({
      key: "token",
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
      paths: ["userInfos"],
    }),
  ],
});

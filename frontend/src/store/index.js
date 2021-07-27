import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    like: {
      userId: "",
      postId: "",
      isLike: "",
      isDislike: "",
    },
    userInfos: {
      isLog: false,
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
    LOADER(state, payload) {
      state.loader = payload;
    },
    ISLOG(state, payload) {
      state.userInfos.isLog = payload;
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
  },
  getters: {},
  actions: {},

  plugins: [createPersistedState()],
});

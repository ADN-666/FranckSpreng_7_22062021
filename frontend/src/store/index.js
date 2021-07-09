import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    formUser: {
      username: "",
      email: "",
      password: "",
      avatar: "",
      bio: "",
    },
    formPost: {
      id: "",
      title: "",
      content: "",
    },
    formComment: {
      id: "",
      comment: "",
    },
    user: {
      id: "",
      username: "",
      avatar: "",
      isAdmin: "",
      createdAt: "",
    },
    post: {
      id: "",
      userId: "",
      title: "",
      content: "",
      createdAt: "",
      updatedAt: "",
      nbComments: "",
      like: "",
      dislike: "",
    },
    comment: {
      id: "",
      userId: "",
      postId: "",
      content: "",
      createdAt: "",
      updatedAt: "",
    },
    like: {
      userId: "",
      postId: "",
      isLike: "",
      isDislike: "",
    },
  },
  mutations: {},
  actions: {},
  modules: {},
});

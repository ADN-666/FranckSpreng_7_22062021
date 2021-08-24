<template>
  <div class="MyPosts container">
    <b-jumbotron bg-variant="white" class="my-5 shadow-lg">
      <h4 v-if="this.posts.length == 0 && userInfos.userId == $route.params.id">
        Vous n'avez pas de publication pour l'instant
      </h4>
      <h4 v-else-if="this.posts.length == 0 && userInfos.userId != $route.params.id">
        Cet utilisateur n'a pas de publication pour l'instant
      </h4>
      <NewPost v-if="userInfos.userId == $route.params.id" />
      <Post
        v-for="post of postPagin"
        :postId="post.id"
        :title="post.title"
        :content="post.content"
        :userId="post.userId"
        :createdAt="post.createdAt"
        :nbComments="post.nbComments"
        :Likes="post.Likes"
        :Dislikes="post.Dislikes"
        :username="post.P_User.username"
        :avatar="post.P_User.avatar"
        :key="post.id"
      />
    </b-jumbotron>
    <b-pagination
      v-if="rows > 2"
      class="mb-5 text-info"
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="post"
      hide-goto-end-buttons
      align="center"
      pills
      page-class="dark"
    ></b-pagination>
  </div>
</template>

<script>
import NewPost from "@/components/NewPost";
import Post from "@/components/Post";
import instance from "../axios/configAxios";
import { mapState } from "vuex";

export default {
  name: "MyPosts",
  components: { NewPost, Post },
  data() {
    return {
      posts: [],
      user: "",
      perPage: 2,
      currentPage: 1,
    };
  },

  mounted() {
    this.user = this.$route.path;
    this.getPosts();
    if (this.posts.length == 0 && this.userInfos.userId != this.$route.params.id) {
      setTimeout(() => {
        this.$router.push({ name: "Users" });
      }, 2500);
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (this.user == this.$route.path) {
      next();
    }
    this.user = this.$route.path;
    this.getPosts();

    next();
  },

  computed: {
    ...mapState(["userInfos"]),
    postPagin() {
      return this.posts.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
    rows() {
      return this.posts.length;
    },
  },

  methods: {
    getPosts() {
      instance
        .get(`${this.user}`, {
          headers: { Authorization: `bearer ${this.userInfos.token}` },
        })
        .then((response) => (this.posts = response.data))
        .catch((error) => {
          error;
        });
    },
  },
};
</script>
<style></style>

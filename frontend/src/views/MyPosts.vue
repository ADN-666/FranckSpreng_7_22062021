<template>
  <div class="MyPosts container">
    <b-jumbotron bg-variant="white" class="my-5 shadow-lg">
      <NewPost />
      <Post
        v-for="post of postPagin"
        :postId="post.id"
        :title="post.title"
        :content="post.content"
        :userId="post.userId"
        :imageUrl="post.imageUrl"
        :createdAt="post.createdAt"
        :nbComments="post.nbComments"
        :Likes="post.Likes"
        :Dislikes="post.Dislikes"
        :P_Likes="post.P_Likes[0]"
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

  updated() {
    //condition permettant le renvoi vers la page des posts si il n'y en a pas
    if (this.posts.length == 0) {
      this.$router.push({ name: "Posts" });
    }
  },

  mounted() {
    //affichage des posts et commentaires au rendu de la page
    this.user = this.$route.path;
    this.getPosts();
    this.$store.dispatch("allComs");
  },

  beforeRouteUpdate(to, from, next) {
    //controle des paramètres de la route pour renvoi vers la page concernée
    if (this.user == this.$route.path) {
      next();
    }
    this.user = this.$route.path;
    this.getPosts();
  },

  computed: {
    ...mapState(["userInfos"]),
    postPagin() {
      //fonction de pagination de la page
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

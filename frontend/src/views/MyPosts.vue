<template>
  <div class="MyPosts container">
    <b-jumbotron bg-variant="light" class="my-5">
      <h4 v-if="this.posts == ''">Vous n'avez pas de publications pour l'instant</h4>
      <NewPost />
      <Post
        v-for="post of posts"
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
  </div>
</template>

<script>
import NewPost from "@/components/NewPost";
import Post from "@/components/Post";
import instance from "../axios/configAxios";

export default {
  name: "MyPosts",
  components: { NewPost, Post },
  data() {
    return {
      posts: [],
      user: "",
    };
  },

  mounted() {
    this.user = this.$route.path;
    this.getPosts();
  },
  beforeRouteUpdate(to, from, next) {
    if (this.user == this.$route.path) {
      next();
    }
    this.user = this.$route.path;
    this.getPosts();

    next();
  },

  methods: {
    getPosts() {
      instance
        .get(`${this.user}`, {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
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

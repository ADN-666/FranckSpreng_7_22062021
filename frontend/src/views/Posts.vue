<template>
  <div class="Posts container">
    <b-jumbotron bg-variant="light" class="my-5">
      <Post
        v-for="post in posts"
        :id="post.id"
        :title="post.title"
        :content="post.content"
        :userId="post.userId"
        :nbComments="post.nbComments"
        :like="post.P_Likes[0]"
        :dislike="post.P_Likes[1]"
        :username="post.P_User.username"
        :avatar="post.P_User.avatar"
        :key="post.id"
      />

      <b-button class="mt-5" :to="{ name: 'NewPost' }">Créer un post</b-button>
    </b-jumbotron>
  </div>
</template>

<script>
import Post from "@/components/Post/Post";
const axios = require("axios");
const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
});
export default {
  name: "Posts",
  components: { Post },
  data() {
    return {
      posts: [],
    };
  },
  mounted() {
    instance
      .get("/posts/all")
      .then((response) => (this.posts = response.data))

      .catch((error) => {
        error;
      });
  },
};
</script>
<style></style>

/* for (let i in response.data) { this.post.id = response.data[i].id; this.post.title =
response.data[i].title; this.post.content = response.data[i].content; this.post.userId =
response.data[i].userId; this.post.nbComments = response.data[i].nbComments; this.post.like =
response.data[i].P_Likes[0]; this.post.dislike = response.data[i].P_Likes[1]; this.post.username =
response.data[i].P_User.username; this.post.avatar = response.data[i].P_User.avatar; } */

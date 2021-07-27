<template>
  <div class="Posts container">
    <b-jumbotron bg-variant="light" class="my-5">
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
        :isLike="post.P_Likes.isLike"
        :isDislike="post.P_Likes.isDislike"
        :username="post.P_User.username"
        :avatar="post.P_User.avatar"
        :key="post.id"
      />
    </b-jumbotron>
  </div>
</template>

<script>
import Post from "@/components/Post";
import NewPost from "@/components/NewPost";
import instance from "../axios/configAxios";

export default {
  name: "Posts",
  components: { Post, NewPost },
  data() {
    return {
      posts: [],
    };
  },

  beforeMount() {
    this.getPosts();
  },

  methods: {
    getPosts() {
      instance
        .get("/posts/all")
        .then((response) => (this.posts = response.data))
        .catch((error) => {
          error;
        });
    },
  },
};
</script>
<style></style>

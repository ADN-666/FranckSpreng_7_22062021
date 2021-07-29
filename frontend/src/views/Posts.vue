<template>
  <div class="Posts container">
    <b-jumbotron bg-variant="light" class="my-5">
      <NewPost />

      <Post
        v-for="post in posts"
        :key="post.id"
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
      />
    </b-jumbotron>
  </div>
</template>

<script>
import Post from "@/components/Post";
import NewPost from "@/components/NewPost";
import { mapActions, mapState } from "vuex";

export default {
  name: "Posts",
  components: { Post, NewPost },
  data() {
    return {};
  },

  computed: {
    ...mapState(["posts", "userInfos"]),
    ...mapActions(["allposts"]),
  },

  mounted() {
    this.$store.dispatch("allposts");
  },

  methods: {},
};
</script>
<style></style>

<template>
  <div class="Posts container">
    <b-jumbotron bg-variant="white" class="my-5 shadow-lg">
      <NewPost />

      <Post
        v-for="post in postPagin"
        :key="post.id"
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
import Post from "@/components/Post";
import NewPost from "@/components/NewPost";
import { mapActions, mapState } from "vuex";

export default {
  name: "Posts",
  components: { Post, NewPost },
  data() {
    return {
      perPage: 2,
      currentPage: 1,
    };
  },

  computed: {
    ...mapState(["posts"]),
    ...mapActions(["allPosts", "allComs"]),
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

  mounted() {
    this.$store.dispatch("allPosts");
    this.$store.dispatch("allComs");
  },

  methods: {},
};
</script>
<style></style>

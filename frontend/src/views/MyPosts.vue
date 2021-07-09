<template>
  <div class="MyPosts container">
    <b-jumbotron bg-variant="light" class="my-5">
      <Post />

      <Comment />

      <b-button class="mt-5" to="#">Créer un post</b-button>
    </b-jumbotron>
  </div>
</template>

<script>
import Comment from "@/components/Post/Comment";
import Post from "@/components/Post/Post";

export default {
  name: "MyPosts",
  components: { Comment, Post },
};
</script>
<style></style>

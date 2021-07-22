<template>
  <b-jumbotron bg-variant="light" class="my-5">
    <b-card
      no-body
      style="max-width: 40rem"
      class="mx-auto mb-5"
      v-for="user in users"
      :key="user.id"
    >
      <template #header>
        <b-row class="mb-0 text-left">
          <b-col cols="10">
            <b-avatar variant="info" :src="user.avatar"></b-avatar>

            {{ user.username }}
          </b-col>
        </b-row>
      </template>
      <b-card-body>
        <b-card-title>Biographie</b-card-title>
        <b-card-text>
          {{ user.bio }}
        </b-card-text>
      </b-card-body>
      <b-card-footer class="mt-1">
        <b-row class="align-items-center">
          <b-col>
            <b-button :to="{ path: `/posts/${user.id}` }"
              ><b-badge variant="light">{{ user.nbPosts }}</b-badge> Publications</b-button
            ></b-col
          ></b-row
        >
      </b-card-footer>
    </b-card>
  </b-jumbotron>
</template>
<script>
const axios = require("axios");
const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
});

export default {
  name: "Users",

  data() {
    return {
      show: false,

      users: [],
    };
  },

  beforeMount() {
    instance
      .get("/users/all")
      .then((response) => (this.users = response.data))

      .catch((error) => {
        error;
      });
  },

  methods: {},
};
</script>

<style></style>

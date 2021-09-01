<template>
  <div class="container">
    <b-jumbotron bg-variant="white" class="my-5 shadow-lg">
      <b-form-row class="mb-5">
        <b-col class="mx-auto col-6">
          <b-form-input
            size="sm"
            class="mr-sm-2 text-center shadow-lg border-dark"
            placeholder="Recherche par Username"
            v-model.trim="inputSearch"
          ></b-form-input>
        </b-col>
      </b-form-row>
      <b-card
        no-body
        style="max-width: 40rem"
        class="mx-auto mb-5 shadow-lg"
        v-for="user in usersPagin"
        :key="user.username"
        bg-variant="light"
        border-variant="dark"
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
              <b-button :disabled="user.nbPosts == 0" :to="{ path: `/posts/${user.id}` }"
                ><b-badge class="mr-1" variant="light">{{ user.nbPosts }}</b-badge>
                <span v-if="user.nbPosts < 2">Publication</span
                ><span v-else>Publications</span></b-button
              ></b-col
            ></b-row
          >
        </b-card-footer>
      </b-card>
    </b-jumbotron>
    <b-pagination
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
import instance from "../axios/configAxios";
import { mapState } from "vuex";

export default {
  name: "Users",

  data() {
    return {
      show: false,
      users: [],
      perPage: 2,
      currentPage: 1,
      inputSearch: "",
    };
  },

  computed: {
    ...mapState(["userInfos"]),
    usersPagin() {
      //fonction de pagination
      return this.users
        .filter((user) => user.username.toLowerCase().startsWith(this.inputSearch))
        .slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
    },
    rows() {
      if (this.inputSearch == "") {
        return this.users.length;
      }
      return this.usersPagin.length;
    },
  },

  mounted() {
    instance
      .get("/users/all", {
        headers: { Authorization: `bearer ${this.userInfos.token}` },
      })
      .then((response) => (this.users = response.data))

      .catch((error) => {
        error;
      });
  },

  methods: {},
};
</script>

<style></style>

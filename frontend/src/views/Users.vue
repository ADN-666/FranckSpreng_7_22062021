<template>
  <div class="container">
    <b-jumbotron bg-variant="white" class="my-5 shadow-lg">
      <b-card
        no-body
        style="max-width: 40rem"
        class="mx-auto mb-5 shadow-lg"
        v-for="user in (usersPagin, filteredUsers)"
        :key="user.id"
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
              <b-button :to="{ path: `/posts/${user.id}` }"
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
    };
  },

  beforeMount() {
    if (this.searchUser != "") {
      this.filteredUsers;
    }
  },

  computed: {
    ...mapState(["userInfos", "searchUser"]),
    usersPagin() {
      return this.users.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
    rows() {
      return this.users.length;
    },
    filteredUsers() {
      return this.users.filter((user) => user.username == this.searchUser);
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

<template>
  <div id="app">
    <header>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand
          ><img
            src="./assets/icon-left-font-monochrome-white.svg"
            width="250"
            height="100"
            alt="logo Groupomania"
        /></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse" v-if="userInfo == true"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav v-if="userInfo == true">
          <b-navbar-nav class="ml-auto">
            <b-nav-item :to="{ name: 'Posts' }">Publications</b-nav-item>
            <b-nav-item :to="{ name: 'Users' }">Utilisateurs</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form class="justify-content-center">
              <b-form-input
                size="sm"
                class="mr-sm-2"
                placeholder="Recherche par Username"
              ></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Recherche</b-button>
            </b-nav-form>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>{{ username }}</em>
              </template>
              <b-dropdown-item :to="{ path: `/posts/${userId}` }">Mes publications</b-dropdown-item>
              <b-dropdown-item :to="{ path: `/users/me/${userId}` }">Profil</b-dropdown-item>
              <b-dropdown-item-button v-b-modal.modal-exit>Déconnexion</b-dropdown-item-button>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    <router-view />
    <footer>
      <b-navbar type="light" variant="light">
        <b-navbar-nav class="mx-auto">
          <b-nav-item class="mx-5">Copyright : Groupomania 2021</b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </footer>
    <b-modal id="modal-exit" v-model="showModal" centered title="Avertissement">
      <p class="my-4">Etes-vous sûr de vouloir quitter l'application !</p>
      <template #modal-footer="{ cancel }">
        <b-button modal-footer size="sm" variant="outline-info" @click="ok()">OUI</b-button>
        <b-button modal-footer size="sm" variant="outline-danger" @click="cancel()">NON</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import jwtDecode from "jwt-decode";

export default {
  data() {
    return {
      userInfo: false,
      username: "",
      userId: "",
      showModal: false,
    };
  },
  beforeMount() {
    if (localStorage.getItem("token") != null) {
      let token = localStorage.getItem("token");
      let decoded = jwtDecode(token);
      this.username = decoded.username;
      this.userId = decoded.userId;
      this.userInfo = true;
    }
  },
  methods: {
    ok() {
      localStorage.removeItem("token");
      this.showModal = false;
      this.userInfo = false;
      this.username = "";
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}
</style>

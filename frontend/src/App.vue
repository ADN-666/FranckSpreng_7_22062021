<template>
  <div id="app" :key="upKey">
    <header>
      <b-navbar toggleable="lg" type="light" variant="info">
        <b-navbar-brand
          ><img
            src="./assets/icon-left-font-monochrome-white.svg"
            width="250"
            height="100"
            alt="logo Groupomania"
        /></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse" v-if="userInfos.isLog == true"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav v-if="userInfos.isLog == true">
          <b-navbar-nav class="ml-auto">
            <b-nav-item class="h4" :to="{ name: 'Posts' }">Publications</b-nav-item>
            <b-nav-item class="h4" :to="{ name: 'Users' }">Utilisateurs</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em class="h4">{{ userInfos.username }}</em>
              </template>
              <b-dropdown-item :to="{ path: `/posts/${userInfos.userId}` }"
                >Mes publications</b-dropdown-item
              >
              <b-dropdown-item :to="{ path: `/users/me/${userInfos.userId}` }"
                >Profil</b-dropdown-item
              >
              <b-dropdown-item-button v-b-modal.modal-exit>Déconnexion</b-dropdown-item-button>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    <router-view />

    <footer>
      <b-navbar variant="light">
        <b-navbar-nav class="mx-auto">
          <b-nav-item class="mx-5" id="nav"
            ><span id="span" class="text-danger h4">Copyright : Groupomania 2021</span></b-nav-item
          >
        </b-navbar-nav>
      </b-navbar>
    </footer>
    <b-modal id="modal-exit" v-model="showModal" centered title="Avertissement">
      <p class="my-4">Etes-vous sûr de vouloir quitter l'application !</p>
      <template #modal-footer="{ cancel }">
        <b-button modal-footer size="sm" variant="info" @click="ok()">OUI</b-button>
        <b-button modal-footer size="sm" variant="danger" @click="cancel()">NON</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      showModal: false,
    };
  },

  computed: {
    ...mapState(["userInfos", "upKey"]),
  },

  methods: {
    ok() {
      this.showModal = false;
      this.$store.commit("ISLOG", false);
      this.$store.commit("KEYDEL");
      localStorage.removeItem("token");
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
#span {
  font-weight: bold;
}
</style>

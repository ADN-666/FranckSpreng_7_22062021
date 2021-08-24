<template>
  <div class="container">
    <b-jumbotron bg-variant="white" class="my-5 shadow-lg">
      <b-col cols="12" class="text-right">
        <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none text-dark" no-caret>
          <template #button-content>
            <b-icon icon="pencil-square" font-scale="2"> </b-icon>
          </template>
          <b-dropdown-item-button v-b-modal.modal-updateProfil @click="updateProfilShow = true"
            >Modifier</b-dropdown-item-button
          >
          <b-dropdown-item-button v-b-modal.modal-deleteProfil @click="deleteProfilShow = true"
            >Supprimer</b-dropdown-item-button
          >
        </b-dropdown>
      </b-col>
      <b-row
        ><b-col cols="12"><h2>Mon profil</h2> </b-col>
      </b-row>
      <b-card
        no-body
        style="max-width: 40rem"
        class="mx-auto shadow-lg"
        bg-variant="light"
        border-variant="dark"
      >
        <template #header>
          <b-row class="mb-3">
            <b-col>
              <b-avatar variant="info" size="6rem" :src="user.avatar"></b-avatar>
            </b-col>
          </b-row>
          <b-row
            ><b-col class="text-left"
              ><p>Mon pseudo : {{ user.username }}</p></b-col
            ></b-row
          >
          <b-row
            ><b-col class="text-left"
              ><p>Mon email : {{ user.email }}</p></b-col
            ></b-row
          >
        </template>
        <b-card-body>
          <b-card-title class="text-left h6">Ma biographie :</b-card-title>
          <b-card-text>
            {{ user.bio }}
          </b-card-text>
        </b-card-body>
        <b-card-footer class="mt-1 text-left">
          <b-row class="text-center mb-4">
            <b-col
              ><h4>
                <b-badge variant="info" v-if="user.nbPosts == null">0 Publication </b-badge>
                <b-badge variant="info"
                  >{{ user.nbPosts }} <span v-if="user.nbPosts < 2">Publication</span
                  ><span v-else>Publications</span></b-badge
                >
              </h4></b-col
            >
          </b-row>
          Inscrit depuis le : {{ localDate(user.createdAt) }}
        </b-card-footer>
        <b-modal
          id="modal-updateProfil"
          centered
          title="Modifier votre profil"
          v-model="updateProfilShow"
        >
          <b-form enctype="multipart/form-data">
            <b-form-group id="group-profil-pseudo" label="Pseudo" label-for="input-profil-pseudo">
              <b-form-input
                id="input-profil-pseudo"
                v-model="user.username"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback :state="validPseudo">
                Le pseudo est obligatoire et doit comporter 3 caractères minimum
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="validPseudo"> Parfait !!. </b-form-valid-feedback>
            </b-form-group>
            <b-form-group id="group-profil-email" label="Email" label-for="input-profil-email">
              <b-form-input
                id="input-profil-email"
                v-model="user.email"
                type="email"
                placeholder="Entrez votre email"
              ></b-form-input>
              <b-form-invalid-feedback :state="validEmail">
                L'email est obligatoire et doit comporter un "@" et un "."
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="validEmail"> Parfait !!. </b-form-valid-feedback>
            </b-form-group>
            <b-form-group id="group-profil-bio" label="Bio" label-for="input-profil-bio">
              <b-form-input
                id="input-profil-bio"
                v-model="user.bio"
                type="text"
                placeholder="Entrez une courte description de vous"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="group-profil-avatar"
              label="Avatar"
              label-for="input-profil-avatar"
              class="mb-2"
            >
              <b-form-file
                id="input-profil-avatar"
                class="text-left"
                @change="upload"
              ></b-form-file>
              <b-button class="mr-5 mt-2" type="reset" variant="info" size="sm" @click="reset"
                >Supprimer l'avatar</b-button
              >
            </b-form-group>
          </b-form>
          <template #modal-footer="{ cancel }">
            <b-button
              modal-footer
              class="mr-5"
              type="submit"
              variant="info"
              size="sm"
              @click="onSubmit"
              >Soumettre</b-button
            >
            <b-button modal-footer variant="danger" size="sm" type="cancel" @click="cancel()">
              Annuler
            </b-button>
          </template>
        </b-modal>
        <b-modal id="modal-deleteProfil" centered title="Avertissement" v-model="deleteProfilShow">
          <p class="my-4">Etes-vous sûr de vouloir supprimer votre compte !</p>
          <template #modal-footer="{ cancel }">
            <b-button modal-footer size="sm" variant="outline-info" @click="onDelete">OUI</b-button>
            <b-button modal-footer size="sm" variant="outline-danger" @click="cancel()"
              >NON</b-button
            >
          </template>
        </b-modal>
      </b-card>
    </b-jumbotron>
  </div>
</template>

<script>
import instance from "../axios/configAxios";
import { mapState } from "vuex";

export default {
  name: "Profil",
  components: {},
  data() {
    return {
      updateProfilShow: false,
      deleteProfilShow: false,

      user: {
        avatar: "",
        bio: "",
        createdAt: "",
        email: "",
        nbPosts: 0,
        username: "",
      },
      image: null,
    };
  },

  computed: {
    ...mapState(["userInfos"]),
    validPseudo() {
      return this.user.username.length > 2;
    },
    validEmail() {
      const regexEmail =
        /[A-Za-z0-9](([_.-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_.-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})/;
      return regexEmail.test(this.user.email) === true;
    },
  },

  mounted() {
    this.getUser();
  },

  methods: {
    getUser() {
      instance
        .get(`/users/me/${this.userInfos.userId}`, {
          headers: { Authorization: `bearer ${this.userInfos.token}` },
        })
        .then((response) => (this.user = response.data))
        .catch((error) => {
          error;
        });
    },
    upload(event) {
      this.image = event.target.files[0];
    },

    onSubmit(event) {
      event.preventDefault();
      let formData = new FormData();
      formData.set("username", this.user.username);
      formData.set("email", this.user.email);
      formData.set("bio", this.user.bio);
      if (this.validPseudo === true && this.validEmail === true) {
        if (this.image != null) {
          formData.append("image", this.image);
        }
        instance
          .put(`/users/me/${this.userInfos.userId}`, formData, {
            headers: { Authorization: `bearer ${this.userInfos.token}` },
          })
          .then((response) => {
            (this.user = response.data),
              this.$store.commit("USERNAME", response.data.username),
              this.$store.commit("AVATAR", response.data.avatar);
          })
          .catch((error) => {
            error;
          });
        this.updateProfilShow = false;
      }
    },

    reset(event) {
      event.preventDefault();
      this.image = null;
    },

    onDelete() {
      instance
        .delete(`/users/me/${this.userInfos.userId}`, {
          headers: { Authorization: `bearer ${this.userInfos.token}` },
        })
        .then((response) => {
          response, this.$store.commit("TOKEN", "");
          this.$store.commit("ISLOG", false);
          this.$store.commit("USERID", "");
          this.$store.commit("USERNAME", "");
          this.$store.commit("AVATAR", "");
          this.$store.commit("POSTS", "");
          this.$store.commit("KEYDEL");
          this.$router.push({ name: "Home" });
        })
        .catch((error) => {
          error;
        });
      this.deleteProfilShow = false;
    },
    localDate(createdAt) {
      let timestamp = Date.parse(createdAt);
      let local = new Date(timestamp);
      let date = local.toLocaleDateString();
      return date;
    },
  },
};
</script>

<style></style>

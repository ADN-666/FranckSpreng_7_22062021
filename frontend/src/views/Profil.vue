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
                <b-badge variant="info" v-if="nbPosts == null">0 Publication </b-badge>
                <b-badge variant="info"
                  >{{ nbPosts }} <span v-if="nbPosts < 2">Publication</span
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
            <b-form-group id="group-profil-avatar" class="mb-2">
              <label
                label-for="input-profil-avatar"
                v-if="newUrl == '' && user.avatar != null"
                class="text-dark"
                >Avatar : {{ user.avatar.split("http://localhost:3000/images/")[1] }}</label
              >
              <label label-for="input-profil-avatar" v-else-if="newUrl != ''" class="text-dark"
                >Avatar : {{ newUrl.name }}</label
              >
              <label label-for="input-profil-avatar" v-else class="text-dark"
                >Avatar : Aucun avatar sélectionné
              </label>

              <b-form-file
                id="input-profil-avatar"
                class="text-left"
                @change="upload"
                placeholder="Choisissez un fichier"
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
      <b-modal id="modal-profil-erreur" centered v-model="errorMsg" title="Avertissement">
        <h5>{{ errors }}</h5>
        <template #modal-footer="{ ok }">
          <b-button modal-footer size="sm" variant="info" @click="ok()">OK</b-button>
        </template>
      </b-modal>
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
        username: "",
      },
      nbPosts: 0,
      newUrl: "",
      errors: "",
      errorMsg: false,
    };
  },

  computed: {
    ...mapState(["userInfos"]),
    validPseudo() {
      //fonction de validation du pseudo
      return this.user.username.length > 2;
    },
    validEmail() {
      //fonction de validation de l'email
      const regexEmail =
        /[A-Za-z0-9](([_.-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_.-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})/;
      return regexEmail.test(this.user.email) === true;
    },
  },

  mounted() {
    //récupération du profil utilisateur
    this.getUser();
  },

  methods: {
    getUser() {
      instance
        .get(`/users/me/${this.userInfos.userId}`, {
          headers: { Authorization: `bearer ${this.userInfos.token}` },
        })
        .then((response) => {
          (this.user = response.data), (this.nbPosts = response.data.nbPosts);
        })
        .catch((error) => {
          error;
        });
    },
    upload(event) {
      this.newUrl = event.target.files[0];
    },

    onSubmit(event) {
      //fonction de màj du profil utilisateur avec création d'un formData
      //et màj de l'avatar
      event.preventDefault();
      let formData = new FormData();
      formData.set("username", this.user.username);
      formData.set("email", this.user.email);
      formData.set("bio", this.user.bio);
      if (this.validPseudo === true && this.validEmail === true) {
        if (this.newUrl != "") {
          formData.append("image", this.newUrl);
        } else if (this.user.avatar != null) {
          formData.append("image", this.user.avatar);
        }
        instance
          .put(`/users/me/${this.userInfos.userId}`, formData, {
            headers: { Authorization: `bearer ${this.userInfos.token}` },
          })
          .then((response) => {
            (this.user = response.data),
              this.$store.commit("USERNAME", response.data.username),
              this.$store.commit("AVATAR", response.data.avatar);
            this.newUrl = "";
            this.updateProfilShow = false;
          })
          .catch((error) => {
            //récupération et traitement des erreurs renvoyées par mysql
            // en cas de pseudo ou email déjà présent dans la base
            this.errors = error.response.data.error.errors[0].path;
            if (this.errors == "users.username") {
              this.errors = "Ce pseudo n'est pas disponible";
              this.errorMsg = true;
            } else {
              this.errors = "Cet email n'est pas disponible";
              this.errorMsg = true;
            }
          });
      }
    },

    reset(event) {
      event.preventDefault();
      this.user.avatar = null;
      this.newUrl = "";
      this.updateProfilShow = false;
      this.$nextTick(() => {
        this.updateProfilShow = true;
      });
    },

    onDelete() {
      //fonction de suppression de l'utilisateur
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
      //formatage de la date
      let timestamp = Date.parse(createdAt);
      let local = new Date(timestamp);
      let date = local.toLocaleDateString();
      return date;
    },
  },
};
</script>

<style></style>

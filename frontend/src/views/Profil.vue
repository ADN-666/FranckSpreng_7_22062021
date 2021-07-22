<template>
  <div class="Profil container">
    <b-jumbotron bg-variant="light" class="my-5">
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
      <b-card no-body style="max-width: 40rem" class="mx-auto">
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
                <b-badge variant="info">{{ user.nbPosts }} Publications</b-badge>
              </h4></b-col
            >
          </b-row>
          Inscrit depuis le : {{ user.createdAt }}
        </b-card-footer>
        <b-modal
          id="modal-updateProfil"
          centered
          title="Modifier votre profil"
          v-model="updateProfilShow"
          @ok="onSubmit"
        >
          <b-form>
            <b-form-group id="input-group-1" label="Pseudo" label-for="input-1">
              <b-form-input
                id="input-1"
                v-model="user.username"
                type="text"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="Email" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="user.email"
                type="email"
                placeholder="Entrez votre email"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-3" label="Bio" label-for="input-4">
              <b-form-input
                id="input-3"
                v-model="user.bio"
                type="text"
                placeholder="Entrez une courte description de vous"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-4" label="Avatar" label-for="input-4">
              <b-form-file id="image" class="text-left" @change="upload"></b-form-file>
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
import jwtDecode from "jwt-decode";

export default {
  name: "Profil",
  components: {},
  data() {
    return {
      updateProfilShow: false,
      deleteProfilShow: false,

      user: {
        username: "",
        email: "",
        bio: "",
        avatar: "",
      },

      image: "",
      userId: "",
    };
  },

  beforeMount() {
    this.getToken(), this.getUser();
  },

  methods: {
    getToken() {
      let token = localStorage.getItem("token");
      let decoded = jwtDecode(token);
      return (this.userId = parseInt(decoded.userId));
    },

    getUser() {
      instance
        .get(`/users/me/${this.userId}`)
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
      formData.append("image", this.image);
      instance
        .put(`/users/me/${this.userId}`, formData)
        .then((response) => (this.user = response.data))
        .catch((error) => {
          error;
        });
      this.updateProfilShow = false;
    },
  },
};
</script>

<style></style>

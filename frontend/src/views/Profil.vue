<template>
  <div class="Profil container">
    <b-jumbotron bg-variant="light" class="my-5">
      <b-col cols="12" class="text-right">
        <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none text-dark" no-caret>
          <template #button-content>
            <b-icon icon="pencil-square" font-scale="2"> </b-icon>
          </template>
          <b-dropdown-item-button v-b-modal.modal-updateProfil ref="show" @click="show = true"
            >Modifier</b-dropdown-item-button
          >
          <b-dropdown-item-button v-b-modal.modal-deleteProfil>Supprimer</b-dropdown-item-button>
        </b-dropdown>
      </b-col>
      <b-row
        ><b-col cols="12"><h2>Mon profil</h2> </b-col>
      </b-row>
      <b-card no-body style="max-width: 40rem" class="mx-auto">
        <template #header>
          <b-row class="mb-3">
            <b-col>
              <b-avatar variant="info" size="6rem" src="https://placekitten.com/300/300"></b-avatar>
            </b-col>
          </b-row>
          <b-row
            ><b-col class="text-left"><p>Mon pseudo : Username</p></b-col></b-row
          >
          <b-row
            ><b-col class="text-left"><p>Mon email : exemple@gmail.com</p></b-col></b-row
          >
        </template>
        <b-card-body>
          <b-card-title class="text-left h6">Ma biographie :</b-card-title>
          <b-card-text v-model="bio">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book.
          </b-card-text>
        </b-card-body>
        <b-card-footer class="mt-1 text-left">
          <b-row class="text-center mb-4">
            <b-col
              ><h4><b-badge variant="info">2 Publications</b-badge></h4></b-col
            >
            <b-col
              ><h4><b-badge variant="info">2 Commentaires</b-badge></h4></b-col
            >
          </b-row>
          Inscrit depuis le : 25 septembre 2021
        </b-card-footer>
        <b-modal
          id="modal-updateProfil"
          centered
          title="Modifier votre profil"
          v-model="show"
          @ok="onSubmit"
        >
          <b-form>
            <b-form-group id="input-group-1" label="Pseudo" label-for="input-1">
              <b-form-input
                id="input-1"
                v-model="form.username"
                type="text"
                placeholder="Entrez votre pseudo"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="Email" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="form.email"
                type="email"
                placeholder="Entrez votre email"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-4" label="Bio" label-for="input-4">
              <b-form-input
                id="input-4"
                v-model="form.bio"
                type="text"
                placeholder="Entrez une courte description de vous"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-5" label="Avatar" label-for="input-5">
              <b-form-file
                class="text-left"
                v-model="form.avatar"
                :state="Boolean(form.avatar)"
                placeholder="Choisissez un fichier ou déposez le ici..."
                drop-placeholder="Drop file here..."
              ></b-form-file>
              <div class="mt-3">
                Fichier sélectionné : {{ form.avatar ? form.avatar.name : "" }}
              </div>
            </b-form-group>
          </b-form>
          <template #modal-footer="{ ok, cancel }">
            <b-button
              modal-footer
              class="mr-5"
              type="submit"
              variant="info"
              size="sm"
              @click="ok(onSubmit)"
              >Soumettre</b-button
            >
            <b-button modal-footer variant="danger" size="sm" type="cancel" @click="cancel()">
              Annuler
            </b-button>
          </template>
        </b-modal>
        <b-modal id="modal-deleteProfil" centered title="Avertissement">
          <p class="my-4">Etes-vous sûr de vouloir supprimer votre compte !</p>
          <template #modal-footer="{ ok, cancel }">
            <b-button modal-footer size="sm" variant="outline-info" @click="ok()">OUI</b-button>
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
const axios = require("axios");
const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
});

export default {
  name: "Profil",
  components: {},
  data() {
    return {
      show: false,

      user: [],

      form: {
        username: "",
        email: "",
        bio: "",
        avatar: "",
      },
    };
  },

  beforeMount() {
    instance
      .get("/users/me/id=1")
      .then((response) => (this.user = response.data))

      .catch((error) => {
        error;
      });
  },

  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.show = false;
      alert(JSON.stringify(this.form));
    },
  },
};
</script>

<style></style>

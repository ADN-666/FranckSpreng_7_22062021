<template>
  <div class="Signup container">
    <b-jumbotron bg-variant="light" class="my-5 mx-auto" style="max-width: 30rem">
      <b-row class="my-5 h2">
        <b-col><p>Formulaire d'inscription</p></b-col>
      </b-row>
      <b-form @submit.stop.prevent="onSubmit" enctype="multipart/form-data">
        <b-form-group id="group-signup-pseudo" label="Pseudo" label-for="input-signup-pseudo">
          <b-form-input
            id="input-signup-pseudo"
            v-model="username"
            type="text"
            placeholder="Entrez votre pseudo"
            :state="validUsername"
          ></b-form-input>
          <b-form-invalid-feedback :state="validUsername">
            3 caractères minimum
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="validUsername"> Parfait !!. </b-form-valid-feedback>
        </b-form-group>
        <b-form-group id="group-signup-email" label="Email" label-for="input-signup-email">
          <b-form-input
            id="input-signup-email"
            v-model="email"
            type="email"
            placeholder="Entrez votre email"
            :state="validEmail"
          ></b-form-input>
          <b-form-invalid-feedback :state="validEmail">
            L'email doit comporter un "@" et un "."
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="validEmail"> Parfait !!. </b-form-valid-feedback>
        </b-form-group>
        <b-form-group
          class="mb-5"
          id="group-signup-password"
          label="Mot de passe:"
          label-for="input-signup-password"
        >
          <b-form-input
            id="input-signup-password"
            v-model="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            :state="validPassword"
          ></b-form-input>
          <b-form-invalid-feedback :state="validPassword">
            8 caractères minimum dont une majuscule et un chiffre
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="validPassword"> Parfait !!. </b-form-valid-feedback>
        </b-form-group>
        <b-row class="mt-5 h5">
          <b-col><p>( Section optionnel pouvant être complétée depuis votre profil )</p></b-col>
        </b-row>
        <b-form-group id="group-signup-bio" label="Bio" label-for="input-signup-bio">
          <b-form-input
            id="input-signup-bio"
            v-model="bio"
            type="text"
            placeholder="Entrez une courte description de vous"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="group-signup-avatar" label="Avatar" label-for="input-signup-avatar">
          <b-form-file
            id="input-signup-avatar"
            class="text-left"
            @change="upload"
            placeholder="Choisissez un fichier..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </b-form-group>
        <b-button class="mr-5" type="submit" variant="primary">Soumettre</b-button>

        <b-button type="button" @click.prevent="onCancel" variant="danger">Annuler</b-button>
      </b-form>
      <b-modal id="modal-signup-erreur" centered v-model="errorMsg" title="Avertissement">
        <h5>{{ errors }}</h5>
        <template #modal-footer="{ ok }">
          <b-button modal-footer size="sm" variant="info" @click="ok()">OK</b-button>
        </template>
      </b-modal>
    </b-jumbotron>
  </div>
</template>

<script>
//import instance from "../axios/configAxios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Signup",
  components: {},
  data() {
    return {
      username: "",
      email: "",
      password: "",
      bio: "",
      image: "",
      errorMsg: false,
    };
  },

  computed: {
    ...mapState(["errors"]),
    ...mapActions(["signup"]),
    validPassword() {
      const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      return this.password.length > 7 && regexPassword.test(this.password) === true;
    },
    validUsername() {
      return this.username.length > 2;
    },
    validEmail() {
      const regexEmail =
        /[A-Za-z0-9](([_.-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_.-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})/;
      return regexEmail.test(this.email) === true;
    },
  },

  methods: {
    upload(event) {
      this.image = event.target.files[0];
    },
    onSubmit() {
      let formData = new FormData();
      formData.set("username", this.username);
      formData.set("email", this.email);
      formData.set("password", this.password);
      formData.set("bio", this.bio);
      formData.append("image", this.image);
      if (this.validPassword === true && this.validUsername === true && this.validEmail === true) {
        this.$store.dispatch("signup", formData);
      }
      setTimeout(() => {
        if (this.errors != "") {
          this.errorMsg = true;
        }
      }, 100);
    },
    onCancel() {
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

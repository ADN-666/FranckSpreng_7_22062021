<template>
  <div class="container">
    <b-jumbotron bg-variant="light" class="my-5 mx-auto shadow-lg" style="max-width: 30rem">
      <b-row class="my-5 h2">
        <b-col><p>Accès utilisateur</p></b-col>
      </b-row>
      <b-form @submit="onSubmit">
        <b-form-group id="group-login-email" label="Email" label-for="input-login-email">
          <b-form-input
            id="input-login-email"
            v-model="form.email"
            type="email"
            placeholder="Entrez votre email"
            :state="validEmail"
            required
          ></b-form-input>
          <b-form-invalid-feedback :state="validEmail">
            L'email doit comporter un "@" et un "."
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="validEmail"> Parfait !!. </b-form-valid-feedback>
        </b-form-group>
        <b-form-group
          class="mb-5"
          id="group-login-password"
          label="Mot de passe:"
          label-for="input-login-password"
        >
          <b-form-input
            id="input-login-password"
            v-model="form.password"
            type="password"
            placeholder="Entrez votre mot de passe"
            :state="validPassword"
            required
          ></b-form-input>
          <b-form-invalid-feedback :state="validPassword">
            8 caractères minimum dont une majuscule et un chiffre
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="validPassword"> Parfait !!. </b-form-valid-feedback>
        </b-form-group>
        <b-button class="mr-5" type="submit" @click="onSubmit" variant="info">Soumettre</b-button>

        <b-button type="button" @click.prevent="onCancel" variant="danger">Annuler</b-button>
      </b-form>
      <b-modal id="modal-login-erreur" centered v-model="errorMsg" title="Avertissement">
        <h5>{{ errors }}</h5>
        <template #modal-footer="{ ok }">
          <b-button modal-footer size="sm" variant="info" @click="ok()">OK</b-button>
        </template>
      </b-modal>
    </b-jumbotron>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      errorMsg: false,
    };
  },

  computed: {
    ...mapActions(["login"]),
    ...mapState(["errors"]),
    validPassword() {
      //fonction permettant de controler les paramètres du mot de passe
      const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      return this.form.password.length > 7 && regexPassword.test(this.form.password) === true;
    },
    validEmail() {
      //fonction permettant de controler les paramètres de l'email
      const regexEmail =
        /[A-Za-z0-9](([_.-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_.-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})/;
      return regexEmail.test(this.form.email) === true;
    },
  },

  methods: {
    onSubmit: function (event) {
      event.preventDefault();
      //condition pour valider le formulaire avant envoi
      if (this.validPassword === true && this.validEmail === true) {
        this.$store.dispatch("login", this.form);
      }
      setTimeout(() => {
        //fonction de renvoi de l'erreur généré par le serveur
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

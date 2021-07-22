<template>
  <div class="Login container">
    <b-jumbotron bg-variant="light" class="my-5 mx-auto" style="max-width: 30rem">
      <b-row class="my-5 h2">
        <b-col><p>Accès utilisateur</p></b-col>
      </b-row>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="input-group-1" label="Email" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            placeholder="Entrez votre email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="mb-5"
          id="input-group-2"
          label="Mot de passe:"
          label-for="input-2"
          description="8 caractères minimum dont une majuscule et un chiffre"
        >
          <b-form-input
            id="input-2"
            v-model="form.password"
            type="password"
            placeholder="Entrez votre mot de passe"
            required
          ></b-form-input>
        </b-form-group>
        <b-button class="mr-5" type="submit" variant="primary">Soumettre</b-button>
        <b-button type="reset" variant="danger">Effacer</b-button>
      </b-form>
    </b-jumbotron>
  </div>
</template>

<script>
import instance from "../axios/configAxios";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      instance
        .post("/users/login", this.form)
        .then((response) => {
          if (response.status == "200") {
            localStorage.setItem("token", response.data.token);
          }
          this.$nextTick(() => {
            this.$router.push({ name: "Posts" });
          });
        })
        .catch((error) => {
          error;
        });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.password = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

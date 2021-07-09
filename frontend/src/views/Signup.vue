<template>
  <div class="Signup container">
    <b-jumbotron bg-variant="light" class="my-5 mx-auto" style="max-width: 30rem">
      <b-row class="my-5 h2">
        <b-col><p>Formulaire d'inscription</p></b-col>
      </b-row>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show" enctype="multipart/form-data">
        <b-form-group id="input-group-1" label="Pseudo" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="username"
            type="text"
            placeholder="Entrez votre pseudo"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-2" label="Email" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="email"
            type="email"
            placeholder="Entrez votre email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="mb-5"
          id="input-group-3"
          label="Mot de passe:"
          label-for="input-3"
          description="8 caractères minimum dont une majuscule et un chiffre"
        >
          <b-form-input
            id="input-3"
            v-model="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            required
          ></b-form-input>
        </b-form-group>
        <b-row class="mt-5 h5">
          <b-col><p>( Section optionnel pouvant être complétée depuis votre profil )</p></b-col>
        </b-row>
        <b-form-group id="input-group-4" label="Bio" label-for="input-4">
          <b-form-input
            id="input-4"
            v-model="bio"
            type="text"
            placeholder="Entrez une courte description de vous"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-5" label="Avatar" label-for="image">
          <b-form-file
            id="image"
            class="text-left"
            @change="upload"
            placeholder="Choisissez un fichier ou déposez le ici..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </b-form-group>
        <b-button class="mr-5" type="submit" variant="primary">Soumettre</b-button>
        <b-button type="reset" variant="danger">Effacer</b-button>
      </b-form>
    </b-jumbotron>
  </div>
</template>

<script>
const axios = require("axios");
const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
});
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

      show: true,
    };
  },
  methods: {
    upload(event) {
      this.image = event.target.files[0];
    },
    onSubmit(event) {
      event.preventDefault();
      let formData = new FormData();
      formData.set("username", this.username);
      formData.set("email", this.email);
      formData.set("password", this.password);
      formData.set("bio", this.bio);
      formData.append("image", this.image);
      instance
        .post("/users/signup", formData)
        .then((response) => {
          if (response.status == "201") {
            alert(JSON.stringify(response.data));
            this.$router.push({ name: "Posts" });
          }
        })
        .catch((error) => {
          error;
        });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.username = "";
      this.email = "";
      this.password = "";
      this.bio = "";
      this.image = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

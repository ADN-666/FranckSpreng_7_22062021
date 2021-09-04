<template>
  <div>
    <b-button
      v-b-toggle="'collapse'"
      :class="visible ? null : 'collapsed'"
      class="mb-5"
      variant="info"
      >Créer un post</b-button
    >
    <b-collapse id="collapse" class="mb-5" v-model="visible">
      <b-row class="my-3 h2">
        <b-col><p>Nouvelle publication</p></b-col>
      </b-row>
      <b-card id="newPost" no-body style="max-width: 40rem" class="mx-auto">
        <template #header>
          <b-row class="mb-0 text-left">
            <b-col cols="10">
              <b-avatar variant="info" :src="userInfos.avatar"></b-avatar>

              {{ userInfos.username }}</b-col
            >
          </b-row>
        </template>
        <b-form @submit.prevent="onSubmit" @reset="onReset" enctype="multipart/form-data">
          <b-card-body>
            <b-form-group
              id="group-newPost-title"
              label="Titre"
              label-for="input-newPost-title"
              class="text-dark"
            >
              <b-form-input
                id="input-newPost-title"
                v-model="form.title"
                type="text"
                class="rounded-0"
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="validTitle">
                La publication doit comporter un titre !!
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="validTitle"> Parfait !!. </b-form-valid-feedback>
            </b-form-group>
            <b-form-group
              id="group-newPost-content"
              label="Publication"
              label-for="input-newPost-content"
              class="text-dark"
            >
              <b-form-textarea
                id="input-newPost-content"
                v-model="form.content"
                rows="6"
                max-rows="15"
                class="rounded-0"
                required
              ></b-form-textarea>
              <b-form-invalid-feedback :state="validContent">
                La publication doit comporter un contenu !!
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="validContent"> Parfait !!. </b-form-valid-feedback>
            </b-form-group>
            <b-form-group
              id="group-newPost-image"
              label="image"
              label-for="input-newPost-image"
              class="text-dark"
            >
              <b-form-file
                id="input-newPost-image"
                placeholder="Choisissez un fichier"
                class="text-left"
                @change="upLoad"
              ></b-form-file>
            </b-form-group>
          </b-card-body>
          <b-card-footer class="mt-1">
            <b-row class="align-items-center"
              ><b-col
                ><b-button class="mr-5" type="submit" variant="info" @click="onSubmit"
                  >Soumettre</b-button
                >
                <b-button type="reset" variant="danger">Effacer</b-button></b-col
              ></b-row
            >
          </b-card-footer>
        </b-form>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import { mapState } from "vuex";
import instance from "../axios/configAxios";

export default {
  name: "NewPost",
  components: {},

  data() {
    return {
      show: false,
      visible: false,

      form: {
        title: "",
        content: "",
        image: "",
      },
    };
  },

  computed: {
    ...mapState(["userInfos"]),
    validTitle() {
      //validation du titre avec 2 caractères min
      return this.form.title.length > 1;
    },
    validContent() {
      //validation du contenu avec 29 caractères min
      return this.form.content.length > 28;
    },
  },

  methods: {
    upLoad(event) {
      this.form.image = event.target.files[0];
    },

    onSubmit(event) {
      //envoi du nouveau post avec création d'un objet formData
      event.preventDefault();
      let formData = new FormData();
      formData.append("title", this.form.title);
      formData.append("content", this.form.content);
      formData.append("image", this.form.image);
      if (this.validTitle === true && this.validContent === true) {
        instance
          .post("/posts/", formData, {
            headers: { Authorization: `bearer ${this.userInfos.token}` },
          })
          .then(() => {
            this.$store.commit("KEY");
          })
          .catch((error) => {
            error;
          });
        this.visible = !this.visible;
      }
    },
    onReset(event) {
      //effacement du nouveau post en cours et bascule en appuyant sur le bouton
      event.preventDefault();
      this.form.title = "";
      this.form.content = "";
      this.form.image = "";
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style lang="scss">
#newPost {
  border: 1px solid black;
  box-shadow: 1px 1px 5px 1px black;
  background-color: #cdd2d3;
}
</style>

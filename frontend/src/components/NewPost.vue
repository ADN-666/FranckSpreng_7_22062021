<template>
  <div>
    <b-button v-b-toggle="'collapse'" :class="visible ? null : 'collapsed'" class="mb-5"
      >Créer un post</b-button
    >
    <b-collapse id="collapse" class="mb-5" v-model="visible">
      <b-row class="my-3 h2">
        <b-col><p>Nouvelle publication</p></b-col>
      </b-row>
      <b-card no-body style="max-width: 40rem" class="mx-auto">
        <template #header>
          <b-row class="mb-0 text-left">
            <b-col cols="10">
              <b-avatar variant="info" :src="userInfos.avatar"></b-avatar>

              {{ userInfos.username }}</b-col
            >
          </b-row>
        </template>
        <b-form @submit="onSubmit" @reset="onReset">
          <b-card-body>
            <b-form-group id="input-group-1" label="Titre" label-for="input-1" class="text-dark">
              <b-form-input
                id="input-1"
                v-model="form.title"
                type="text"
                class="rounded-0"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-2"
              label="Publication"
              label-for="input-2"
              class="text-dark"
            >
              <b-form-textarea
                id="input-2"
                v-model="form.content"
                rows="6"
                max-rows="15"
                class="rounded-0"
              ></b-form-textarea>
            </b-form-group>
          </b-card-body>
          <b-card-footer class="mt-1">
            <b-row class="align-items-center"
              ><b-col
                ><b-button class="mr-5" type="submit" variant="info" @click="visible = !visible"
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
import instance from "../axios/configAxios";
import { mapState } from "vuex";

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
      },
    };
  },

  computed: {
    ...mapState(["userInfos"]),
  },

  methods: {
    onSubmit(event) {
      event.preventDefault();
      instance
        .post("/posts/", this.form)
        .then(() => {})
        .catch((error) => {
          error;
        });
      window.location.reload;
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.title = "";
      this.form.content = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style></style>

<template>
  <b-jumbotron bg-variant="light" class="my-5">
    <b-row class="my-3 h2">
      <b-col><p>Nouvelle publication</p></b-col>
    </b-row>
    <b-card no-body style="max-width: 40rem" class="mx-auto">
      <template #header>
        <b-row class="mb-0 text-left">
          <b-col cols="10">
            <b-avatar variant="info" src="https://placekitten.com/300/300"></b-avatar>

            username</b-col
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
              ><b-button class="mr-5" type="submit" variant="info">Soumettre</b-button>
              <b-button type="reset" variant="danger">Effacer</b-button></b-col
            ></b-row
          >
        </b-card-footer>
      </b-form>
    </b-card>
  </b-jumbotron>
</template>

<script>
export default {
  name: "Users",
  components: {},
  data() {
    return {
      show: false,
      title: "Publication test",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",

      form: {
        userId: "",
        title: "",
        content: "",
      },
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.show = false;
      alert(JSON.stringify(this.form));
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

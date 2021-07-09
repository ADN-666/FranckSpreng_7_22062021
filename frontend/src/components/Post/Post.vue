<template>
  <div>
    <b-card no-body style="max-width: 40rem" class="mx-auto">
      <template #header>
        <b-row class="mb-0 text-left">
          <b-col cols="10">
            <b-avatar variant="info" :src="avatar"></b-avatar>

            {{ username }} - publié il y a {{ createdAt }} </b-col
          ><b-col cols="2"
            ><b-dropdown
              v-if="userId == userId"
              size="sm"
              variant="link"
              toggle-class="text-decoration-none text-dark"
              no-caret
            >
              <template #button-content>
                <b-icon icon="pencil-square" font-scale="2"> </b-icon>
              </template>
              <b-dropdown-item-button v-b-modal.modal-updatePost ref="show" @click="show = true"
                >Modifier</b-dropdown-item-button
              >
              <b-dropdown-item-button v-b-modal.modal-deletePost>Supprimer</b-dropdown-item-button>
            </b-dropdown></b-col
          >
        </b-row>
      </template>
      <b-card-body>
        <b-card-title>{{ title }}</b-card-title>
        <b-card-text> {{ content }} </b-card-text>
      </b-card-body>
      <b-card-footer class="mt-1">
        <b-row class="align-items-center"
          ><b-col cols="2"
            ><b-button size="sm" to="#" variant="link" class="text-dark"
              ><b-badge variant="light">{{ like }}</b-badge
              ><b-icon icon="hand-thumbs-up" font-scale="2"></b-icon></b-button
          ></b-col>
          <b-col cols="2"
            ><b-button size="sm" to="#" variant="link" class="text-dark"
              ><b-badge variant="light">{{ dislike }}</b-badge
              ><b-icon icon="hand-thumbs-down" font-scale="2"></b-icon></b-button
          ></b-col>

          <b-col cols="8" class="text-right">
            <!-- Via array of string IDs passed to directive value -->
            <b-button v-b-toggle="['a']"
              ><b-badge variant="light">{{ nbComments }}</b-badge> Commentaires</b-button
            ></b-col
          ></b-row
        >
      </b-card-footer>
      <b-modal
        id="modal-updatePost"
        centered
        title="Modifier votre publication"
        v-model="show"
        @ok="onSubmit"
      >
        <b-form>
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
      <b-modal id="modal-deletePost" centered title="Avertissement">
        <p class="my-4">Etes-vous sûr de vouloir supprimer cette publication !</p>
        <template #modal-footer="{ ok, cancel }">
          <b-button modal-footer size="sm" variant="outline-info" @click="ok()">OUI</b-button>
          <b-button modal-footer size="sm" variant="outline-danger" @click="cancel()">NON</b-button>
        </template>
      </b-modal>
    </b-card>
    <Comment />
  </div>
</template>

<script>
import Comment from "@/components/Post/Comment";

export default {
  name: "Post",
  components: { Comment },
  props: {
    id: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    nbComments: {
      type: Number,
      required: false,
      default: 0,
    },
    like: {
      type: Number,
      required: false,
      default: 0,
    },
    dislike: {
      type: Number,
      required: false,
      default: 0,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      show: false,

      form: {
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
  },
};
</script>

<style></style>

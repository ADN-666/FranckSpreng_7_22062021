<template>
  <div class="my-2">
    <b-form @submit="onSubmit">
      <b-row>
        <b-col class="col-7 mx-auto"
          ><b-form-input
            id="input-1"
            v-model="form.comment"
            type="text"
            class="rounded-pill mx-auto mt-2"
            placeholder="Commenter cette publication..."
          ></b-form-input
        ></b-col>
      </b-row>
    </b-form>
    <!-- Elements to collapse -->
    <b-collapse id="a" class="mt-3">
      <b-card no-body style="max-width: 35rem" class="mx-auto mb-2">
        <template #header>
          <b-row class="mb-0 text-left">
            <b-col cols="10">
              <b-avatar variant="info" :src="user.avatar"></b-avatar>
              {{ user.username }} - publié il y a {{ comment.createdAt }} </b-col
            ><b-col cols="2">
              <b-dropdown
                v-if="user.userId == comment.userId"
                size="sm"
                variant="link"
                toggle-class="text-decoration-none text-dark"
                no-caret
              >
                <template #button-content>
                  <b-icon icon="pencil-square" font-scale="2"> </b-icon>
                </template>
                <b-dropdown-item-button v-b-modal.modal-updateComment
                  >Modifier</b-dropdown-item-button
                >
                <b-dropdown-item-button v-b-modal.modal-deleteComment
                  >Supprimer</b-dropdown-item-button
                >
              </b-dropdown>
            </b-col>
          </b-row>
        </template>

        <b-card-body>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries,
        </b-card-body>
      </b-card>
      <b-modal
        id="modal-updateComment"
        centered
        title="Modifier votre commentaire"
        v-model="show"
        @ok="onSubmit"
      >
        <b-form>
          <b-form-group
            id="input-group-5"
            label="Publication"
            label-for="input-5"
            class="text-dark"
          >
            <b-form-textarea
              id="input-5"
              v-model="form.updateComment"
              rows="4"
              max-rows="10"
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
          <b-button modal-footer type="cancel" variant="outline-danger" size="sm" @click="cancel()">
            Annuler
          </b-button>
        </template>
      </b-modal>
      <b-modal id="modal-deleteComment" centered title="Avertissement">
        <p class="my-4">Etes-vous sûr de vouloir supprimer ce commentaire !</p>
        <template #modal-footer="{ ok, cancel }">
          <b-button modal-footer size="sm" variant="info" @click="ok()">OUI</b-button>
          <b-button modal-footer size="sm" variant="outline-danger" @click="cancel()">NON</b-button>
        </template>
      </b-modal>
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: "Comment",
  data() {
    return {
      show: false,
      user: {
        userId: "",
        avatar: "",
        createdAt: "",
      },
      comment: {
        id: "",
        postId: "",
        userId: "",
        content: "",
        createdAt: "",
      },
      form: {
        comment: "",
        updateComment: "",
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

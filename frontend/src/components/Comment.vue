<template>
  <div class="my-2">
    <!-- Elements to collapse -->
    <b-collapse :id="'collapse' + comPostId" class="mt-3">
      <b-card no-body style="max-width: 35rem" class="mx-auto mb-2">
        <template #header>
          <b-row class="mb-0 text-left">
            <b-col cols="10">
              <b-avatar variant="info" :src="avatar"></b-avatar>
              {{ username }} - publié il y a {{ createdAt }} </b-col
            ><b-col cols="2">
              <b-dropdown
                v-if="comUserId == userInfos.userId"
                size="sm"
                variant="link"
                toggle-class="text-decoration-none text-dark"
                no-caret
              >
                <template #button-content>
                  <b-icon icon="pencil-square" font-scale="2"> </b-icon>
                </template>
                <b-dropdown-item-button
                  ref="updateComShow"
                  v-b-modal="'modal-updateComment' + comId"
                  @click="updateComShow = true"
                  >Modifier</b-dropdown-item-button
                >
                <b-dropdown-item-button
                  ref="deleteComShow"
                  v-b-modal="'modal-deleteComment' + comId"
                  @click="deleteComShow = true"
                  >Supprimer</b-dropdown-item-button
                >
              </b-dropdown>
            </b-col>
          </b-row>
        </template>

        <b-card-body>
          {{ content }}
        </b-card-body>
      </b-card>
      <b-modal
        :id="'modal-updateComment' + comId"
        centered
        title="Modifier votre commentaire"
        v-model="updateComShow"
      >
        <b-form>
          <b-form-group
            id="input-group-1"
            label="Publication"
            label-for="input-1"
            class="text-dark"
          >
            <b-form-textarea
              id="input-1"
              v-model="formCommentUpdate.content"
              rows="4"
              max-rows="10"
              class="rounded-0"
            ></b-form-textarea>
          </b-form-group>
        </b-form>
        <template #modal-footer="{ cancel }">
          <b-button modal-footer class="mr-5" variant="info" size="sm" @click="updateComment"
            >Soumettre</b-button
          >
          <b-button modal-footer variant="outline-danger" size="sm" @click="cancel()">
            Annuler
          </b-button>
        </template>
      </b-modal>
      <b-modal
        :id="'modal-deleteComment' + comId"
        centered
        title="Avertissement"
        v-model="deleteComShow"
      >
        <p class="my-4">Etes-vous sûr de vouloir supprimer ce commentaire !</p>
        <template #modal-footer="{ cancel }">
          <b-button modal-footer size="sm" variant="info" @click="deleteComment">OUI</b-button>
          <b-button modal-footer size="sm" variant="outline-danger" @click="cancel()">NON</b-button>
        </template>
      </b-modal>
    </b-collapse>
  </div>
</template>

<script>
import instance from "../axios/configAxios";
import { mapState } from "vuex";

export default {
  name: "Comment",
  props: {
    comId: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comUserId: {
      type: Number,
      required: true,
    },
    comPostId: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      updateComShow: false,
      deleteComShow: false,

      formCommentUpdate: {
        content: this.content,
      },
    };
  },

  computed: {
    ...mapState(["userInfos"]),
  },

  methods: {
    updateComment() {
      instance
        .put(`/posts/${this.comPostId}/comments/${this.comId}`, this.formCommentUpdate, {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => response)
        .catch((error) => {
          error;
        });
      this.updateComShow = false;
      this.$store.commit("KEY");
    },
    deleteComment() {
      instance
        .delete(`/posts/${this.comPostId}/comments/${this.comId}`, {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => response)
        .catch((error) => {
          error;
        });
      this.deleteComShow = false;
      this.$store.commit("KEY");
    },
  },
};
</script>

<style></style>

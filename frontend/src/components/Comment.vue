<template>
  <div class="my-2">
    <b-collapse :id="'collapse' + comPostId" class="mt-3">
      <b-card id="comment" no-body style="max-width: 35rem" class="mx-auto mb-5 text-black">
        <template #header>
          <b-row class="mb-0 text-left">
            <b-col cols="10">
              <b-avatar variant="info" :src="avatar"></b-avatar>
              {{ username }} - publié il y a {{ date(createdAt) }} </b-col
            ><b-col cols="2">
              <b-dropdown
                v-if="comUserId == userInfos.userId || userInfos.isAdmin == true"
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
            id="group-comment-content"
            label="Commentaire"
            label-for="input-comment-content"
            class="text-dark"
          >
            <b-form-textarea
              id="input-comment-content"
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
          <b-button modal-footer variant="danger" size="sm" @click="cancel()"> Annuler </b-button>
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
          <b-button modal-footer size="sm" variant="danger" @click="cancel()">NON</b-button>
        </template>
      </b-modal>
    </b-collapse>
  </div>
</template>

<script>
import moment from "moment";
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

  mounted() {
    setTimeout(() => {
      this.formCommentUpdate.content = this.content;
    }, 500);
  },

  computed: {
    ...mapState(["userInfos"]),
  },

  methods: {
    updateComment() {
      instance
        .put(`/posts/${this.comPostId}/comments/${this.comId}`, this.formCommentUpdate, {
          headers: { Authorization: `bearer ${this.userInfos.token}` },
        })
        .then((response) => response)
        .catch((error) => {
          error;
        });
      this.$store.commit("KEY");
      this.updateComShow = false;
    },
    deleteComment() {
      instance
        .delete(`/posts/${this.comPostId}/comments/${this.comId}`, {
          headers: { Authorization: `bearer ${this.userInfos.token}` },
        })
        .then((response) => response)
        .catch((error) => {
          error;
        });
      this.deleteComShow = false;
      this.$store.commit("KEY");
    },
    date(createdAt) {
      let timestamp = Date.parse(createdAt);
      let localDate = new Date(timestamp);
      moment.updateLocale("en", {
        relativeTime: {
          future: "in %s",
          past: "%s",
          s: "une seconde",
          ss: "%d secondes",
          m: "une minute",
          mm: "%d minutes",
          h: "une heure",
          hh: "%d heures",
          d: "un jour",
          dd: "%d jours",
          w: "une semaine",
          ww: "%d semaines",
          M: "un mois",
          MM: "%d mois",
          y: "une année",
          yy: "%d années",
        },
      });
      return moment(localDate).fromNow();
    },
  },
};
</script>

<style lang="scss">
#comment {
  border: 1px solid black;
  box-shadow: 1px 1px 10px 2px black;
  background-color: #dbdbdb;
}
</style>

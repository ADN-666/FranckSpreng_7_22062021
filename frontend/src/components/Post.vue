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
              v-if="userId == userInfos.userId"
              size="sm"
              variant="link"
              toggle-class="text-decoration-none text-dark"
              no-caret
            >
              <template #button-content>
                <b-icon icon="pencil-square" font-scale="2"> </b-icon>
              </template>
              <b-dropdown-item-button
                v-b-modal="'modal-updatePost' + postId"
                ref="updateShow"
                @click="updatePostShow = true"
                >Modifier</b-dropdown-item-button
              >
              <b-dropdown-item-button
                v-b-modal="'modal-deletePost' + postId"
                ref="deleteShow"
                @click="deletePostShow = true"
                >Supprimer</b-dropdown-item-button
              >
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
          ><b-col cols="3"
            ><b-button size="sm" to="#" variant="link" class="text-dark"
              ><b-badge variant="light" v-if="Likes != null">{{ Likes }}</b-badge>
              <b-badge variant="light" v-else>0</b-badge>
              <b-icon
                icon="hand-thumbs-up"
                font-scale="2"
                v-if="isLike == true"
                v-model="isLike"
              ></b-icon
              ><b-icon
                icon="hand-thumbs-up"
                font-scale="2"
                v-else
                v-model="isLike"
              ></b-icon></b-button
          ></b-col>
          <b-col cols="3"
            ><b-button size="sm" to="#" variant="link" class="text-dark" v-model="isDislike"
              ><b-badge variant="light" v-if="Dislikes != null">{{ Dislikes }}</b-badge>
              <b-badge variant="light" v-else>0</b-badge>
              <b-icon icon="hand-thumbs-down" font-scale="2"></b-icon></b-button
          ></b-col>

          <b-col cols="6" class="text-right">
            <b-button v-b-toggle="'collapse' + postId"
              ><b-badge variant="light">{{ nbComments }}</b-badge> Commentaires</b-button
            ></b-col
          ></b-row
        >
      </b-card-footer>
      <b-modal
        :id="'modal-updatePost' + postId"
        ref="updateShow"
        centered
        title="Modifier votre publication"
        v-model="updatePostShow"
      >
        <b-form>
          <b-form-group id="input-group-1" label="Titre" label-for="input-1" class="text-dark">
            <b-form-input
              id="input-1"
              v-model="formPostUpdate.title"
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
              v-model="formPostUpdate.content"
              rows="6"
              max-rows="15"
              class="rounded-0"
            ></b-form-textarea>
          </b-form-group>
        </b-form>
        <template #modal-footer="{ cancel }">
          <b-button modal-footer class="mr-5" variant="info" size="sm" @click.prevent="updatePost"
            >Soumettre</b-button
          >
          <b-button modal-footer variant="danger" size="sm" @click="cancel()"> Annuler </b-button>
        </template>
      </b-modal>
      <b-modal
        :id="'modal-deletePost' + postId"
        ref="deleteShow"
        centered
        title="Avertissement"
        v-model="deletePostShow"
      >
        <p class="my-4">Etes-vous sûr de vouloir supprimer cette publication !</p>
        <template #modal-footer="{ cancel }">
          <b-button modal-footer size="sm" variant="outline-info" @click="deletePost">OUI</b-button>
          <b-button modal-footer size="sm" variant="outline-danger" @click="cancel()">NON</b-button>
        </template>
      </b-modal>
    </b-card>
    <b-form @submit.prevent="createComment">
      <b-row>
        <b-col class="col-7 mx-auto"
          ><b-form-input
            id="input-1"
            v-model="formCommentCreate.content"
            type="text"
            class="rounded-pill mx-auto my-2"
            placeholder="Commenter cette publication..."
          ></b-form-input
        ></b-col>
      </b-row>
    </b-form>
    <Comment
      v-for="com in comments"
      :key="com.id"
      :comId="com.id"
      :content="com.content"
      :comUserId="com.userId"
      :comPostId="com.postId"
      :createdAt="com.createdAt"
      :username="com.C_User.username"
      :avatar="com.C_User.avatar"
    />
  </div>
</template>

<script>
import Comment from "@/components/Comment";
import instance from "../axios/configAxios";
import { mapState } from "vuex";

export default {
  name: "Post",
  components: { Comment },
  props: {
    postId: {
      type: Number,
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
      type: Number,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    nbComments: {
      type: Number,
      required: false,
      default: 0,
    },
    Likes: {
      type: String,
      required: false,
      default: "0",
    },
    Dislikes: {
      type: String,
      required: false,
      default: "0",
    },
    isLike: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDislike: {
      type: Boolean,
      required: false,
      default: false,
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
      updatePostShow: false,
      deletePostShow: false,
      comments: [],

      formPostUpdate: {
        title: this.title,
        content: this.content,
      },
      formCommentCreate: {
        content: "",
      },
    };
  },

  mounted() {
    this.getCom();
  },

  computed: {
    ...mapState(["userInfos", "keyPost"]),
  },

  methods: {
    getCom() {
      if (this.nbComments >= 0) {
        instance
          .get(`/posts/${this.postId}/comments/all`, {
            headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
          })
          .then((response) => (this.comments = response.data))
          .catch((error) => {
            error;
          });
      }
    },
    updatePost() {
      instance
        .put(`/posts/${this.postId}`, this.formPostUpdate, {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => response)
        .catch((error) => {
          error;
        });
      this.updatePostShow = false;
      this.$store.commit("KEY");
    },
    deletePost() {
      instance
        .delete(`/posts/${this.postId}`, {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => response)
        .catch((error) => {
          error;
        });
      this.deletePostShow = false;
      this.$store.commit("KEY");
    },
    createComment() {
      instance
        .post(`/posts/${this.postId}/comments`, this.formCommentCreate, {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          this.comments = response.data;
        })
        .catch((error) => {
          error;
        });
      this.$store.commit("KEY");
    },
  },
};
</script>

<style></style>

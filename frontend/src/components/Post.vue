<template>
  <div>
    <b-card id="post" no-body style="max-width: 40rem" class="mx-auto" bg-variant="light">
      <template #header>
        <b-row class="mb-0 text-left">
          <b-col cols="10">
            <b-avatar variant="info" :src="avatar"></b-avatar>

            {{ username }} - publié il y a {{ date(createdAt) }} </b-col
          ><b-col cols="2"
            ><b-dropdown
              v-if="userId == userInfos.userId || userInfos.isAdmin == true"
              size="sm"
              variant="link"
              toggle-class="text-decoration-none text-dark"
              no-caret
            >
              <template #button-content class="border-2">
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
        <b-card-title class="h5">{{ title }}</b-card-title>
        <b-card-img
          v-b-modal="'modal-img' + postId"
          ref="img"
          @click="imgShow = true"
          v-if="imageUrl != null"
          :src="imageUrl"
          alt="Image"
          style="max-width: 20%"
        >
        </b-card-img>
        <b-card-text class="h6"> {{ content }} </b-card-text>
      </b-card-body>
      <b-card-footer class="mt-1">
        <b-row class="align-items-center"
          ><b-col cols="3"
            ><b-button size="sm" variant="link" class="text-dark" @click="like"
              ><b-badge variant="white">{{ Likes }}</b-badge>

              <b-icon
                icon="hand-thumbs-up"
                font-scale="2"
                v-if="P_Likes.isLike == true"
                variant="info"
              ></b-icon
              ><b-icon icon="hand-thumbs-up" font-scale="2" v-else></b-icon></b-button
          ></b-col>
          <b-col cols="3"
            ><b-button size="sm" variant="link" class="text-dark" @click.prevent="dislike"
              ><b-badge variant="white">{{ Dislikes }}</b-badge>

              <b-icon
                icon="hand-thumbs-down"
                font-scale="2"
                v-if="P_Likes.isDislike == true"
                variant="info"
              ></b-icon>
              <b-icon icon="hand-thumbs-down" v-else font-scale="2"></b-icon></b-button
          ></b-col>

          <b-col cols="6" class="text-right">
            <b-button v-b-toggle="'collapse' + postId"
              ><b-badge class="mr-1" variant="light">{{ nbComments }}</b-badge
              ><span v-if="nbComments < 2">Commentaire</span
              ><span v-else>Commentaires</span></b-button
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
        <b-form @reset="reset">
          <b-form-group
            id="group-post-title"
            label="Titre"
            label-for="input-post-title"
            class="text-dark"
          >
            <b-form-input
              id="input-post-title"
              v-model="formPostUpdate.title"
              type="text"
              class="rounded-0"
            ></b-form-input>
            <b-form-invalid-feedback :state="validTitle">
              La publication doit comporter un titre !
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="validTitle"> Parfait ! </b-form-valid-feedback>
          </b-form-group>
          <b-form-group
            id="group-post-content"
            label="Publication"
            label-for="input-post-content"
            class="text-dark"
          >
            <b-form-textarea
              id="input-post-content"
              v-model="formPostUpdate.content"
              rows="6"
              max-rows="15"
              class="rounded-0"
            ></b-form-textarea>
            <b-form-invalid-feedback :state="validContent">
              La publication doit comporter un contenu !
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="validContent"> Parfait ! </b-form-valid-feedback>
          </b-form-group>
          <b-form-group id="group-post-image" class="text-dark">
            <p class="mb-0">
              <label
                label-for="input-post-image"
                v-if="newUrl == '' && formPostUpdate.imageUpdate != null"
                class="text-dark"
                >Image :
                {{ formPostUpdate.imageUpdate.split("http://localhost:3000/images/")[1] }}</label
              >
              <label label-for="input-post-image" v-else-if="newUrl != ''" class="text-dark"
                >Image : {{ newUrl.name }}</label
              >
              <label label-for="input-post-image" v-else class="text-dark"
                >Image : Aucune image sélectionnée</label
              >
            </p>
            <b-button class="mb-2" type="reset" variant="info" size="sm" @click="reset"
              >Supprimer l'image</b-button
            >
            <b-form-file
              id="input-post-image"
              placeholder="Choisissez un fichier"
              class="text-left"
              @change="upload"
            ></b-form-file>
          </b-form-group>
        </b-form>
        <template #modal-footer="{ cancel }">
          <b-button modal-footer class="mr-5" variant="info" size="sm" @click="updatePost"
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
          <b-button modal-footer size="sm" variant="info" @click="deletePost">OUI</b-button>
          <b-button modal-footer size="sm" variant="danger" @click="cancel()">NON</b-button>
        </template>
      </b-modal>
      <b-modal :id="'modal-img' + postId" ref="img" centered v-model="imgShow">
        <b-img :src="imageUrl" fluid></b-img>
        <template #modal-footer="{ ok }">
          <b-button modal-footer size="sm" variant="info" @click="ok()">ok</b-button>
        </template>
      </b-modal>
    </b-card>
    <b-form @submit.prevent="createComment">
      <b-row>
        <b-col class="col-7 mx-auto"
          ><b-form-input
            id="input-comment"
            v-model="formCommentCreate.content"
            type="text"
            class="rounded-pill mx-auto my-3 border-dark text-black"
            placeholder="Commenter ce post..."
          ></b-form-input
        ></b-col>
      </b-row>
    </b-form>
    <Comment
      v-for="com in filteredComments"
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
import moment from "moment";
import Comment from "@/components/Comment";
import instance from "../axios/configAxios";
import { mapState } from "vuex";

export default {
  name: "Post",
  components: { Comment },
  props: {
    postId: {
      type: Number,
      required: true,
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
      required: true,
    },
    Likes: {
      type: String,
      required: true,
    },
    Dislikes: {
      type: String,
      required: false,
    },

    P_Likes: {
      type: Object,
      default: function () {
        return { isLike: false, isDislike: false };
      },
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      updatePostShow: false,
      deletePostShow: false,
      imgShow: false,
      show: false,

      formPostUpdate: {
        title: this.title,
        content: this.content,
        imageUpdate: this.imageUrl,
      },

      formCommentCreate: {
        content: "",
      },

      formLike: {
        isLike: false,
        isDislike: false,
      },
      newUrl: "",
    };
  },

  mounted() {
    setTimeout(() => {
      //récupération de la maj du post
      (this.formPostUpdate.title = this.title),
        (this.formPostUpdate.content = this.content),
        (this.formPostUpdate.imageUpdate = this.imageUrl);
    }, 500);
  },

  computed: {
    ...mapState(["userInfos", "comments"]),

    filteredComments() {
      //fonction de filtre des commentaires pour les attribuer au bon post par l'id
      return this.comments.filter((com) => com.postId == this.postId);
    },
    validTitle() {
      //validation du titre du post à la maj
      return this.formPostUpdate.title.length > 2;
    },
    validContent() {
      //validation du contenu du post à la maj
      return this.formPostUpdate.content.length > 10;
    },
  },

  methods: {
    upload(event) {
      // récupération de l'image dans un req.file au changement de l'input
      this.formPostUpdate.imageUpdate = event.target.files[0];
      this.newUrl = event.target.files[0];
    },
    reset(event) {
      //suppression de l'image du post
      event.preventDefault();
      this.formPostUpdate.imageUpdate = null;
      this.newUrl = "";
      this.updatePostShow = false;
      this.$nextTick(() => {
        this.updatePostShow = true;
      });
    },
    updatePost() {
      //màj du post avec création d'un formData et récupération ou non de l'image
      let formData = new FormData();
      formData.set("title", this.formPostUpdate.title);
      formData.set("content", this.formPostUpdate.content);
      if (this.validTitle === true && this.validContent === true) {
        if (this.formPostUpdate.imageUpdate != null) {
          formData.append("image", this.formPostUpdate.imageUpdate);
        }
        instance
          .put(`/posts/${this.postId}`, formData, {
            headers: { Authorization: `bearer ${this.userInfos.token}` },
          })
          .then(() => {
            this.$store.commit("KEY");
            this.updatePostShow = false;
          })
          .catch((error) => {
            error;
          });
      }
    },
    deletePost() {
      //suppression du post
      instance
        .delete(`/posts/${this.postId}`, {
          headers: { Authorization: `bearer ${this.userInfos.token}` },
        })
        .then(() => {
          this.deletePostShow = false;
          this.$store.commit("KEY");
        })
        .catch((error) => {
          error;
        });
    },
    createComment() {
      //création d'un commentaire
      instance
        .post(`/posts/${this.postId}/comments`, this.formCommentCreate, {
          headers: { Authorization: `bearer ${this.userInfos.token}` },
        })
        .then(() => {
          this.$store.commit("KEY");
        })
        .catch((error) => {
          error;
        });
    },
    like() {
      //création ou màj d'un like avec condition pour faire passer un like existant
      // de true à false ou inversement
      if (this.P_Likes.isLike == true) {
        this.formLike.isLike = false;
      } else {
        this.formLike.isLike = true;
      }
      instance
        .post(`/posts/${this.postId}/like`, this.formLike, {
          headers: { Authorization: `bearer ${this.userInfos.token}` },
        })
        .then(() => this.$store.commit("KEY"))
        .catch((error) => {
          error;
        });
    },
    dislike() {
      //création ou màj d'un dislike avec condition pour faire passer un like existant
      // de true à false ou inversement
      if (this.P_Likes.isDislike == true) {
        this.formLike.isDislike = false;
      } else {
        this.formLike.isDislike = true;
      }
      instance
        .post(`/posts/${this.postId}/like`, this.formLike, {
          headers: { Authorization: `bearer ${this.userInfos.token}` },
        })
        .then(() => this.$store.commit("KEY"))
        .catch((error) => {
          error;
        });
    },

    date(createdAt) {
      //formatage de la date de publication du post
      let timestamp = Date.parse(createdAt);
      let localDate = new Date(timestamp);
      moment.updateLocale("fr", {
        relativeTime: {
          future: "in %s",
          past: "%s",
          s: "moins d'une minute",
          ss: "%d secondes",
          m: "1 minute",
          mm: "%d minutes",
          h: "1 heure",
          hh: "%d heures",
          d: "1 jour",
          dd: "%d jours",
          w: "1 semaine",
          ww: "%d semaines",
          M: "1 mois",
          MM: "%d mois",
          y: "1 année",
          yy: "%d années",
        },
      });
      return moment(localDate).fromNow();
    },
  },
};
</script>

<style lang="scss">
#post {
  border: 1px solid black;
  box-shadow: 1px 1px 5px 1px black;
}
#input-comment {
  background-color: rgb(213, 215, 216);
}
</style>

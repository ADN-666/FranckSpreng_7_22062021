<template>
  <div class="Home container">
    <b-jumbotron bg-variant="light" class="my-5 shadow-lg">
      <b-card
        title="Bienvenue sur le réseau social de Groupomania"
        img-src="../assets/icon.svg"
        img-alt="Logo Groupomania"
        img-top
        tag="article"
        style="max-width: 35rem"
        class="mb-2 mx-auto shadow-lg"
        bg-variant="light"
        border-variant="dark"
      >
        <b-card-text class="texte">Veuillez créer un compte ou vous identifier </b-card-text>
        <b-button :to="{ name: 'Signup' }" variant="info" class="mr-5">Inscription</b-button>
        <b-button :to="{ name: 'Login' }" variant="info">Connexion</b-button>
      </b-card>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  name: "Home",
  component: {},
};
</script>

<style></style>

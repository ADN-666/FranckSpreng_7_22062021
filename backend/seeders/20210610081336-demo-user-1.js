"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        username: "adn-666",
        email: "adn@gmail.com",
        password: "$2b$10$fU5fi0yLTgErNDD.MdjyMuSc6C5/mthmdwe6iD85vil1QlfVRXOiq",
        bio: "Bonjour je m'appelle Franck, j'ai 46 ans et je suis developpeur web pour le groupe.",
        avatar: null,
        isAdmin: "0",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};

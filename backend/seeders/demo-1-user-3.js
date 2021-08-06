"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        username: "Moderateur",
        email: "moderateur@gmail.com",
        password: "$2b$10$fU5fi0yLTgErNDD.MdjyMuSc6C5/mthmdwe6iD85vil1QlfVRXOiq",
        bio: "Bonjour je suis le modérateur du réseau social.",
        avatar: null,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};

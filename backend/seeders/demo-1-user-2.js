"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        username: "simba",
        email: "doudou@gmail.com",
        password: "$2b$10$ZelA/NqEC87sBaA4IR.KrutlaiDcc2Z7bEPicVzpjWI07uWp5TIhy",
        bio: "Bonjour je m'appelle Simba, j'ai 17 ans et je suis un chat.",
        avatar: "http://localhost:3000/images/doudou.jpg1630490396422.jpg",
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};

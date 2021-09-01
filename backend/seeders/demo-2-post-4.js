"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Posts", [
      {
        userId: 1,
        title: " Cyberpunk 2077",
        content: "Je ne sais pas si vous jouez chez vous ? Mais il est pas mal ce jeux",
        imageUrl: "http://localhost:3000/images/photomode_05022021_005347.png1630489900240.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Posts", null, {});
  },
};

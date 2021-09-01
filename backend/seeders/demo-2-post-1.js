"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Posts", [
      {
        userId: 1,
        title: "Mona Lisa",
        content: "Vu au Louvre samedi dernier",
        imageUrl: " http://localhost:3000/images/Mona_Lisa.jpg1630491484781.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Posts", null, {});
  },
};

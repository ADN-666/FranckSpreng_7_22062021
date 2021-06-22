"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Like.belongsTo(models.Post, {
        as: "L_Post",
        foreignKey: "postId",
        allowNull: false,
      });
      models.Like.belongsTo(models.User, {
        as: "L_User",
        foreignKey: "userId",
        allowNull: false,
      });
    }
  }
  Like.init(
    {
      postId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      isLike: DataTypes.BOOLEAN,
      isDislike: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};

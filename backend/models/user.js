"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Post, {
        as: "U_Posts",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
      models.User.hasMany(models.Comment, {
        as: "U_Comments",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
      models.User.hasMany(models.Like, {
        as: "U_Likes",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      bio: DataTypes.STRING,
      avatar: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

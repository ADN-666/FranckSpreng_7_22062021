"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Post.belongsTo(models.User, {
        as: "P_User",
        foreignKey: "userId",
        allowNull: false,
      });
      models.Post.hasMany(models.Comment, {
        as: "P_Comments",
        foreignKey: "postId",
        allowNull: false,
        onDelete: "CASCADE",
        hooks: true,
      });
      models.Post.hasMany(models.Like, {
        as: "P_Likes",
        foreignKey: "postId",
        allowNull: false,
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Post.init(
    {
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};

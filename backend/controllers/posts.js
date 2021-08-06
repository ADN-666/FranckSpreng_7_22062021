/* Fichier contenant la logique des sauces*/

const models = require("../models");
const jwtUtils = require("../utils/jwt.utils");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

module.exports = {
  createPost: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    const post = {
      userId: userId,
      title: req.body.title,
      content: req.body.content,
    };
    models.Post.create(post)
      .then((post) => res.status(201).json(post))
      .catch((error) => res.status(400).json({ error }));
  },

  getAllPost: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    models.Post.findAll({
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "title",
        "content",
        "userId",
        "createdAt",
        [
          Sequelize.literal(`(
                    SELECT COUNT(postId)
                    FROM Comments  WHERE
                     Post.id = Comments.postId
                )`),
          "nbComments",
        ],
        [
          Sequelize.literal(`(
                    SELECT COALESCE(SUM(isLike),0) AS val
                    FROM Likes  WHERE
                     Post.id = Likes.postId
                )`),
          "Likes",
        ],
        [
          Sequelize.literal(`(
                    SELECT COALESCE(SUM(isDislike),0) AS val
                    FROM Likes  WHERE
                     Post.id = Likes.postId
                )`),
          "Dislikes",
        ],
      ],
      include: [
        {
          model: models.User,
          as: "P_User",

          attributes: ["username", "id", "avatar"],
        },
        {
          model: models.Like,
          as: "P_Likes",
          attributes: ["isLike", "isDislike"],
          where: { userId: userId },
          required: false,
        },
      ],
    })
      .then((posts) => res.status(200).json(posts))
      .catch((error) => res.status(400).json({ error }));
  },

  getUserPost: function (req, res) {
    models.Post.findAll({
      order: [["id", "DESC"]],
      where: { userId: req.params.userId },
      attributes: [
        "id",
        "title",
        "content",
        "userId",
        "createdAt",
        [
          Sequelize.literal(`(
                    SELECT COUNT(postId)
                    FROM Comments  WHERE
                     Post.id = Comments.postId
                )`),
          "nbComments",
        ],
        [
          Sequelize.literal(`(
                    SELECT COALESCE(SUM(isLike),0) AS val
                    FROM Likes  WHERE
                     Post.id = Likes.postId
                )`),
          "Likes",
        ],
        [
          Sequelize.literal(`(
                    SELECT COALESCE(SUM(isDislike),0) AS val
                    FROM Likes  WHERE
                     Post.id = Likes.postId
                )`),
          "Dislikes",
        ],
      ],
      include: {
        model: models.User,
        as: "P_User",

        attributes: ["username", "id", "avatar"],
      },
    })
      .then((posts) => res.status(200).json(posts))
      .catch((error) => res.status(400).json({ error }));
  },

  updatePost: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    const isAdmin = jwtUtils.getIsAdmin(headerAuth);

    let title = req.body.title;
    let content = req.body.content;

    models.Post.findOne({
      where: { id: req.params.id },
    })
      .then((postUpdate) => {
        if (postUpdate.userId == userId || isAdmin == true) {
          postUpdate.update({
            title: title,
            content: content,
          });
          return res.status(200).json({ message: "Message modifié !" });
        } else {
          return res.status(500).json({ error: " Vous ne pouvez pas modifier ce post  " });
        }
      })
      .catch((error) => res.status(500).json({ error: " Un problème s'est produit  " }));
  },

  deletePost: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    const isAdmin = jwtUtils.getIsAdmin(headerAuth);
    models.Post.findOne({
      where: { id: req.params.id },
    })
      .then((post) => {
        if (post.userId == userId || isAdmin == true) {
          models.Post.destroy({
            where: { id: post.id },
          })
            .then(() => res.status(200).json({ message: "Message supprimé !" }))
            .catch((error) =>
              res.status(400).json({ error: "Impossible de supprimer le message" })
            );
        } else {
          return res.status(400).json({ message: "Vous ne pouvez pas supprimer ce post" });
        }
      })
      .catch((error) => res.status(500).json({ error }));
  },
};

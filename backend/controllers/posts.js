/* Fichier contenant la logique des sauces*/

const models = require("../models");
const fs = require("fs"); // module permettant l'enregistrement d'une image sur le serveur
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
    const image = {
      image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    };
    if (req.file) {
      models.Post.create(post, image)
        .then((newPost) => res.status(201).json({ message: "Post enregistré !", newPost }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      models.Post.create(post)
        .then((newPost) => res.status(201).json({ message: "Post enregistré !", newPost }))
        .catch((error) => res.status(400).json({ error }));
    }
  },

  getAllPost: function (req, res) {
    models.Post.findAll({
      group: "Id",
      attributes: [
        "title",
        "content",
        "image",
        [
          Sequelize.literal(`(
                    SELECT COUNT(postId)
                    FROM Comments  WHERE
                     Post.id = Comments.postId
                )`),
          "nbComments",
        ],
      ],
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: models.User,
          as: "P_User",
          attributes: ["username"],
        },
        {
          model: models.Like,
          as: "P_Likes",
          attributes: [
            [Sequelize.fn("SUM", Sequelize.col("isLike")), "Likes"],
            [Sequelize.fn("SUM", Sequelize.col("isDislike")), "Dislikes"],
          ],
        },
      ],
    })
      .then((posts) => res.status(200).json(posts))
      .catch((error) => res.status(400).json({ error }));
  },

  getOnePost: function (req, res) {
    models.Post.findOne({
      where: { id: req.params.id },
      attributes: [
        "title",
        "content",
        "image",
        "createdAt",
        "updatedAt",
        [
          Sequelize.literal(`(
                    SELECT SUM(isLike)
                    FROM Likes  WHERE
                     Post.id = Likes.postId
                )`),
          "Likes",
        ],
        [
          Sequelize.literal(`(
                    SELECT SUM(isDislike)
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
          attributes: ["username"],
        },
        {
          model: models.Comment,
          as: "P_Comments",
          attributes: ["content", "createdAt", "updatedAt"],
          include: {
            model: models.User,
            as: "C_User",
            attributes: ["username"],
          },
        },
      ],
    })
      .then((post) => res.status(200).json(post))
      .catch((error) => res.status(404).json({ error }));
  },

  updatePost: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    let title = req.body.title;
    let content = req.body.content;
    let image = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    models.Post.findOne({
      where: { id: req.params.id },
    })
      .then((postUpdate) => {
        if (postUpdate.userId == userId) {
          if (req.file) {
            postUpdate.update({
              title: title,
              content: content,
              image: image,
            });
            if (image != postUpdate.image && postUpdate.image != null) {
              const filename = postUpdate.image.split("/images/")[1];
              fs.unlink(`images/${filename}`, () => {
                return res.status(201).json(postUpdate);
              });
            }
            return res.status(201).json(postUpdate);
          } else {
            postUpdate.update({
              title: title,
              content: content,
            });
          }
        }
        return res.status(500).json({ error: " Vous ne pouvez pas modifier ce post  " });
      })
      .catch((error) => res.status(500).json({ error: " Un problème s'est produit  " }));
  },

  deletePost: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    models.Post.findOne({
      where: { id: req.params.id },
    })
      .then((post) => {
        if (post.userId == userId) {
          if (post.image) {
            let image = post.image.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              models.Post.destroy({
                where: { id: post.id },
              })
                .then(() => res.status(200).json({ message: "Objet supprimé !" }))
                .catch((error) => res.status(400).json({ error: "Impossible de supprimer le message" }));
            });
          } else {
            models.Post.destroy({
              where: { id: post.id },
            })
              .then(() => res.status(200).json({ message: "Objet supprimé !" }))
              .catch((error) => res.status(400).json({ error: "Impossible de supprimer le message" }));
          }
        } else {
          return res.status(400).json({ message: "Vous ne pouvez pas supprimer ce post" });
        }
      })
      .catch((error) => res.status(500).json({ error }));
  },
};

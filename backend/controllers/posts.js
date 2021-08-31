/* Fichier contenant la logique des sauces*/

const models = require("../models");
const jwtUtils = require("../utils/jwt.utils");
const fs = require("fs");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

module.exports = {
  createPost: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    let title = req.body.title;
    let content = req.body.content;

    if (req.file != null) {
      models.Post.create({
        title: title,
        content: content,
        userId: userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      })
        .then((newPost) => res.status(201).json(newPost))
        .catch((error) => res.status(410).json({ error }));
    } else {
      models.Post.create({
        title: title,
        content: content,
        userId: userId,
        imageUrl: null,
      })
        .then((newPost) => res.status(201).json(newPost))
        .catch((error) => res.status(420).json({ error }));
    }
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
        "imageUrl",
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
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    models.Post.findAll({
      order: [["id", "DESC"]],
      where: { userId: req.params.userId },
      attributes: [
        "id",
        "title",
        "content",
        "imageUrl",
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
          if (req.file) {
            if (postUpdate.imageUrl != null) {
              const filename = postUpdate.imageUrl.split("/images/")[1];
              fs.unlink(`images/${filename}`, () => {
                postUpdate
                  .update({
                    title: title,
                    content: content,
                    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                  })
                  .then((postUpdate) => res.status(200).json(postUpdate))
                  .catch(() =>
                    res.status(400).json({
                      error: "il y a eu un problème à la suppression de l'ancienne image !",
                    })
                  );
              });
            } else {
              postUpdate
                .update({
                  title: title,
                  content: content,
                  imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                })
                .then((postUpdate) => res.status(200).json(postUpdate))
                .catch(() =>
                  res.status(400).json({
                    error: "il y a eu un problème au téléchargement de l'image !",
                  })
                );
            }
          } else {
            if (postUpdate.imageUrl != null && req.body.image == undefined) {
              const filename = postUpdate.imageUrl.split("/images/")[1];
              fs.unlink(`images/${filename}`, () => {
                postUpdate
                  .update({
                    title: title,
                    content: content,
                    imageUrl: null,
                  })
                  .then((postUpdate) => res.status(200).json(postUpdate))
                  .catch(() =>
                    res.status(500).json({ error: " La publication n'a pas été mise à jour  " })
                  );
              });
            } else {
              postUpdate
                .update({
                  title: title,
                  content: content,
                })
                .then((postUpdate) => res.status(200).json(postUpdate))
                .catch(() =>
                  res.status(500).json({ error: " La publication n'a pas été mise à jour  " })
                );
            }
          }
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
          if (post.imageUrl) {
            let filename = post.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              models.Post.destroy({
                where: { id: post.id },
              })
                .then(() => res.status(200).json({ message: "Publication supprimée !" }))
                .catch((error) =>
                  res.status(400).json({ error: "Impossible de supprimer la publication" })
                );
            });
          }
          models.Post.destroy({
            where: { id: post.id },
          })
            .then(() => res.status(201).json(`La publication a bien été supprimé`))
            .catch((error) =>
              res.status(500).json({ error: "problème à la suppression de la publication" })
            );
        } else {
          return res.status(400).json({ message: "Vous ne pouvez pas supprimer ce post" });
        }
      })
      .catch((error) => res.status(500).json({ error: "Aucune publication correspondante" }));
  },
};

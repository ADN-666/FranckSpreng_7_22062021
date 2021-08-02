const models = require("../models");
const bcrypt = require("bcrypt"); // module de cryptage du mot de passe
const jwt = require("jsonwebtoken"); // module permettant la création d'un jeton d'authentification
const jwtUtils = require("../utils/jwt.utils");
const fs = require("fs"); // module permettant l'enregistrement d'une image sur le serveur
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

module.exports = {
  signup: function (req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let bio = req.body.bio;

    if (email == null || username == null || password == null) {
      return res.status(400).json({
        erreur: "les champs: Email, Username et Password sont obligatoires",
      });
    }
    models.User.findOne({
      attributes: ["email", "username"],
      where: {
        [Op.or]: [{ email: email }, { username: username }],
      },
    })
      .then((userFound) => {
        if (!userFound) {
          if (req.file != null) {
            bcrypt.hash(password, 10, function (err, hash) {
              models.User.create({
                username: username,
                email: email,
                password: hash,
                bio: bio,
                avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                isAdmin: 0,
              })
                .then((newUser) => {
                  return res.status(201).json({
                    token: jwt.sign({ userId: newUser.id }, "doudou21steph29", {
                      expiresIn: "24h",
                    }),
                    avatar: newUser.avatar,
                    username: newUser.username,
                    userId: newUser.id,
                  });
                })
                .catch((error) =>
                  res.status(500).json({ error: "Impossible de créer un nouvel utilisateur" })
                );
            });
          } else {
            bcrypt.hash(password, 10, function (err, hash) {
              models.User.create({
                username: username,
                email: email,
                password: hash,
                bio: bio,
                avatar: null,
                isAdmin: 0,
              })
                .then(function (newUser) {
                  return res.status(201).json({
                    token: jwt.sign({ userId: newUser.id }, "doudou21steph29", {
                      expiresIn: "24h",
                    }),
                    avatar: newUser.avatar,
                    username: newUser.username,
                    userId: newUser.id,
                  });
                })
                .catch((error) =>
                  res.status(500).json({ error: "Impossible de créer un nouvel utilisateur" })
                );
            });
          }
        } else if (userFound.email == email) {
          return res.status(401).json({ error: "email déjà présent dans la base !" });
        } else if (userFound.username == username) {
          return res.status(401).json({ error: "username déjà présent dans la base !" });
        }
      })
      .catch((error) => res.status(500).json({ error: "Erreur de traitement" }));
  },

  login: function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || email == "" || password == null || password == "") {
      return res.status(400).json({ erreur: "Les champs Email et Password doivent être remplis" });
    }

    models.User.findOne({
      attributes: ["id", "password", "username", "avatar"],
      where: { email: email },
    })
      .then((userFound) => {
        if (!userFound) {
          return res.status(401).json({ erreur: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(password, userFound.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              token: jwt.sign({ userId: userFound.id }, "doudou21steph29", {
                expiresIn: "24h",
              }),
              avatar: userFound.avatar,
              username: userFound.username,
              userId: userFound.id,
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  },

  getAllUsers: function (req, res) {
    models.User.findAll({
      attributes: [
        "id",
        "username",
        "bio",
        "avatar",
        [
          Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Posts AS Post WHERE
                     Post.userId = User.id
                )`),
          "nbPosts",
        ],
      ],
    })
      .then((user) => res.status(200).json(user))
      .catch((error) => res.status(500).json({ error }));
  },

  getOneUser: function (req, res) {
    models.User.findOne({
      group: "U_Posts.id",
      attributes: ["username", "bio", "avatar"],
      where: { id: req.params.id },
      include: {
        model: models.Post,
        as: "U_Posts",
        attributes: [
          "id",
          "title",
          "content",
          [
            Sequelize.literal(`(
                    SELECT COUNT(postId)
                    FROM Comments  WHERE
                     U_Posts.id = Comments.postId
                )`),
            "nbComments",
          ],
        ],
        include: [
          {
            model: models.Like,
            as: "P_Likes",
            attributes: [
              [Sequelize.fn("SUM", Sequelize.col("isLike")), "Likes"],
              [Sequelize.fn("SUM", Sequelize.col("isDislike")), "Dislikes"],
            ],
          },
        ],
      },
    })
      .then((userFound) => res.status(200).json(userFound))
      .catch((error) => res.status(404).json({ error }));
  },

  getUserProfile: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    models.User.findOne({
      where: { id: userId },
      attributes: [
        "avatar",
        "bio",
        "createdAt",
        "email",
        "updatedAt",
        "username",

        [
          Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Posts AS Post WHERE
                     Post.userId = User.id
                )`),
          "nbPosts",
        ],
      ],
    })
      .then((userFound) => res.status(200).json(userFound))
      .catch((error) => res.status(404).json({ error: "utilisateur introuvable" }));
  },

  updateProfile: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    let username = req.body.username;
    let email = req.body.email;
    let bio = req.body.bio;

    models.User.findOne({
      where: { id: userId },
    })
      .then((userFound) => {
        if (req.file) {
          if (userFound.avatar != null) {
            const filename = userFound.avatar.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              userFound
                .update({
                  username: username,
                  email: email,
                  bio: bio,
                  avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                })
                .then((userUpdate) => res.status(200).json(userUpdate))
                .catch(() =>
                  res.status(400).json({
                    error: "il y a eu un problème à la suppression de l'ancienne image !",
                  })
                );
            });
          } else {
            userFound
              .update({
                username: username,
                email: email,
                bio: bio,
                avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
              })
              .then((userUpdate) => res.status(200).json(userUpdate))
              .catch(() =>
                res.status(400).json({
                  error: "il y a eu un problème à la suppression de l'ancienne image !",
                })
              );
          }
        } else {
          userFound
            .update({
              username: username,
              email: email,
              bio: bio,
            })
            .then((userUpdate) => res.status(200).json(userUpdate))
            .catch(() => res.status(500).json({ error: " Le profil n'a pas été mis à jour  " }));
        }
      })
      .catch(() =>
        res.status(500).json({
          error: "il y a eu un problème de traitement !",
        })
      );
  },

  deleteUser: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    models.User.findOne({
      where: { id: req.params.id },
      attributes: ["id", "username"],
    })
      .then((userFound) => {
        if (userFound.id != userId) {
          return res.status(401).json({ message: "Vous ne pouvez pas supprimé ce compte" });
        } else {
          if (userFound.avatar) {
            let filename = userFound.avatar.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              models.User.destroy({
                where: { id: userId },
              })
                .then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
                .catch((error) =>
                  res.status(400).json({ error: "Impossible de supprimer le message" })
                );
            });
          }
          models.User.destroy({
            where: { id: userId },
          })
            .then(() =>
              res.status(201).json(`L'utilisateur ${userFound.username} a bien été supprimé`)
            )
            .catch((error) =>
              res.status(500).json({ error: "problème à la suppression du compte" })
            );
        }
      })
      .catch((error) => res.status(500).json({ error: "Aucun utilisateur correspondant" }));
  },
};

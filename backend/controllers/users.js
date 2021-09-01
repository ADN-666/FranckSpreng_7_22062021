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
            //logique si un avatar est présent dans la requête
            bcrypt.hash(password, 10, function (err, hash) {
              models.User.create({
                username: username,
                email: email,
                password: hash,
                bio: bio,
                avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                isAdmin: false,
              })
                .then((newUser) => {
                  return res.status(201).json({
                    token: jwt.sign({ userId: newUser.id }, "doudou21steph29", {
                      expiresIn: "24h",
                    }),
                    avatar: newUser.avatar,
                    username: newUser.username,
                    userId: newUser.id,
                    isAdmin: newUser.isAdmin,
                  });
                })
                .catch((error) =>
                  res.status(500).json({ error: "Impossible de créer un nouvel utilisateur" })
                );
            });
          } else {
            // logique sans avatar dans la requête
            bcrypt.hash(password, 10, function (err, hash) {
              models.User.create({
                username: username,
                email: email,
                password: hash,
                bio: bio,
                avatar: null,
                isAdmin: false,
              })
                .then(function (newUser) {
                  return res.status(201).json({
                    token: jwt.sign({ userId: newUser.id }, "doudou21steph29", {
                      expiresIn: "24h",
                    }),
                    avatar: newUser.avatar,
                    username: newUser.username,
                    userId: newUser.id,
                    isAdmin: newUser.isAdmin,
                  });
                })
                .catch((error) =>
                  res.status(500).json({ error: "Impossible de créer un nouvel utilisateur" })
                );
            });
          } // logique controlant la présence dans la base d'un email ou username
        } else if (userFound.email == email) {
          return res.status(400).json("email déjà présent dans la base !");
        } else if (userFound.username == username) {
          return res.status(400).json("username déjà présent dans la base !");
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
      attributes: ["id", "password", "username", "avatar", "isAdmin"],
      where: { email: email },
    })
      .then((userFound) => {
        if (!userFound) {
          return res.status(401).json("Utilisateur non trouvé !");
        }
        bcrypt
          .compare(password, userFound.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json("Mot de passe incorrect !");
            }
            res.status(200).json({
              token: jwt.sign(
                { userId: userFound.id, isAdmin: userFound.isAdmin },
                "doudou21steph29",
                {
                  expiresIn: "24h",
                }
              ),
              avatar: userFound.avatar,
              username: userFound.username,
              userId: userFound.id,
              isAdmin: userFound.isAdmin,
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  },

  //requête d'affichage des utilisateurs avec sous requête sur le nombre de post publiés par chacun
  getAllUsers: function (req, res) {
    models.User.findAll({
      order: [["username", "ASC"]],
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

  //requête d'affichage du profil utilisateur avec sous requête sur le nombre de post publiés
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
          //logique de mise à jour du profil et de l'avatar avec un avatar déjà présent dans la base
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
                .then((userUpdate) =>
                  res.status(200).json({
                    username: userUpdate.username,
                    email: userUpdate.email,
                    bio: userUpdate.bio,
                    avatar: userUpdate.avatar,
                    createdAt: userUpdate.createdAt,
                  })
                )
                .catch((error) =>
                  res.status(400).json({
                    error: "il y a eu un problème à la suppression de l'ancienne image !",
                  })
                );
            });
          } else {
            //logique de mise à jour du profil et de l'avatar sans avatar déjà présent dans la base
            userFound
              .update({
                username: username,
                email: email,
                bio: bio,
                avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
              })
              .then((userUpdate) =>
                res.status(200).json({
                  username: userUpdate.username,
                  email: userUpdate.email,
                  bio: userUpdate.bio,
                  avatar: userUpdate.avatar,
                  createdAt: userUpdate.createdAt,
                })
              )
              .catch(() =>
                res.status(400).json({
                  error: "il y a eu un problème à la suppression de l'ancienne image !",
                })
              );
          }
        } else {
          //logique de mise à jour du profil et de l'avatar avec suppression de celui dans la base
          if (userFound.avatar != null && req.body.image == null) {
            const filename = userFound.avatar.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              userFound
                .update({
                  username: username,
                  email: email,
                  bio: bio,
                  avatar: null,
                })
                .then((userUpdate) =>
                  res.status(200).json({
                    username: userUpdate.username,
                    email: userUpdate.email,
                    bio: userUpdate.bio,
                    avatar: userUpdate.avatar,
                    createdAt: userUpdate.createdAt,
                  })
                )
                .catch(() =>
                  res.status(500).json({ error: " Le profil n'a pas été mis à jour  " })
                );
            });
          } else {
            //logique de mise à jour du profil sans remplacement de l'avatar présent dans la base
            userFound
              .update({
                username: username,
                email: email,
                bio: bio,
              })
              .then((userUpdate) =>
                res.status(200).json({
                  username: userUpdate.username,
                  email: userUpdate.email,
                  bio: userUpdate.bio,
                  avatar: userUpdate.avatar,
                  createdAt: userUpdate.createdAt,
                })
              )
              .catch((error) => res.status(500).json({ error }));
          }
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
          //condition permettant de vérifier le droit de suppression du compte
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
      .catch((error) => res.status(404).json({ error: "Aucun utilisateur correspondant" }));
  },
};

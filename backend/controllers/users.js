const models = require("../models");
const bcrypt = require("bcrypt"); // module de cryptage du mot de passe
const jwt = require("jsonwebtoken"); // module permettant la création d'un jeton d'authentification
const jwtUtils = require("../utils/jwt.utils");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

module.exports = {
  signup: function (req, res) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const bio = req.body.bio;

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
          bcrypt.hash(password, 10, function (err, hash) {
            models.User.create({
              email: email,
              username: username,
              password: hash,
              bio: bio,
              isAdmin: 0,
            })
              .then(function (newUser) {
                return res.status(201).json({
                  message: `nouvel utilisateur créé avec le userId ${newUser.id}`,
                });
              })
              .catch((error) => res.status(500).json({ error: "Impossible de créer un nouvel utilisateur" }));
          });
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
      attributes: ["id", "password"],
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
              userId: userFound.id,
              token: jwt.sign({ userId: userFound.id }, "doudou21steph29", {
                expiresIn: "24h",
              }),
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
      .then((user) => res.status(201).json(user))
      .catch((error) => res.status(500).json({ error }));
  },

  getOneUser: function (req, res) {
    models.User.findOne({
      group: "U_Posts.id",
      attributes: ["username", "bio"],
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
      attributes: { exclude: ["password"] },
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
      .then((userFound) =>
        userFound
          .update({
            username: username ? username : userFound.username,
            email: email ? email : userFound.email,
            bio: bio ? bio : userFound.bio,
          })
          .then((updateProfile) => res.status(201).json(updateProfile)) // a vérifier
          .catch((error) => res.status(500).json({ error: " Utilisateur non trouvé  " }))
      )
      .catch((error) => res.status(500).json({ error: "Le profil n'a pas été mis à jour " }));
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
          models.User.destroy({
            where: { id: userId },
          })
            .then(() => res.status(201).json(`L'utilisateur ${userFound.username} a bien été supprimé`))
            .catch((error) => res.status(500).json({ error: "problème à la suppression du compte" }));
        }
      })
      .catch((error) => res.status(500).json({ error: "Aucun utilisateur correspondant" }));
  },
};

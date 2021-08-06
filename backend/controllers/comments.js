const models = require("../models");
const jwtUtils = require("../utils/jwt.utils");

module.exports = {
  createComment: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    const comment = {
      userId: userId,
      postId: req.params.postId,
      content: req.body.content,
    };
    models.Comment.create(comment)
      .then((newComment) =>
        res.status(201).json({ message: "Commentaire enregistré !", newComment })
      )
      .catch((error) => res.status(400).json({ error }));
  },

  getAllComments: function (req, res) {
    models.Comment.findAll({
      order: [["id", "DESC"]],
      include: {
        model: models.User,
        as: "C_User",
        attributes: ["username", "avatar"],
      },
    })
      .then((post) => res.status(200).json(post))
      .catch((error) => res.status(404).json({ error }));
  },

  getOneComment: function (req, res) {
    models.Comment.findOne({
      where: { id: req.params.id },
      include: {
        model: models.User,
        as: "C_User",
        attributes: ["username", "avatar"],
      },
    })
      .then((post) => res.status(200).json(post))
      .catch((error) => res.status(404).json({ error }));
  },

  updateComment: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    const isAdmin = jwtUtils.getIsAdmin(headerAuth);
    let content = req.body.content;

    models.Comment.findOne({
      where: { id: req.params.id },
    })
      .then((comUpdate) => {
        if (comUpdate.userId == userId || isAdmin == true) {
          comUpdate.update({
            content: content,
          });
          return res.status(200).json(comUpdate);
        } else {
          return res.status(404).json({ error: " Vous ne pouvez pas modifier ce commentaire " });
        }
      })
      .catch((error) => res.status(500).json({ error: " Un problème s'est produit  " }));
  },

  deleteComment: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    const isAdmin = jwtUtils.getIsAdmin(headerAuth);
    models.Comment.findOne({
      where: { id: req.params.id },
    })
      .then((comment) => {
        if (comment.userId == userId || isAdmin == true) {
          models.Comment.destroy({
            where: { id: comment.id },
          });
          return res.status(200).json({ message: "Commentaire supprimé !" });
        } else {
          return res.status(400).json({ message: "Vous ne pouvez pas supprimer ce commentaire" });
        }
      })
      .catch((error) => res.status(500).json({ error }));
  },
};

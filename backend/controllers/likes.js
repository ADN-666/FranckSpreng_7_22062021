/* Fichier contenant la logique permettant l'attribution d'un like ou dislike
  à une sauce sélectionné ainsi que l'ajout du user id dans le tableau usersliked
  ou usersdisliked correspondant à son choix, selon des conditions définies, puis
  mise é jour de la sauce*/

const models = require("../models");
const jwtUtils = require("../utils/jwt.utils");

module.exports = {
  createLikes: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    let postId = req.params.postId;
    let newIsLike = req.body.isLike;
    let newIsDislike = req.body.isDislike;
    let like = {
      userId: userId,
      postId: postId,
      isLike: newIsLike,
      isDislike: newIsDislike,
    };

    models.Like.findOne({
      where: { postId: postId, userId: userId },
    })
      .then((likeFound) => {
        if (!likeFound) {
          models.Like.create(like)
            .then(() => res.status(201).json({ message: "Le like a bien été créé" }))
            .catch((error) => res.status(400).json({ error: "erreur à la création du like" }));
        } else {
          if (!(newIsLike == true && newIsDislike == true)) {
            models.Like.update(
              {
                isLike: newIsLike,
                isDislike: newIsDislike,
              },
              { where: { postId: postId, userId: userId } }
            )
              .then(() => res.status(200).json({ message: "MAJ effectuée" }))
              .catch((error) =>
                res.status(400).json({
                  error: "erreur sur le traitement de la recherche du post",
                })
              );
          } else {
            return res.status(400).json({ erreur: "Vous ne pouvez pas liké et disliké" });
          }
        }
      })
      .catch((error) => res.status(400).json({ error: "erreur dés le début du traitement" }));
  },

  getLikes: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    models.Like.findAll({
      where: { userId: userId },
      attributes: ["postId", "userId", "isLike", "isDislike"],
    })
      .then((likeFound) => {
        res.status(200).json(likeFound);
      })
      .catch(() => res.status(400).json({ error: "Vous n'avez pas encore liké ce post" }));
  },
};

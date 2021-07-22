/* fonction permettant l'authentification de l'utilisateur au login et permettant la création
d'un jeton qui sera utilisé sur les routes sauces et likes */

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("bearer ", "");
    const decodedtoken = jwt.verify(token, "doudou21steph29");
    const userId = decodedtoken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: "Requête non identifiée !",
    });
  }
};

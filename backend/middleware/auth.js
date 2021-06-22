/* fonction permettant l'authentification de l'utilisateur au login et permettant la création
d'un jeton qui sera utilisé sur les routes sauces et likes */

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedtoken = jwt.verify(token, "doudou21steph29");
    const userId = decodedtoken.id;
    if (req.body.id && req.body.id !== userId) {
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

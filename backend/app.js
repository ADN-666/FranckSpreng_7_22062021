/* fichier principal contenant l'ensemble des accés aux différentes routes et fonctions du serveur ainsi
que les déclarations des différents modules utilisés */

require("dotenv").config();
const express = require("express");

const app = express();
const path = require("path");
const headers = require("./middleware/headers");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const likesRoutes = require("./routes/likes");
const commentsRoutes = require("./routes/comments");

// module de sécurité pour les en-têtes HTTP
const helmet = require("helmet");
// module de sécurité pour les attaques par déni de service
const Ddos = require("ddos");
const ddos = new Ddos({ burst: 10, limit: 15 });
// appel des différentes fonctions

app.use(helmet());
app.use(ddos.express);

app.use(headers);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/posts", postsRoutes, commentsRoutes, likesRoutes);
app.use("/api/users", usersRoutes);

module.exports = app;

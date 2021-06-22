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

// appel des différentes fonctions

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(headers);

app.use("/api/images", express.static(path.join(__dirname, "images")));
app.use("/api/posts", postsRoutes, commentsRoutes, likesRoutes);
app.use("/api/users", usersRoutes);

module.exports = app;

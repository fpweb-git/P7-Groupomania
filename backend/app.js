const express = require("express");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment")
const likesRoutes = require("./routes/like")
const path = require("path");
const db = require("./models");


const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

db.sequelize
	.sync()
	.then((db) => {
		console.log(`sync to MySql listening on port ${db.config.port}`);
	})
	.catch((err) => {
		console.log(err);
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);
app.use("/api", likesRoutes);

module.exports = app;

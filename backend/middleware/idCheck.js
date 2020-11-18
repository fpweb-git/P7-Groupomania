const jwt = require("jsonwebtoken");
const db = require("../models");

exports.users = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decodedToken = jwt.verify(token, "Jtsr843aIc78adGa_korT2aN_171a00");
	const userId = decodedToken.userId;
	db.user.findByPk(userId)
	.then((user)=>{
		if (user.isAdmin !== true){
			db.user
			.findByPk(req.params.id)
			.then((user) => {
				if (user.userId !== userId) {
					res.status(401).json({
						message: "opération non autorisée",
					});
				} else {
					next();
				}
			});
		} else{
			next()
		}
	})
};


exports.posts = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decodedToken = jwt.verify(token, "Jtsr843aIc78adGa_korT2aN_171a00");
	const userId = decodedToken.userId;
	db.user.findByPk(userId)
	.then((user)=>{
		if (user.isAdmin !== true){
			db.post
			.findByPk(req.params.id)
			.then((post) => {
				if (post.userId !== userId) {
					res.status(401).json({
						message: "opération non autorisée",
					});
				} else {
					next();
				}
			});
		}else{
			next()
		}
	})
};

exports.comments = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decodedToken = jwt.verify(token, "Jtsr843aIc78adGa_korT2aN_171a00");
	const userId = decodedToken.userId;
	db.user.findByPk(userId)
	.then((user)=>{
		if (user.isAdmin !== true){
			db.comment
			.findByPk(req.params.id)
			.then((comment) => {
				if (comment.userId !== userId) {
					res.status(401).json({
						message: "opération non autorisée",
					});
				} else {
					next();
				}
			});
		} else {
			next();
		}
	})
};
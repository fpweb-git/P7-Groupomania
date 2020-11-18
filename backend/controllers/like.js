const jwt = require("jsonwebtoken");
const db = require("../models");

exports.createLike = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decodedToken = jwt.verify(token, "Jtsr843aIc78adGa_korT2aN_171a00");
	const userId = decodedToken.userId;
	// const likeValue = parseInt(req.body.like)
	switch (req.body.like) {
		//case like = 0
		case 0:
			db.like.findAll({where: {userId : userId, postId : req.params.id}})
			.then((like)=>{
				if (like.length < 1){
					return res.status(401).json({ error: "Opération non authorisé" })
				}
				db.like.destroy({ where: { userId: userId, postId : req.params.id } })
				.then(() => {
					res.status(201).json({
						message: "like retiré",
					});
				})
				.catch((error) => {
					res.status(400).json({ error });
				});
			})
			.catch((error) => {
				res.status(400).json({ error });
			});
			break;
		//case like = 1
		case 1:
			db.like.findAll({where: {userId : userId, postId : req.params.id}, raw : true})
			.then((like)=>{
				if (like.length > 0){
					return res.status(401).json({ error: "Opération non authorisé" })
				}
				db.like.create(
					{
						postId : req.params.id ,
						userId : userId
					}
					)
					.then(() => {
						res.status(201).json({
							message: "like ajouté",
						});
					})
					.catch((error) => {
						res.status(400).json({ error });
					});
			})
			.catch((error) => {
				res.status(400).json({ error });
			});
			break;
		default:
			res.status(400).json("une erreur s'est produite")
	}
};

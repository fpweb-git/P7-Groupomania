const jwt = require("jsonwebtoken");
const db = require("../models");

exports.getAllComments = (req, res, next) => {
	db.comment
		.findAll({ where: { postId: req.params.id }, include: [db.user]})
		.then((comments) => res.status(200).json(comments))
		.catch((error) => res.status(400).json({ error }));
};

exports.getOneComment = (req, res, next) => {
    db.comment
    .findByPk(req.params.id)
		.then((comment) =>
			res.status(200).json({comment})
		)
		.catch((error) => res.status(400).json({ error }));
};

exports.createComment = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decodedToken = jwt.verify(token, "Jtsr843aIc78adGa_korT2aN_171a00");
	const userId = decodedToken.userId;
	if (req.body.content === ""){
		return res.status(401).json({ error: "Veuillez remplir le champs" });
	} else {
		db.comment.create({
			postId : req.params.id,
			userId : userId,
			content: req.body.content,
		})
		.then((response) => res.status(201).json({ message: "Commentaire ajouté !", comment : response}))
        .catch((error) => res.status(400).json({ error }));
	}
};


exports.modifyComment = (req, res, next) => {
        db.comment.update(
            {
                    content: req.body.content,
            },
            { where: { commentId: req.params.id } }
        )
        .then(() => res.status(200).json({ message: "commentaire modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteComment = (req, res, next) => {
	db.comment
		.destroy({ where: { commentId: req.params.id } })
		.then(() => res.status(200).json({ message: "commentaire supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
};


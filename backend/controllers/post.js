const jwt = require("jsonwebtoken");
const db = require("../models");
const fs = require("fs");

exports.getAllPosts = (req, res, next) => {
	db.post
		.findAll({ include: [db.user, db.comment, db.like]})
		.then((posts) => res.status(200).json(posts))
		.catch((error) => res.status(400).json({ error }));
};

exports.getAllPostsOfOneUser = (req, res, next) => {
	db.post
		.findAll({ where: { userId: req.params.id },include: [db.user, db.comment, db.like]})
		.then((posts) => res.status(200).json(posts))
		.catch((error) => res.status(400).json({ error }));
};

exports.getOnePost = (req, res, next) => {
    db.post
    .findByPk(req.params.id, { include: [db.user, db.comment, db.like]})
		.then((post) =>
			res.status(200).json({post})
		)
		.catch((error) => res.status(400).json({ error }));
};

exports.createPost = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decodedToken = jwt.verify(token, "Jtsr843aIc78adGa_korT2aN_171a00");
    const userId = decodedToken.userId;
    if (req.file){
        const postPic = `${req.protocol}://${req.get("host")}/images/posts/${req.file.filename}`;
		db.post
			.create({
                userId : userId,
				content: req.body.content,
                picture : postPic,
			})
			.then((response) => res.status(201).json({ message: "Post créé !", post: response }))
            .catch((error) => res.status(400).json({ error }));
    }else{
        db.post
		.create({
            userId : userId,
			content: req.body.content,
            picture : null,
		})
		.then((response) => res.status(201).json({ message: "Post créé !", post: response }))
        .catch((error) => res.status(400).json({ error }));
    }
};


exports.modifyPost = (req, res, next) => {
        db.post.update(
            {
                    content: req.body.content,
            },
            { where: { postId: req.params.id } }
        )
        .then(() => res.status(200).json({ message: "post modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
    db.post
    .findByPk(req.params.id)
    .then((post) => {
        if(post.picture !== null){
            const filename = post.picture.split("/images/posts/")[1];
        fs.unlink(`images/posts/${filename}`, () => {
	db.post
		.destroy({ where: { postId: req.params.id } })
		.then(() => res.status(200).json({ message: "post supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
        });
        } else {
            db.post
		.destroy({ where: { postId: req.params.id } })
		.then(() => res.status(200).json({ message: "post supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
        }
    })
    .catch((error) => res.status(500).json({ error }));
};



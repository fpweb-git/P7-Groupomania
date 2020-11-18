const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const fs = require("fs");

exports.getAllUsers = (req, res, next) => {
	db.user
		.findAll({ include: [db.post, db.comment]})
		.then((users) => res.status(200).json(users))
		.catch((error) => res.status(400).json({ error }));
};

exports.getOneUser = (req, res, next) => {
	db.user
		.findOne({ where: { userId: req.params.id }, include: [db.post, db.comment]})
		.then((user) =>
			res.status(200).json({
				userId: user.userId,
				username: user.username,
				email : user.email,
				createdAt: user.createdAt,
				profilePic: user.profilePic,
				posts: user.posts,
				comments: user.comments,
			})
		)
		.catch((error) => res.status(400).json({ error }));
};

exports.signup = (req, res, next) => {
	const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	const PASSWORD_REGEX = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/
	if (req.body.email == "" || req.body.password == "" || req.body.username == "") {
		return res.status(401).json({ error: "Veuillez remplir les champs" });
	}
	if(!EMAIL_REGEX.test(req.body.email)){
		return res.status(401).json({ error: "Email non valide" })
	} 
	if (!PASSWORD_REGEX.test(req.body.password)){
		return res.status(401).json({ error: "Le mot de passe doit être au minimum de 6 caractères et contenir 1 chiffre" })
	}
	if (req.body.username.length > 20){
		return res.status(401).json({ error: "Le nom d'utilisateur ne doit pas dépasser 20 caractères" })
	}
	bcrypt
	.hash(req.body.password, 10)
	.then((hash) => {
		db.user
			.create({
				username: req.body.username,
				email: req.body.email,
				password: hash,
				isAdmin: false,
			})
			.then(() => res.status(201).json({ message: "Compte créé !" }))
			.catch(() => res.status(400).json({ error: "Email ou nom d'utilisateur existant !" }));
	})
	.catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
	db.user
		.findOne({ where: { email: req.body.email } })
		.then((user) => {
			if (req.body.email == "" || req.body.password == "") {
				return res.status(401).json({ error: "Veuillez remplir les champs" });
			}
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user.userId,
						isAdmin : user.isAdmin,
						token: jwt.sign(
							{ userId: user.userId, isAdmin: user.isAdmin},
							"Jtsr843aIc78adGa_korT2aN_171a00",
							{ expiresIn: "24h" }
						),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.modifyUserUsername = (req, res, next) => {
	if(req.body.username.length > 3){
		db.user
			.update(
				{
					username: req.body.username,
				},
				{ where: { userId: req.params.id } }
			)
			.then(() => res.status(200).json({ message: "Utilisateur modifié !" }))
			.catch((error) => res.status(400).json({ error }));
	} else {
		return res.status(401).json({ error: "Votre nom doit faire minimum 3 caractères" });
	}
};

exports.modifyUserEmail = (req, res, next) => {
	const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	if (req.body.email == ""){
		return res.status(401).json({ error: "Veuillez remplir les champs" });
	}
	if(!EMAIL_REGEX.test(req.body.email)){
		return res.status(401).json({ error: "Email non valide" })
	}
		db.user
			.update(
				{
					email: req.body.email,
				},
				{ where: { userId: req.params.id } }
			)
			.then(() => res.status(200).json({ message: "Email modifié !" }))
			.catch((error) => res.status(400).json({ error }));
};

exports.modifyUserPassword = (req, res, next) => {
	const PASSWORD_REGEX = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/
	if (req.body.password == "") {
		return res.status(401).json({ error: "Veuillez remplir les champs" });
	}
	if (!PASSWORD_REGEX.test(req.body.password)){
		return res.status(401).json({ error: "Le mot de passe doit être au minimum de 6 caractères et contenir 1 chiffre" })
	}
	bcrypt.hash(req.body.password, 10).then((hash) => {
		db.user
			.update(
				{
					password: hash,
				},
				{ where: { userId: req.params.id } }
			)
			.then(() => res.status(200).json({ message: "Mot de passe modifié !" }))
			.catch((error) => res.status(400).json({ error }));
	})
};

exports.deleteUser = (req, res, next) => {
	db.user
    .findByPk(req.params.id)
    .then((user) => {
        if(user.profilePic !== null){
            const filename = user.profilePic.split("/images/users/")[1];
        fs.unlink(`images/users/${filename}`, () => {
			db.user
			.destroy({ where: { userId: req.params.id } })
			.then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
			.catch((error) => res.status(400).json({ error }));
        });
        } else {
			db.user
			.destroy({ where: { userId: req.params.id } })
			.then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
			.catch((error) => res.status(400).json({ error }));
        }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.ModifyUserPic = (req, res, next) => {
	db.user
		.findByPk(req.params.id)
		.then((user) => {
			const userPic = `${req.protocol}://${req.get("host")}/images/users/${
				req.file.filename
			}`;
			if(user.profilePic == null){
				db.user
				.update(
					{
						profilePic: userPic,
					},
					{ where: { userId: req.params.id } }
				)
				.then(() =>
					res.status(200).json({
						message: "Image ajouté !",
					})
				)
				.catch((error) => res.status(400).json({ error }));
			} else {
				const filename = user.profilePic.split("/images/users/")[1];
				console.log(filename)
				fs.unlink(`images/users/${filename}`, () => {
					db.user
						.update(
							{
								profilePic: userPic,
							},
							{ where: { userId: req.params.id } }
						)
						.then(() =>
							res.status(200).json({
								message: "Image modifié !",
							})
						)
						.catch((error) => res.status(400).json({ error }));
				});
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

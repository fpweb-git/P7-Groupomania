module.exports = (req, res, next) => {
	if (Object.keys(req.body).length > 0) {
		return res
			.status(401)
			.json({ error: "Les champs ne doivent pas contenir de texte" });
	} else {
		next();
	}
};

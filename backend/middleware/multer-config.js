const multer = require("multer");

const MIME_TYPES = {
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/png": "png",
};

const userStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "images/users");
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(" ").join("_");
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + "." + extension);
	},
});

const postStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "images/posts");
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(" ").join("_");
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + "." + extension);
	},
});

exports.users = multer({ storage: userStorage }).single("image");
exports.posts = multer({ storage: postStorage }).single("image");

module.exports = (sequelize, Datatypes) => {
	const Post = sequelize.define("post", {
		postId: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			unique: true,
			type: Datatypes.INTEGER,
		},
		content: {
			allowNull: false,
			type: Datatypes.TEXT,
		},
		picture: {
			allowNull: true,
			type: Datatypes.STRING,
		},
	});
	Post.associate = (models) => {
		Post.belongsTo(models.user, {
			foreignKey: {
				name: "userId",
				allowNull: false,
			},
			onDelete: "cascade",
		});
		Post.hasMany(models.comment, {
			foreignKey: { name: "postId", allowNull: false },
			onDelete: "cascade",
		});
		Post.hasMany(models.like, {
			foreignKey: { name: "postId", allowNull: false },
			onDelete: "cascade",
		});
	};
	return Post;
};

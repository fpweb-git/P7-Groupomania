module.exports = (sequelize, Datatypes) => {
	const Comment = sequelize.define("comment", {
		commentId: {
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
	});
	Comment.associate = (models) => {
		Comment.belongsTo(models.user, {
			foreignKey: { name: "userId", allowNull: false },
			onDelete: "cascade",
		});
		Comment.belongsTo(models.post, {
			foreignKey: { name: "postId", allowNull: false },
			onDelete: "cascade",
		});
	};
	return Comment;
};

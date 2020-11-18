module.exports = (sequelize, Datatypes) => {
	const User = sequelize.define("user", {
		userId: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Datatypes.INTEGER,
		},
		email: {
			allowNull: false,
			unique: true,
			type: Datatypes.STRING,
		},
		username: {
			allowNull: false,
			unique: true,
			type: Datatypes.STRING,
		},
		password: {
			allowNull: false,
			type: Datatypes.STRING,
		},
		isAdmin: {
			allowNull: false,
			type: Datatypes.BOOLEAN,
		},
		profilePic: {
			allowNull: true,
			type: Datatypes.STRING,
		},
	});

	User.associate = (models) => {
		User.hasMany(models.post, {
			foreignKey: { name: "userId", allowNull: false },
			onDelete: "cascade",
		});
		User.hasMany(models.comment, {
			foreignKey: { name: "userId", allowNull: false },
			onDelete: "cascade",
		});
		User.hasMany(models.like, {
			foreignKey: { name: "userId", allowNull: false },
			onDelete: "casade",
		});
	};
	return User;
};

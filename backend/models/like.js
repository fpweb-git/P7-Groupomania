module.exports = (sequelize, Datatypes) => {

const Like = sequelize.define('like', {
    likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: Datatypes.INTEGER,
    },
});

Like.associate = function(models) {
    Like.belongsTo(models.user, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "cascade",
    });
    Like.belongsTo(models.post, {
        foreignKey: { name: "postId", allowNull: false },
        onDelete: "cascade",
    });
};

return Like;
};
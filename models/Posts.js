import Media from "./Media.js";

import {DataTypes, Model} from "sequelize";
import sequelize from "../clients/sequelize.mysql.js";

class Posts extends Model {}

Posts.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: 'posts',
        tableName: 'posts',
    }
)

Posts.hasMany(Media, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: 'postId',
    as: 'images',
});

Media.belongsTo(Posts);

export default Posts;
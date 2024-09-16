import {DataTypes, Model} from 'sequelize';
import sequelize from '../clients/sequelize.mysql.js';
import Users from "./Users.js";

class Follow extends Model {}

Follow.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        followerId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },

        followingId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'follow',
        tableName: 'follow',
    }
)

Users.hasMany(Follow, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'followerId',
    as: 'following',
});

Follow.belongsTo(Users, {
    foreignKey: 'followerId',
    as: 'follower',
});

Users.hasMany(Follow, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'followingId',
    as: 'followers',
})

Follow.belongsTo(Users, {
    foreignKey: 'followingId',
    as: 'following',
});

export default Follow;
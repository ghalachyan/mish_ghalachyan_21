import md5 from "md5";
import Posts from "./Posts.js";
import {DataTypes, Model} from 'sequelize';
import sequelize from '../clients/sequelize.mysql.js';
import Media from "./Media.js";

const { USER_PASSWORD_SECRET } = process.env;

class Users extends Model {
    static  hash (password){
        return md5(md5(password) + USER_PASSWORD_SECRET);
    }
}

Users.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return '😁';
            },
            set (value) {
                this.setDataValue('password', Users.hash(value));
            },
        },

        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
            allowNull: false,
        },

    },
    {
        sequelize,
        timestamps: true,
        modelName: 'users',
        tableName: 'users',
        indexes: [
            {
                unique: true,
                fields: ['email', 'userName'],
            }
        ]
    }
);

Users.hasMany(Posts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: 'userId',
});
Posts.belongsTo(Users );

Users.hasMany(Media, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: 'userId',
    as: 'avatar',
});
Media.belongsTo(Users);

export default Users;

import {DataTypes, Model} from "sequelize";
import sequelize from "../clients/sequelize.mysql.js";

class Media extends Model {

}

Media.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        images: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: 'media',
        tableName: 'media',
    }
)

export default Media;
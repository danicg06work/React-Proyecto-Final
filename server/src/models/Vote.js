import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Vote = sequelize.define('Vote', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['userId', 'gameId']
        }
    ]
});

export default Vote;

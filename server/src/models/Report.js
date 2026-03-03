import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['userId', 'gameId']
        }
    ]
});

export default Report;

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Game = sequelize.define('Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_lanzamiento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    compania: {
        type: DataTypes.STRING,
        allowNull: true
    },
    plataformas: {
        type: DataTypes.JSON,
        allowNull: true
    },
    categorias: {
        type: DataTypes.JSON,
        allowNull: true
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    video: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export default Game;

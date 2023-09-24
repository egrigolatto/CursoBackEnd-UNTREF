const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');


const contenido_actores = sequelize.define('contenido_actores', {
    contenido_actores_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    contenido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    actores_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'contenido_actores',
    timestamps: false,
});

module.exports = contenido_actores;
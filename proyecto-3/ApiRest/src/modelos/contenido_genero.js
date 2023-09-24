const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');


const contenido_genero = sequelize.define('contenido_genero', {
    contenido_genero_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    contenido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    genero_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'contenido_genero',
    timestamps: false,
});

module.exports = contenido_genero;
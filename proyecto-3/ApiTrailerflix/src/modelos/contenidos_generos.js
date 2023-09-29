const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');


const contenidos_generos = sequelize.define('contenidos_generos', {
    contenido_genero_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
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
    tableName: 'contenidos_generos',
    timestamps: false,
});

module.exports = contenidos_generos;
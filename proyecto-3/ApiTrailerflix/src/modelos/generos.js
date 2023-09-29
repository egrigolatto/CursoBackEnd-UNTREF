const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');


const generos = sequelize.define('generos', {
    genero_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    genero_nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
}, {
    tableName: 'generos',
    timestamps: false,
});

module.exports = generos;
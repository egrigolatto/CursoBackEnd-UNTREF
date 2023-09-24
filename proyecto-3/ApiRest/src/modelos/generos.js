const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');


const generos = sequelize.define('generos', {
    generos_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    generos_nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        default: 'N/A'
    },
}, {
    tableName: 'generos',
    timestamps: false,
});

module.exports = generos;
const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');


const actores = sequelize.define('actores', {
    actores_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    actores_nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        default: 'N/A'
    },
}, {
    tableName: 'actores',
    timestamps: false,
});

module.exports = actores;

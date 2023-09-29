const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');

const actores = sequelize.define('actores', {
    actor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    actor_nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
}, {
    tableName: 'actores',
    timestamps: false,
});

module.exports = actores;

const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');


const contenidos_actores = sequelize.define('contenidos_actores', {
    contenido_actor_id: {
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
    actor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'contenidos_actores',
    timestamps: false,
});

module.exports = contenidos_actores;
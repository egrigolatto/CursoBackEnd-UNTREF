const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');


const categorias = sequelize.define('categorias', {
    categoria_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    categoria_nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
}, {
    tableName: 'categorias',
    timestamps: false,
});

module.exports = categorias;


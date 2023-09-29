const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');

const contenidos = sequelize.define('contenidos', {
    contenido_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    titulo: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    resumen: {
      type: DataTypes.STRING(1000),
      default: 'N/A'
    },
    temporadas: {
      type: DataTypes.INTEGER,
      default: '0'
    },  
    poster: {
      type: DataTypes.STRING(250),
      default: 'N/A'
    },
    trailer: {
        type: DataTypes.STRING(250),
        default: 'N/A'
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
  tableName: 'contenidos',
  timestamps: false,
});


module.exports = contenidos;

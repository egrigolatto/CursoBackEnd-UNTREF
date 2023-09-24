const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');


const contenido = sequelize.define('contenido', {
    contenido_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 'N/A'
    },
    resumen: {
      type: DataTypes.STRING,
      default: 'N/A'
    },
    temporadas: {
      type: DataTypes.INTEGER,
      default: 'N/A'
    },  
    poster: {
      type: DataTypes.STRING,
      default: 'N/A'
    },
    trailer: {
        type: DataTypes.STRING,
        default: 'N/A'
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
  tableName: 'contenido',
  timestamps: false,
});

module.exports = contenido;

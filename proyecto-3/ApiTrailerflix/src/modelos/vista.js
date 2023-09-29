const sequelize = require('../connection/connection');
const { DataTypes } = require('sequelize');

const Vista = sequelize.define('Vista', {
  poster: {
    type: DataTypes.STRING(250),
    default: 'N/A'
  },
  titulo: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  genero: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  resumen: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  temporadas: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  reparto: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  trailer: {
    type: DataTypes.STRING(250),
    allowNull: false
  }
}, {
  tableName: 'vista_tipo_json', 
  timestamps: false, 
  freezeTableName: true, 
});

module.exports = Vista;
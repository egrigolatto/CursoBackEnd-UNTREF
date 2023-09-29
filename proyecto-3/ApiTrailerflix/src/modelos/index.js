const Contenidos = require('./contenidos');
const Categorias = require('./categorias');
const Actores = require('./actores');
const Generos = require('./generos');
const Contenidos_generos = require('./contenidos_generos');
const Contenidos_actores = require('./contenidos_actores');
const Vista = require('./vista');

Categorias.hasMany(Contenidos, {foreignKey: 'categoria_id' });
Contenidos.belongsTo(Categorias, { foreignKey: 'categoria_id' });

Contenidos.belongsToMany(Actores, {
  through: { model: Contenidos_actores, unique: false },
  foreignKey: 'contenido_id', // Clave de unión personalizada
  otherKey: 'actor_id', // Clave de unión personalizada
  as: 'actor', // Alias personalizado
});
Actores.belongsToMany(Contenidos, {
  through: { model: Contenidos_actores, unique: false },
  foreignKey: 'actor_id', 
  otherKey: 'contenido_id', 
  as: 'contenidos_act', 
});

Contenidos.belongsToMany(Generos, {
  through: { model: Contenidos_generos, unique: false },
  foreignKey: 'contenido_id', 
  otherKey: 'genero_id', 
  as: 'generos', 
});
Generos.belongsToMany(Contenidos, {
  through: { model: Contenidos_generos, unique: false },
  foreignKey: 'genero_id', 
  otherKey: 'contenido_id', 
  as: 'contenidos_gen', 
});

module.exports = {
  Contenidos,
  Categorias,
  Actores,
  Generos,
  Vista,
  Contenidos_generos,
  Contenidos_actores
};

const express = require('express');

const router = express.Router();

const { Contenidos, Categorias, Actores, Generos, Contenidos_generos, Contenidos_actores } = require('../modelos');
const { mapear } = require('../funciones/mapear');

const messageErrorServer = { message: 'Se ha generado un error en el servidor' };

const { Op } = require("sequelize");

//http://localhost:8080/catalogo --> devuelve el catalogo completo (vista)
router.get("/", async (req, res, next) => {

  try {
    const catalogo = await Contenidos.findAll({
      include: [
        { model: Categorias, as: 'categoria' },
        { model: Generos, as: 'generos', through: { attributes: [] } },
        { model: Actores, as: 'actor', through: { attributes: [] } },
      ]
    });
    const mapeo = mapear(catalogo);
    res.status(200).send(mapeo);
  } catch (error) {
    res.status(500);
    next(messageErrorServer);
  }
});

// http://localhost:8080/catalogo/:id --> devuelve el contendio del catalogo por su id
router.get("/:id", async (req, res, next) => {

  const { id } = req.params;

  if (!id || isNaN(id)) {
    res.status(400);
    next({ message: 'id no válido' });
    return;
  }

  try {
    const catalogo = await Contenidos.findByPk(id, {
      include: [
        { model: Categorias, as: 'categoria' },
        { model: Generos, as: 'generos', through: { attributes: [] } },
        { model: Actores, as: 'actor', through: { attributes: [] } },
      ]
    });

    if (!catalogo) {
      res.status(404);
      next({ message: 'No se encontró contenido con el ID proporcionado' });
      return;
    }

    const mapeo = mapear([catalogo]);
    res.status(200).send(mapeo);
  } catch (error) {
    res.status(500);
    next(messageErrorServer);
  }
});

// http://localhost:8080/catalogo/titulo/:titulo --> busca por titulo o nombre del contenido
router.get("/titulo/:titulo", async (req, res, next) => {

  const { titulo } = req.params;

  if (!titulo || titulo.length < 3 || !/^[a-zA-Z0-9\s-]+$/.test(titulo)) {
    res.status(400);
    next({ message: 'Titulo no valido, ingrese al menos 3 letras para una busqueda' });
    return;
  }

  try {
    const catalogo = await Contenidos.findAll({
      include: [
        { model: Categorias, as: 'categoria' },
        { model: Generos, as: 'generos', through: { attributes: [] } },
        { model: Actores, as: 'actor', through: { attributes: [] } },
      ],
      where: {
        titulo: {
          [Op.like]: `%${titulo}%`
        }
      }
    });

    if (catalogo.length === 0) {
      res.status(404);
      next({ message: 'No se encontraron coincidencias' });
      return;
    }

    const mapeo = mapear(catalogo);
    res.status(200).send(mapeo);
  } catch (error) {
    res.status(500);
    next(messageErrorServer);
  }
});

// http://localhost:8080/catalogo/genero/:genero --> busca por genero
router.get("/genero/:genero", async (req, res, next) => {

  const { genero } = req.params;

  if (!genero || genero.length < 3 || !/^[a-zA-Z0-9\s-]+$/.test(genero)) {
    res.status(400);
    next({ message: 'Género no válido, ingrese al menos 3 letras para una búsqueda' });
    return;
  }

  try {
    const catalogo = await Contenidos.findAll({
      include: [
        { model: Categorias, as: 'categoria' },
        { model: Generos, as: 'generos', through: { attributes: [] },
          where: {
            genero_nombre: {
              [Op.like]: `%${genero}%`
            }
          }},
        { model: Actores, as: 'actor', through: { attributes: [] } },
      ]
    });

    if (catalogo.length === 0) {
      res.status(404);
      next({ message: 'No se encontraron coincidencias' });
      return;
    }
    const mapeo = mapear(catalogo);
    res.status(200).send(mapeo);
  } catch (error) {
    res.status(500);
    next(messageErrorServer);
  }
});

// http://localhost:8080/catalogo/actor/:actor --> busca por nombre de actor
router.get("/actor/:actor", async (req, res, next) => {

  const { actor } = req.params;

  if (!actor || actor.length < 3 || !/^[a-zA-Z0-9\s-]+$/.test(actor)) {
    res.status(400);
    next({ message: 'Nombre de actor no válido, ingrese al menos 3 letras para una búsqueda' });
  }

  try {
    const catalogo = await Contenidos.findAll({
      include: [
        { model: Categorias, as: 'categoria' },
        { model: Generos, as: 'generos', through: { attributes: [] } },
        { model: Actores, as: 'actor', through: { attributes: [] },
          where: { actor_nombre: { [Op.like]: `%${actor}%` } }
        }]
    });

    if (catalogo.length === 0) {
      res.status(404);
      next({ message: 'No se encontraron coincidencias' });
    }

    const mapeo = mapear(catalogo);
    res.status(200).send(mapeo);
  } catch (error) {
    res.status(500);
    next(messageErrorServer);
  }
});

// http://localhost:8080/categorias/:categoria  -->devuelve filtrado por categoria, las opciones son serie o pelicula
router.get("/categorias/:categoria", async (req, res, next) => {

  const { categoria } = req.params;

  if (!["serie", "pelicula"].includes(categoria)) {
    res.status(400);
    next({ message: 'Categoría no válida' });
  };

  try {
    const catalogo = await Contenidos.findAll({
      include: [
        { model: Categorias, as: 'categoria', where: { categoria_nombre: categoria } },
        { model: Generos, as: 'generos', through: { attributes: [] } },
        { model: Actores, as: 'actor', through: { attributes: [] } },
      ]
    });

    if (catalogo.length === 0) {
      res.status(404);
      next({ message: 'No se encontraron coincidencias' });
    }

    const mapeo = mapear(catalogo);
    res.status(200).send(mapeo);
  } catch (error) {
    res.status(500);
    next(messageErrorServer);
  }
});

// http://localhost:8080/catalago --> para crear un nuevo contenido
router.post('/', async (req, res, next) => {

  const { poster, titulo, categoria, genero, resumen, temporadas, reparto, trailer } = req.body;

  if (!poster || !titulo || !categoria || !genero || !resumen || !temporadas || !reparto || !trailer) {
    res.status(400);
    next({ error: 'Faltan datos requeridos' });
    return;
  }

  try {
    // Obtener el id de la categoria
    const categoriaObj = await Categorias.findOne({ where: { categoria_nombre: categoria } });
    if (!categoriaObj) {
      res.status(400);
      next({ error: 'Categoria no encontrada' });
      return;
    }

    // Separar los géneros por comas y obtener sus ids o agregar nuevos
    const generosArray = genero.split(',').map((generoStr) => generoStr.trim());
    const generosIds = [];
    for (const generoStr of generosArray) {
      let generoObj = await Generos.findOne({ where: { genero_nombre: generoStr } });
      if (!generoObj) {
        // Si el género no existe, créalo y obtenga su ID
        generoObj = await Generos.create({ genero_nombre: generoStr });
      }
      generosIds.push(generoObj.genero_id);
    }

    // Separar el reparto por comas y obtener los ids de los actores o agregar nuevos
    const actoresArray = reparto.split(',').map((actorStr) => actorStr.trim());
    const actoresIds = [];
    for (const actorStr of actoresArray) {
      let actorObj = await Actores.findOne({ where: { actor_nombre: actorStr } });
      if (!actorObj) {
        // Si el actor no existe crealo y obtener su id
        actorObj = await Actores.create({ actor_nombre: actorStr });
      }
      actoresIds.push(actorObj.actor_id);
    }

    // Crear el nuevo registro de contenido
    const nuevoContenido = await Contenidos.create({
      poster,
      titulo,
      categoria_id: categoriaObj.categoria_id,
      resumen,
      temporadas,
      trailer,
    });

    // Asociar los géneros y actores al contenido
    await Promise.all(generosIds.map(async (generoId) => {
      await Contenidos_generos.create({
        contenido_id: nuevoContenido.contenido_id,
        genero_id: generoId,
      });
    }));

    await Promise.all(actoresIds.map(async (actorId) => {
      await Contenidos_actores.create({
        contenido_id: nuevoContenido.contenido_id,
        actor_id: actorId,
      });
    }));

    res.status(201).send({message: 'contenido creado ', nuevoContenido });
  } catch (error) {
    console.error(error);
    res.status(500);
    next(messageErrorServer);
  }
});

// http://localhost:8080/catalago/:id --> actualiza un contendio por su id
router.put('/:id', async (req, res, next) => {

  const contenidoId = req.params.id;
  const { poster, titulo, categoria, genero, resumen, temporadas, reparto, trailer } = req.body;

  try {
    // Verificar si el contenido existe
    const contenidoExistente = await Contenidos.findByPk(contenidoId);
    if (!contenidoExistente) {
      res.status(404);
      next({ error: 'Contenido no encontrado' });
      return;
    }

    // Actualizar los campos del contenido
    contenidoExistente.poster = poster || contenidoExistente.poster;
    contenidoExistente.titulo = titulo || contenidoExistente.titulo;
    contenidoExistente.resumen = resumen || contenidoExistente.resumen;
    contenidoExistente.temporadas = temporadas || contenidoExistente.temporadas;
    contenidoExistente.trailer = trailer || contenidoExistente.trailer;

    // Obtener el id de la categoria
    if (categoria) {
      const categoriaObj = await Categorias.findOne({ where: { categoria_nombre: categoria } });
      if (!categoriaObj) {
        res.status(400);
        next({ error: 'Categoria no encontrada' });
        return;
      }
      contenidoExistente.categoria_id = categoriaObj.categoria_id;
    }

    // Separar los generos por comas y obtener sus ids o agregar nuevos
    if (genero) {
      const generosArray = genero.split(',').map((generoStr) => generoStr.trim());
      const generosIds = [];
      for (const generoStr of generosArray) {
        let generoObj = await Generos.findOne({ where: { genero_nombre: generoStr } });
        if (!generoObj) {
          // Si el gnero no existe, crealo y obtener su id
          generoObj = await Generos.create({ genero_nombre: generoStr });
        }
        generosIds.push(generoObj.genero_id);
      }
      // Eliminar las relaciones anteriores con generos
      await Contenidos_generos.destroy({ where: { contenido_id: contenidoId } });
      // Asociar los nuevos generos al contenido
      await Promise.all(generosIds.map(async (generoId) => {
        await Contenidos_generos.create({
          contenido_id: contenidoId,
          genero_id: generoId,
        });
      }));
    }

    // Separar el reparto por comas y obtener los ids de los actores o agregar nuevos
    if (reparto) {
      const actoresArray = reparto.split(',').map((actorStr) => actorStr.trim());
      const actoresIds = [];
      for (const actorStr of actoresArray) {
        let actorObj = await Actores.findOne({ where: { actor_nombre: actorStr } });
        if (!actorObj) {
          // Si el actor no existe, crealo y obtenga su id
          actorObj = await Actores.create({ actor_nombre: actorStr });
        }
        actoresIds.push(actorObj.actor_id);
      }
      // Eliminar las relaciones anteriores con actores
      await Contenidos_actores.destroy({ where: { contenido_id: contenidoId } });
      // Asociar los nuevos actores al contenido
      await Promise.all(actoresIds.map(async (actorId) => {
        await Contenidos_actores.create({
          contenido_id: contenidoId,
          actor_id: actorId,
        });
      }));
    }

    // Guardar los cambios
    await contenidoExistente.save();

    res.status(200).send({message: 'contenido actualizado', contenidoExistente });
  } catch (error) {
    res.status(500);
    next(messageErrorServer);
  }
});

// http://localhost:8080/catalago/:id --> elimina un contendio por su id
router.delete('/:id', async (req, res, next) => {

  const contenidoId = req.params.id;

  try {
    // Verificar si el contenido existe
    const contenido = await Contenidos.findByPk(contenidoId);
    if (!contenido) {
      res.status(404);
      next({ error: 'Contenido no encontrado' });
      return;
    };

    // Eliminar los registros relacionados en las tablas de union (si los tienes)
    await Contenidos_generos.destroy({ where: { contenido_id: contenidoId } });
    await Contenidos_actores.destroy({ where: { contenido_id: contenidoId } });

    // Eliminar el contenido
    await Contenidos.destroy({ where: { contenido_id: contenidoId } });

    res.status(204).send({message: 'contenido eliminado'}); // 204 significa "No Content" (contenido eliminado con éxito)
  } catch (error) {
    res.status(500);
    next(messageErrorServer);
  }
});


module.exports = router;
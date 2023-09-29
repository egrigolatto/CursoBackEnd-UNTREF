
const mapear = (catalogo) => {
  
  return catalogo.map((contenido) => ({
    id: contenido.contenido_id,
    poster: `http://catalogo/${contenido.categoria ? contenido.categoria.categoria_nombre : null}/${contenido.titulo.replace(/\s+/g, '')}${contenido.poster}`.toLowerCase(),
    titulo: contenido.titulo,
    categoria: contenido.categoria ? contenido.categoria.categoria_nombre : null,
    genero: contenido.generos.map((genero) => genero.genero_nombre).join(', '),
    resumen: contenido.resumen,
    temporadas: contenido.temporadas,
    reparto: contenido.actor.map((actor) => actor.actor_nombre).join(', '),
    trailer: contenido.trailer,
  }));
};

module.exports = { mapear };

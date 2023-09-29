DROP VIEW IF EXISTS vista_tipo_json;
CREATE VIEW vista_tipo_json AS
SELECT
    c.contenido_id AS id,
    c.poster,
    c.titulo,
    cat.categoria_nombre AS categoria,
    (
        SELECT GROUP_CONCAT(DISTINCT g.genero_nombre SEPARATOR ', ')
        FROM generos g
        JOIN contenidos_generos cg ON g.genero_id = cg.genero_id
        WHERE cg.contenido_id = c.contenido_id
    ) AS genero,
    c.resumen,
    c.temporadas,
    GROUP_CONCAT(DISTINCT a.actor_nombre SEPARATOR ', ') AS reparto,
    c.trailer
FROM
    contenidos c
JOIN
    categorias cat ON c.categoria_id = cat.categoria_id
JOIN
    contenidos_actores ca ON c.contenido_id = ca.contenido_id
JOIN
    actores a ON ca.actor_id = a.actor_id
GROUP BY
    c.contenido_id, c.poster, c.titulo, cat.categoria_nombre, c.resumen, c.temporadas, c.trailer;

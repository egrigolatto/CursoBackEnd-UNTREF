CREATE VIEW vista_tipo_json AS
SELECT
    c.contenido_id AS id,
    c.poster,
    c.titulo,
    cat.categoria_nombre AS categoria,
    (
        SELECT GROUP_CONCAT(DISTINCT g.generos_nombre SEPARATOR ', ')
        FROM generos g
        JOIN contenido_genero cg ON g.generos_id = cg.genero_id
        WHERE cg.contenido_id = c.contenido_id
    ) AS genero,
    c.resumen,
    c.temporadas,
    GROUP_CONCAT(DISTINCT a.actores_nombre SEPARATOR ', ') AS reparto,
    c.trailer
FROM
    contenido c
JOIN
    categorias cat ON c.categoria_id = cat.categoria_id
JOIN
    contenido_actores ca ON c.contenido_id = ca.contenido_id
JOIN
    actores a ON ca.actores_id = a.actores_id
GROUP BY
    c.contenido_id, c.poster, c.titulo, cat.categoria_nombre, c.resumen, c.temporadas, c.trailer;

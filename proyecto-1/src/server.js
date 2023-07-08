const express = require("express");
const { findOneById, findAll, create, update, destroy } = require("./database/data.manager.js");

require('dotenv').config();

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Obtener todas las guitarras: Ruta GET http://127.0.0.1:3000/guitarras
server.get('/guitarras', (req, res) => {
    findAll()
        .then((guitarras) => res.status(200).send(guitarras))
        .catch((error) => res.status(400).send(error.message));
});

// Obtener una guitarra en específico: Ruta GET http://127.0.0.1:3000/guitarra/id
server.get('/guitarras/:id', (req, res) => {
    const { id } = req.params;

    findOneById(Number(id))
        .then((guitarras) => res.status(200).send(guitarras))
        .catch((error) => res.status(400).send(error.message));
});

// Crear una nueva guitarra: Ruta POST http://127.0.0.1:3000/guitarras
server.post('/guitarras', (req, res) => {
    const { marca, color, modelo } = req.body;

    create({ marca, color, modelo })
        .then((guitarras) => res.status(201).send(guitarras))
        .catch((error) => res.status(400).send(error.message));
});

// Actualizar una guitarra en específico: Ruta PUT http://127.0.0.1:3000/guitarras/id
server.put('/guitarras/:id', (req, res) => {
    const { id } = req.params;
    const { marca, color, modelo } = req.body;

    update({ id: Number(id), marca, color, modelo })
        .then((guitarras) => res.status(200).send(guitarras))
        .catch((error) => res.status(400).send(error.message));
});

// Eliminar una guitarra en específico: Ruta DELETE http://127.0.0.1:3000/guitarras/id
server.delete('/guitarras/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((guitarras) => res.status(200).send(guitarras))
        .catch((error) => res.status(400).send(error.message));
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<div 
    style="display:flex;
    flex-direction:column;
    align-items:center;
    border:2px solid red;
    width:50vw;
    margin: auto;
    margin-top:20vh
    ">
    <h1>Error 404</h1>
    <h3>La URL indicada no existe en el servidor</h3>
    <div>`);
});

// Método escucha de peteciones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/guitarras`);
});
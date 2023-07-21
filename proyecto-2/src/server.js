const express = require('express');
const { conectToDb, desconectar, generateCodigo } = require('../connection_db.js');

const server = express();

const messageNotFound = JSON.stringify({ message: 'El código no corresponde a un mueble registrado' });
const messageMissingData = JSON.stringify({ message: 'Faltan datos relevantes' });
const messageErrorServer = JSON.stringify({ message: 'Se ha generado un error en el servidor' });

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/api/v1/muebles', async (req, res) => {
    const { categoria, precio_gte, precio_lte } = req.query;

    let muebles = [];

    try {
        const collection = await conectToDb('muebles');
        if (categoria) muebles = await collection.find({ categoria }).sort({ nombre: 1 }).toArray();
        else if (precio_gte) muebles = await collection.find({ precio: { $gte: Number(precio_gte) } }).sort({ precio: 1 }).toArray();
        else if (precio_lte) muebles = await collection.find({ precio: { $lte: Number(precio_lte) } }).sort({ precio: -1 }).toArray();
        else muebles = await collection.find().toArray();

        res.status(200).send(JSON.stringify({ payload: muebles }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconectar();
    }
});

server.get('/api/v1/muebles/:codigo', async (req, res) => {
    const { codigo } = req.params;

    try {
        const collection = await conectToDb('muebles');
        const mueble = await collection.findOne({ codigo: { $eq: Number(codigo) } });

        if (!mueble) return res.status(400).send(messageNotFound);

        res.status(200).send(JSON.stringify({ payload: mueble }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconectar();
    }
});

server.post('/api/v1/muebles', async (req, res) => {
    const { nombre, precio, categoria } = req.body;

    if (!nombre || !precio || !categoria) {
        return res.status(400).send(messageMissingData);
    }

    try {
        const collection = await conectToDb('muebles');
        const mueble = { codigo: await generateCodigo(collection), nombre, precio, categoria };

        await collection.insertOne(mueble);
        res.status(201).send(JSON.stringify({ message: 'Registro creado', payload: mueble }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconectar();
    }
});

server.put('/api/v1/muebles/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { nombre, precio, categoria } = req.body;

    if (!nombre && !precio && !categoria) {
        return res.status(400).send(messageMissingData);
    }

    try {
        const collection = await conectToDb('muebles');
        let mueble = await collection.findOne({ codigo: { $eq: Number(codigo) } });

        if (!mueble) return res.status(400).send(messageNotFound);
        mueble = { nombre, precio, categoria };

        await collection.updateOne({ codigo: Number(codigo) }, { $set: mueble });
        res.status(200).send(JSON.stringify({ message: 'Registro actualizado', payload: { codigo, ...mueble } }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconectar();
    }
});

server.delete('/api/v1/muebles/:codigo', async (req, res) => {
    const { codigo } = req.params;

    try {
        const collection = await conectToDb('muebles');
        const mueble = await collection.findOne({ codigo: { $eq: Number(codigo) } });

        if (!mueble) {
            return res.status(400).send(messageNotFound);
        }

        await collection.deleteOne({ codigo: { $eq: Number(codigo) } });
        res.status(200).send(JSON.stringify({ message: 'Registro eliminado' }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconectar();
    }
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>`);
});

// Método oyente de solicitudes
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/v1/muebles`);
});
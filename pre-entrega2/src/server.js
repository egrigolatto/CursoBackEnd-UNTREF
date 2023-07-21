const express = require('express'); 
const { conectToDb, generateId, desconectar } = require('../mongodb.js'); 

const server = express(); 

server.use(express.json()); 
server.use(express.urlencoded({ extended: true })); 

//obtener todas las guitaras o aplicarle filtros especificos
//ruta GET http://127.0.0.1:3000/guitarras
server.get('/guitarras', async (req, res) => { 
    const { nombre, marca, modelo, color, precio_menor_que, descuento } = req.query; 
    
    //let guitarras = [];
    const filtroDeBusqueda = {};

    if (nombre) filtroDeBusqueda.nombre = nombre;
    if (marca) filtroDeBusqueda.marca = marca;
    if (modelo) filtroDeBusqueda.modelo = modelo;
    if (color) filtroDeBusqueda.color = color;
    if (precio_menor_que) filtroDeBusqueda.precio = { $lt: Number(precio_menor_que ) };
    if (descuento) filtroDeBusqueda.descuento = ({ descuento: { $exists: true } });

    try {
        const collection = await conectToDb('guitarras');
        const guitarras = (await collection.find(filtroDeBusqueda).sort({ marca: 1 }).toArray()); 

        res.status(200).send(JSON.stringify(guitarras, null, '\t'));
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Se produjo un error en el servidor');
    } finally {
        await desconectar();
    }
});

//obtener solo una guitarra por su id
//ruta GET http://127.0.0.1:3000/guitarras/id
server.get('/guitarras/:id', async (req, res) => { 
    const { id } = req.params; 

    try {
        const collection = await conectToDb('guitarras'); 
        const guitarra = await collection.findOne({ id: Number(id) }); 

        if (!guitarra) return res.status(400).send('Error. El Id no coincide con una guitarra existente.');

        res.status(200).send(JSON.stringify(guitarra, null, '\t')); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Se produjo un error en el servidor');
    } finally {
        await desconectar();
    }
});

//metodo post para crear una nueva guitarra
//ruta POST http://127.0.0.1:3000/guitarras
server.post('/guitarras', async (req, res) => {
    const { 
        nombre, marca, modelo, color, precio, cuerpo, mastil, diapason, puente, numero_de_trastes, escala, descuento 
    } = req.body;

    if (!nombre || !marca || !modelo || !color || !precio) {
        return res.status(400).send('Error. Faltan ingresar datos de relevancia.');
    }
    // mmm aca volvi a cambiar && por ||
    try {
        const collection = await conectToDb('guitarras');
        const guitarra = { id: await generateId(collection), nombre, marca, modelo, color, precio };

        if (cuerpo) guitarra.cuerpo = cuerpo;
        if (mastil) guitarra.mastil = mastil;
        if (diapason) guitarra.diapason = diapason;
        if (puente) guitarra.puente = puente;
        if (numero_de_trastes) guitarra.numero_de_trastes = numero_de_trastes;
        if (escala) guitarra.escala = escala;
        if (descuento) guitarra.descuento = descuento;

        await collection.insertOne(guitarra);

        res.status(200).send(JSON.stringify(guitarra, null, '\t'));
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Se produjo un error en el servidor');
    } finally {
        await desconectar();
    }
});

//actualizar una guitarra
//ruta PUT http://127.0.0.1:3000/guitarra/id
server.put('/guitarras/:id', async (req, res) => {
    const { id } = req.params;

    const { 
        nombre, marca, modelo, color, precio, cuerpo, mastil, diapason, puente, numero_de_trastes, escala, descuento 
    } = req.body;

    if (!nombre && !marca && !modelo && !color && !precio) {
        return res.status(400).send('Error. Faltan ingresar datos de relevancia.');
    }
    
    const guitarra = { nombre, marca, modelo, color, precio };

    if (cuerpo) guitarra.cuerpo = cuerpo;
    if (mastil) guitarra.mastil = mastil;
    if (diapason) guitarra.diapason = diapason;
    if (puente) guitarra.puente = puente;
    if (numero_de_trastes) guitarra.numero_de_trastes = numero_de_trastes;
    if (escala) guitarra.escala = escala;
    if (descuento) guitarra.descuento = descuento;

    try {
        const collection = await conectToDb('guitarras');
        await collection.updateOne({ id: Number(id) }, { $set: guitarra});

        res.status(200).send(JSON.stringify(guitarra, null, '\t'));
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Se produjo un error en el servidor');
    } finally {
        await desconectar();
    }
});

//eliminar una guitarra por su id
//ruta DELETE http://127.0.0.1:3000/guitarras/id
server.delete('/guitarras/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const collection = await conectToDb('guitarras');
        await collection.deleteOne({ id: { $eq: Number(id) } });

        res.status(200).send(`el articulo fue eliminado con exito`);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Se produjo un error en el servidor');
    } finally {
        await desconectar();
    }
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

// Método oyente de peteciones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {  
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/guitarras`);
});
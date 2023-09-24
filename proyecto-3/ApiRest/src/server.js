const express = require('express');
const server = express();

const dotenv = require('dotenv');
dotenv.config();

//esto nos va conectare con db
const sequelize = require("./connection/connection")

// tablas
const Contenido = require("./modelos/contenido");
const Actores = require("./modelos/actores");
const Categorias = require("./modelos/categorias");
const Generos = require("./modelos/generos");
const Contenido_genero = require("./modelos/contenido_genero");
const Contenido_actores = require("./modelos/actores");


//operadores
const { Op } = require("sequelize")

// Middlewares
server.use(express.json());
//server.use(express.urlencoded({ extended: true }));

server.get("/contenido", async (req, res) => {
    //const products = await sequelize.query("select * from contenido")

    const contenidos = await Contenido.findAll();
    //const contenidos = await Contenido.findAll({attributes: ["contenido_id", "titulo"]})
    //const contenidos = await Contenido.findAll({ where: {contenido_id: 2} })
    //const contenidos = await Contenido.findAll({ attributes: ["contenido_id", "titulo"] ,where: { contenido_id: 2 } })

    

    //pricegte es el parametro a pasar como query params http://localhost:8080/contenido?pricegte=19

    const pricegte = Number(req.query.pricegte)
    //const contenidos = await Contenido.findAll({where: {contenido_id: { [Op.gte] : pricegte}}})

    //http://localhost:8080/contenido?pricegte=19&priceorder=ASC

    // const priceorder = req.query.priceorder
    //a priceorder lo puedo llamar como asc o desc

    // const contenidos = await Contenido.findAll({
    //     attributes: ["contenido_id", "titulo"],
    //     where: { contenido_id: { [Op.gte]: pricegte} },
    //     order: [ ['contenido_id', priceorder] ] 
    // });
   
    res.status(200).send(contenidos);
});

server.get("/contenido/:id", async (req, res) =>  {

    //const contenidos = await Contenido.findOne({ where: { contenido_id : Number(req.params.id) }})

    //const contenidos = await Contenido.findOne({where: { contenido_id : { [Op.eq]: req.params.id } } })

    const contenidos = await Contenido.findByPk(Number(req.params.id));

    res.status(200).send(contenidos);
});

server.post("/contenido", async (req, res) =>  {

// en postman en body -> raw y elegimos json le pasamos paara que creo el nuevo conenido
    const newContenido = await Contenido.create(req.body);
    res.status(201).send(newProduct);
});

server.put("/contenido/:id", async (req, res) =>  {
    //con esta sentencia actualizamos el contenido con la info que llega en req.body
    await Contenido.update(req.body, { where: { contenido_id : Number(req.params.id) } });
    // y como update no devuelve lo que actualiza lo volvemos a pedir en contenidos
    const contenidos = await Contenido.findByPk(Number(req.params.id));
    console.log(contenidos);
    res.status(200).send(contenidos);
});

server.delete("/contenido/:id", async (req, res) =>  {
    await Contenido.destroy({where: { contenido_id : Number(req.params.id) }});
    res.status(200).send({message: `El producto de id: ${req.params.id} fue eliminado con éxito.`});
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send({error: `La URL indicada no existe en este servidor`});
});

// comentario: cuando le pegamos a una tabla con una de las funciones ejemplo destroy, finall, estamos pegandole a toda la tabla, si queremos pegar a un entidad en particular usamos findByPk o similar para llamar solo a esa entidad

// Método oyente de solicitudes
sequelize.authenticate().then(()=>{
    sequelize.sync({ force: false }).then(()=>{
        server.listen(process.env.PORT, process.env.HOST, () => {
            console.log(`El servidor se está ejecutando en: http://${process.env.HOST}:${process.env.PORT}`);
        });
    }).catch(()=>{
        console.log("Hubo un problema con la sincronización de los modelos.");
    });
}).catch(()=>{
    console.log("Hubo un problema con la conexión a la base de datos.");
});


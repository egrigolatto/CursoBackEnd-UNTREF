const express = require('express');
const server = express();
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require("./connection/connection")

const catalogo = require('./routes/catalogo');
const vista = require('./routes/vista')

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// rutas
server.use('/catalogo', catalogo);
server.use('/vista', vista);

// Control de rutas inexistentes
server.use('*', (req, res) => {
  res.status(404).send({error: `La URL indicada no existe en este servidor`});
});

// Manejo de errores
server.use((error, req, res, next) => {
  console.log(error);
  res.send(error);
});

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


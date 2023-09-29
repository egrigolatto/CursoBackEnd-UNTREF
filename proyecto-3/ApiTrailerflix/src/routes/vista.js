const express = require('express');
const router = express.Router();
const { Vista } = require('../modelos');
const messageErrorServer = { message: 'Se ha generado un error en el servidor' };

//http://localhost:8080/vista --> muestra la vista creada en MySQL
router.get("/", async (req, res, next) => {
  try {
    const vista = await Vista.findAll();
    res.status(200).send(vista);
  } catch (error) {
    res.status(500);
    next(messageErrorServer);
  }
});



module.exports = router;
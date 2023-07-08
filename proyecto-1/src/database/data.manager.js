const fs   = require("fs");
const path = require("path");

const ruta = path.join(__dirname, "data.json");

function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se puede escribir"));

            resolve(true);
        });
    });
}

function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, "utf8", (error, result) => {
            if (error) reject(new Error("Error. No se puede leer"));

            resolve(JSON.parse(result));
        });
    });
}

function generarId(guitarras) {
    let mayorId = 0;

    guitarras.forEach((guitarra) => {
        if (Number(guitarra.id) > mayorId) {
            mayorId = Number(guitarra.id);
        }
    });

    return mayorId + 1;
}

async function findOneById(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    const guitarras = await leer();
    const guitarra = guitarras.find((element) => element.id === id);

    if (!guitarra) throw new Error("Error. El Id no corresponde a una guitarra en existencia.");

    return guitarra;
}

async function findAll() {
    const guitarras = await leer();
    return guitarras;
}

async function create(guitarra) {
    if (!guitarra?.marca || !guitarra?.color || !guitarra?.modelo) throw new Error("Error. Datos incompletos.");

    let guitarras = await leer();
    const guitarraConId = { id: generarId(guitarras), ...guitarra };

    guitarras.push(guitarraConId);
    await escribir(guitarras);

    return guitarraConId;
}

async function update(guitarra) {
    if (!guitarra?.id || !guitarra?.marca || !guitarra?.color || !guitarra?.modelo) throw new Error("Error. Datos incompletos.");

    let guitarras   = await leer();
    const indice = guitarras.findIndex((element) => element.id === guitarra.id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a una guitarra en existencia.");

    guitarras[indice] = guitarra;
    await escribir(guitarras);

    return guitarras[indice];
}

async function destroy(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    let guitarras   = await leer();
    const indice = guitarras.findIndex((element) => element.id === id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a una guitarra en existencia.");

    const guitarra = guitarras[indice];
    guitarras.splice(indice, 1);
    await escribir(guitarras);

    return guitarra;
}

module.exports = { findOneById, findAll, create, update, destroy };
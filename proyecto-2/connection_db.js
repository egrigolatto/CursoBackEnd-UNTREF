const { MongoClient } = require('mongodb');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new MongoClient(process.env.DATABASE_URL);

async function conectar() {
    let connection = null;
    console.log('Conectando...');

    try {
        connection = await client.connect();
        console.log('Conectado');
    } catch (error) {
        console.log(error.message);
    }

    return connection;
}

async function desconectar() {
    try {
        await client.close();
        console.log('Desconectado');
    } catch (error) {
        console.log(error.message);
    }
}

async function conectToDb(collectionName) {
    const connection = await conectar();
    const db = connection.db(process.env.DATABASE_NAME);
    const collection = db.collection(collectionName);

    return collection;
}

async function generateCodigo(collection) {
    const documentMaxCodigo = await collection.find().sort({ codigo: -1 }).limit(1).toArray();
    const maxCodigo = documentMaxCodigo[0]?.codigo ?? 0;

    return maxCodigo + 1;
}

module.exports = { conectToDb, desconectar, generateCodigo };
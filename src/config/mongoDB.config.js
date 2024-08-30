import mongoose from "mongoose";
import envs from "./envs.config.js";
// import { seedProductsToDB } from "./seed/seedProducts.js"; //// funcion para sembrar datos desde un JSON a nuestra BD de Mongo

// //funcion para determinar la conexion de mongo atlas:
// export const connectMongoDB = async () => {
//     try {
//         mongoose.connect(envs.MONGO_URL);
//         console.log("MongoDB connected");

//     } catch (error) {
//         console.log(`Error: ${error}}`);
//     }
// }


// Función para determinar la conexión de MongoDB Atlas: (ES UNA SOLUCION PARA PODER CREAR VARIOS TICKETS SEGUIDOS... SINO ARROJA UN ERROR DE INDEX 'products.code_1' NULL)
export const connectMongoDB = async () => {
    try {
        await mongoose.connect(envs.MONGO_URL);
        console.log("MongoDB connected");

        const db = mongoose.connection.db;

        // Comprobar si el índice 'products.code_1' existe
        const indexes = await db.collection('tickets').indexes();
        const indexExists = indexes.some(index => index.name === 'products.code_1');

        if (indexExists) {
            // El índice existe, proceder a eliminarlo
            await db.collection('tickets').dropIndex('products.code_1');
            console.log("Índice 'products.code_1' eliminado");
        }

        // Crear el nuevo índice con un nombre diferente
        await db.collection('tickets').createIndex(
            { 'products.code': 1 },
            { unique: true, partialFilterExpression: { 'products.code': { $exists: true, $type: 'string' } }, name: "products.code_unique_partial" }
        );

    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

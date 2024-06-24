import mongoose from "mongoose";
// import { seedProductsToDB } from "./seed/seedProducts.js"; //// funcion para sembrar datos desde un JSON a nuestra BD de Mongo

//funcion para determinar la conexion de mongo atlas:
export const connectMongoDB = async () => {
    try {
        mongoose.connect("");
        console.log("MongoDB connected");

    } catch (error) {
        console.log(`Error: ${error}}`);
    }
}
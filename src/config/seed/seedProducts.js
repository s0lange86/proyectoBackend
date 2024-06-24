import fs from "fs";
import { productModel } from "../../dao/mongoDB/models/product.model.js";

export const seedProductsToDB = async () => {
    try {
        const products = await fs.promises.readFile("./src/config/seed/Products.json", "utf-8"); // leemos nuestro archivo JSON
        const parseProducts = await JSON.parse(products); // parseamos el contido del archivo

        await productModel.insertMany(parseProducts); // siguiendo la estructura que tenemos definida en el schema de products para subirla a la base de Mongo

        console.log("Usuarios agregados a la BD en Mongo")

    } catch (error) {
        console.log(error)
    }
}
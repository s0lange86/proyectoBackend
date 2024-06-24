import { request, response } from "express";
import productDao from "../dao/mongoDB/product.dao.js";


export const checkProductData = async (req = request,  res = response, next) => {
    try {
        const { title, description, code, price, stock, category } = req.body; //desestructuramos los campos obligatorios a excepcion de "thumbnail" segun la consigna. Ademas "Status" es TRUE por default.

        const newProduct = { //creamos esta variable que sera el "nuevo producto" para luego chequear que todos los campos que se ingresen por body sean obligatorios
            title,
            description,
            code,
            price,
            stock, 
            category
        };

        const products = await productDao.getAll();

        //VALIDACIONES:
        //verificamos que el code no se repita con uno ya existente
        const productExist = products.docs.find(element => element.code === code); // es "products.docs" porque estamos utilizando PAGINADO
        if (productExist) return res.status(400).json({ status: "Error", mensaje: `Ya existe un producto con el codigo ${code} ingresado` }); //corto la ejecución RETORNANDO un status

        //verificamos que los campos sean obligatorios
        if (Object.values(newProduct).includes(undefined)) return res.status(400).json({ status: "Error", mensaje: "Todos los campos son obligatorios" }); //corto la ejecución RETORNANDO un status

        next(); //si no hay errores que prosiga con la ejecución...

    } catch (error) {
        console.log(error);
        res.status(500).json({status: "Error", mensaje: "Error del servidor..."});
    }
}
import { request, response } from "express";
import mongoose from "mongoose";
import productRepository from "../persistence/mongoDB/product.repository.js"
import cartRepository from "../persistence/mongoDB/cart.repository.js";

export const checkIdData = async ( req = request,  res = response, next ) => {
    try {
        const { cid, pid } = req.params;

        //validamos el formato del "cid" y del "pid" que tienen formato ObjectId antes de usarlos. 
        //De esta manera verificamos si el id proporcionado es un ObjectId válido antes de realizar operaciones con él
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ status: "Error", mensaje: "ID de producto no válido" });
        }

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ status: "Error", mensaje: "ID de carrito no válido" });
        }

        //buscamos por id el carrito y si no existe informamos el error
        const cart = await cartRepository.getById(cid)
        if(!cart) return res.status(404).json({ status: "Error", mensaje: `Carrito ingresado no encontrado (id: ${cid})` });

        //buscamos por id el producto y si no existe informamos el error
        const product = await productRepository.getById(pid);
        if(!product) return res.status(404).json({ status: "Error", mensaje: `Producto ingresado no encontrado (id: ${pid})` });

        next(); //si no hay errores que prosiga con la ejecución...

    } catch (error) {
        console.log(error);
        res.status(500).json({status: "Error", mensaje: "Error del servidor..."});
    }
}


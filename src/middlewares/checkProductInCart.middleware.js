import { request, response } from "express";
import cartDao from "../dao/mongoDB/cart.dao.js";


export const checkProductInCart = async (req = request,  res = response, next) => {
    try {
        const { cid, pid } = req.params;
    
        //buscamos por id el carrito y si no existe informamos el error
        const cart = await cartDao.getById(cid)
        if(!cart) return res.status(404).json({ status: "Error", mensaje: `Carrito ingresado no encontrado (id: ${cid})` });

        const product = cart.products.find(element => element.product == pid);
        if(!product) return res.status(404).json({ status: "Error", mensaje: `Producto ingresado con id ${pid} no existe en el carrito` });

        next(); //si no hay errores que prosiga con la ejecución...

    } catch (error) {
        console.log(error);
        res.status(500).json({status: "Error", mensaje: "Error del servidor..."});
    }    
}
import { Router } from "express";
import mongoose from "mongoose";
import cartDao from "../dao/mongoDB/cart.dao.js";
import { checkIdData } from "../middlewares/checkIdData.middleware.js";
import { checkProductInCart } from "../middlewares/checkProductInCart.middleware.js";

const router = Router();

// CREAMOS UN CARRITO NUEVO
router.post("/", async(req, res) => {
    try {
        const cart = await cartDao.createItem()
        res.status(201).json({ status: "Success", cart }); //status 201: se ha creado un carrito

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})

// CONSULTAMOS UN CARRITO ESPECIFICO SEGUN SU ID
router.get("/:cid", async(req, res) => {
    try {
        const { cid } = req.params;
        
        //validamos el formato del ObjectId ("cid") antes de usarlo.
        //De esta manera verificamos si el id proporcionado es un ObjectId válido antes de realizar operaciones con él
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ status: "Error", mensaje: "ID de carrito no válido" });
        }
        
        //buscamos por id el carrito y si no existe informamos el error
        const cart = await cartDao.getById(cid);
        if(!cart) return res.status(404).json({status: "Error", mensaje: "Carrito ingresado no encontrado"});        
        res.status(200).json({ status: "Success", cart});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})

// AGREGAMOS UN PRODUCTO ESPECIFICO SEGUN SU PRODUCT ID EN UN CARRITO ESPECIFICO SEGUN SU CART ID
router.post("/:cid/product/:pid", checkIdData, async(req, res) => {
    try {
        const { cid, pid } = req.params;

        const newCart = await cartDao.addProductToCart(cid, pid)
        res.status(201).json({ status: "Success", newCart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})

// ELIMINAMOS UN PRODUCTO ESPECIFICO SEGUN SU PRODUCT ID EN UN CARRITO ESPECIFICO SEGUN SU CART ID
router.delete("/:cid/product/:pid", checkIdData, checkProductInCart, async(req, res) => {
    try {
        const { cid, pid } = req.params;

        const newCart = await cartDao.deleteProductToCart(cid, pid)
        res.status(201).json({ status: "Success", newCart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})


// ACTUALIZAMOS LA CANTIDAD DE UN PRODUCTO POR BODY
router.put("/:cid/product/:pid", checkIdData, checkProductInCart, async(req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const newCart = await cartDao.updateProductQuantity(cid, pid, quantity)
        res.status(201).json({ status: "Success", newCart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})


// ELIMINAMOS TODOS LOS PRODUCTOS DEL CARRITO
router.delete("/:cid", async(req, res) => {
    try {
        const { cid } = req.params;
        
        //validamos el formato del ObjectId ("cid") antes de usarlo.
        //De esta manera verificamos si el id proporcionado es un ObjectId válido antes de realizar operaciones con él
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ status: "Error", mensaje: "ID de carrito no válido" });
        }
        
        //buscamos por id el carrito y si no existe informamos el error
        const cart = await cartDao.getById(cid);
        if(!cart) return res.status(404).json({status: "Error", mensaje: "Carrito ingresado no encontrado"});  

        //vaciamos el carrito
        const newCart = await cartDao.cleanCart(cid);
        res.status(200).json({ status: "Success", newCart});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})

export default router;
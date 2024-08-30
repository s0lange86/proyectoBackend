import { Router } from "express";
import productManager from "../persistence/fileSystem/productManager.js";
import { io } from "../app.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.render("home", { products }) //"products" lo mandamos como objeto para que pueda ser iterado por el forEach que tenemos en home.handlebars

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realTimeProducts")

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

// AGREGAR PRODUCTOS

router.post("/realtimeproducts", async (req, res) => {
    try {
        //datos que recibimos por body a traves de formulario
        const { title, description, stock, price } = req.body
        //agregamos el valor de los datos que recibimos
        await productManager.addProduct({ title, description, stock, price })
        //traigo el listado de productos actualizado
        const products = await productManager.getProducts()
        //enviamos los productos actualizados por socket
        io.emit("products", products)
        //renderizamos
        res.render("realTimeProducts")

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

// ELIMINAR PRODUCTOS

router.delete("/realtimeproducts", async (req, res) => {
    try {
        //datos que recibimos por body a traves de formulario
        const { id } = req.body
        //agregamos el valor de los datos que recibimos
        await productManager.deleteProduct(Number(id))
        //traigo el listado de productos actualizado
        const products = await productManager.getProducts()
        //enviamos los productos actualizados por socket
        io.emit("products", products)
        //renderizamos
        res.render("realTimeProducts")

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

export default router;
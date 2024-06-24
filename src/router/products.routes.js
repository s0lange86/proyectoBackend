import { Router } from "express";
import { checkProductData } from "../middlewares/checkProductData.middleware.js";
import productDao from "../dao/mongoDB/product.dao.js";

const router = Router();


router.get("/", async (req, res) => {
    try {
        //CONFIGURAMOS NUESTRA PAGINACION: 
        // 1) declaramos las posibles querys
        const { limit, page, sort, category, status } = req.query;

        // 2) configuramos el valor de las querys que nos puedan llegar: el primer valor es lo que se defina por query y el segundo seria el valor que definimos por defecto
        const options = {
            limit: limit || 10,
            page: page || 1,
            sort: {
                price: sort == "asc" ? 1 : -1 // 1 = ascendente y -1 = descendente
            },
            learn: true
        }

        let products;

        // 3) Si nos solicitan los productos por una categoria específica
        if (category) {
            products = await productDao.getAll({ category }, options);
        } 
        // 4) Si nos consultan por disponibilidad de un producto (status)
        else if (status) {
            products = await productDao.getAll({ status }, options);
        } 
        // 5) si no se especifica ningun filtro
        else {
            products = await productDao.getAll({}, options); //primer parametro quedan las llaves vacías porque no filtramos
        }

        res.status(200).json({ status: "Success", products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})

router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productDao.getById(pid)

        if(!product) return res.status(404).json({ status: "Error", mensaje: "Producto ingresado no encontrado" });

        res.status(200).json({ status: "Success", product});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})


router.post("/", checkProductData, async (req, res) => {
    try {
        const productData = req.body;
        const product = await productDao.createItem(productData);

        res.status(201).json({ status: "Success", product }); //status 201: se ha creado un producto

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})

router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const productData = req.body;
        const product = await productDao.updateItem(pid, productData)

        if(!product) return res.status(404).json({status: "Error", mensaje: "Producto ingresado no encontrado"});

        res.status(200).json({ status: "Success", product});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})


router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productDao.deleteItem(pid)

        if(!product) return res.status(404).json({status: "Error", mensaje: "Producto ingresado no encontrado"});

        res.status(200).json({ status: "Success", mensaje: "Producto eliminado exitosamente"});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
})

export default router;
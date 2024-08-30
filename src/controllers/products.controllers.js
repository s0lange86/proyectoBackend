import { request, response } from "express";
import productsServices from "../services/products.services.js";

const getAllProducts = async (req = request, res = response) => {
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
            products = await productsServices.getAllProducts({ category }, options);
        } 
        // 4) Si nos consultan por disponibilidad de un producto (status)
        else if (status) {
            products = await productsServices.getAllProducts({ status }, options);
        } 
        // 5) si no se especifica ningun filtro
        else {
            products = await productsServices.getAllProducts({}, options); //primer parametro quedan las llaves vacías porque no filtramos
        }

        res.status(200).json({ status: "Success", products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

const getProductById = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const product = await productsServices.getProductById(pid);

        if(!product) return res.status(404).json({ status: "Error", mensaje: "Producto ingresado no encontrado" });

        res.status(200).json({ status: "Success", product});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

const updateProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const productData = req.body;
        const product = await productsServices.updateProduct(pid, productData);

        if(!product) return res.status(404).json({status: "Error", mensaje: "Producto ingresado no encontrado"});

        res.status(200).json({ status: "Success", product});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

const createProduct = async (req = request, res = response) => {
    try {
        const productData = req.body;
        const product = await productsServices.createProduct(productData);

        res.status(201).json({ status: "Success", product }); //status 201: se ha creado un producto

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

const deleteProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const product = await productsServices.deleteProduct(pid);

        if(!product) return res.status(404).json({status: "Error", mensaje: "Producto ingresado no encontrado"});

        res.status(200).json({ status: "Success", mensaje: "Producto eliminado exitosamente"});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
}

export default {
    getAllProducts,
    getProductById,
    updateProduct,
    createProduct,
    deleteProduct
};
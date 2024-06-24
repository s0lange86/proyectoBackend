// vamos a crear el CRUD completo con MONGOOSE que interactua con nuestra BD utilizando el/los modelos creados ("models")

import { productModel } from "./models/product.model.js";

// traemos todos los productos de la BD
const getAll = async (query, options) => {
    // const products = await productModel.find({status: true}); // filtramos: debe traernos todos los productos que tengan el status en "true", que deberian ser los "existentes"
    const products = await productModel.paginate(query, options); // al traer todos los productos utilizamos "paginado"
    return products;
}

// buscamos un producto en la BD por ID
const getById = async (id) => {
    const product = await productModel.findById(id);
    return product;
}

// creamos un producto nuevo
const createItem = async (data) => {
    const product = await productModel.create(data);
    return product;
}

// actualizamos datos de un producto de la BD
const updateItem = async (id, data) => {
    const productUpdate = await productModel.findByIdAndUpdate(id, data, {new: true}); //el 3er parámetro hace que el return devuelva el producto con el dato actualizado
    return productUpdate;
}

// deshabilitamos un producto de la BD
const deleteItem = async (id) => {
    const product = await productModel.findByIdAndUpdate(id, {status: false}, {new: true}); //cambiamos el status para no eliminar fisicamente el dato de la base
    return product;
}


// exportamos todas las funciones para utilizarlas en los routes:
export default {
    getAll,
    getById,
    createItem,
    updateItem,
    deleteItem
}
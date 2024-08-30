// vamos a crear el CRUD completo con MONGOOSE que interactua con nuestra BD utilizando el/los modelos creados ("models")

import { cartModel } from "./models/cart.model.js";

// traemos todos los carritos de la BD
const getAll = async () => {
const carts = await cartModel.find();
    return carts;
}

// buscamos un carrito en la BD por ID
const getById = async (id) => {
    const cart = await cartModel.findById(id).populate("products.product"); // si bien almacenamos solo el id, con "populate" podemos desglosar los productos almacenados en el carrito
    return cart;
}

// creamos un carrito nuevo
const createItem = async (data) => {
    const cart = await cartModel.create(data);
    return cart;
}

// actualizamos datos de un carrito de la BD
const updateItem = async (id, data) => {
    const cartUpdate = await cartModel.findByIdAndUpdate(id, data, {new: true}); //el 3er parámetro hace que el return devuelva el carrito con el dato actualizado
    return cartUpdate;
}

// deshabilitamos un carrito de la BD
const deleteItem = async (id) => {
    const cart = await cartModel.deleteOne({_id: id}); // en este caso sí eliminamos el carrito "físicamente"
    return cart;
}

// agregamos un producto especifico en un carrito especifo de la BD
const addProductToCart = async (cid, pid) => {
    const cart = await cartModel.findById(cid) // buscamos el carrito con un id especifico, el cual lo recibimos con el "cid"

    const findProductInCart = cart.products.find(element => element.product == pid) //buscamos un producto que coincida con el "pid"
    
    // si existe que incremente la cantidad en 1, sino que pushee al array de objetos "products" el "pid" y la cantidad en 1
    if (findProductInCart){
        findProductInCart.quantity+=1;
    } else {
        cart.products.push({ product: pid, quantity: 1 })
    }

    await cart.save(); // "await" porque la funcion "save" es una PROMESA de mongoose: actualiza los cambios en nuestra BD y los guarda
    return cart
}

// eliminamos un producto especifico en un carrito especifo de la BD
const deleteProductToCart = async (cid, pid) =>{
    const cart = await cartModel.findById(cid); // buscamos el carrito con un id especifico, el cual lo recibimos con el "cid"

    cart.products = cart.products.filter(element => element.product != pid); // reescribimos el array de "products" del carrito con los productos que sean distintos al producto especificado por pid por medio de un filtrado
    await cart.save(); // "await" porque la funcion "save" es una PROMESA de mongoose: actualiza los cambios en nuestra BD y los guarda
    return cart
    
} 


// agregamos una cantidad determinada de un producto específico dentro del carrito
const updateProductQuantity = async (cid, pid, quantity) => {
    const cart = await cartModel.findById(cid); // buscamos el carrito con un id especifico, el cual lo recibimos con el "cid"

    const product = cart.products.find(element => element.product == pid);

    product.quantity = quantity; // al carrito encontrado con el pid le asignamos a su propiedad quantity el valor de la quantity que nos manden por parametro
    
    await cart.save(); // "await" porque la funcion "save" es una PROMESA de mongoose: actualiza los cambios en nuestra BD y los guarda
    return cart
}

// eliminamos todos los productos del carrito
const cleanCart = async (cid) => {
    const cart = await cartModel.findById(cid); // buscamos el carrito con un id especifico, el cual lo recibimos con el "cid"

    cart.products = []; // reasignamos el valor por un array vacio

    await cart.save(); // "await" porque la funcion "save" es una PROMESA de mongoose: actualiza los cambios en nuestra BD y los guarda
    return cart
}

// exportamos todas las funciones para utilizarlas en los routes:
export default {
    getAll,
    getById,
    createItem,
    updateItem,
    deleteItem,
    addProductToCart,
    deleteProductToCart,
    updateProductQuantity,
    cleanCart
}
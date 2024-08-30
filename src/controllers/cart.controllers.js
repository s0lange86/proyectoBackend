import { request, response } from "express";
import mongoose from "mongoose";

import cartRepository from "../persistence/mongoDB/cart.repository.js";
import cartServices from "../services/cart.services.js";
import ticketServices from "../services/ticket.services.js";


const createCart = async(req = request, res = response) => {
    try {
        const cart = await cartServices.createCart();
        res.status(201).json({ status: "Success", cart }); //status 201: se ha creado un carrito

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

const getCartById = async(req = request, res = response) => {
    try {
        const { cid } = req.params;

        //validamos el formato del ObjectId ("cid") antes de usarlo.
        //De esta manera verificamos si el id proporcionado es un ObjectId válido antes de realizar operaciones con él
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ status: "Error", mensaje: "ID de carrito no válido" });
        }
        
        //buscamos por id el carrito y si no existe informamos el error
        const cart = await cartRepository.getById(cid);
        if(!cart) return res.status(404).json({status: "Error", mensaje: "Carrito ingresado no encontrado"});        
        res.status(200).json({ status: "Success", cart});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

const deleteProductToCartById = async(req, res) => {
    try {
        const { cid, pid } = req.params;

        const newCart = await cartServices.deleteProductToCartById(cid, pid)
        res.status(201).json({ status: "Success", newCart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

const addProductToCartById = async(req, res) => {
    try {
        const { cid, pid } = req.params;

        const newCart = await cartServices.addProductToCartById(cid, pid)
        res.status(201).json({ status: "Success", newCart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

const updateProductQuantityById = async(req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const newCart = await cartServices.updateProductQuantityById(cid, pid, quantity)
        res.status(201).json({ status: "Success", newCart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

const cleanCartById = async(req, res) => {
    try {
        const { cid } = req.params;

        //validamos el formato del ObjectId ("cid") antes de usarlo.
        //De esta manera verificamos si el id proporcionado es un ObjectId válido antes de realizar operaciones con él
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ status: "Error", mensaje: "ID de carrito no válido" });
        }
        
        //buscamos por id el carrito y si no existe informamos el error
        const cart = await cartServices.getCartById(cid);
        if(!cart) return res.status(404).json({status: "Error", mensaje: "Carrito ingresado no encontrado"});  

        //vaciamos el carrito
        const newCart = await cartServices.cleanCartById(cid);
        res.status(200).json({ status: "Success", newCart});

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

const purchaseCart = async(req, res) => {
    try {
        const { cid } = req.params

        //validamos el formato del ObjectId ("cid") antes de usarlo.
        //De esta manera verificamos si el id proporcionado es un ObjectId válido antes de realizar operaciones con él
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ status: "Error", mensaje: "ID de carrito no válido" });
        }
        
        //buscamos por id el carrito y si no existe informamos el error
        const cart = await cartRepository.getById(cid);
        if(!cart) return res.status(404).json({status: "Error", mensaje: "Carrito ingresado no encontrado"});

        const total = await cartServices.purchaseCart(cid);
        const ticket = await ticketServices.createTicket(req.user.email, total);

        res.status(200).json({ status: "Success" , ticket })

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", mensaje: "Error del servidor..." });
    }
};

export default {
    createCart,
    getCartById,
    deleteProductToCartById,
    addProductToCartById,
    updateProductQuantityById,
    cleanCartById,
    purchaseCart
};
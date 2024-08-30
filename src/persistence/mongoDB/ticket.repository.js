// vamos a crear el CRUD completo con MONGOOSE que interactua con nuestra BD utilizando el/los modelos creados ("models")

import { ticketModel } from "./models/ticket.model.js";

// TRAEMOS TODOS LOS TICKETS DE LA BD
const getAll = async (query, options) => {
    // const tickets = await ticketModel.find({status: true}); // filtramos: debe traernos todos los tickets que tengan el status en "true", que deberian ser los "existentes"
    const tickets = await ticketModel.paginate(query, options); // al traer todos los tickets utilizamos "paginado"
    return tickets;
}

// BUSCAMOS UN TICKET EN LA BD POR ID
const getById = async (id) => {
    const ticket = await ticketModel.findById(id);
    return ticket;
}

// CREAMOS UN TICKET NUEVO
const createItem = async (data) => {
    const ticket = await ticketModel.create(data);
    return ticket;
}

// ACTUALIZAMOS DATOS DE UN TICKET DE LA BD
const updateItem = async (id, data) => {
    const ticketUpdate = await ticketModel.findByIdAndUpdate(id, data, {new: true}); //el 3er parámetro hace que el return devuelva el ticket con el dato actualizado
    return ticketUpdate;
}

// DESHABILITAMOS UN TICKET DE LA BD
const deleteItem = async (id) => {
    const ticket = await ticketModel.findByIdAndUpdate(id, {status: false}, {new: true}); //cambiamos el status para no eliminar fisicamente el dato de la base
    return ticket;
}


// exportamos todas las funciones para utilizarlas en los routes:
export default {
    getAll,
    getById,
    createItem,
    updateItem,
    deleteItem
}
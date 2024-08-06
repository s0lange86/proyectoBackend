// vamos a crear el CRUD completo con MONGOOSE que interactua con nuestra BD utilizando el/los modelos creados ("models")

import { userModel } from "./models/user.model.js";

// traemos todos los usuarios de la BD
const getAll = async (query, options) => {
    const users = await userModel.paginate(query, options); // al traer todos los usuarios utilizamos "paginado"
    return users;
}

// buscamos un usuario en la BD por ID
const getById = async (id) => {
    const user = await userModel.findById(id);
    return user;
}

// buscamos un usuario por email
const getByEmail = async (email) => {
    const user = await userModel.findOne({ email: email });
    return user;
}


// creamos un usuario nuevo
const create = async (data) => {
    const user = await userModel.create(data);
    return user;
}

// actualizamos datos de un usuario de la BD
const update = async (id, data) => {
    const userUpdate = await userModel.findByIdAndUpdate(id, data, {new: true}); //el 3er parámetro hace que el return devuelva el usuario con el dato actualizado
    return userUpdate;
}

// deshabilitamos un usuario de la BD
const deleteUser = async (id) => {
    const user = await userModel.findByIdAndUpdate(id, {status: false}, {new: true}); //cambiamos el status para no eliminar fisicamente el dato de la base
    return user;
}


// exportamos todas las funciones para utilizarlas en los routes:
export default {
    getAll,
    getById,
    getByEmail,
    create,
    update,
    deleteUser
}
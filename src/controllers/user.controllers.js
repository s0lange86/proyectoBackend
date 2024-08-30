import { request, response } from "express";
import { isValidPassword } from "../utils/hashPassword.js";
import { createToken } from "../utils/jwt.js";
import userServices from "../services/user.services.js";
import { respUserDto } from "../dto/user.dto.js";


const createUser = async (req = request, res = response) => { 
    try {
        res.status(201).json({ status: "Success", mensaje: "User created" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", mensaje: "Internal server error" })
    }
};

const loginUser = async (req = request, res = response) => { 
    try {
        //creamos el token con JWT y luego lo almaceno creando una cookie que contendra el token y la info del usuario
        const token = createToken(req.user);

        res.cookie("token", token, { httpOnly: true }); //1er parametro es el nombre de la cookie; 2do parámetro la info que se guarda en esa cookie, 3er parámetro: las cookies solo se van a mandar por peticiones http, no van a tener acceso desde el front, solo desde el back.        

        return res.status(200).json({ status: "Success", payload: req.user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", mensaje: "Internal server error" })
    }
};

const loginAuthenticateToken = async (req = request, res = response) => {
    try {
        const { email, password } = req.body;
        const user = await userServices.loginAuthenticateToken(email);
        if(!user || !isValidPassword(user.password, password) ) res.status(401).json({ status: "Error", mensaje: "User or email invalid" });

        const token = createToken(user);       

        res.cookie("token", token, { httpOnly: true }); //1er parametro es el nombre de la cookie; 2do parámetro la info que se guarda en esa cookie, 3er parámetro: las cookies solo se van a mandar por peticiones http, no van a tener acceso desde el front, solo desde el back.

        res.status(200).json({ status: "Success", user, token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", mensaje: "Internal server error" })
    }
};

const getCurrentUser = async (req = request, res = response) => { 
    const user = req.user;
    const userResponse = respUserDto(user);
    res.status(200).json({ status: "Success", userResponse })
};

export default {
    createUser,
    loginUser,
    loginAuthenticateToken,
    getCurrentUser
}


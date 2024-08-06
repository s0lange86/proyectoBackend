import { Router } from "express";
import userDao from "../dao/mongoDB/user.dao.js";
import passport from "passport";
import { isValidPassword } from "../utils/hashPassword.js";
import { createToken } from "../utils/jwt.js";
import { passportCall } from "../middlewares/passport.middleware.js";

const router = Router();

// creamos/registramos un usuario
router.post("/register", passport.authenticate("register"), async (req, res) => { //2do parámetro utilizamos un metodo de passport y colocamos el nombre de la estrategia a utilizar
    try {
        res.status(201).json({ status: "Success", mensaje: "User created" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", mensaje: "Internal server error" })
    }
})

// logueamos un usuario (con estrategia passport "local" llamada "login" utilizando JWT):
router.post("/login", passportCall("login"), async (req, res) => { // usamos un middleware para manejo de mensajes de error y dentro de esta decimos que estrategia queremos usar
    try {
        //creamos el token con JWT y luego lo almaceno creando una cookie que contendra el token y la info del usuario
        const token = createToken(req.user);

        res.cookie("token", token, { httpOnly: true }); //1er parametro es el nombre de la cookie; 2do parámetro la info que se guarda en esa cookie, 3er parámetro: las cookies solo se van a mandar por peticiones http, no van a tener acceso desde el front, solo desde el back.

        return res.status(200).json({ status: "Success", payload: req.user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", mensaje: "Internal server error" })
    }
})

// autenticacion de token por JWT (sin uso de passport)
router.post("/auth", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userDao.getByEmail(email);
        if(!user || !isValidPassword(user.password, password) ) res.status(401).json({ status: "Error", mensaje: "User or email invalid" });

        const token = createToken(user);       

        res.cookie("token", token, { httpOnly: true }); //1er parametro es el nombre de la cookie; 2do parámetro la info que se guarda en esa cookie, 3er parámetro: las cookies solo se van a mandar por peticiones http, no van a tener acceso desde el front, solo desde el back.

        res.status(200).json({ status: "Success", user, token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", mensaje: "Internal server error" })
    }
})

// mostramos la sesion activa (usando estrategia de passport personalizado, "custom passport")
router.get("/current", passportCall("current"), async (req, res) => { // usamos un middleware para manejo de mensajes de error y dentro de esta decimos que estrategia queremos usar
    res.status(200).json({ status: "Success", user: req.user })
})


export default router
import passport from "passport";
import { Router } from "express";
import { passportCall } from "../middlewares/passport.middleware.js";
import userControllers from "../controllers/user.controllers.js";

const router = Router();

// CREAMOS/REGISTRAMOS UN USUARIO
router.post("/register", passport.authenticate("register"), userControllers.createUser) //2do parámetro utilizamos un metodo de passport y colocamos el nombre de la estrategia a utilizar

// LOGUEAMOS UN USUARIO (CON ESTRATEGIA PASSPORT "LOCAL" LLAMADA "LOGIN" UTILIZANDO JWT):
router.post("/login", passportCall("login"), userControllers.loginUser) // 2do parametro usamos un middleware para manejo de mensajes de error y dentro de esta decimos que estrategia queremos usar

// AUTENTICACION DE TOKEN POR JWT (SIN USO DE PASSPORT)
router.post("/auth", userControllers.loginAuthenticateToken)

// MOSTRAMOS LA SESION ACTIVA (USANDO ESTRATEGIA DE PASSPORT PERSONALIZADO, "CUSTOM PASSPORT")
router.get("/current", passportCall("current"), userControllers.getCurrentUser) // usamos un middleware para manejo de mensajes de error y dentro de esta decimos que estrategia queremos usar


export default router
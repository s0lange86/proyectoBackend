import express from "express";
import router from "./router/index.routes.js";

import __dirname from "./dirname.js"; //path absoluto
import handlebars from "express-handlebars"; 
import viewRoutes from "./router/views.routes.js"

import { Server } from "socket.io";
import productRepository from "./persistence/mongoDB/product.repository.js";
import { connectMongoDB } from "./config/mongoDB.config.js";
import envs from "./config/envs.config.js" //variables de entorno

import cookieParser from "cookie-parser";
import session from "express-session";

import passport from "passport";
import { initializePassport } from "./config/passport.config.js";

const app = express();

//MongoDB
connectMongoDB();

//Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); // lo que vamos a compartir con el cliente

app.use(cookieParser("secretCode")); // pasamos como parámetro un codigo que habilita poder modificar la cookie. Sin éste codigo la misma no puede ser modificada
app.use(session({
    secret: envs.SECRET_CODE, //palabra secreta
    resave: true, // mantiene la sesion activa, si está en "false" la sesion se cierra por inactividad despues de un cierto tiempo
    saveUninitialized: true // guarda la sesion aunque ésta no tenga contenido
}));

//PASSPORT:
initializePassport(); //inicializamos passport
//Middlewares de passport:
app.use(passport.initialize());
app.use(passport.session()); //utiliza session para guardar la informacion que maneje passport

//Middlewares de RUTAS:
app.use("/api", router)
app.use("/", viewRoutes)

//Handlebars: (configuracion por defecto)
app.engine("handlebars", handlebars.engine()); //Inicia el motor de la plantilla
app.set("views", __dirname + "/views"); // Indicamos donde se encuentran nuestras vistas
app.set("view engine", "handlebars"); // Indicamos con que motos vamos a utilizar las vistas


//Websocket:
// 1) Guardamos la configuracion del servidor en una variable:
const httpServer = app.listen(envs.PORT, () =>{
    console.log(`Server listening port ${envs.PORT}`);
});
// 2) configuramos websocket (lado del servidor):
export const io = new Server(httpServer)
// 3) "handshake":
io.on("connection", async (socket) => {
    console.log("New client connected");
    const products = await productRepository.getAll();
    io.emit("products", products)
})
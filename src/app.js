import express from "express";
import router from "./router/index.routes.js";

import __dirname from "./dirname.js"; //path absoluto
import handlebars from "express-handlebars"; 
import viewRoutes from "./router/views.routes.js"

import { Server } from "socket.io";
import productDao from "./dao/mongoDB/product.dao.js";
import { connectMongoDB } from "./config/mongoDB.config.js";


const PORT = 8080;
const app = express();

//MongoDB
connectMongoDB();

//Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Handlebars: (configuracion por defecto)
app.engine("handlebars", handlebars.engine()); //Inicia el motor de la plantilla
app.set("views", __dirname + "/views"); // Indicamos donde se encuentran nuestras vistas
app.set("view engine", "handlebars"); // Indicamos con que motos vamos a utilizar las vistas

app.use(express.static("public")); // lo que vamos a compartir con el cliente

//Rutas:
app.use("/api", router)
app.use("/", viewRoutes)


//Websocket:
// 1) Guardamos la configuracion del servidor en una variable:
const httpServer = app.listen(PORT, () =>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
// 2) configuramos websocket (lado del servidor):
export const io = new Server(httpServer)
// 3) "handshake":
io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    const products = await productDao.getAll();
    io.emit("products", products)
})
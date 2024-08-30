import { Router } from "express";
import { checkProductData } from "../middlewares/checkProductData.middleware.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { authorization } from "../middlewares/authorization.middleware.js";
import productsControllers from "../controllers/products.controllers.js";


const router = Router();

//OBTENEMOS TODOS LOS PRODUCTOS:
router.get("/", passportCall("jwt"), authorization("user"), productsControllers.getAllProducts) //contiene middlewares para chekear token de un usuario autenticado(osea, debe estar logueado) y asi acceder a los productos, y el 2do es para verificar que tenga rol de usuario

//OBTENEMOS UN PRODUCTO SEGUN SU ID
router.get("/:pid", productsControllers.getProductById)

//CREAMOS UN NUEVO PRODUCTO
router.post("/", checkProductData, authorization("admin"), productsControllers.createProduct)

//ACTUALIZAMOS DATA DE UN PRODUCTO
router.put("/:pid", authorization("admin"), productsControllers.updateProduct)

//BORRAMOS UN PRODUCTO EXISTENTE
router.delete("/:pid", authorization("admin"), productsControllers.deleteProduct)

export default router;
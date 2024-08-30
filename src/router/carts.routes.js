import { Router } from "express";
import { checkIdData } from "../middlewares/checkIdData.middleware.js";
import { checkProductInCart } from "../middlewares/checkProductInCart.middleware.js";
import cartControllers from "../controllers/cart.controllers.js";
import { authorization } from "../middlewares/authorization.middleware.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { isUserCart } from "../middlewares/isUserCart.middleware.js";

const router = Router();

// CREAMOS UN CARRITO NUEVO
router.post("/", cartControllers.createCart);

// CONSULTAMOS UN CARRITO ESPECIFICO SEGUN SU ID
router.get("/:cid", cartControllers.getCartById);

// AGREGAMOS UN PRODUCTO ESPECIFICO SEGUN SU PRODUCT ID EN UN CARRITO ESPECIFICO SEGUN SU CART ID
router.post("/:cid/product/:pid", passportCall("jwt"), authorization("user"), checkIdData, isUserCart, cartControllers.addProductToCartById);

// ELIMINAMOS UN PRODUCTO ESPECIFICO SEGUN SU PRODUCT ID EN UN CARRITO ESPECIFICO SEGUN SU CART ID
router.delete("/:cid/product/:pid", authorization("user"), passportCall("jwt"), checkIdData, checkProductInCart, cartControllers.deleteProductToCartById);

// ACTUALIZAMOS LA CANTIDAD DE UN PRODUCTO POR BODY
router.put("/:cid/product/:pid", authorization("user"), passportCall("jwt"), checkIdData, checkProductInCart, cartControllers.updateProductQuantityById);

// ELIMINAMOS TODOS LOS PRODUCTOS DEL CARRITO
router.delete("/:cid", passportCall("jwt"), authorization("user"), cartControllers.cleanCartById);

// COMPRAMOS LOS PRODUCTOS CARGADOS EN EL CARRITO
router.get("/:cid/purchase", passportCall("jwt"), authorization("user"), cartControllers.purchaseCart);

export default router;
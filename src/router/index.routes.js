import { Router } from "express";
import productsRoutes from "./products.routes.js";
import cartsRoutes from "./carts.routes.js";
import sessionRoutes from "./session.routes.js";

const router = Router();

router.use("/products", productsRoutes);
router.use("/carts", cartsRoutes);
router.use("/session", sessionRoutes);

//si el desde el cliente ingresan una ruta inexistente, a nivel global
router.get("*", async(req, res) => {
    try {
        res.status(404).json({ status: "Error", message: "Route not found" })
    } catch (error) {
        console.log(error);
        res.status(505).json({ status: "Error", message: "Internal server error" })
    }
})



export default router;
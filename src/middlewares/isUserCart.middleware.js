import { request, response } from "express";

//middleware para validar que estemos agregando productos al carrito correspondiente del usuario
export const isUserCart = async (req = request, res = response, next) => {
    const { cid } = req.params;
    if(req.user.cart._id !== cid) return res.status(401).json({ status: "Error", message: "Wrong cart user" });

    next();
}
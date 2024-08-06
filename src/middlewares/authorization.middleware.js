import { request, response } from "express";

export const authorization = (role) => {
    return async (req = request, res = response, next) => {
        if(!req.user) return res.status(401).json({ status: "Error", message: "Unauthorized" });
        if(req.user.role != role) return res.status(403).json({ status: "Error", message: "No permissions" });
        next();
    }
}
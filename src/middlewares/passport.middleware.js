import { request, response } from "express";
import passport from "passport";


//middleware para mostrar por consola los mensajes de posibles errores de passportm, pasando como parametro la estrategia que estaremos utilizando
export const passportCall = (strategy) => {

    return async (req = request, res = response, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if(error) return next(error);
            if(!user) return res.status(401).json({ status: "Error", message: info.message ? info.message : info.toString() }) // si existe el mensaje mostrará el mismo, sino no aparecerá

            req.user = user;
            next();
        })(req, res, next) //esto va siempre por defecto como confiración
    }
}
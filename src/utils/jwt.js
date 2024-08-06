import jwt from "jsonwebtoken";
import envs from "./../config/envs.config.js"

// funcion que crea el token:
export const createToken = (user) => { // la funcion recibe los datos que vamos a cifrar en el token
    const { _id, email, role, cart } = user;
    const token = jwt.sign( { _id, email, role, cart }, envs.JWT_CODE, { expiresIn: "2m" } ); // 1er parametro: payload, la data que vamos a guardar dentro de nuestro token, si este no coincide resultara un token invalido; 2do va el codigo secreto; 3ero el tiempo de expiracion
    return token;
}

// funcion que va a verificar el token:
export const verifyToken = (token) =>{
    try {
        const decoded = jwt.verify( token, envs.JWT_CODE ); // 1er parametro va el token que recibimos, 2do el codigo secreto que debe coincidir con el codigo que secreto que viene dentro del token... si este no coinde arroja error ya que el token es invalido
        return decoded;
        
    } catch (error) {
        return null;
    }
}
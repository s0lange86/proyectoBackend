import passport from "passport";
import local from "passport-local";
import passportJWT from "passport-jwt";
import passportCustom from "passport-custom";

import userDao from "../dao/mongoDB/user.dao.js";
import cartDao from "../dao/mongoDB/cart.dao.js";
import envs from "./envs.config.js";

import { createHash, isValidPassword } from "./../utils/hashPassword.js";
import { cookieExtractor } from "../utils/cookieExtractor.js";
import { verifyToken } from "../utils/jwt.js";

const LocalStrategy = local.Strategy; //la variable se escribe en mayuscula porque despues la vamos a instanciar
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const CustomStrategy = passportCustom.Strategy;

//vamos a configurar nuestra estrategia en una sola función porque despues la vamos a inicializar con nuestra aplicación
export const initializePassport = () => {
    //para usar nuestras estrategias tenemos que utilizar los MIDDLEWARES de passport:

    //ESTRATEGIA LOCAL PARA EL REGISTRO

    passport.use(
        //1) nombre de la estrategia
        "register",
        //2) instanciamos la estrategia que vamos a usar: 1er parámetro nos habilita en el callback el "request"; 2do parámetro configuramos que dato se considera como "username"; 3er parámetro nuestro callback 
        new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, 
            async (req, username, password, done) => { //"req" ya lo habilitamos como TRUE (el cual recibe todos los datos). Username y password los recibios del body
                try {
                    const {first_name, last_name, age} = req.body;
                    //vamos a chequear si el usuario existe con nuestro "dao":
                    const user = await userDao.getByEmail(username); //username = email
                    if(user) return done(null, false, { message: "User already exists" }); //done: 1ero ponemos "null" porque no hay ningun error, 2do "false" porque como estamos registrando no podemos pasar un usuario que exista (es un parámetro opcional), y 3ero un mensaje para mostrar (tambien es opcional)

                    //si el usuario no existe, osea, no entro en el "if" anterior, pasamos a crear un carrito y al registro del nuevo usuario:
                    const newCart = await cartDao.createItem();

                    const newUser = {
                        first_name, 
                        last_name, 
                        password: createHash(password), //importo la funcion de "hasheo" de bcrypt para encriptarla
                        email: username, 
                        age,
                        cart: newCart._id //pasamos el id del carrito que se acaba de crear en la linea 35
                    }

                    const userCreate = await userDao.create(newUser);
                    return done(null, userCreate); //done: no pasamos 3er parámetro (es opcional)

                } catch (error) {
                    return done(error); //done: no pasamos 2do ni 3er parámetro (son opcionales). Solo pasamos el error.
                }
        }) 
    );

    //ESTRATEGIA LOCAL PARA EL LOGIN

    passport.use(
        "login", 
        new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
            try {
                const user = await userDao.getByEmail(username);
                if (!user || !isValidPassword(user.password, password) ) return done(null, false, { message: "User or password are incorrect" });

                return done(null, user)
                
            } catch (error) {
                done(error)
            }
        })
    );

    
    //ESTRATEGIA PASSPORT JWT

    passport.use(
        "jwt",
        new JWTStrategy(
            { jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), secretOrKey: envs.JWT_CODE }, // "jwtFromRequest" es donde pasamos nuestro extractor del token y "fromExtractors()" recibe como parametro un array de "extractores" que estaremos creando nosotros manualmente, los cuales lo haran mediante cookies.
            async (jwt_payload, done) => { // en el payload vamos a tener la info que esta almacenada en el token
                try {
                    return done(null, jwt_payload)

                } catch (error) {
                    return done(error);
                }
            }
        )
    );


    //ESTRATEGIA PERSONALIZADA
    passport.use(
        "current",
        new CustomStrategy(
            async (req, done) => {
                try {
                    const token = cookieExtractor(req); // extraemos el token que almacenamos en la cookie cuando hacemos el login en "session.routes"
                    if(!token) return done(null, false);
                    const tokenVerify = verifyToken(token); // verificamos el token que sea valido (no alterado) y nos traiga la info del usuario (id, email, rol y cart)
                    if(!tokenVerify) return done(null, false);

                    const user = await userDao.getByEmail(tokenVerify.email)

                    done(null, user);
                } catch (error) {
                    done(error)
                }
            }
        )
    )


    //SERIALIZACION y DESERIALIZACION de un usuario: crear un identificador unico y usar dicho identificador para almacenar y obtener la info del usuario en la sesion
    passport.serializeUser( ( user, done ) => {
        done(null, user._id); //con el id del usuario vamos a generar un identificador unico
    } );

    passport.deserializeUser( async ( id, done ) => {
        try {
            const user = await userDao.getById(id); //buscamos el usuario por identificador unico
            done(null, user); // devolvemos el usuario completo, con toda su info
        } catch (error) {
            done(error)
        }
    } );

}
import bcrypt from "bcrypt";

//HASHEO:

export const createHash = (password) => { //recibimos como parámetro la pass del usuario sin encriptar
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //primer parámetro la pass a encriptar, 2do paramatro en cuantos caracteres va a desectructurar la pass para encriptarla
}

//VALIDACIÓN:

export const isValidPassword = (encryptedPassUser, password) => { //primero paramatro el pass del usuario encriptado y el 2do el password que estamos recibiendo
    return bcrypt.compareSync(password, encryptedPassUser); //esta funcion devuelve un BOOLEANO, TRUE si coinciden ambas pass, FALSE si son diferentes
}

export const cookieExtractor = (req) => {
    let token = null; // esta variable va a inicializarse en null
    if(req && req.cookies){
        token = req.cookies["token"]; // es lo mismo poner token = req.cookies.token
    }

    return token; // devolvera el token si que existe y sino retornara un null
}
import fs from "fs";

const path = "./data/carts.json";

let carts = [];

//CREAR CARRITO
const createCart = async() => {
    await getCarts();
    const newCart = {
        id: carts.length +1,
        products: []
    };

    //Agregamos el carrito al array "carts"
    carts.push(newCart);

    //Escribimos el archivo JSON con los datos de los carritos que vayamos creando en 2 pasos:
    //1) guardamos en una variable el contenido del array transformandolo en formato JSON, osea, texto plano
    const fileContent = JSON.stringify(carts, null, '\t');
    //2) escribimos el contenido en un archivo JSON (si éste no existe, lo crea)
    await fs.promises.writeFile(path, fileContent);

    return newCart
}


// OBTENER PRODUCTOS DE CARRITO PARA QUE SIEMPRE TRAIGA LOS CARRITOS AL MOMENTO DE CREAR UNO NUEVO
const getCarts = async() => {
    //leemos el archivo
    const fileContent = await fs.promises.readFile(path, "utf-8");
    //parseamos el JSON para que muestre el contenido en formato Object
    const fileContentParse = JSON.parse(fileContent);
    carts = fileContentParse || [];
}


//OBTENER PRODUCTOS DE UN CARRITO EN ESPECIFICO
const getCartById = async(idNum) => {    
    await getCarts();
    const cartById = carts.find(element => element.id === idNum);

    return cartById;
}


//AGREGAR PRODUCTOS A UN CARRITO EN ESPECIFICO
const addProductToCart = async(cid, pid) => {
    await getCarts();

    const newProduct = {
        product: pid,
        quantity: 1
    };

    const indexCart = carts.findIndex(element => element.id === cid);
    if (indexCart === -1) {
        return null; // Cart not found. Return "null" para que se ejecute el manejo de errores en routes
    }

    const findProduct = carts[indexCart].products.find(e => e.product === pid);

    if (findProduct) {
        findProduct.quantity += 1;
    } else {
        carts[indexCart].products.push(newProduct);
    }

    const fileContent = JSON.stringify(carts, null, '\t');
    await fs.promises.writeFile(path, fileContent);

    return carts[indexCart];
}

export default {
    createCart,
    getCarts,
    getCartById,
    addProductToCart
}
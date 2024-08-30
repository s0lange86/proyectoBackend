import fs from "fs";

const path = "./data/products.json"; //base de datos de productos
let products = []


//AGREGAR PRODUCTOS
const addProduct = async (product) => {
    //primero obtenemos los productos del JSON
    await getProducts();

    const { title, description, price, status = true, category, thumbnail = [], code, stock } = product

    const newProduct = { //creamos el nuevo producto con todos los campos que debe tener
        id: products.length + 1,
        title,
        description,
        price,
        status,
        category,
        thumbnail,
        code,
        stock
    };

    //en el archivo ubicado en ./src/middlewares/chekProductData.middleware.js estan las validaciones de los campos que son obligatorios <---

    //Agregamos el producto al array "products"
    products.push(newProduct);

    //Escribimos el archivo JSON con los datos de los productos en 2 pasos:
    //1) guardamos en una variable el contenido del array transformandolo en formato JSON, osea, texto plano
    const fileContent = JSON.stringify(products, null, '\t');
    //2) escribimos el contenido en un archivo JSON (si éste no existe, lo crea)
    await fs.promises.writeFile(path, fileContent);

    return products
}

//OBTENER LISTADO DE PRODUCTOS
const getProducts = async (limit) => {
    //leemos el archivo
    const fileContent = await fs.promises.readFile(path, "utf-8");
    //parseamos el JSON para que muestre el contenido en formato Object
    const fileContentParse = JSON.parse(fileContent);
    products = fileContentParse || [];

    if (!limit) return products;

    return products.slice(0, limit);
}


//OBTENER UN PRODUCTO POR SU ID
const getProductById = async (idNum) => {
    //leemos el archivo y despues lo parseamos:
    const fileContent = await fs.promises.readFile(path, "utf-8");
    const fileContentParse = JSON.parse(fileContent);

    const productById = fileContentParse.find(element => element.id === idNum)

    return productById;
}


//ACTUALIZAMOS LA INFO DE UN PRODUCTO EN ESPECIFICO SEGUN SU ID
const updateProduct = async(idNum, newData) => {
    await getProducts();

    //busco el INDICE del objeto dentro el array products que corresponda con el ID indicado. Una vez que identidico su indice, hago una copia de ese objeto y actualizo los datos con la info que se envie por newData. Solo se actualizaran los datos que se ingresen por parametro, el resto de propiedades quedarian igual al original.
    const objetIndex = products.findIndex(element => element.id === idNum);
    products[objetIndex] = {
        ...products[objetIndex],
        ...newData
    }

    //sobreescribo la info en el archivo con los datos actualizados:
    const fileContent = JSON.stringify(products, null, '\t');
    await fs.promises.writeFile(path, fileContent);

    //retorno la info actualizada segun ese ID
    return await getProductById(idNum);
}


//BORRAMOS UN PRODUCTO SEGUN SU ID
const deleteProduct = async(idNum) => {
    await getProducts();

    //valido que el ID exista
    const product = await getProductById(idNum);
    if(!product) return false;

    //elimino el producto del id especificado
    const restProducts = products.filter(e => e.id != idNum);

    //reescribo el archivo
    const fileUpdated = JSON.stringify(restProducts, null, '\t');
    await fs.promises.writeFile(path, fileUpdated);
    return true
}


export default {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
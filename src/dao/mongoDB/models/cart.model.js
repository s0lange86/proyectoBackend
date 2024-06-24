import mongoose from "mongoose";

//nombre de la coleccion: "carts":
const cartCollection = "carts"; // en plural porque es una coleccion de "cartS"

//creamos el "schema", la estructura de como van a ser los datos y el tipo de dato:
const cartSchema = new mongoose.Schema({
    products: {
        // products es de tipo array donde dentro tendra objetos con 2 propiedades: product y quantity
        type: [ { 
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products" }, // el tipo de dato que estará en la propiedad "product" es de tipo ObjectId que es la forma en que almacena y genera mongo. El "ref" hace referencia al nombre de la coleccion creada en product.model, osea, "products" 
            quantity: Number
        } ],
    }
})

//creamos el modelo: coleccion + schema
export const cartModel = mongoose.model(cartCollection, cartSchema)
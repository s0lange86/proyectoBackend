import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

//nombre de la coleccion: "products":
const productCollection = "products"; // en plural porque es una coleccion de "productoS"

//creamos el "schema", la estructura de como van a ser los datos y el tipo de dato:
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: {
        type: Array,
        default: []
    },
    code: String,
    stock: Number,
    category: String,
    status: {
        type: Boolean,
        default: true //cuando eliminamos algo de una base de datos en realidad cambiamos el status y pasa a ser "false". El dato jamas de elimina para evitar que pueda romperse la base o haya alguna falla/error, sobre todo en bases relacionales.
    }
})

productSchema.plugin(mongoosePaginate); // cuando consultemos los productos lo devolvera todo "paginado"

//creamos el modelo: coleccion + schema
export const productModel = mongoose.model(productCollection, productSchema)
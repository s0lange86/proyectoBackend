import mongoose from "mongoose";

//nombre de la coleccion: "tickets":
const ticketCollection = "tickets"; // en plural porque es una coleccion de "ticketS"

//creamos el "schema", la estructura de como van a ser los datos y el tipo de dato:
const ticketSchema = new mongoose.Schema({    
    code: { // debe autogenerarse y ser unico
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: { // cuando se realizo la compra
        type: Date,
        default: Date.now()
    },
    amount: { // total de la compra
        type: Number,
        required: true
    }, 
    purchaser: { // contendra el correo asociado a la compra
        type: String,
        required: true
    }    
});


//creamos el modelo: coleccion + schema
export const ticketModel = mongoose.model(ticketCollection, ticketSchema)
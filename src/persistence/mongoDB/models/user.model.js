import mongoose from "mongoose";

//nombre de la coleccion: "users":
const userCollection = "users"; // en plural porque es una coleccion de "userS"

//creamos el "schema", la estructura de como van a ser los datos y el tipo de dato:
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }, 
    email: {
        type: String,
        require: true,
        unique: true
    },
    age: {
        type: Number,
        require: true
    },
    role: {
        type: String,
        default: "user"
    }, 
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "carts"}, //populate
});

userSchema.pre("findOne", function() { // "pre" es un middleware de mongoose: cuando haga una peticion "finOne" ejecute la funcion y haga el populate de "carts"
    this.populate("cart");
})

//creamos el modelo: coleccion + schema
export const userModel = mongoose.model(userCollection, userSchema)
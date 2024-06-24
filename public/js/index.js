// LADO DEL CLIENTE: (lo que tendria que hacer el front)

const socket = io();

//traigo el div que va a contener los productos que voy a ir agregando o eliminando
const productsList = document.getElementById("productsList");

// formularios
const addForm = document.getElementById("addForm");
const deleteForm = document.getElementById("deleteForm");

//Agregar productos por formulario:

addForm.addEventListener("submit", async (e) => {
    //para que no se recargue la pagina
    e.preventDefault();

    //capturo el valor ("value") ingresado de cada input por su ID
    const title = document.getElementById ("titleId").value;
    const description = document.getElementById("descriptionId").value;
    const stock = document.getElementById("stockId").value;
    const price = document.getElementById("priceId").value;


    // enviamos los datos por fetch
    await fetch("/realtimeproducts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, stock, price }) // son los mismos datos que se reciben por el lado servidor en body.request
    })

    addForm.reset() //para que se reseteen todos los datos del formulario

    addForm.reset();
})

//Eliminar productos por formulario:

deleteForm.addEventListener("submit", async (e) => {
    //para que no se recargue la pagina
    e.preventDefault();

    //capturo el valor ("value") ingresado de cada input por su ID
    const id = document.getElementById ("productId").value;
    

    //enviamos los datos por fetch
    await fetch("/realtimeproducts", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }) // son los mismos datos que se reciben por el lado servidor en body.request
    })

    deleteForm.reset() //para que se reseteen todos los datos del formulario
})

// Recibimos todos los productos que se enviaron por la vista realTimeProducts
socket.on("products", (data) => {
    productsList.innerHTML = ""; //string vacio para que cada vez que agreguemos no se repita todo el array
    
    //vamos a iterar por todos los productos que estemos recibiendo
    data.forEach(element => {
        const cardProduct = document.createElement("div")
        cardProduct.classList.add("card");
        cardProduct.style.width = "18rem";
        cardProduct.style.marginTop = "1em";
        cardProduct.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${element.title}</h5>
            <p class="card-text">${element.description}</p>
            <p class="card-text">Disponibles:${element.stock}</p>
            <p class="card-text">Precio:${element.price}</p>
        </div>
        `;

        productsList.appendChild(cardProduct)
    });
})
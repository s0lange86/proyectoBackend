import ticketRepository from "../persistence/mongoDB/ticket.repository.js";

const createTicket = async (userEmail, totalCart) => {
    const newTicket = {
        purchaser: userEmail, // usuario que realiza la compra
        amount: totalCart, // costo total de la compra
        code: Math.random().toString(36).substr(2, 9),
        //el "purchase_datetime" no es necesario colocarlo/declararlo porque se genera automaticamente por default
    };

    const ticket = await ticketRepository.createItem(newTicket);
    return ticket;
}

export default { createTicket };
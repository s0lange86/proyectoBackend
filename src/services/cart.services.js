import cartRepository from "../persistence/mongoDB/cart.repository.js";
import productRepository from "../persistence/mongoDB/product.repository.js";

const createCart = async () => {
    return await cartRepository.createItem();
};

const getCartById = async (cid) => {
    return await cartRepository.getById(cid);
};

const deleteProductToCartById = async (cid, pid) => {
    return await cartRepository.deleteProductToCart(cid, pid);
};

const addProductToCartById = async (cid, pid) => {
    return await cartRepository.addProductToCart(cid, pid);
};

const updateProductQuantityById = async (cid, pid, quantity) => {
    return await cartRepository.updateProductQuantity(cid, pid, quantity);
};

const cleanCartById = async (cid) => {
    return await cartRepository.cleanCart(cid);
};

const purchaseCart = async (cid) => {
    const cart = await cartRepository.getById(cid);
    let total = 0;
    const productsWithoutStock = []; // se almacenaran los productos que no pudieron ser comprados por falta de stock

    for(const element of cart.products) {
        const product = await productRepository.getById(element.product); // que itere el array de productos que tiene el cart donde coincida con el "element.product" que es el id del producto

        // una vez que ya identifique el producto, que valide si el stock de ese producto es mayor o igual al quantity de mi carrito y sume el total del precio
        if(product.stock >= element.quantity){
            total += product.price * element.quantity;
            await productRepository.updateItem(product._id, { stock: product.stock - element.quantity })
        } else {
            productsWithoutStock.push(element); // si no hay stock se pushea el "element" que es el objeto de PRODUCTO COMPLETO al array de productos sin stock
        }
        
        await cartRepository.updateItem(cid, { products: productsWithoutStock }); // actualizamos el carrito donde quedaran los productos que no pudieron comprarse
    }

    return total; // devolvemos la suma total de la compra
}

export default {
    createCart,
    getCartById,
    deleteProductToCartById,
    addProductToCartById,
    updateProductQuantityById,
    cleanCartById,
    purchaseCart
};
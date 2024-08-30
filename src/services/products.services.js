import { respProductDto } from "../dto/product.dto.js";
import productRepository from "../persistence/mongoDB/product.repository.js";
const getAllProducts = async (query, options) => {
    return await productRepository.getAll(query, options);
};

const getProductById = async (pid) => {
    const product = await productRepository.getById(pid);
    const productResponse = respProductDto(product); //filtramos la info para mostrarla mas simplificada

    return productResponse; 
};

const updateProduct = async (pid, productData) => {
    return await productRepository.updateItem(pid, productData);
};

const createProduct = async (productData) => {
    return await productRepository.createItem(productData);
};

const deleteProduct = async (pid) => {
    return await productRepository.deleteItem(pid);
};

export default {
    getAllProducts,
    getProductById,
    updateProduct,
    createProduct,
    deleteProduct
};
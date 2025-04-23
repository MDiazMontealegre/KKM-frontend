//1. Creacion de servicios
const API_BASE = "http://127.0.0.1:8000";

export const getProducts = async () => {
    const res = await fetch(`${API_BASE}/product/get-products/`);
    return await res.json();
};

export const getProductById = async (product_id) => {
    const res = await fetch(`${API_BASE}/product/get-product/${product_id}`);
    return await res.json();
};

export const updateStock = async (product) => {
    const {id, marca, nombre, talla, precio, numreferencia, proveedor, stock} =product;
    return await fetch(`${API_BASE}/product/update-stock/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, marca, nombre, talla, precio, numreferencia, proveedor, stock}), //No se envia el estado
    });
};

export const addProduct = async (data) => {
    const res = await fetch(`${API_BASE}/product/add-product/`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
};
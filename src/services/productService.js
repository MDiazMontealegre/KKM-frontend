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

export const updateStock = async (product_id, data) => {
    const res = await fetch(`${API_BASE}/product/update-stock/${product_id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
};

export const addProduct = async (data) => {
    const res = await fetch(`${API_BASE}/product/add-product/`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
};
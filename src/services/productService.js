//1. Creacion de servicios
const API_BASE = "https://kkm-backend.onrender.com";

export const getProducts = async () => {
    const res = await fetch(`${API_BASE}/product/get-products/`);
    return await res.json();
};

export const getProductById = async (product_id) => {
    const res = await fetch(`${API_BASE}/product/get-product/${product_id}`);
    return await res.json();
};

export const updateProduct = async (product) => {
    const {id, marca, nombre, talla, precio, numreferencia, proveedor, tipo, categoria_id} =product;
    return await fetch(`${API_BASE}/product/update-product/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, marca, nombre, talla, precio, numreferencia, proveedor, tipo, categoria_id}), //No se envia el estado
    });
};

export const addProduct = async (data) => {
    return await fetch(`${API_BASE}/product/add-product/`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
};

export async function changeProductStatus(id, estado) {
    return await fetch(`${API_BASE}/product/change-status/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado }),
    });
  }
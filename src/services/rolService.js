//1. Creacion de servicios
const API_BASE = "https://kkm-backend.onrender.com";

export const getRoles = async() => {
    const response = await fetch(`${API_BASE}/rol/get-roles`)
    return await response.json();
};

export const createRol = async(data) => {
    const response = await fetch(`${API_BASE}/rol/create_rol`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
         },
        body : JSON.stringify(data)
    });
    return response;
};
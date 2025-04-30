//1. Creacion de servicios
const API_BASE = "http://127.0.0.1:8000";

export const getUsers = async() => {
    const response = await fetch(`${API_BASE}/user/get_users`)
    return await response.json();
};

export const getUserById = async (user_id) => {
    const res = await fetch(`${API_BASE}/user/get-user/${user_id}`);
    return await res.json();
};

export const createUser = async(data) => {
    const response = await fetch(`${API_BASE}/user/create_user`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
         },
        body : JSON.stringify(data)
    });
};

export const updateUser = async (user) => {
    const {id, nombre, correo, contrasena, rol_id} =user;
    return await fetch(`${API_BASE}/user/update-user/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, nombre, correo, contrasena, rol_id}), //No se envia el estado
    });
};
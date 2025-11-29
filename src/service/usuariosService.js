import axios from "axios";

// URL base  Backend Spring Boot para usuarios
const API_URL = "http://localhost:8080/api/v1/usuarios";


export async function registrarUsuario(usuario) {
    const res = await axios.post(API_URL, usuario);
    return res.data;
}


export async function loginUsuario(correo, password) {
    const res = await axios.post(`${API_URL}/login`, { correo, password });
    return res.data;
}


export async function getUsuarios() {
    const res = await axios.get(API_URL);
    return res.data;
}


export async function updateUsuario(id, usuario) {
    const res = await axios.put(`${API_URL}/${id}`, usuario);
    return res.data;
}

export async function deleteUsuario(id) {
    await axios.delete(`${API_URL}/${id}`);
}
import axios from "axios";


const API_URL = "http://localhost:8080/api/v1/usuarios";

// Función para obtener el header de autorización con el token JWT
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};


export async function registrarUsuario(usuario) {
    // POST con headers 
    // útil si un admin está creando usuarios
    //  o si es registro público el backend lo ignorará
    const res = await axios.post(API_URL, usuario, { headers: getAuthHeaders() });
    return res.data;
}

export async function loginUsuario(correo, password) {
    // El login suele ser público, pero enviamos headers por consistencia 
    // el backend en SecurityConfig tiene .permitAll() para login, así que pasará igual
    const res = await axios.post(`${API_URL}/login`, { correo, password }, { headers: getAuthHeaders() });
    return res.data;
}

export async function getUsuarios() {
    // GET: Necesario para que el ADMIN vea la lista
    const res = await axios.get(API_URL, { headers: getAuthHeaders() });
    return res.data;
}

export async function updateUsuario(id, usuario) {
    // PUT: Necesario para editar perfil
    const res = await axios.put(`${API_URL}/${id}`, usuario, { headers: getAuthHeaders() });
    return res.data;
}

export async function deleteUsuario(id) {
    // DELETE: Necesario para que el ADMIN elimine usuarios
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
}
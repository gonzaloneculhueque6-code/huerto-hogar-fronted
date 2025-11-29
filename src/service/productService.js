import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/productos";

// Función para obtener el header de autorización con el token JWT
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};
// Peticiones CRUD para productos con manejo de token JWT
export const getProductos = async () => {
    // GET: axios.get(url, config)
    const res = await axios.get(API_URL, { headers: getAuthHeaders() });
    return res.data;
};

export const crearProducto = async (producto) => {
    // POST: axios.post(url, data, config)
    const res = await axios.post(API_URL, producto, { headers: getAuthHeaders() });
    return res.data;
};

export const actualizarProducto = async (id, producto) => {
    // PUT: axios.put(url, data, config)
    const res = await axios.put(`${API_URL}/${id}`, producto, { headers: getAuthHeaders() });
    return res.data;
};

export const eliminarProducto = async (id) => {
    // DELETE: axios.delete(url, config)
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/ordenes";
// Función para obtener el header de autorización con el token JWT
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};


// Envía el carrito y los datos del cliente para procesar la compra.
export async function crearOrden(datosCompra) {
    // POST http://localhost:8080/api/v1/ordenes/comprar
    // Se agrega headers para identificar al usuario que compra aunque el ID ya vaya en el
    const res = await axios.post(`${API_URL}/comprar`, datosCompra, { headers: getAuthHeaders() });
    return res.data;
}

//OBTENER TODAS LAS ÓRDENES (Admin/Vendedor)
export async function getTodasLasOrdenes() {
    // GET http://localhost:8080/api/v1/ordenes
    // Vital para proteger el panel de administración
    const res = await axios.get(API_URL, { headers: getAuthHeaders() });
    return res.data;
}

//ACTUALIZAR ESTADO (Admin/Vendedor)
export async function actualizarEstadoOrden(idOrden, nuevoEstado) {
    // PATCH http://localhost:8080/api/v1/ordenes/{id}/estado?nuevoEstado=Enviado
    // Aquí combinamos 'params' y 'headers' en el mismo objeto de configuración
    const res = await axios.patch(`${API_URL}/${idOrden}/estado`, null, {
        params: { nuevoEstado: nuevoEstado },
        headers: getAuthHeaders()
    });
    return res.data;
}
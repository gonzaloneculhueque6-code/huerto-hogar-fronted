import axios from "axios";

// URL base del controlador de órdenes en Spring Boot
const API_URL = "http://localhost:8080/api/v1/ordenes";
// Envía el carrito y los datos del cliente para procesar la compra.
export async function crearOrden(datosCompra) {
    // POST http://localhost:8080/api/ordenes/comprar
    const res = await axios.post(`${API_URL}/comprar`, datosCompra);
    return res.data;
}


 //OBTENER TODAS LAS ÓRDENES (Admin/Vendedor)
export async function getTodasLasOrdenes() {
    // GET http://localhost:8080/api/ordenes
    const res = await axios.get(API_URL);
    return res.data;
}


 //ACTUALIZAR ESTADO (Admin/Vendedor)
export async function actualizarEstadoOrden(idOrden, nuevoEstado) {
    // PATCH http://localhost:8080/api/ordenes/{id}/estado?nuevoEstado=Enviado
    const res = await axios.patch(`${API_URL}/${idOrden}/estado`, null, {
        params: { nuevoEstado: nuevoEstado }
    });
    return res.data;
}
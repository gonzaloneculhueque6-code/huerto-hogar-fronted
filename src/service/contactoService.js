import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/contacto";

export async function enviarMensaje(datos) {
    // datos = nombre, email, mensaje
    const res = await axios.post(API_URL, datos);
    return res.data;
}
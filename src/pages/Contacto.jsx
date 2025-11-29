import React, { useState } from 'react';
import { enviarMensaje } from '../service/contactoService'; 

export default function Contacto() {
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await enviarMensaje(formData); 
        alert("¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.");
        setFormData({ nombre: '', email: '', mensaje: '' }); 
    } catch (error) {
        console.error(error);
        alert("Hubo un error al enviar el mensaje.");
    }
  };

  return (
    <div className="container my-5">
        <h2 className="titulo text-center">Contáctanos</h2>
        <div className="row justify-content-center">
            <div className="col-md-6 caja_formulario p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mensaje</label>
                        <textarea className="form-control" name="mensaje" rows="4" value={formData.mensaje} onChange={handleChange} required></textarea>
                    </div>
                    <button type="submit" className="button w-100">ENVIAR MENSAJE</button>
                </form>
            </div>
        </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import regionesYComunas from '../data/regionComuna.js';

//Importamos la función del servicio para conectar con el Backend
import { registrarUsuario } from '../service/usuariosService';

export default function Registro(){
  const [form, setForm] = useState({
      nombre:'', 
      apellidos: '', 
      rut:'', 
      correo:'', 
      confirmarCorreo:'', 
      contrasena:'', 
      confirmarContrasena:'', 
      direccion:'', 
      telefono:'', 
      region:'', 
      comuna:''
  });
  const navigate = useNavigate();
  const [comunasDisponibles, setComunasDisponibles] = useState([]);

  const onChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleRegionChange = (e) => {
    const regionNombre = e.target.value;
    setForm(prevForm => ({
      ...prevForm,
      region: regionNombre,
      comuna: '' 
    }));
    const regionEncontrada = regionesYComunas.find(r => r.nombre === regionNombre);
    setComunasDisponibles(regionEncontrada ? regionEncontrada.comunas : []);
  };
  
  // Hacemos la función 'async' para poder usar 'await' con la API
  const onSubmit = async (e) => {
    e.preventDefault();
    const correoRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    const direccionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\s+\d+$/;
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}\-[\dkK]$/;

    const {nombre, apellidos, rut, correo, confirmarCorreo, contrasena, confirmarContrasena, direccion, region, comuna} = form;

    // --- VALIDACIONES DEL FRONTEND 
    if(!nombre || !apellidos || !rut || !correo || !confirmarCorreo || !contrasena || !confirmarContrasena || !direccion){
      alert('Completa todos los campos obligatorios.');
      return;
    }
    if(!rutRegex.test(rut)){ alert('RUT inválido. Formato xx.xxx.xxx-k'); return }
    if(!direccionRegex.test(direccion)){ alert('Dirección debe ser "calle número"'); return }
    if(correo !== confirmarCorreo){ alert('Correos no coinciden'); return }
    if(contrasena !== confirmarContrasena){ alert('Contraseñas no coinciden'); return }
    if(contrasena.length < 4 || contrasena.length > 10){ alert('Contraseña entre 4 y 10 caracteres.'); return }
    if(correo.length > 100){ alert('Correo excede 100 caracteres'); return }
    if(!correoRegex.test(correo)){ alert('Correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com'); return }
    if(!region || !comuna){ alert('Selecciona región y comuna'); return }

    try {
        const usuarioParaBackend = {
            nombre: nombre,
            apellido: apellidos, 
            rut: rut,
            correo: correo,
            password: contrasena,
            direccion: direccion,
            telefono: form.telefono,
            region: region,
            comuna: comuna,
            rol: {nombre: "CLIENTE"}
        };

        // Llamamos al servicio (esto hace el POST a Spring Boot)
        await registrarUsuario(usuarioParaBackend);

        // Si no hubo error en el await, mostramos éxito
        alert('¡Registro exitoso en la Base de Datos! Ya puedes iniciar sesión.');
        navigate('/login');

    } catch (error) {
        console.error("Error al registrar:", error);
        // Manejo de errores Ej: Si el correo ya existe en MySQL
        if (error.response && error.response.status === 500) {
             alert('Error: Es posible que el correo o el RUT ya estén registrados.');
        } else {
             alert('Ocurrió un error al conectar con el servidor.');
        }
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 formulario-card p-4 caja_formulario">
          <h5 className="text-center mb-4">Registro de usuario</h5>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">NOMBRE</label> 
              <input className="form-control" name="nombre" value={form.nombre} onChange={onChange}/>
            </div>

            <div className="mb-3">
              <label className="form-label">APELLIDOS</label>
              <input className="form-control" name="apellidos" value={form.apellidos} onChange={onChange}/>
            </div>

            <div className="mb-3">
              <label className="form-label">RUT</label>
              <input className="form-control" name="rut" value={form.rut} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">CORREO</label>
              <input type="email" className="form-control" name="correo" value={form.correo} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">CONFIRMAR CORREO</label>
              <input type="email" className="form-control" name="confirmarCorreo" value={form.confirmarCorreo} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">CONTRASEÑA</label>
              <input type="password" className="form-control" name="contrasena" value={form.contrasena} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">CONFIRMAR CONTRASEÑA</label>
              <input type="password" className="form-control" name="confirmarContrasena" value={form.confirmarContrasena} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">DIRECCIÓN</label>
              <input className="form-control" name="direccion" value={form.direccion} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label className="form-label">TELÉFONO (opcional)</label>
              <input className="form-control" name="telefono" value={form.telefono} onChange={onChange}/>
            </div>
            <div className="row mb-4">
              <div className="col-6">
                <label className="form-label">Región*</label>
                <select 
                  className="form-select" 
                  name="region" 
                  value={form.region} 
                  onChange={handleRegionChange} 
                  required 
                >
                  <option value="">Seleccione Región...</option>
                  {regionesYComunas.map(region => (
                    <option key={region.nombre} value={region.nombre}>
                      {region.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Comuna*</label>
                <select 
                  className="form-select" 
                  name="comuna" 
                  value={form.comuna} 
                  onChange={onChange} 
                  required 
                  disabled={!form.region || comunasDisponibles.length === 0} 
                >
                  <option value="">Seleccione Comuna...</option>
                  {comunasDisponibles.map(comuna => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-grid gap-2">
              <button className="button">Registrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
import React, { useState, useEffect } from 'react';
import { updateUsuario } from '../service/usuariosService'; 
export default function ConfiguracionPerfil({ adminUser, setAdminUser }) {
  
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    rut: '',
    correo: '',
    telefono: '',
    direccion: '',
    region: '',
    comuna: '',
    password: '', 
    confirmPassword: ''
  });

  useEffect(() => {
    if (adminUser) {
      setFormData({
        id: adminUser.id,
        nombre: adminUser.nombre || '',
        apellido: adminUser.apellido || adminUser.apellidos || '',
        rut: adminUser.rut || '',
        correo: adminUser.correo || '',
        telefono: adminUser.telefono || '',
        direccion: adminUser.direccion || '',
        region: adminUser.region || '',
        comuna: adminUser.comuna || '',
        password: '', 
        confirmPassword: ''
      });
    }
  }, [adminUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseñas si el usuario escribió algo
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
      //Si el campo password va vacío
      const usuarioActualizado = {
        ...formData,
        // Mantener rol original 
        rol: adminUser.rol, 
        password: formData.password ? formData.password : adminUser.password
      };

      //Llamada al Backend (PUT)
      const respuesta = await updateUsuario(formData.id, usuarioActualizado);

      //Actualiza estado global y localStorage
      setAdminUser(respuesta);
      localStorage.setItem('usuarioLogueado', JSON.stringify(respuesta));

      alert("¡Perfil actualizado correctamente!");
      
      //Limpiar campos de contraseña
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar. Intente nuevamente.");
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
        <div className="card-header bg-white">
          <h3 className="mb-0 text-center titulo">Mi Perfil</h3>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            
            <h5 className="mb-3 text-muted">Información Personal</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Apellidos</label>
                <input className="form-control" name="apellido" value={formData.apellido} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">RUT</label>
                <input 
                    className="form-control bg-light" 
                    name="rut" 
                    value={formData.rut} 
                    onChange={handleChange} 
                    disabled 
                />
                <small className="text-muted">El RUT no se puede modificar.</small>
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Correo</label>
                <input 
                    className="form-control bg-light" 
                    name="correo" 
                    value={formData.correo} 
                    onChange={handleChange} 
                    disabled 
                />
                <small className="text-muted">El correo es su identificador.</small>
              </div>
              <div className="col-md-6">
                <label className="form-label">Teléfono</label>
                <input className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} />
              </div>
            </div>

            <h5 className="mb-3 text-muted">Dirección de Envío</h5>
            <div className="row g-3 mb-4">
              <div className="col-12">
                <label className="form-label">Dirección (Calle y Número)</label>
                <input className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Región</label>
                <input className="form-control" name="region" value={formData.region} onChange={handleChange} />
                
              </div>
              <div className="col-md-6">
                <label className="form-label">Comuna</label>
                <input className="form-control" name="comuna" value={formData.comuna} onChange={handleChange} />
              </div>
            </div>

            <h5 className="mb-3 text-muted">Seguridad (Opcional)</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Nueva Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Dejar en blanco para mantener la actual"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirmar Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="submit" className="button btn-lg px-5">
                Guardar Cambios
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
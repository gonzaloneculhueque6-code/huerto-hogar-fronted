import React, { useState, useEffect } from 'react';
import regionesYComunas from '../data/regionComuna.js';


export default function AgregarModificar({ user, onSave, onCancel, allUsers }) {


  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    rut: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    direccion: '',
    telefono: '',
    region: '',
    comuna: '',
    rol: '',
    ...user
  });

  const [comunasDisponibles, setComunasDisponibles] = useState([]);
  const [errors, setErrors] = useState({});
  const isEditing = user && user.correo && !user.correo.startsWith('TEMP-');

  useEffect(() => {
    if (formData.region) {
      const regionEncontrada = regionesYComunas.find(r => r.nombre === formData.region);
      setComunasDisponibles(regionEncontrada ? regionEncontrada.comunas : []);
    } else {
      setComunasDisponibles([]);
    }
  }, [formData.region]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegionChange = (e) => {
    const regionNombre = e.target.value;
    setFormData(prevForm => ({
      ...prevForm,
      region: regionNombre,
      comuna: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const correoRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es requerido.';
    if (!formData.apellidos?.trim()) newErrors.apellidos = 'Los apellidos son requeridos.';
    if (!formData.rut?.trim()) newErrors.rut = 'El RUT es requerido.';
    if (!formData.correo?.trim()) newErrors.correo = 'El correo es requerido.';
    else if (!correoRegex.test(formData.correo)) newErrors.correo = 'Correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    else {
      const correoExistente = Array.isArray(allUsers) && allUsers.find(u => u.correo.toLowerCase() === formData.correo.toLowerCase());
      if (!isEditing && correoExistente) {
        newErrors.correo = 'Este correo ya está registrado.';
      }
      if (isEditing && correoExistente && correoExistente.correo !== user.correo) {
        newErrors.correo = 'Este correo ya pertenece a otro usuario.';
      }
    }
    if (!isEditing || formData.contrasena) {
      if (!formData.contrasena) newErrors.contrasena = 'La contraseña es requerida.';
      else if (formData.contrasena.length < 4 || formData.contrasena.length > 10) newErrors.contrasena = 'Contraseña debe tener entre 4 y 10 caracteres.';

      if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
        newErrors.confirmarContrasena = 'Las contraseñas no coinciden.';
      }
      if (formData.contrasena && !formData.confirmarContrasena) {
        newErrors.confirmarContrasena = 'Debe confirmar la contraseña.';
      }
    }

    // Validaciones de Dirección 
    if (!formData.direccion?.trim()) newErrors.direccion = 'La dirección es requerida.';
    if (!formData.region) newErrors.region = 'La región es requerida.';
    if (!formData.comuna) newErrors.comuna = 'La comuna es requerida.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmarContrasena, ...userDataToSave } = formData;
      if (isEditing && !userDataToSave.contrasena) {
        delete userDataToSave.contrasena;
      }
      onSave(userDataToSave);

    } else {
      alert("Por favor corrija los errores en el formulario.");
    }
  };


  return (
    <div className="card shadow-sm p-4 mb-4 caja_formulario">
      <h3>{isEditing ? 'Modificar Usuario' : 'Agregar Nuevo Usuario'}</h3>
      <form onSubmit={handleSubmit}>

        {/* -Inputs del formulario  */}
        {/* Nombre y Apellidos */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre*</label>
            <input type="text" className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} name="nombre" value={formData.nombre || ''} onChange={handleChange} />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Apellidos*</label>
            <input type="text" className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`} name="apellidos" value={formData.apellidos || ''} onChange={handleChange} />
            {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
          </div>
        </div>
        {/* RUT y Teléfono */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">RUT*</label>
            <input type="text" className={`form-control ${errors.rut ? 'is-invalid' : ''}`} name="rut" value={formData.rut || ''} onChange={handleChange} placeholder="Ej: 12345678-k" />
            {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Teléfono (opcional)</label>
            <input type="tel" className="form-control" name="telefono" value={formData.telefono || ''} onChange={handleChange} />
          </div>
        </div>
        {/* Correo */}
        <div className="row">
          <div className="col-md-12 mb-3">
            <label className="form-label">Correo*</label>
            <input type="email" className={`form-control ${errors.correo ? 'is-invalid' : ''}`} name="correo" value={formData.correo || ''} onChange={handleChange} disabled={isEditing} />
            {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
            {isEditing && <small className="text-muted d-block">El correo no se puede modificar.</small>}
          </div>
        </div>
        {/* Contraseña */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Contraseña* {isEditing && '(Dejar en blanco para no cambiar)'}</label>
            <input type="password" className={`form-control ${errors.contrasena ? 'is-invalid' : ''}`} name="contrasena" value={formData.contrasena || ''} onChange={handleChange} />
            {errors.contrasena && <div className="invalid-feedback">{errors.contrasena}</div>}
          </div>
          <div className="col-md-6 mb-3">
            {(!isEditing || formData.contrasena) && (
              <>
                <label className="form-label">Confirmar Contraseña*</label>
                <input type="password" className={`form-control ${errors.confirmarContrasena ? 'is-invalid' : ''}`} name="confirmarContrasena" value={formData.confirmarContrasena || ''} onChange={handleChange} />
                {errors.confirmarContrasena && <div className="invalid-feedback">{errors.confirmarContrasena}</div>}
              </>
            )}
          </div>
        </div>
        {/* Dirección */}
        <div className="mb-3">
          <label className="form-label">Dirección* (Calle y Número)</label>
          <input type="text" className={`form-control ${errors.direccion ? 'is-invalid' : ''}`} name="direccion" value={formData.direccion || ''} onChange={handleChange} placeholder="Ej: Av. Siempreviva 123" />
          {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
        </div>
        {/* Región y Comuna */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Región*</label>
            <select className={`form-select ${errors.region ? 'is-invalid' : ''}`} name="region" value={formData.region || ''} onChange={handleRegionChange}>
              <option value="">Seleccione Región...</option>
              {regionesYComunas.map(region => (<option key={region.nombre} value={region.nombre}>{region.nombre}</option>))}
            </select>
            {errors.region && <div className="invalid-feedback">{errors.region}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Comuna*</label>
            <select className={`form-select ${errors.comuna ? 'is-invalid' : ''}`} name="comuna" value={formData.comuna || ''} onChange={handleChange} disabled={comunasDisponibles.length === 0}>
              <option value="">Seleccione Comuna...</option>
              {comunasDisponibles.map(comuna => (<option key={comuna} value={comuna}>{comuna}</option>))}
            </select>
            {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Tipo de Usuario (Rol)*</label>
          <select
            className="form-select"
            name="rol"
            value={formData.rol || 'cliente'} 
            onChange={handleChange}
          >
            <option value="cliente">Cliente (Comprador)</option>
            <option value="vendedor">Vendedor (Gestor)</option>
            <option value="admin">Administrador (Acceso Total)</option>
          </select>
          <small className="text-muted">
            Nota: El "Vendedor" tendrá permisos limitados, "Admin" tiene acceso total.
          </small>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="button">
            <i className={`fas ${isEditing ? 'fa-save' : 'fa-plus'} me-2`}></i>
            {isEditing ? 'Guardar Cambios' : 'Agregar Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { registrarUsuario, updateUsuario, deleteUsuario } from '../service/usuariosService';


function UserForm({ user, onSave, onCancel }) {
  //Inicializamos los datos
  const [formData, setFormData] = useState({
    id: user?.id || '',
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    rut: user?.rut || '',
    correo: user?.correo || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    region: user?.region || '',
    comuna: user?.comuna || '',
    rol: user?.rol?.nombre || user?.rol || 'CLIENTE', 
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.password && formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }
    
    onSave(formData);
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h4 className="mb-3">{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h4>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
            <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
                <label className="form-label">Apellido</label>
                <input className="form-control" name="apellido" value={formData.apellido} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
                <label className="form-label">RUT</label>
                <input className="form-control" name="rut" value={formData.rut} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
                <label className="form-label">Correo</label>
                <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
                <label className="form-label">Teléfono</label>
                <input className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>
            <div className="col-md-6">
                <label className="form-label">Rol</label>
                <select className="form-select" name="rol" value={formData.rol} onChange={handleChange}>
                    <option value="CLIENTE">Cliente</option>
                    <option value="VENDEDOR">Vendedor</option>
                    <option value="ADMIN">Administrador</option>
                </select>
            </div>
            
            <div className="col-12"><hr/></div>
            <div className="col-md-6">
                <label className="form-label">Contraseña {user && '(Dejar vacía para mantener)'}</label>
                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder={user ? "*******" : ""} required={!user} />
            </div>
            <div className="col-md-6">
                <label className="form-label">Confirmar Contraseña</label>
                <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required={!!formData.password} />
            </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="button">Guardar</button>
        </div>
      </form>
    </div>
  );
}

export default function GestionUsuarios({ usuarios, setUsuarios }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleSaveUser = async (userData) => {
    // Preparamos el objeto para enviar al backend
    // Ajustamos el rol para enviar el objeto completo si el backend lo requiere
    const usuarioParaGuardar = {
        ...userData,
        rol: { nombre: userData.rol }
    };

    try {
      if (editingUser) {
        // Editar (PUT)
        const actualizado = await updateUsuario(userData.id, usuarioParaGuardar);
        
        // Actualizamos la lista visual
        setUsuarios(usuarios.map(u => u.id === actualizado.id ? actualizado : u));
        alert("Usuario actualizado correctamente.");
      } else {
        const nuevo = await registrarUsuario(usuarioParaGuardar);
        setUsuarios([...usuarios, nuevo]);
        alert("Usuario creado correctamente.");
      }
      
      setIsFormVisible(false);
      setEditingUser(null);

    } catch (error) {
      console.error("Error al guardar:", error);
      const mensajeError = error.response?.data || error.message || "Error desconocido";
      alert("No se pudo guardar: " + mensajeError);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
        try {
            await deleteUsuario(id);
            setUsuarios(usuarios.filter(u => u.id !== id));
        } catch (error) {
            console.error(error);
            alert("Error al eliminar usuario.");
        }
    }
  };

  return (
    <div className="container-fluid px-0">
      {!isFormVisible && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="titulo">Gestión de Usuarios</h4>
          <button className="button btn-sm" onClick={() => { setEditingUser(null); setIsFormVisible(true); }}>
            <i className="fas fa-plus me-2"></i> Nuevo Usuario
          </button>
        </div>
      )}

      {isFormVisible && (
        <UserForm 
            user={editingUser} 
            onSave={handleSaveUser} 
            onCancel={() => { setIsFormVisible(false); setEditingUser(null); }} 
        />
      )}

      {!isFormVisible && (
        <div className="card shadow-sm">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.nombre} {u.apellido}</td>
                                    <td>{u.correo}</td>
                                    <td>
                                        <span className={`badge ${u.rol?.nombre === 'ADMIN' ? 'bg-danger' : u.rol?.nombre === 'VENDEDOR' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                            {u.rol?.nombre || u.rol}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-info me-2 text-white" onClick={() => { setEditingUser(u); setIsFormVisible(true); }}>
                                            Editar
                                        </button>
                                        <button className="btn btn-sm btn-rojo" onClick={() => handleDelete(u.id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
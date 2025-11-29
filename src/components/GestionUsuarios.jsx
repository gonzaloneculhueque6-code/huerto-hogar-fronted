import React, { useState } from 'react';
import AgregarModificar from './AgregarModificar';
import '../styles/estilo.css';

import { registrarUsuario, updateUsuario, deleteUsuario } from '../service/usuariosService';

export default function GestionUsuarios({ usuarios = [], setUsuarios }) {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // --- GUARDAR USUARIO EN BD ---
  const handleSaveUser = async (userData) => {
    
    // Preparamos el objeto para Java
    const usuarioParaBackend = {
        nombre: userData.nombre,
        apellido: userData.apellidos, 
        rut: userData.rut,
        correo: userData.correo,
        password: userData.contrasena,
        direccion: userData.direccion,
        telefono: userData.telefono,
        region: userData.region,
        comuna: userData.comuna,
        
        rol: userData.rol || 'cliente' 
    };
    // Para depurar
    console.log("Enviando al backend:", usuarioParaBackend); 

    try {
        const esEdicion = usuarios.some(u => u.correo === userData.correo);
        let usuarioGuardado;

        if (esEdicion && editingUser && editingUser.id) {
            // EDITAR
            usuarioGuardado = await updateUsuario(editingUser.id, usuarioParaBackend);
            setUsuarios(usuarios.map(u => u.id === usuarioGuardado.id ? usuarioGuardado : u));
            alert(`Usuario "${usuarioGuardado.nombre}" actualizado.`);

        } else {
            // CREAR
            usuarioGuardado = await registrarUsuario(usuarioParaBackend);
            setUsuarios([...usuarios, usuarioGuardado]);
            alert(`Usuario "${usuarioGuardado.nombre}" creado.`);
        }

        setIsFormVisible(false);
        setEditingUser(null);

    } catch (error) {
        console.error("Error al guardar usuario:", error);
        alert("Error al guardar. Puede que el correo ya exista.");
    }
  };

  // --- ELIMINAR USUARIO EN BD ---
  const handleDeleteUsuario = async (usuario) => {
    if (usuario.correo === 'admin@huerto.cl' || usuario.rol?.nombre === 'ADMIN') {
       alert("No puedes eliminar al Super Admin.");
       return;
    }

    if (window.confirm(`¿Eliminar a ${usuario.nombre}?`)) {
        try {
            await deleteUsuario(usuario.id);
            setUsuarios(usuarios.filter(u => u.id !== usuario.id));
            alert('Usuario eliminado.');
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Error al eliminar usuario.");
        }
    }
  };

  const handleAddClick = () => {
    setEditingUser({
      correo: '', nombre: '', apellidos: '', rut: '', contrasena: '',
      direccion: '', telefono: '', region: '', comuna: '', rol: 'cliente'
    });
    setIsFormVisible(true);
  };

  const handleEditClick = (userToEdit) => {
    setEditingUser({ 
        ...userToEdit, 
        apellidos: userToEdit.apellido || userToEdit.apellidos,
        contrasena: '', 
        confirmarContrasena: '',
        // Rol 
        rol: typeof userToEdit.rol === 'object' ? userToEdit.rol.nombre.toLowerCase() : userToEdit.rol
    });
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingUser(null);
  };

  return (
    <div className="container-fluid px-0">
      
      {!isFormVisible && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Gestión de Usuarios</h4>
          <button className="button btn-sm" onClick={handleAddClick}>
            Agregar Usuario
          </button>
        </div>
      )}

      {isFormVisible && (
        <AgregarModificar
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={handleCancelForm}
          allUsers={usuarios}
        />
      )}

      {!isFormVisible && (
        <div className="card shadow-sm mt-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th className="text-center">Acciones (Modificar / Eliminar)</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.nombre}</td>
                      <td>{u.apellido || u.apellidos}</td>
                      <td>{u.correo}</td>
                      <td>
                        {(() => {
                            const r = typeof u.rol === 'object' ? u.rol?.nombre : u.rol;
                            const rolStr = String(r || '').toUpperCase();
                            
                            if(rolStr === 'ADMIN') return <span className="badge bg-primary">Admin</span>;
                            if(rolStr === 'VENDEDOR') return <span className="badge bg-warning text-dark">Vendedor</span>;
                            return <span className="badge bg-secondary">Cliente</span>;
                        })()}
                      </td>
                    
                      <td className="text-center">
                        <button 
                            className="btn btn-sm btn-info me-2 text-white" 
                            onClick={() => handleEditClick(u)}
                        >
                            Modificar
                        </button>
                        <button 
                            className="btn-rojo btn-sm" 
                            onClick={() => handleDeleteUsuario(u)}
                        >
                            Eliminar
                        </button>
                      </td>

                    </tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr><td colSpan="5" className="text-center p-3">No hay usuarios registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
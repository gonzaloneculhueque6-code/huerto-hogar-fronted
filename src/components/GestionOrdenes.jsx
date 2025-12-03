import React, { useState } from 'react';
import '../styles/admin.css';
import '../styles/estilo.css';
import { actualizarEstadoOrden } from '../service/ordenService';

export default function GestionOrdenes({ ordenes = [], setOrdenes }) {

  const [filtroEstado, setFiltroEstado] = useState('Todos');

  
  const listaSegura = Array.isArray(ordenes) ? ordenes : [];

  const handleStatusChange = async (orderId, newStatus) => {
    if (window.confirm(`¿Está seguro de cambiar el estado de la orden #${orderId} a "${newStatus}"?`)) {
      try {
        //Llamada al Backend (PATCH)
        await actualizarEstadoOrden(orderId, newStatus);

        //Actualizar visualmente la lista local
        setOrdenes(prevOrdenes =>
          prevOrdenes.map(o =>
            o.id === orderId ? { ...o, estado: newStatus } : o
          )
        );
      } catch (error) {
        console.error("Error actualizando estado:", error);
        alert("Error al actualizar el estado en el servidor.");
      }
    }
  };

  const ordenesFiltradas = listaSegura
    .filter(orden => {
      if (filtroEstado === 'Todos') return true;
      return orden.estado === filtroEstado;
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  
  const contarEstado = (estado) => listaSegura.filter(o => o.estado === estado).length;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
        <h2 className="mb-0 titulo me-3">Gestión de Órdenes</h2>

        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn ${filtroEstado === 'Todos' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroEstado('Todos')}
          >
            Todas ({ordenes.length})
          </button>
          <button
            type="button"
            className={`btn ${filtroEstado === 'Pendiente' ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroEstado('Pendiente')}
          >
            Pendientes ({contarEstado('Pendiente')})
          </button>
          <button
            type="button"
            className={`btn ${filtroEstado === 'Enviado' ? 'btn-info' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroEstado('Enviado')}
          >
            Enviadas ({contarEstado('Enviado')})
          </button>
          <button
            type="button"
            className={`btn ${filtroEstado === 'Completado' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroEstado('Completado')}
          >
            Completadas ({contarEstado('Completado')})
          </button>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">

          <table className="table table-hover mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th>Cliente (Email)</th>
                <th>Total</th>
                <th className='text-center'>Estado</th>
                <th className='text-center' style={{ minWidth: '200px' }}>Cambiar Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted p-3">
                    {filtroEstado === 'Todos'
                      ? 'No hay órdenes para mostrar.'
                      : `No hay órdenes con el estado "${filtroEstado}".`
                    }
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map(orden => (
                  <tr key={orden.id}>
                    <td>
                      {orden.usuario ? (
                        <div>
                          <strong>{orden.usuario.nombre} {orden.usuario.apellido}</strong>
                          <br />
                          <small className="text-muted">{orden.usuario.correo}</small>
                        </div>
                      ) : 'Usuario desconocido'}
                    </td>

                    <td>${Number(orden.total).toLocaleString('es-CL')}</td>

                    <td className='text-center'>
                      <span className={`badge ${orden.estado === 'Pendiente' ? 'bg-warning text-dark' :
                          orden.estado === 'Enviado' ? 'bg-info' :
                            orden.estado === 'Completado' ? 'bg-success' :
                              'bg-secondary'
                        }`}>
                        {orden.estado}
                      </span>
                    </td>
                    <td className="text-center">
                      <select
                        className="form-select form-select-sm d-inline-block w-auto"
                        value={orden.estado}
                        onChange={(e) => handleStatusChange(orden.id, e.target.value)}
                        
                        disabled={orden.estado === 'Cancelado'}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Completado">Completado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))
                
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
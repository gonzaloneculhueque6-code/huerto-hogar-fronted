import React from 'react';

export default function Reportes({ productos = [], usuarios = [], ordenes = [] }) {

  // Calcular Ingresos Totales 
  const ingresosTotales = ordenes
    .filter(o => o.estado !== 'Cancelado') 
    .reduce((total, orden) => total + Number(orden.total), 0);

  // Contar Órdenes por Estado
  const porEstado = {
    Pendiente: ordenes.filter(o => o.estado === 'Pendiente').length,
    Enviado: ordenes.filter(o => o.estado === 'Enviado').length,
    Completado: ordenes.filter(o => o.estado === 'Completado').length,
    Cancelado: ordenes.filter(o => o.estado === 'Cancelado').length,
  };

  // Productos con Stock Crítico
  const stockCritico = productos.filter(p => p.stock <= p.criticalStock);

  return (
    <div className="container-fluid px-0">
      <h2 className="titulo mb-4">Reportes y Estadísticas</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3 shadow-sm">
            <div className="card-header">Ingresos Totales (Histórico)</div>
            <div className="card-body">
              <h3 className="card-title">${ingresosTotales.toLocaleString('es-CL')}</h3>
              <p className="card-text">Suma de ventas no canceladas.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-dark bg-warning mb-3 shadow-sm">
            <div className="card-header">Pedidos Pendientes</div>
            <div className="card-body">
              <h3 className="card-title">{porEstado.Pendiente}</h3>
              <p className="card-text">Órdenes que requieren atención.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3 shadow-sm">
            <div className="card-header">Productos Stock Crítico</div>
            <div className="card-body">
              <h3 className="card-title">{stockCritico.length}</h3>
              <p className="card-text">Productos por agotar.</p>
            </div>
          </div>
        </div>
      </div>
      {stockCritico.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-danger text-white">
            <h5 className="mb-0">Alerta de Stock</h5>
          </div>
          <div className="card-body p-0">
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock Actual</th>
                  <th>Mínimo Permitido</th>
                </tr>
              </thead>
              <tbody>
                {stockCritico.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="fw-bold text-danger">{p.stock}</td>
                    <td>{p.criticalStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="card shadow-sm">
        <div className="card-header">
            <h5 className="mb-0">Desglose de Órdenes</h5>
        </div>
        <div className="card-body">
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Pendientes
                    <span className="badge bg-warning text-dark rounded-pill">{porEstado.Pendiente}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Enviados
                    <span className="badge bg-info rounded-pill">{porEstado.Enviado}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Completados
                    <span className="badge bg-success rounded-pill">{porEstado.Completado}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Cancelados
                    <span className="badge bg-secondary rounded-pill">{porEstado.Cancelado}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
                    TOTAL PEDIDOS
                    <span className="badge bg-primary rounded-pill">{ordenes.length}</span>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
}
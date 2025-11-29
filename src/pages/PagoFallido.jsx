import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function PagoFallido() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pedidoFallido, setPedidoFallido] = useState(null);
  const [mensajeError, setMensajeError] = useState('');
  const [numeroPedido, setNumeroPedido] = useState('');

  useEffect(() => {
    const generateOrderAttemptNumber = () => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const time = date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0');
      return `#${year}${month}${day}${time}`;
    };

    if (location.state) {
      setPedidoFallido(location.state);
      setNumeroPedido(generateOrderAttemptNumber());

      if (location.state.errorType === 'notLoggedIn') {
        setMensajeError('No se pudo procesar el pago. Debes iniciar sesión o registrarte para completar la compra.');
      } else if (location.state.errorType === 'paymentFailed') {
        setMensajeError('Hubo un problema con el proceso de pago. Por favor, intenta de nuevo.');
      } else {
        setMensajeError('No se pudo realizar el pago por un error desconocido.');
      }

    } else {
      navigate('/productos');
      alert('Acceso inválido a la página de pago fallido. Intenta de nuevo.');
    }
  }, [location.state, navigate]);

  if (!pedidoFallido) {
    return (
      <div className="container my-5 text-center">
        <h2>Cargando información del error...</h2>
        <p>Si no se carga, <Link to="/productos">vuelve a la tienda</Link>.</p>
      </div>
    );
  }

  const formData = pedidoFallido.formData || {};
  const carritoItems = pedidoFallido.carrito || [];
  const totalPagado = pedidoFallido.total || 0;


  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <i className="fas fa-times-circle text-danger mb-3" style={{ fontSize: '3rem' }}></i>
          <h2 className="text-danger mb-3">No se pudo realizar el pago. nro {numeroPedido}</h2>
          <p className="text-danger fw-bold">{mensajeError}</p>
        </div>
        <div className="d-grid gap-2 mb-4">
          {pedidoFallido.errorType === 'notLoggedIn' ? (
            <Link to="/login" className="btn btn-primary btn-lg">Iniciar Sesión para Pagar</Link>
          ) : (
            <Link to="/carrito" className="btn btn-success btn-lg">VOLVER A REALIZAR EL PAGO</Link>
          )}
        </div>


        <div className="mb-4">
          <h5 className="border-bottom pb-2 mb-3">Detalle del intento de compra</h5>
          <div className="row">
            <div className="col-md-4 mb-2">
              <label className="form-label form-label-sm fw-bold">Nombre:</label>
              <input type="text" className="form-control form-control-sm" value={formData.nombre || 'N/A'} readOnly />
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label form-label-sm fw-bold">Apellido:</label>
              <input type="text" className="form-control form-control-sm" value={formData.apellidos || 'N/A'} readOnly />
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label form-label-sm fw-bold">Correo:</label>
              <input type="text" className="form-control form-control-sm" value={formData.correo || 'N/A'} readOnly />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="border-bottom pb-2 mb-3">Dirección de entrega de los productos</h5>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label form-label-sm fw-bold">Calle:</label>
              <input type="text" className="form-control form-control-sm" value={formData.calle || 'N/A'} readOnly />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label form-label-sm fw-bold">Departamento (opcional):</label>
              <input type="text" className="form-control form-control-sm" value={formData.departamento || 'N/A'} readOnly />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label form-label-sm fw-bold">Región:</label>
              <input type="text" className="form-control form-control-sm" value={formData.region || 'N/A'} readOnly />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label form-label-sm fw-bold">Comuna:</label>
              <input type="text" className="form-control form-control-sm" value={formData.comuna || 'N/A'} readOnly />
            </div>
            <div className="col-12 mb-2">
              <label className="form-label form-label-sm fw-bold">Indicaciones (opcional):</label>
              <textarea className="form-control form-control-sm" rows="2" value={formData.indicaciones || 'Ninguna'} readOnly></textarea>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h5 className="border-bottom pb-2 mb-3">Productos en el intento de compra</h5>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th className="text-end">Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {carritoItems.length > 0 ? (
                  carritoItems.map((item) => (
                    <tr key={item.id}>
                      <td><img src={`/assets/${item.imagen}`} alt={item.nombre} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '3px' }} /></td>
                      <td>{item.nombre}</td>
                      <td className="text-end">${(Number(item.precio) || 0).toLocaleString('es-CL')}</td>
                      <td className="text-center">{item.cantidad}</td>
                      <td className="text-end">${((Number(item.precio) || 0) * (Number(item.cantidad) || 0)).toLocaleString('es-CL')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No había productos en el carrito.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="d-flex justify-content-end mb-4">
          <div className="p-3 bg-light rounded shadow-sm">
            <h4 className="mb-0">Total del intento: ${totalPagado.toLocaleString('es-CL')}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
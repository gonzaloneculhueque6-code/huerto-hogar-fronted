import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function PagoExitoso() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [numeroPedido, setNumeroPedido] = useState('');
  
  const haGuardadoRef = useRef(false);

  useEffect(() => {
    const generateOrderNumber = () => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const time = date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0');
      return `#${year}${month}${day}${time}`;
    };

    if (location.state && !haGuardadoRef.current) {
      const datosDelPedido = location.state;
      setPedido(datosDelPedido);
      setNumeroPedido(generateOrderNumber());

      try {
        const ordenesActuales = JSON.parse(localStorage.getItem('ordenes') || '[]');
        const nuevaOrden = {
          id: `ORD-${Date.now()}`,
          fecha: new Date().toISOString(),
          clienteEmail: datosDelPedido.formData.correo,
          estado: 'Pendiente',
          items: datosDelPedido.carrito.map(item => ({
            id: item.id,
            name: item.nombre,
            price: Number(item.precio || 0),
            quantity: Number(item.cantidad || 0)
          }))
        };
        const ordenesActualizadas = [...ordenesActuales, nuevaOrden];
        localStorage.setItem('ordenes', JSON.stringify(ordenesActualizadas));
        
        haGuardadoRef.current = true;
        console.log('¡Orden guardada exitosamente en localStorage!');

      } catch (error) {
        console.error("Error al guardar la nueva orden:", error);
      }

    } else if (!location.state) {
      navigate('/productos');
      alert('Acceso inválido a la página de pago exitoso. Intenta de nuevo.');
    }
  }, [location.state, navigate]); 

  
  if (!pedido) {
    return (
      <div className="container my-5 text-center">
        <h2>Cargando información del pedido...</h2>
        <p>Si no se carga, <Link to="/productos">vuelve a la tienda</Link>.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '3rem' }}></i>
          <h2 className="text-success mb-3">Se ha realizado la compra. nro {numeroPedido}</h2>
          <p className="text-muted">¡Gracias por tu compra! Tu pedido ha sido procesado exitosamente.</p>
        </div>

        
        <div className="mb-4">
          <h5 className="border-bottom pb-2 mb-3">Detalles del Cliente</h5>
          <div className="row">
            <div className="col-md-4 mb-2">
              <label className="form-label form-label-sm fw-bold">Nombre:</label>
              <input type="text" className="form-control form-control-sm" value={pedido.formData.nombre} readOnly />
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label form-label-sm fw-bold">Apellido:</label>
              <input type="text" className="form-control form-control-sm" value={pedido.formData.apellidos} readOnly />
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label form-label-sm fw-bold">Correo:</label>
              <input type="text" className="form-control form-control-sm" value={pedido.formData.correo} readOnly />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="border-bottom pb-2 mb-3">Dirección de entrega de los productos</h5>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label form-label-sm fw-bold">Calle:</label>
              <input type="text" className="form-control form-control-sm" value={pedido.formData.calle} readOnly />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label form-label-sm fw-bold">Departamento (opcional):</label>
              <input type="text" className="form-control form-control-sm" value={pedido.formData.departamento || 'N/A'} readOnly />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label form-label-sm fw-bold">Región:</label>
              <input type="text" className="form-control form-control-sm" value={pedido.formData.region} readOnly />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label form-label-sm fw-bold">Comuna:</label>
              <input type="text" className="form-control form-control-sm" value={pedido.formData.comuna} readOnly />
            </div>
            <div className="col-12 mb-2">
              <label className="form-label form-label-sm fw-bold">Indicaciones (opcional):</label>
              <textarea className="form-control form-control-sm" rows="2" value={pedido.formData.indicaciones || 'Ninguna'} readOnly></textarea>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="border-bottom pb-2 mb-3">Productos comprados</h5>
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
                {pedido.carrito.map((item) => (
                  <tr key={item.id}>
                    <td><img src={`/assets/${item.imagen}`} alt={item.nombre} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '3px' }} /></td>
                    <td>{item.nombre}</td>
                    <td className="text-end">${(Number(item.precio) || 0).toLocaleString('es-CL')}</td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end">${((Number(item.precio) || 0) * (Number(item.cantidad) || 0)).toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-4">
          <div className="p-3 bg-light rounded shadow-sm">
            <h4 className="mb-0">Total pagado: ${pedido.total.toLocaleString('es-CL')}</h4>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-danger"><i className="fas fa-file-pdf me-2"></i>Imprimir boleta en PDF</button>
          <button className="btn btn-success"><i className="fas fa-envelope me-2"></i>Enviar boleta por email</button>
        </div>
      </div>
    </div>
  );
  
} 
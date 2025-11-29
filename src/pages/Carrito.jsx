import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import regionesYComunas from '../data/regionComuna.js';
import { crearOrden } from '../service/ordenService'; 

export default function Carrito({ user }) {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  //Estados del Formulario de Pago
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', correo: '', calle: '', departamento: '',
    region: 'Metropolitana de Santiago', comuna: '', indicaciones: ''
  });
  const [comunasDisponibles, setComunasDisponibles] = useState([]);

  const sync = () => {
    const cartData = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(cartData);
  };

  useEffect(() => {
    //Carga carrito
    const cartData = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(cartData);

    //Carga comunas iniciales
    const regionPorDefecto = regionesYComunas.find(r => r.nombre === formData.region);
    if (regionPorDefecto) {
      setComunasDisponibles(regionPorDefecto.comunas);
    }
    if (user) {
      console.log("Usuario cargado en carrito:", user);
      setFormData(prevData => ({
        ...prevData,
        nombre: user.nombre || '',
        apellidos: user.apellido || user.apellidos || '', 
        correo: user.correo || '',
      }));
    } else {
      setFormData(prevData => ({
        nombre: '', apellidos: '', correo: '', calle: '', departamento: '',
        region: prevData.region, comuna: '', indicaciones: ''
      }));
    }

  }, [user]);

  const guardar = (arr) => {
    const carritoFiltrado = arr.filter(item => item.cantidad > 0);
    localStorage.setItem('carrito', JSON.stringify(carritoFiltrado));
    setCarrito(carritoFiltrado);
    window.dispatchEvent(new Event('storage'));
  };
  const inc = (id) => {
    const c = [...carrito];
    const i = c.findIndex(x => x.id === id);
    if (i >= 0) { c[i].cantidad = (c[i].cantidad || 0) + 1; guardar(c); }
  };
  const dec = (id) => {
    let c = [...carrito];
    const i = c.findIndex(x => x.id === id);
    if (i >= 0 && c[i].cantidad > 0) { c[i].cantidad -= 1; guardar(c); }
  };
  const delItem = (id) => {
    if (window.confirm('¿Quitar este producto?')) guardar(carrito.filter(x => x.id !== id));
  };
  const vaciar = () => {
    if (window.confirm('¿Vaciar carrito?')) guardar([]);
  };

  const total = carrito.reduce((s, i) => s + (Number(i.precio) || 0) * (Number(i.cantidad) || 0), 0);

  const handleRegionChange = (e) => {
    const regionNombre = e.target.value;
    setFormData(prev => ({ ...prev, region: regionNombre, comuna: '' }));
    const regionEncontrada = regionesYComunas.find(r => r.nombre === regionNombre);
    setComunasDisponibles(regionEncontrada ? regionEncontrada.comunas : []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión o registrarte para completar la compra.');
      return;
    }
    
    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '[]');
    if (carritoActual.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    
    if (!formData.comuna && comunasDisponibles.length > 0) {
      alert('Por favor, seleccione una comuna.');
      return;
    }
    
    //Envios al backend
    const compraPayload = {
        idUsuario: user.id, 
        total: total,
        calle: formData.calle,
        comuna: formData.comuna,
        region: formData.region,
        indicaciones: formData.indicaciones || '',
        //Items del carrito
        items: carritoActual.map(item => ({
            idProducto: item.id,
            cantidad: parseInt(item.cantidad),
            precio: parseFloat(item.precio)
        }))
    };

    console.log("Enviando compra al backend:", compraPayload);

    try {
        //Llamada al backend
        const ordenCreada = await crearOrden(compraPayload);
        
        console.log("Respuesta exitosa:", ordenCreada);
        
        //Limpieza
        localStorage.removeItem('carrito');
        window.dispatchEvent(new Event('storage'));
        sync();

        navigate('/pagoexitoso', {
            state: {
                formData: formData, // Para mostrar datos del cliente
                carrito: carritoActual, // Para mostrar items
                total: total,
                ordenId: ordenCreada.id // ID real de la BD
            }
        });

    } catch (error) {
        console.error("Error detallado al comprar:", error);
        // Mostrar alerta con el error real del servidor si existe
        let mensajeErrorBackend = "Error desconocido";
        if (error.response && error.response.data) {
            //A veces Spring devuelve un JSON con "message" o texto plano
            mensajeErrorBackend = error.response.data.message || JSON.stringify(error.response.data);
        }
        
        alert(`No se pudo procesar el pago.\nServidor dice: ${mensajeErrorBackend}`);

        navigate('/pagofallido', {
            state: {
                formData: formData,
                carrito: carritoActual,
                total: total,
                errorType: 'paymentFailed'
            }
        });
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos antes de proceder al pago.</p>
        <Link to="/productos" className="button mt-3">Ver Productos</Link>
      </div>
    );
  }

  return (
    <div className="container container-lg my-5">
      <h1 className="titulo text-center mb-4">Mi carrito y Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="row g-5">
          <div className="col-lg-7">
            <h3>Productos en tu carrito</h3>
            {carrito.map(item => (
              <div key={item.id} className="cart-item d-flex justify-content-between align-items-center border-bottom py-3">
                <div className="d-flex align-items-center">
                  <img src={`/assets/${item.imagen}`} alt={item.nombre} style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 15, borderRadius: '4px' }} />
                  <div>
                    <strong>{item.nombre}</strong><br />
                    <small className="text-muted">Precio: ${(Number(item.precio) || 0).toLocaleString('es-CL')}</small>
                  </div>
                </div>
                <div className="text-end">
                  <span className="fw-bold d-block mb-1">${((Number(item.precio) || 0) * (Number(item.cantidad) || 0)).toLocaleString('es-CL')}</span>
                  <div className="input-group input-group-sm mt-1" style={{ maxWidth: 110 }}>
                    <button type="button" className="btn btn-outline-secondary px-2" onClick={() => dec(item.id)}>-</button>
                    <input className="form-control text-center px-1" value={item.cantidad} readOnly />
                    <button type="button" className="btn btn-outline-secondary px-2" onClick={() => inc(item.id)}>+</button>
                  </div>
                  <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={() => delItem(item.id)}><i className="fas fa-times"></i></button>
                </div>
              </div>
            ))}
            <div className="text-end mt-3"><button type="button" onClick={vaciar} className="btn btn-outline-secondary btn-sm">Vaciar Carrito</button></div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm p-3 position-sticky" style={{ top: '20px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <h4 className="mb-0">TOTAL:</h4>
                <h4 className="mb-0 text-success fw-bold">${total.toLocaleString('es-CL')}</h4>
              </div>

              <h5 className="mt-2">Información del cliente</h5>
              {!user && <div className="alert alert-info py-1 px-2 mb-2"><Link to="/login">Inicia sesión</Link> para pagar.</div>}
              
              <div className="row gx-2">
                <div className="col-md-6 mb-2">
                  <label className="form-label form-label-sm">Nombre*</label>
                  <input type="text" className="form-control form-control-sm" name="nombre" value={formData.nombre} onChange={handleChange} required disabled={!!user} />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label form-label-sm">Apellidos*</label>
                  <input type="text" className="form-control form-control-sm" name="apellidos" value={formData.apellidos} onChange={handleChange} required disabled={!!user} />
                </div>
                <div className="col-12 mb-2">
                  <label className="form-label form-label-sm">Correo*</label>
                  <input type="email" className="form-control form-control-sm" name="correo" value={formData.correo} onChange={handleChange} required disabled={!!user} />
                </div>
              </div>

              <h5 className="mt-3">Dirección de entrega</h5>
              <div className="mb-2">
                <label className="form-label form-label-sm">Calle*</label>
                <input type="text" className="form-control form-control-sm" name="calle" value={formData.calle} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label form-label-sm">Depto</label>
                <input type="text" className="form-control form-control-sm" name="departamento" value={formData.departamento} onChange={handleChange} />
              </div>
              <div className="row gx-2">
                <div className="col-md-6 mb-2">
                  <label className="form-label form-label-sm">Región*</label>
                  <select className="form-select form-select-sm" name="region" value={formData.region} onChange={handleRegionChange} required>
                    {regionesYComunas.map((region) => (<option key={region.nombre} value={region.nombre}>{region.nombre}</option>))}
                  </select>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label form-label-sm">Comuna*</label>
                  <select className="form-select form-select-sm" name="comuna" value={formData.comuna} onChange={handleChange} required disabled={comunasDisponibles.length === 0}>
                    <option value="">Seleccione...</option>
                    {comunasDisponibles.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label form-label-sm">Indicaciones</label>
                <textarea className="form-control form-control-sm" name="indicaciones" value={formData.indicaciones} onChange={handleChange} rows="2"></textarea>
              </div>

              <div className="d-grid gap-2 mt-4">
                <button type="submit" className="button btn-lg" disabled={!user}>Pagar Ahora</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
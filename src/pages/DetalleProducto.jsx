import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';


//Recibimos productos como prop
export default function DetalleProducto({ productos }){
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);

  

  // Buscamos el producto directamente en los props 'productos'
  const producto = useMemo(() => productos.find(p => p.id === id), [productos, id]);

  
  const add = () => {
    if(!producto) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')||'[]');
    const encontrado = carrito.find(i=>i.id===producto.id);
    const cantidadEnCarrito = encontrado ? encontrado.cantidad : 0;
    
    //Validamos que la cantidad a añadir no exceda el stock
    const cantidadAAgregar = parseInt(cantidad) || 1; 
    if (cantidadEnCarrito + cantidadAAgregar > producto.stock) {
      alert(`No hay suficiente stock. Solo quedan ${producto.stock - cantidadEnCarrito} unidades disponibles.`);
      return; 
    }

    //Agregar o incrementar
    if(encontrado){
      encontrado.cantidad += cantidadAAgregar;
    } else {
      //Formatear objeto para el carrito
      carrito.push({
        id: producto.id,
        nombre: producto.name,       
        precio: producto.price,      
        imagen: producto.image,     
        descripcion: producto.description, 
        cantidad: cantidadAAgregar
      });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`Has añadido ${cantidadAAgregar} unidad(es) de ${producto.name} al carrito.`); 
    window.dispatchEvent(new Event('storage'));
  };

  //Manejo si el producto no se encuentra
  if(!producto) {
    return (
      <div className="container text-center">
        <h2 className="titulo mt-5">Producto no encontrado</h2>
        <p>El ID "{id}" no corresponde a ningún producto.</p>
        <Link to="/productos" className="btn btn-primary">Volver a Productos</Link>
      </div>
    );
  }
  //Productos relacionados
  const relacionados = productos.filter(p => p.category === producto.category && p.id !== producto.id);

  //Ajustar cantidad si el valor ingresado supera el stock disponible
  const handleCantidadChange = (e) => {
    let nuevaCantidad = parseInt(e.target.value) || 1;
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    if (nuevaCantidad > producto.stock) nuevaCantidad = producto.stock;
    setCantidad(nuevaCantidad);
  };

  return (
    <div className="container">
      <nav className="mb-3">
        <Link className="enlaces" to="/productos">{producto.category || 'Categoría'}</Link> &gt; <span>{producto.name || 'Producto'}</span>
      </nav>

      <div className="row">
        <div className="col-md-6">
          <img src={`/assets/${producto.image || 'default.png'}`} className="img-fluid border" alt={producto.name} />
        </div>
        <div className="col-md-6">
          <h2><span>{producto.name}</span> <span className="text-success">${producto.price?.toLocaleString('es-CL') ?? 'N/A'}</span> CLP</h2>
          <p>{producto.description}</p>
          <p><strong>Stock disponible:</strong> {producto.stock} unidades</p>

          <div className="mb-3">
            <label className="form-label">Cantidad</label>
            <input 
              type="number" 
              min="1" 
              max={producto.stock} 
              value={cantidad} 
              onChange={handleCantidadChange}
              className="form-control w-25"
              disabled={producto.stock <= 0} 
            />
          </div>
          <button onClick={add} disabled={producto.stock <= 0 || cantidad < 1}>
            {producto.stock > 0 ? 'Añadir al carrito' : 'Sin Stock'}
          </button>
        </div>
      </div>

      <section className="mt-5">
        <h4>Productos Relacionados</h4>
        <div className="d-flex gap-3 flex-wrap">
          {relacionados.map(r => (
            <Link key={r.id} to={`/detalle/${r.id}`}>
              <img src={`/assets/${r.image || 'default.png'}`} alt={r.name} className="img-thumbnail" style={{width:120}}/>
            </Link>
          ))}
          {relacionados.length === 0 && (
            <p className="text-muted">No hay otros productos en esta categoría.</p>
          )}
        </div>
      </section>
    </div>
  )
}
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Productos({ productos }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState(['Todas']); 

  // Validamos que productos sea un array seguro
  const listaSegura = Array.isArray(productos) ? productos : [];

  useEffect(() => {
    if (listaSegura.length > 0) {
      const allCats = listaSegura
        .map(p => p.category || p.categoria || 'Otros') 
        .filter(c => c); // eliminar nulos
      const uniqueCats = [...new Set(allCats)];
      setCategories(['Todas', ...uniqueCats.sort()]);
    }
  }, [productos]); 

  const filteredProducts = selectedCategory === 'Todas'
    ? listaSegura
    : listaSegura.filter(p => {
        const cat = p.category || p.categoria || 'Otros';
        return cat === selectedCategory;
      });

  // Manejo si no hay productos
  if (!Array.isArray(productos) || productos.length === 0) {
    return (
      <div className="container text-center my-5">
         <div className="spinner-border text-success mb-3" role="status"></div>
         <p className="text-muted">Cargando catálogo...</p>
      </div>
    );
  }

  const agregar = (p) => {
    //Normalizamos los datos para guardarlos en el carrito siempre igual
    const productoParaCarrito = {
        id: p.id,
        nombre: p.name || p.nombre || 'Producto',
        precio: Number(p.price || p.precio || 0),
        imagen: p.image || p.imagen || p.imagenUrl || 'default.png',
        descripcion: p.description || p.descripcion || '',
        stock: Number(p.stock || 0)
    };

    if (productoParaCarrito.stock <= 0) {
      alert("Error: Producto sin stock.");
      return;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const itemEnCarrito = carrito.find(i => i.id === productoParaCarrito.id);
    
    if (itemEnCarrito) {
       if (itemEnCarrito.cantidad >= productoParaCarrito.stock) {
          alert(`No hay más stock disponible para "${productoParaCarrito.nombre}".`);
          return;
       }
       itemEnCarrito.cantidad += 1;
    } else {
       carrito.push({ ...productoParaCarrito, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${productoParaCarrito.nombre} agregado al carrito.`);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="container">
      <h1 className="text-center titulo my-4">PRODUCTOS</h1>
      <div className="text-center mb-5 categoria-filtros">
        {categories.map(category => (
          <button
            key={category}
            className={`btn mx-1 mb-2 ${selectedCategory === category ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <hr className="mb-5"/>

      <div className="row">
        {filteredProducts.map((p, index) => {
          if (!p) return null;
          const nombre = p.name || p.nombre || 'Producto sin nombre';
          const precio = Number(p.price || p.precio || 0);
          const imagen = p.image || p.imagen || p.imagenUrl || 'default.png';
          const categoria = p.category || p.categoria || 'General';
          const descripcion = p.description || p.descripcion || '';
          const stock = Number(p.stock || 0);

          return (
            <div className="col-md-3 mb-4" key={p.id || `product-${index}`}>
              <div className="card h-100 shadow-sm border-0">
                <div style={{ height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
                    <img 
                        src={`/assets/${imagen}`} 
                        className="card-img-top" 
                        alt={nombre}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Sin+Imagen'} 
                    />
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="titulo fs-6">{nombre}</h5>
                  <span className="badge bg-light text-dark border mb-2 align-self-start">{categoria}</span>
                  <p className="desc_prod_text_sec small text-truncate">{descripcion}</p>
                  
                  <div className="mt-auto">
                    <p className="fw-bold text-success fs-5 mb-1">
                        ${precio.toLocaleString('es-CL')}
                    </p>
                    
                    <div className="d-grid gap-2 d-md-flex mt-3">
                      {p.id && <Link to={`/detalle/${p.id}`} className="btn btn-outline-secondary btn-sm flex-grow-1">Ver</Link>}
                      
                      <button 
                        onClick={() => agregar(p)} 
                        className={`btn btn-sm flex-grow-1 ${stock > 0 ? 'button' : 'btn-secondary'}`} 
                        disabled={stock <= 0}
                      >
                        {stock > 0 ? 'Añadir' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && selectedCategory !== 'Todas' && (
          <div className="col-12 text-center py-5">
             <h4 className="text-muted">No hay productos en la categoría "{selectedCategory}".</h4>
             <button className="btn btn-link" onClick={() => setSelectedCategory('Todas')}>Ver todos</button>
          </div>
        )}
      </div>
    </div>
  );
}
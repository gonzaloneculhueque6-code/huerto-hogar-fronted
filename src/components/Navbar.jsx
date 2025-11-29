import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
export default function Navbar({user, setUser}){
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => {
      const c = JSON.parse(localStorage.getItem('carrito')||'[]');
      const total = c.reduce((s,i)=>s + (i.cantidad||0), 0);
      setCartCount(total);
    }
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const handleLogout = () => {
    setUser(null); 
    alert('Sesión cerrada.'); 
    navigate('/'); 
  };
  console.log('APP: Estado user actual:', user);
  return (
    <div className="caja_titulo container-fluid text-center">
      <div className="row align-items-center">
        <div className="col-12 col-md-3 text-start">
          
          <h1 className="titulo m-0">■ Huerto Hogar</h1>
        </div>
        <div className="col-12 col-md-6 my-2 my-md-0">
          
          <NavLink to="/" className="enlaces mx-1">Home</NavLink> |
          <NavLink to="/productos" className="enlaces mx-1">Productos</NavLink> |
          <NavLink to="/nosotros" className="enlaces mx-1">Nosotros</NavLink> |
          <NavLink to="/blogs" className="enlaces mx-1">Blogs</NavLink> |
          <NavLink to="/contacto" className="enlaces mx-1">Contacto</NavLink>
    
           {user && user.rol === 'admin' && (
             <>
               <NavLink to="/administrador" className="enlaces mx-1 text-warning">Admin</NavLink>
             </>
           )}
        </div>
        <div className="col-12 col-md-3 text-md-end d-flex align-items-center justify-content-center justify-content-md-end">
          <Link to="/carrito" className="enlaces me-3">
            <img src="/assets/carrito.png" alt="Carrito" style={{height:24, marginRight:6}}/>
            Carrito (<span>{cartCount}</span>)
          </Link>
          {user ? (
            <>
              <span className="texto_pric me-2">Hola, {user.nombre || 'Usuario'}</span>
              
              <button onClick={handleLogout} className="button btn-sm "> 
                Cerrar Sesión
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
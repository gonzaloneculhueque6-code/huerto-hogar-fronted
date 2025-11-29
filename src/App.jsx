import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/estilo.css';

import { getProductos } from './service/productService';
// Componentes
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
// Páginas
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Blogs from './pages/Blogs.jsx';
import Contacto from './pages/Contacto.jsx';
import Carrito from './pages/Carrito.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Administrador from './pages/Administrador.jsx';
import PagoExitoso from './pages/PagoExitoso';
import PagoFallido from './pages/PagoFallido';

export default function App() {
  // Estados Globales
  const [user, setUser] = useState(null);
  const [productos, setProductos] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Persistencia de Sesión
  // Recupera al usuario si recargamos la página para no perder el login
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioGuardado) {
      setUser(JSON.parse(usuarioGuardado));
    }
  }, []);

  //Cargar Productos desde Backend (Usando Service)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getProductos();
        console.log("Productos cargados:", data);
        setProductos(data);
      } catch (error) {
        console.error("Error conectando con el backend:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  //Lógica para ocultar Navbar en el panel de admin
  const location = useLocation();
  const isAdminRoute = location.pathname === '/administrador';


  const tienePermisoAdmin = () => {
    if (!user || !user.rol) return false;
    const nombreRol = user.rol.nombre || user.rol; 
    const rolUpper = String(nombreRol).toUpperCase();
    return rolUpper === 'ADMIN' || rolUpper === 'VENDEDOR';
  };

  // Pantalla de carga simple
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fondo_prin d-flex flex-column min-vh-100">
      
      {/* Navbar se oculta en Admin */}
      {!isAdminRoute && <Navbar user={user} setUser={setUser} />}

      <main className="flex-grow-1">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contacto" element={<Contacto />} />
          
          {/* Tienda */}
          <Route path="/productos" element={<Productos productos={productos} />} />
          <Route path="/detalle/:id" element={<DetalleProducto productos={productos} />} />

          {/* Transaccionales */}
          <Route path="/carrito" element={<Carrito user={user} />} />
          <Route path="/pagoexitoso" element={<PagoExitoso />} />
          <Route path="/pagofallido" element={<PagoFallido />} />

          {/* Autenticación */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/registro" element={<Registro />} />

          {/* Ruta Protegida (Admin y Vendedor) */}
          <Route
            path="/administrador"
            element={
              tienePermisoAdmin() 
                ? (
                  <Administrador
                    user={user}
                    setUser={setUser}
                    productos={productos}      
                    // Para actualizar lista al crear/editar/eliminar
                    setProductos={setProductos} 
                  />
                ) 
                : <Navigate to="/login" replace />
            }
          />
          {/* 404 Not Found */}
          <Route path="*" element={<div className="text-center my-5"><h1>404 - Página no encontrada</h1></div>} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
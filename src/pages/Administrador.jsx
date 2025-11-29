import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';

import { getUsuarios } from '../service/usuariosService';
import { getTodasLasOrdenes } from '../service/ordenService';
import InventarioAdmin from '../components/InventarioAdmin.jsx';
import GestionUsuarios from '../components/GestionUsuarios.jsx';
import GestionOrdenes from '../components/GestionOrdenes.jsx';
import Reportes from '../components/Reportes.jsx';
import ConfiguracionPerfil from '../components/ConfiguracionPerfil.jsx';

import '../styles/admin.css';
import '../styles/estilo.css';

export default function Administrador({ user, setUser, productos, setProductos }) {
  const navigate = useNavigate();

  //Detección de Rol
  const rolNombre = user?.rol?.nombre || user?.rol || '';
  const esAdmin = String(rolNombre).toUpperCase() === 'ADMIN';
  const esVendedor = String(rolNombre).toUpperCase() === 'VENDEDOR';

  const [activeTab, setActiveTab] = useState(esAdmin ? 'dashboard' : 'ordenes');
  
  //ESTADOS PARA DATOS
  const [usuarios, setUsuarios] = useState([]);
  const [ordenes, setOrdenes] = useState([]); 
  
  const [stats, setStats] = useState({
    compras: 0,
    totalProductos: 0,
    inventarioTotal: 0,
    totalUsuarios: 0
  });

  // CARGAR DATOS REALES
  useEffect(() => {
    const cargarDatosDelDashboard = async () => {
      try {
        //Cargar Órdenes (Para Admin y Vendedor)
        const dataOrdenes = await getTodasLasOrdenes();
        setOrdenes(Array.isArray(dataOrdenes) ? dataOrdenes : []);

        //Cargar Usuarios (Solo Admin)
        if (esAdmin) {
            const dataUsuarios = await getUsuarios();
            setUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios : []);
        }

      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
        setOrdenes([]); 
      }
    };

    cargarDatosDelDashboard();
  }, [esAdmin]); 

  // Calculo de Estadísticas
  useEffect(() => {
    const totalProductos = productos.length;
    const inventarioTotal = productos.reduce((acc, p) => acc + Number(p.stock || 0), 0);
    const totalUsuarios = usuarios.length; 
    const totalCompras = ordenes.length;

    setStats({
      compras: totalCompras,
      totalProductos: totalProductos,
      inventarioTotal: inventarioTotal,
      totalUsuarios: totalUsuarios
    });

  }, [productos, usuarios, ordenes]);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogueado');
    setUser(null);
    alert('Sesión cerrada');
    navigate("/");
  };

  const getMenuTabs = () => {
    if (esAdmin) return ['dashboard', 'ordenes', 'productos', 'usuarios', 'reportes'];
    if (esVendedor) return ['ordenes', 'productos'];
    return [];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'productos':
        return (
          <div>
            <h2 className="mb-4 titulo">Gestión de Productos</h2>
            <InventarioAdmin productos={productos} setProductos={setProductos} />
          </div>
        );
      case 'ordenes':
        return <GestionOrdenes ordenes={ordenes} setOrdenes={setOrdenes} />;
      case 'usuarios':
        if (!esAdmin) return <div className="alert alert-danger">Acceso Denegado</div>;
        return <GestionUsuarios usuarios={usuarios} setUsuarios={setUsuarios} loggedInUser={user} setLoggedInUser={setUser} />;
      case 'reportes':
        if (!esAdmin) return <div className="alert alert-danger">Acceso Denegado</div>;
        return <Reportes productos={productos} usuarios={usuarios} ordenes={ordenes} />;
      case 'perfil':
        return <ConfiguracionPerfil adminUser={user} setAdminUser={setUser} usuarios={usuarios} setUsuarios={setUsuarios} />;
      case 'tienda':
        return <Navigate to="/" replace />;
      case 'dashboard':
      default:
        if (!esAdmin) return <div className="alert alert-warning">Seleccione una opción del menú.</div>;
        return (
          <>
            <h2 className="mb-4 titulo">Resumen de las actividades diarias</h2>
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm color-cartas">
                  <div className="card-body">
                    <h3 className="card-title fw-bold texto_pric">Compras</h3>
                    <h1 className="display-4 texto_pric">{stats.compras}</h1>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm color-cartas">
                  <div className="card-body">
                    <h3 className="card-title fw-bold texto_pric">Productos</h3>
                    <h1 className="display-4 texto_pric">{stats.totalProductos}</h1>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm color-cartas">
                  <div className="card-body">
                    <h3 className="card-title fw-bold texto_pric">Usuarios</h3>
                    <h1 className="display-4 texto_pric">{stats.totalUsuarios}</h1>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="admin-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom fixed-top shadow-sm admin-navbar">
        <div className="container-fluid">
          <Link to="#" className="navbar-brand me-4">
            <span className="fs-5 fw-bold titulo">Huerto Hogar ({esAdmin ? 'Admin' : 'Vendedor'})</span>
          </Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-pills">
            {getMenuTabs().map((tab) => (
              <li className="nav-item" key={tab}>
                <Link to="#" className={`nav-link text-dark ${activeTab === tab ? 'active button text-white' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav d-flex">
            <li className="nav-item me-2"><Link to="#" className="nav-link text-dark" onClick={() => setActiveTab('tienda')}>Tienda</Link></li>
            <li className="nav-item me-2"><Link to="#" className="nav-link text-dark" onClick={() => setActiveTab('perfil')}>Perfil</Link></li>
            <li className="nav-item"><button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button></li>
          </ul>
        </div>
      </nav>
      <div className="admin-content-area">{renderContent()}</div>
    </div>
  );
}
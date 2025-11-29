import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario } from '../service/usuariosService';


export default function Login({ setUser }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();
  
  //Estados para manejo de errores visuales
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  //Convertimos la función a (async) para esperar la respuesta de la API
  const ingresar = async (e) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      setMensajeError('Por favor, complete todos los campos.');
      setError(true);
      return;
    }
    setError(false);

  
   try {
      const respuestaBackend = await loginUsuario(correo, contrasena);

      //CLAVE AQUÍ - Manejo del token JWT
      // Separamos el usuario del token
      const usuarioReal = respuestaBackend.usuario; 
      const token = respuestaBackend.token;

      // Guardamos el token en el navegador 
      if (token) {
          localStorage.setItem('token', token);
      }
      alert(`¡Bienvenido/a, ${usuarioReal.nombre}!`);
      setUser(usuarioReal);
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioReal));

      if (usuarioReal.rol && (usuarioReal.rol.nombre === 'ADMIN' || usuarioReal.rol === 'admin')) {
        navigate('/administrador');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error("Error en login:", err);
      setError(true);
      // Manejo de errores específicos del Backend
      if (err.response && err.response.status === 401) {
        setMensajeError('El correo o la contraseña son incorrectos.');
      } else {
        setMensajeError('Error de conexión con el servidor. Intente más tarde.');
      }
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 caja_formulario p-4">
          <h5 className="text-center mb-4 p-2 bg-secondary text-white">Inicio sesión</h5>
          <form onSubmit={ingresar}>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-user"></i></span>
                <input 
                  className="form-control" 
                  placeholder="Correo" 
                  value={correo} 
                  onChange={e => setCorreo(e.target.value)} 
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-lock"></i></span>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Contraseña" 
                  value={contrasena} 
                  onChange={e => setContrasena(e.target.value)} 
                />
              </div>
            </div>
            <div className="d-grid gap-2">
              <button className="button w-100">INICIAR SESIÓN</button>
            </div>
            <div className="text-center mt-3">
              <Link to="/registro" className="enlaces">Crear una nueva cuenta</Link>
            </div>
          </form>
          
          {/* Mostramos el mensaje de error dinámico */}
          {error && <p className='text-danger mt-2 text-center'>{mensajeError}</p>}
        </div>
      </div>
    </div>
  )
}
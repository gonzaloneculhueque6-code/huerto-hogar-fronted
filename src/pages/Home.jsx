import { Link } from 'react-router-dom'

export default function Home({user}){
  return (
    <>
      {!user && (
        <div className="text-end pe-3 my-3">
          <Link to="/login"><button>Iniciar Sesión</button></Link>{' '}
          <Link to="/registro"><button>Registrar Usuario</button></Link>
        </div>
      )}
      <div className="row align-items-center caja_tienda_online">
        <div className="col-md-6">
          <h2 className="titulo">TIENDA ONLINE</h2>
          <p className="texto_pric">
            HuertoHogar es una tienda online dedicada a llevar la frescura y calidad del campo
            directamente a tu puerta en Chile. Con más de 6 años de experiencia y presencia en varias ciudades.
          </p>
          <Link to="/productos"><button>Ver Productos</button></Link>
        </div>
        <div className="col-md-6 text-center">
          <img src="/assets/Logo.png" alt="Logo" width="500" />
        </div>
      </div>
    </>
  )
}

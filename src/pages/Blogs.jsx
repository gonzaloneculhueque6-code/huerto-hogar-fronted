export default function Blogs(){
  const items = [
    {titulo:'Desechos de Alimentos', texto:'Se desperdicia casi un tercio de toda la producción mundial de alimentos (1.300 millones de toneladas/año).', img:'desechos.png', url:'https://www.zurich.cl/blog/articles/2023/09/alimentacion-sostenible'},
    {titulo:'Agricultura Sostenible', texto:'Prácticas que protegen la biodiversidad, mejoran el suelo y reducen químicos.', img:'agricultura.png', url:'https://www.bbva.com/es/sostenibilidad/que-es-la-alimentacion-sostenible-como-evitar-devorar-el-planeta/'},
    {titulo:'Alimentación Saludable en Chile', texto:'Altos costos y predominancia de ultraprocesados dificultan comer sano.', img:'saludable.png', url:'https://uchile.cl/noticias/181001/comer-sano-una-eleccion-que-no-todos-pueden-tomar-en-chile'}
  ]
  return (
    <div className="container">
      {items.map((n,i)=>(
        <div key={i} className="row align-items-center caja_blogs my-4">
          <div className="col-md-6">
            <h2 className="titulo">{n.titulo}:</h2>
            <p className="texto_pric">{n.texto}</p>
            <a href={n.url} target="_blank" rel="noreferrer"><button>Ver Caso</button></a>
          </div>
          <div className="col-md-6 text-center">
            <img src={`/assets/${n.img}`} alt="" width="500"/>
          </div>
        </div>
      ))}
    </div>
  )
}

import React, { useState } from 'react';
import '../styles/admin.css';
import { crearProducto, actualizarProducto, eliminarProducto } from '../service/productService';

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: product.id || '',
    name: product.name || '',
    description: product.description || '',
    price: product.price || 0,
    stock: product.stock || 0,
    criticalStock: product.criticalStock || 0,
    category: product.category || '',
    image: product.image || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  const isExistingProduct = product && product.id && product === formData; 

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h3 className="mb-3">{product.id ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">ID (Código)*</label>
           
            <input 
              type="text" 
              className="form-control" 
              name="id" 
              value={formData.id} 
              onChange={handleChange} 
              required 
              placeholder="EJ: MAN1"
              disabled={!!product.id} 
            />
          </div>
          <div className="col-md-9 mb-3">
            <label className="form-label">Nombre*</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
        </div>

        <div className="mb-3">
            <label className="form-label">Descripción*</label>
            <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="2" required />
        </div>

        <div className="row">
            <div className="col-md-3 mb-3">
                <label className="form-label">Precio ($)*</label>
                <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required min="1" />
            </div>
            <div className="col-md-3 mb-3">
                <label className="form-label">Stock Inicial*</label>
                <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
            </div>
            <div className="col-md-3 mb-3">
                <label className="form-label">Stock Crítico*</label>
                <input type="number" className="form-control" name="criticalStock" value={formData.criticalStock} onChange={handleChange} required min="0" />
            </div>
            <div className="col-md-3 mb-3">
                <label className="form-label">Categoría*</label>
                <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Seleccione...</option>
                    <option value="Frutas">Frutas</option>
                    <option value="Verdura Organicas">Verdura Orgánicas</option>
                    <option value="Productos Organicos">Productos Orgánicos</option>
                    <option value="Productos Lacteos">Productos Lácteos</option>
                    <option value="Semillas">Semillas</option>
                    <option value="Otros">Otros</option>
                </select>
            </div>
        </div>

        <div className="mb-3">
            <label className="form-label">Nombre Imagen (ej: manzana.png)</label>
            <input type="text" className="form-control" name="image" value={formData.image} onChange={handleChange} placeholder="default.png" />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn-success">Guardar en BD</button>
        </div>
      </form>
    </div>
  );
}

export default function InventarioAdmin({ productos, setProductos }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  //FUNCIÓN PARA GUARDAR (CREATE / UPDATE) EN LA BD
  const handleSaveProduct = async (productData) => {
    // Validar y convertir tipos antes de enviar
    const productToSave = {
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
        criticalStock: Number(productData.criticalStock)
    };

    try {
        let productoGuardado;
        
        // Verificamos si estamos editando
        const esEdicion = editingProduct !== null;

        if (esEdicion) {
            // UPDATE (PUT)
            productoGuardado = await actualizarProducto(productToSave.id, productToSave);
            
            // Actualizar estado local para ver el cambio inmediato
            setProductos(productos.map(p => p.id === productToSave.id ? productoGuardado : p));
            alert("Producto actualizado correctamente.");
        } else {
            //(POST)
            productoGuardado = await crearProducto(productToSave);
            
            setProductos([...productos, productoGuardado]);
            alert("Producto creado exitosamente.");
        }

        setIsFormVisible(false);
        setEditingProduct(null);

    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error al guardar el producto. Revise si el ID ya existe o la conexión.");
    }
  };

  // FUNCIÓN PARA ELIMINAR 
  const handleDeleteProduct = async (id) => {
    if (window.confirm(`¿Seguro que desea eliminar el producto ${id} de la Base de Datos?`)) {
        try {
            await eliminarProducto(id);
            setProductos(productos.filter(p => p.id !== id));
            alert("Producto eliminado.");
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar el producto.");
        }
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  return (
    <div className="container-fluid px-0">
      {!isFormVisible && (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Lista de Productos</h4>
            <button className="button btn-sm" onClick={handleAddClick}>
                <i className="fas fa-plus me-2"></i> Agregar Producto
            </button>
        </div>
      )}

      {isFormVisible && (
        <ProductForm 
            // Pasamos un objeto vacío si es nuevo para evitar errores de uncontrolled inputs
            product={editingProduct || { id: '', name: '', description: '', price: '', stock: '', criticalStock: '', category: '', image: '' }} 
            onSave={handleSaveProduct} 
            onCancel={handleCancelForm} 
        />
      )}

      {!isFormVisible && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th className='text-center'>Stock</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td className={`text-center ${product.stock <= product.criticalStock ? 'text-danger fw-bold' : ''}`}>
                        {product.stock}
                      </td>
                      <td>${(Number(product.price)||0).toLocaleString('es-CL')}</td>
                      <td>{product.category}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-info me-2 text-white" onClick={() => handleEditClick(product)}>
                            Modificar
                        </button>
                        <button className="btn-rojo btn-sm" onClick={() => handleDeleteProduct(product.id)}>
                            Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {productos.length === 0 && (
                    <tr>
                        <td colSpan="6" className="text-center p-4">No hay productos en el inventario.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
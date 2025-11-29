if (!window.totalLogic) {
  /**
   * Calcula el total de un carrito u orden
   * @param {Array} items - Lista de objetos con { price, quantity }
   * @returns {number} Total acumulado
   */
  function calcularTotal(items) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
  window.totalLogic = { calcularTotal };
}
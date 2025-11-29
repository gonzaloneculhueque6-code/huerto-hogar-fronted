if (!window.ordenesLogic) {
  /**
   * Cambia el estado de una orden previa
   * @param {number} orderId - ID de la orden
   * @param {string} newStatus - Nuevo estado de la orden
   * @param {Function} setOrdenes - Setter de estado (actualiza la lista)
   */
  function handleStatusChange(orderId, newStatus, setOrdenes) {
    if (
      window.confirm(
        `¿Está seguro de cambiar el estado de la orden ${orderId} a "${newStatus}"?`
      )
    ) {
      setOrdenes((prevOrdenes) =>
        prevOrdenes.map((o) =>
          o.id === orderId ? { ...o, estado: newStatus } : o
        )
      );
      alert("Estado de la orden actualizado.");
    }
  }

  window.ordenesLogic = { handleStatusChange };
}
describe("Pruebas de handleStatusChange", function () {
  const { handleStatusChange } = window.ordenesLogic;

  let mockSetOrdenes;
  let mockAlert;
  let mockConfirm;
  let ordenes;

  beforeEach(function () {
    ordenes = [
      { id: 1, estado: "Pendiente" },
      { id: 2, estado: "En proceso" },
      { id: 3, estado: "Entregado" },
    ];

    mockSetOrdenes = jasmine.createSpy("setOrdenes");
    mockAlert = spyOn(window, "alert");
    mockConfirm = spyOn(window, "confirm");
  });

  it("Cambia el estado cuando el usuario confirma", function () {
    mockConfirm.and.returnValue(true);

    handleStatusChange(2, "Completado", mockSetOrdenes);

    expect(mockSetOrdenes).toHaveBeenCalled();
    const updateFn = mockSetOrdenes.calls.mostRecent().args[0];

    const resultado = updateFn(ordenes);

    expect(resultado).toEqual([
      { id: 1, estado: "Pendiente" },
      { id: 2, estado: "Completado" },
      { id: 3, estado: "Entregado" },
    ]);

    expect(mockAlert).toHaveBeenCalledWith("Estado de la orden actualizado.");
  });

  it("No hace nada si el usuario cancela", function () {
    mockConfirm.and.returnValue(false);

    handleStatusChange(1, "Cancelado", mockSetOrdenes);

    expect(mockSetOrdenes).not.toHaveBeenCalled();
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it("Si el ID no existe, no cambia nada", function () {
    mockConfirm.and.returnValue(true);
    handleStatusChange(999, "Cancelado", mockSetOrdenes);
    const updateFn = mockSetOrdenes.calls.mostRecent().args[0];
    const resultado = updateFn(ordenes);
    expect(resultado).toEqual(ordenes);
    expect(mockAlert).toHaveBeenCalledWith("Estado de la orden actualizado.");
  });
});
describe("Pruebas de calcularTotal", function () {
  const { calcularTotal } = window.totalLogic;

  it("Calcula correctamente el total con varios items", function () {
    const items = [
      { price: 10, quantity: 2 }, 
      { price: 5, quantity: 3 },   
      { price: 2, quantity: 4 },   
    ];
    const resultado = calcularTotal(items);
    expect(resultado).toBe(43);
  });

  it("Devuelve 0 si el array está vacío", function () {
    const resultado = calcularTotal([]);
    expect(resultado).toBe(0);
  });

  it("Devuelve 0 si no recibe un array", function () {
    expect(calcularTotal(null)).toBe(0);
    expect(calcularTotal(undefined)).toBe(0);
    expect(calcularTotal("no es un array")).toBe(0);
  });

  it("Ignora items sin price o quantity válidos (da NaN si son inválidos)", function () {
    const items = [
      { price: 10, quantity: 2 },     
      { price: "abc", quantity: 3 },  
    ];
    const resultado = calcularTotal(items);
    expect(isNaN(resultado)).toBeTrue(); // La función no valida tipos numéricos
  });
});
describe("Pruebas de handleDeleteUsuario", function () {
  const { handleDeleteUsuario } = window.usuariosLogic;

  let mockSetUsuarios;
  let mockAlert;
  let mockConfirm;
  let usuarios;

  beforeEach(function () {
    usuarios = [
      { correo: "user1@test.com" },
      { correo: "user2@test.com" },
      { correo: "huertohogar@gmail.com" },
    ];

    mockSetUsuarios = jasmine.createSpy("setUsuarios");
    mockAlert = spyOn(window, "alert");
    mockConfirm = spyOn(window, "confirm");
  });

  it("No debe eliminar al admin principal", function () {
    handleDeleteUsuario("huertohogar@gmail.com", usuarios, mockSetUsuarios);

    expect(mockAlert).toHaveBeenCalledWith(
      "No puedes eliminar al usuario administrador principal."
    );
    expect(mockSetUsuarios).not.toHaveBeenCalled();
  });

  it("Elimina usuario si confirma", function () {
    mockConfirm.and.returnValue(true);

    handleDeleteUsuario("user1@test.com", usuarios, mockSetUsuarios);

    expect(mockSetUsuarios).toHaveBeenCalledWith([
      { correo: "user2@test.com" },
      { correo: "huertohogar@gmail.com" },
    ]);
    expect(mockAlert).toHaveBeenCalledWith("Usuario user1@test.com eliminado.");
  });

  it("No elimina si el usuario cancela el confirm", function () {
    mockConfirm.and.returnValue(false);

    handleDeleteUsuario("user2@test.com", usuarios, mockSetUsuarios);

    expect(mockSetUsuarios).not.toHaveBeenCalled();
    expect(mockAlert).not.toHaveBeenCalledWith(
      "Usuario user2@test.com eliminado."
    );
  });
});
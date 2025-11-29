function handleDeleteUsuario(correoAEliminar, usuarios, setUsuarios) {
  console.log("handleDeleteUsuario llamado para:", correoAEliminar);

  if (correoAEliminar === "huertohogar@gmail.com") {
    alert("No puedes eliminar al usuario administrador principal.");
    return;
  }

  if (
    window.confirm(
      `¿Está seguro de que desea eliminar al usuario ${correoAEliminar}? Esta acción no se puede deshacer`
    )
  ) {
    try {
      const nuevosUsuarios = Array.isArray(usuarios)
        ? usuarios.filter((u) => u.correo !== correoAEliminar)
        : [];

      setUsuarios(nuevosUsuarios);
      alert(`Usuario ${correoAEliminar} eliminado.`);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Ocurrió un error al intentar eliminar el usuario.");
    }
  }
}
window.usuariosLogic = { handleDeleteUsuario };
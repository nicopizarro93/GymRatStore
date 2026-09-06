document.addEventListener("DOMContentLoaded", function () {
  var Data = window.GymratstoreData;
  var V = window.Validaciones;

  document.getElementById("formLogin").addEventListener("submit", function (evento) {
    evento.preventDefault();

    var correo = document.getElementById("correo");
    var clave = document.getElementById("clave");
    var alerta = document.getElementById("alertaLogin");
    alerta.classList.add("d-none");

    var valido = V.validarFormulario({ correo: V.email, clave: V.clave });
    if (!valido) return;

    var usuario = Data.autenticar(correo.value.trim(), clave.value);
    if (!usuario) {
      alerta.textContent = "Correo o contraseña incorrectos.";
      alerta.classList.remove("d-none");
      return;
    }

    window.Sesion.guardarSesion(usuario);

    var parametros = new URLSearchParams(window.location.search);
    var destino = parametros.get("volver");
    if (destino) {
      window.location.href = destino;
    } else if (usuario.tipoUsuario === "Administrador" || usuario.tipoUsuario === "Vendedor") {
      window.location.href = "admin/index.html";
    } else {
      window.location.href = "index.html";
    }
  });
});

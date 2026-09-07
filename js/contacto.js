document.addEventListener("DOMContentLoaded", function () {
  var V = window.Validaciones;

  document.getElementById("formContacto").addEventListener("submit", function (evento) {
    evento.preventDefault();

    var exito = document.getElementById("exitoContacto");
    var alerta = document.getElementById("alertaContacto");
    exito.classList.add("d-none");
    alerta.classList.add("d-none");

    var valido = V.validarFormulario({
      nombre: function (v) { return V.texto(v, { requerido: true, max: 100 }); },
      correo: V.email,
      comentario: function (v) { return V.texto(v, { requerido: true, max: 500 }); },
    });

    if (!valido) {
      alerta.textContent = "Revisa los campos marcados en rojo antes de enviar.";
      alerta.classList.remove("d-none");
      return;
    }

    document.getElementById("formContacto").reset();
    document.querySelectorAll("#formContacto .is-valid").forEach(function (el) {
      el.classList.remove("is-valid");
    });
    exito.textContent = "¡Gracias! Recibimos tu mensaje y te responderemos pronto.";
    exito.classList.remove("d-none");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var Data = window.GymratstoreData;
  var V = window.Validaciones;

  var selectRegion = document.getElementById("region");
  var selectComuna = document.getElementById("comuna");

  Object.keys(Data.REGIONES).forEach(function (region) {
    var opt = document.createElement("option");
    opt.value = region;
    opt.textContent = region;
    selectRegion.appendChild(opt);
  });

  selectRegion.addEventListener("change", function () {
    V.poblarComunas(selectRegion, selectComuna);
  });

  document.getElementById("formRegistro").addEventListener("submit", function (evento) {
    evento.preventDefault();

    var run = document.getElementById("run");
    var correo = document.getElementById("correo");
    var nombre = document.getElementById("nombre");
    var apellidos = document.getElementById("apellidos");
    var clave = document.getElementById("clave");
    var direccion = document.getElementById("direccion");
    var consentimiento = document.getElementById("consentimiento");

    var valido = V.validarFormulario({
      run: V.run,
      correo: V.email,
      nombre: function (v) { return V.texto(v, { requerido: true, max: 50 }); },
      apellidos: function (v) { return V.texto(v, { requerido: true, max: 100 }); },
      clave: V.clave,
      direccion: function (v) { return V.texto(v, { requerido: true, max: 300 }); },
    });

    var region = V.aplicar(selectRegion, function (v) { return V.texto(v, { requerido: true, mensajeRequerido: "Selecciona una región." }); });
    var comuna = V.aplicar(selectComuna, function (v) { return V.texto(v, { requerido: true, mensajeRequerido: "Selecciona una comuna." }); });

    var alerta = document.getElementById("alertaRegistro");
    var exito = document.getElementById("exitoRegistro");
    alerta.classList.add("d-none");
    exito.classList.add("d-none");

    if (valido && Data.existeCorreo(correo.value.trim())) {
      V.mostrarError(correo, "Ya existe una cuenta registrada con ese correo.");
      valido = false;
    }

    consentimiento.classList.remove("is-invalid");
    var feedbackConsentimiento = consentimiento.parentElement.querySelector(".invalid-feedback");
    if (!consentimiento.checked) {
      consentimiento.classList.add("is-invalid");
      if (feedbackConsentimiento) feedbackConsentimiento.textContent = "Debes autorizar el tratamiento de tus datos para continuar.";
      valido = false;
    } else if (feedbackConsentimiento) {
      feedbackConsentimiento.textContent = "";
    }

    if (!valido || !region || !comuna) {
      alerta.textContent = "Revisa los campos marcados en rojo antes de continuar.";
      alerta.classList.remove("d-none");
      return;
    }

    var usuario = {
      run: run.value.trim().toUpperCase(),
      nombre: nombre.value.trim(),
      apellidos: apellidos.value.trim(),
      correo: correo.value.trim(),
      clave: clave.value,
      fechaNacimiento: document.getElementById("fechaNacimiento").value || null,
      tipoUsuario: "Cliente",
      region: selectRegion.value,
      comuna: selectComuna.value,
      direccion: direccion.value.trim(),
      membresia: null,
    };

    Data.guardarUsuario(usuario);
    window.Sesion.guardarSesion(usuario);

    exito.textContent = "Cuenta creada con éxito. Redirigiendo...";
    exito.classList.remove("d-none");
    setTimeout(function () {
      window.location.href = "index.html";
    }, 1200);
  });
});

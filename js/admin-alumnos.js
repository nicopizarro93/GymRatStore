document.addEventListener("DOMContentLoaded", function () {
  var Data = window.GymratstoreData;
  var V = window.Validaciones;

  var sesion = window.Sesion.requiereSesion(["Administrador"], "../login.html", "index.html");
  if (!sesion) return;

  var modalEl = document.getElementById("modalUsuario");
  var modal = new bootstrap.Modal(modalEl);
  var form = document.getElementById("formUsuario");

  var uRun = document.getElementById("uRun");
  var uTipoUsuario = document.getElementById("uTipoUsuario");
  var uClave = document.getElementById("uClave");
  var uRegion = document.getElementById("uRegion");
  var uComuna = document.getElementById("uComuna");
  var uPlan = document.getElementById("uPlan");
  var uVigencia = document.getElementById("uVigencia");
  var bloqueMembresia = document.getElementById("bloqueMembresia");

  var runEnEdicion = null;

  Object.keys(Data.REGIONES).forEach(function (region) {
    var opt = document.createElement("option");
    opt.value = region;
    opt.textContent = region;
    uRegion.appendChild(opt);
  });
  uRegion.addEventListener("change", function () {
    V.poblarComunas(uRegion, uComuna);
  });

  Data.getProductosPorTipo("Plan").forEach(function (plan) {
    var opt = document.createElement("option");
    opt.value = plan.codigo;
    opt.textContent = plan.nombre;
    uPlan.appendChild(opt);
  });

  function actualizarVisibilidadMembresia() {
    bloqueMembresia.classList.toggle("d-none", uTipoUsuario.value !== "Cliente");
  }
  uTipoUsuario.addEventListener("change", actualizarVisibilidadMembresia);

  function limpiarValidaciones() {
    form.querySelectorAll(".is-invalid, .is-valid").forEach(function (el) {
      el.classList.remove("is-invalid", "is-valid");
    });
    document.getElementById("alertaUsuario").classList.add("d-none");
  }

  function abrirModalNuevo() {
    runEnEdicion = null;
    document.getElementById("tituloModalUsuario").textContent = "Nuevo usuario";
    form.reset();
    limpiarValidaciones();
    uRun.disabled = false;
    uComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
    uComuna.disabled = true;
    uClave.placeholder = "";
    document.getElementById("uClaveAyuda").textContent = "4 a 10 caracteres.";
    uTipoUsuario.value = "Cliente";
    actualizarVisibilidadMembresia();
  }

  function abrirModalEditar(usuario) {
    runEnEdicion = usuario.run;
    document.getElementById("tituloModalUsuario").textContent = "Editar usuario";
    limpiarValidaciones();
    uRun.value = usuario.run;
    uRun.disabled = true;
    uTipoUsuario.value = usuario.tipoUsuario;
    uClave.value = "";
    uClave.placeholder = "Dejar en blanco para no cambiarla";
    document.getElementById("uClaveAyuda").textContent = "Déjala en blanco para mantener la contraseña actual.";
    document.getElementById("uNombre").value = usuario.nombre;
    document.getElementById("uApellidos").value = usuario.apellidos;
    document.getElementById("uCorreo").value = usuario.correo;
    document.getElementById("uFechaNacimiento").value = usuario.fechaNacimiento || "";
    uRegion.value = usuario.region || "";
    V.poblarComunas(uRegion, uComuna, usuario.comuna);
    document.getElementById("uDireccion").value = usuario.direccion || "";

    uPlan.value = usuario.membresia ? usuario.membresia.productoCodigo : "";
    uVigencia.value = usuario.membresia ? usuario.membresia.fechaFin : "";

    actualizarVisibilidadMembresia();
    modal.show();
  }

  document.getElementById("btnNuevoUsuario").addEventListener("click", abrirModalNuevo);

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarValidaciones();

    var reglas = {
      uRun: V.run,
      uNombre: function (v) { return V.texto(v, { requerido: true, max: 50 }); },
      uApellidos: function (v) { return V.texto(v, { requerido: true, max: 100 }); },
      uCorreo: V.email,
      uDireccion: function (v) { return V.texto(v, { requerido: true, max: 300 }); },
    };
    var valido = V.validarFormulario(reglas);

    // La contraseña es obligatoria solo al crear; al editar, en blanco = no cambiarla.
    if (!runEnEdicion || uClave.value !== "") {
      valido = V.aplicar(uClave, V.clave) && valido;
    } else {
      uClave.classList.remove("is-invalid");
    }

    var region = V.aplicar(uRegion, function (v) { return V.texto(v, { requerido: true, mensajeRequerido: "Selecciona una región." }); });
    var comuna = V.aplicar(uComuna, function (v) { return V.texto(v, { requerido: true, mensajeRequerido: "Selecciona una comuna." }); });

    var correo = document.getElementById("uCorreo").value.trim();
    var alerta = document.getElementById("alertaUsuario");

    if (valido && Data.existeCorreo(correo, runEnEdicion)) {
      V.mostrarError(document.getElementById("uCorreo"), "Ya existe un usuario con ese correo.");
      valido = false;
    }

    if (uTipoUsuario.value === "Cliente" && uPlan.value && !uVigencia.value) {
      V.mostrarError(uVigencia, "Indica la fecha de vigencia del plan asignado.");
      valido = false;
    }

    if (!valido || !region || !comuna) {
      alerta.textContent = "Revisa los campos marcados en rojo.";
      alerta.classList.remove("d-none");
      return;
    }

    var run = uRun.value.trim().toUpperCase();
    var claveFinal = uClave.value !== "" ? uClave.value : (runEnEdicion ? Data.getUsuarioPorRun(runEnEdicion).clave : "");

    var membresia = null;
    if (uTipoUsuario.value === "Cliente" && uPlan.value) {
      var previo = runEnEdicion ? Data.getUsuarioPorRun(runEnEdicion) : null;
      var fechaInicioPrevia = previo && previo.membresia && previo.membresia.productoCodigo === uPlan.value ? previo.membresia.fechaInicio : new Date().toISOString().slice(0, 10);
      membresia = {
        productoCodigo: uPlan.value,
        fechaInicio: fechaInicioPrevia,
        fechaFin: uVigencia.value,
      };
    }

    Data.guardarUsuario({
      run: run,
      nombre: document.getElementById("uNombre").value.trim(),
      apellidos: document.getElementById("uApellidos").value.trim(),
      correo: correo,
      clave: claveFinal,
      fechaNacimiento: document.getElementById("uFechaNacimiento").value || null,
      tipoUsuario: uTipoUsuario.value,
      region: uRegion.value,
      comuna: uComuna.value,
      direccion: document.getElementById("uDireccion").value.trim(),
      membresia: membresia,
    });

    modal.hide();
    window.Carrito.mostrarToast("Usuario guardado correctamente.");
    render();
  });

  // --- Tabla / filtros ---------------------------------------------------

  var tabla = document.getElementById("tablaUsuarios");
  var sinUsuarios = document.getElementById("sinUsuarios");
  var inputBuscar = document.getElementById("buscarUsuario");

  function badgeMembresia(usuario) {
    if (usuario.tipoUsuario !== "Cliente") return '<span class="text-muted-gr small">-</span>';
    var estado = Data.getEstadoMembresia(usuario);
    var clase = estado === "Activa" ? "is-activa" : estado === "Vencida" ? "is-vencida" : "is-sin-plan";
    return '<span class="gr-badge-membresia ' + clase + '">' + estado + "</span>";
  }

  function filaUsuario(usuario) {
    return (
      "<tr>" +
      "<td>" + usuario.run + "</td>" +
      "<td>" + usuario.nombre + " " + usuario.apellidos + "</td>" +
      "<td>" + usuario.correo + "</td>" +
      "<td>" + usuario.tipoUsuario + "</td>" +
      "<td>" + badgeMembresia(usuario) + "</td>" +
      "<td>" + (usuario.comuna || "-") + "</td>" +
      '<td class="text-end">' +
      '<button type="button" class="btn btn-sm btn-outline-light me-1" data-editar="' + usuario.run + '"><i class="bi bi-pencil"></i></button>' +
      '<button type="button" class="btn btn-sm btn-outline-danger" data-eliminar="' + usuario.run + '"' + (usuario.run === sesion.run ? " disabled title=\"No puedes eliminar tu propia cuenta\"" : "") + "><i class=\"bi bi-trash\"></i></button>" +
      "</td>" +
      "</tr>"
    );
  }

  function render() {
    var tipo = document.querySelector('input[name="filtroTipoUsuario"]:checked').value;
    var texto = inputBuscar.value.trim().toLowerCase();

    var usuarios = Data.getUsuarios().filter(function (u) {
      if (tipo && u.tipoUsuario !== tipo) return false;
      if (texto) {
        var coincide =
          u.run.toLowerCase().indexOf(texto) !== -1 ||
          (u.nombre + " " + u.apellidos).toLowerCase().indexOf(texto) !== -1 ||
          u.correo.toLowerCase().indexOf(texto) !== -1;
        if (!coincide) return false;
      }
      return true;
    });

    if (usuarios.length === 0) {
      tabla.innerHTML = "";
      sinUsuarios.classList.remove("d-none");
      return;
    }
    sinUsuarios.classList.add("d-none");
    tabla.innerHTML = usuarios.map(filaUsuario).join("");

    tabla.querySelectorAll("[data-editar]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var usuario = Data.getUsuarioPorRun(boton.getAttribute("data-editar"));
        if (usuario) abrirModalEditar(usuario);
      });
    });
    tabla.querySelectorAll("[data-eliminar]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        if (boton.disabled) return;
        var run = boton.getAttribute("data-eliminar");
        var usuario = Data.getUsuarioPorRun(run);
        if (usuario && window.confirm('¿Eliminar a "' + usuario.nombre + " " + usuario.apellidos + '"? Esta acción no se puede deshacer.')) {
          Data.eliminarUsuario(run);
          window.Carrito.mostrarToast("Usuario eliminado.");
          render();
        }
      });
    });
  }

  document.querySelectorAll('input[name="filtroTipoUsuario"]').forEach(function (radio) {
    radio.addEventListener("change", render);
  });
  inputBuscar.addEventListener("input", render);

  render();
});

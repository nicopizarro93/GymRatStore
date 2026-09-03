document.addEventListener("DOMContentLoaded", function () {
  var Data = window.GymratstoreData;
  var sesion = window.Sesion.getSesion();

  // --- Estadísticas rápidas ------------------------------------------------
  document.getElementById("statPlanes").textContent = Data.getProductosPorTipo("Plan").length;
  document.getElementById("statSuplementos").textContent = Data.getProductosPorTipo("Suplemento").length;
  document.getElementById("statAlumnos").textContent = Data.getUsuariosAlumnos().length;

  // --- Destacados (2 planes + 2 suplementos) --------------------------------
  var destacados = Data.getProductosPorTipo("Plan").slice(0, 2).concat(Data.getProductosPorTipo("Suplemento").slice(0, 2));
  var grid = document.getElementById("gridDestacados");
  grid.innerHTML = destacados.map(window.ProductoUI.tarjetaProducto).join("");
  window.ProductoUI.activarBotonesAgregar(grid);

  // --- Hero según sesión -----------------------------------------------------
  var heroAnonimo = document.getElementById("heroAnonimo");
  var heroSesion = document.getElementById("heroSesion");
  var bannerStaff = document.getElementById("bannerStaff");

  if (!sesion) {
    return; // se queda el hero de marketing por defecto
  }

  heroAnonimo.classList.add("d-none");
  heroSesion.classList.remove("d-none");

  if (sesion.tipoUsuario === "Administrador" || sesion.tipoUsuario === "Vendedor") {
    bannerStaff.classList.remove("d-none");
  }

  var iniciales = (sesion.nombre.charAt(0) + (sesion.apellidos ? sesion.apellidos.charAt(0) : "")).toUpperCase();
  document.getElementById("heroIniciales").textContent = iniciales;
  document.getElementById("heroSaludo").textContent = "Hola, " + sesion.nombre;

  var usuario = Data.getUsuarioPorRun(sesion.run);
  var badge = document.getElementById("heroBadgeMembresia");
  var detalle = document.getElementById("heroDetalleMembresia");
  var botonPrincipal = document.getElementById("heroBotonPrincipal");

  if (sesion.tipoUsuario !== "Cliente") {
    badge.textContent = sesion.tipoUsuario;
    badge.className = "gr-badge-membresia is-activa";
    detalle.textContent = "Tienes acceso al panel de administración de Gymratstore.";
    botonPrincipal.textContent = "Ir al panel admin";
    botonPrincipal.href = "admin/index.html";
    return;
  }

  var estado = Data.getEstadoMembresia(usuario);
  if (estado === "Activa") {
    var plan = Data.getProductoPorCodigo(usuario.membresia.productoCodigo);
    badge.textContent = "Activa";
    badge.className = "gr-badge-membresia is-activa";
    detalle.textContent = (plan ? plan.nombre : "Tu plan") + " vigente hasta el " + usuario.membresia.fechaFin + ".";
    botonPrincipal.textContent = "Ver suplementos";
    botonPrincipal.href = "productos.html?tipo=Suplemento";
  } else if (estado === "Vencida") {
    badge.textContent = "Vencida";
    badge.className = "gr-badge-membresia is-vencida";
    detalle.textContent = "Tu plan venció el " + usuario.membresia.fechaFin + ". Renuévalo para seguir entrenando con nosotros.";
    botonPrincipal.textContent = "Renovar plan";
    botonPrincipal.href = "productos.html?tipo=Plan";
  } else {
    badge.textContent = "Sin plan";
    badge.className = "gr-badge-membresia is-sin-plan";
    detalle.textContent = "Todavía no tienes un plan contratado.";
    botonPrincipal.textContent = "Ver planes";
    botonPrincipal.href = "productos.html?tipo=Plan";
  }
});

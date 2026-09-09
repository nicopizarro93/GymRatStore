document.addEventListener("DOMContentLoaded", function () {
  var Data = window.GymratstoreData;
  var sesion = window.Sesion.requiereSesion(["Administrador", "Vendedor"], "../login.html");
  if (!sesion) return;

  document.getElementById("rolActual").textContent = sesion.tipoUsuario;

  var productos = Data.getProductos();
  var ordenes = Data.getOrdenes();
  var alumnos = Data.getUsuariosAlumnos();

  document.getElementById("statProductos").textContent = productos.length;
  document.getElementById("statOrdenes").textContent = ordenes.length;
  document.getElementById("statVentas").textContent = Data.formatoCLP(
    ordenes.reduce(function (acc, o) { return acc + o.total; }, 0)
  );

  if (sesion.tipoUsuario === "Administrador") {
    document.getElementById("statAlumnos").textContent = alumnos.length;
    var activas = 0, vencidas = 0, sinPlan = 0;
    alumnos.forEach(function (alumno) {
      var estado = Data.getEstadoMembresia(alumno);
      if (estado === "Activa") activas++;
      else if (estado === "Vencida") vencidas++;
      else sinPlan++;
    });
    document.getElementById("statActivas").textContent = activas;
    document.getElementById("statVencidas").textContent = vencidas;
    document.getElementById("statSinPlan").textContent = sinPlan;
  }

  var ultimas = ordenes.slice().sort(function (a, b) { return b.id - a.id; }).slice(0, 5);
  var tabla = document.getElementById("tablaUltimasOrdenes");
  if (ultimas.length === 0) {
    tabla.innerHTML = '<tr><td colspan="4" class="text-muted-gr text-center py-3">Todavía no hay órdenes registradas.</td></tr>';
  } else {
    tabla.innerHTML = ultimas
      .map(function (orden) {
        return (
          "<tr>" +
          "<td>#" + orden.id + "</td>" +
          "<td>" + Data.nombreClienteOrden(orden) + "</td>" +
          "<td>" + orden.fecha + "</td>" +
          "<td>" + Data.formatoCLP(orden.total) + "</td>" +
          "</tr>"
        );
      })
      .join("");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var Data = window.GymratstoreData;

  var sesion = window.Sesion.requiereSesion(["Administrador", "Vendedor"], "../login.html");
  if (!sesion) return;

  var tabla = document.getElementById("tablaOrdenes");
  var sinOrdenes = document.getElementById("sinOrdenes");
  var inputBuscar = document.getElementById("buscarOrden");
  var modalDetalle = new bootstrap.Modal(document.getElementById("modalDetalleOrden"));

  function filaOrden(orden) {
    return (
      "<tr>" +
      "<td>#" + orden.id + "</td>" +
      "<td>" + Data.nombreClienteOrden(orden) + "</td>" +
      "<td>" + orden.fecha + "</td>" +
      "<td>" + orden.items.length + "</td>" +
      "<td>" + Data.formatoCLP(orden.total) + "</td>" +
      '<td><span class="badge text-bg-secondary">' + orden.estado + "</span></td>" +
      '<td class="text-end"><button type="button" class="btn btn-sm btn-outline-light" data-ver="' + orden.id + '"><i class="bi bi-eye"></i></button></td>' +
      "</tr>"
    );
  }

  function render() {
    var texto = inputBuscar.value.trim().toLowerCase();
    var ordenes = Data.getOrdenes()
      .filter(function (orden) {
        if (!texto) return true;
        return (
          String(orden.id).indexOf(texto) !== -1 ||
          (orden.run || "").toLowerCase().indexOf(texto) !== -1 ||
          Data.nombreClienteOrden(orden).toLowerCase().indexOf(texto) !== -1
        );
      })
      .sort(function (a, b) { return b.id - a.id; });

    if (ordenes.length === 0) {
      tabla.innerHTML = "";
      sinOrdenes.classList.remove("d-none");
      return;
    }
    sinOrdenes.classList.add("d-none");
    tabla.innerHTML = ordenes.map(filaOrden).join("");

    tabla.querySelectorAll("[data-ver]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var orden = Data.getOrdenes().filter(function (o) { return o.id === Number(boton.getAttribute("data-ver")); })[0];
        if (orden) mostrarDetalle(orden);
      });
    });
  }

  function mostrarDetalle(orden) {
    document.getElementById("tituloDetalleOrden").textContent = "Orden #" + orden.id;
    document.getElementById("detalleOrdenAlumno").textContent = Data.nombreClienteOrden(orden);
    document.getElementById("detalleOrdenFecha").textContent = orden.fecha;
    document.getElementById("detalleOrdenTotal").textContent = Data.formatoCLP(orden.total);
    document.getElementById("detalleOrdenItems").innerHTML = orden.items
      .map(function (item) {
        return (
          '<li class="d-flex justify-content-between border-bottom border-secondary py-2">' +
          "<span>" + item.nombre + " × " + item.cantidad + "</span>" +
          "<span>" + Data.formatoCLP(item.precio * item.cantidad) + "</span>" +
          "</li>"
        );
      })
      .join("");
    modalDetalle.show();
  }

  inputBuscar.addEventListener("input", render);
  render();
});

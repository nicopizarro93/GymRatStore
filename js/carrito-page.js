document.addEventListener("DOMContentLoaded", function () {
  var Data = window.GymratstoreData;
  var V = window.Validaciones;

  var vista = document.getElementById("vistaCarrito");
  var lista = document.getElementById("listaCarrito");
  var vacio = document.getElementById("carritoVacio");
  var confirmacion = document.getElementById("confirmacionCompra");
  var avisoPlan = document.getElementById("avisoPlanRequiereCuenta");
  var bloqueInvitado = document.getElementById("bloqueInvitado");
  var btnConfirmar = document.getElementById("btnConfirmar");

  function tieneCarritoUnPlan(carrito) {
    return carrito.some(function (item) { return item.tipo === "Plan"; });
  }

  function filaCarrito(item) {
    var producto = Data.getProductoPorCodigo(item.codigo);
    var esPlan = item.tipo === "Plan";
    var icono = producto ? Data.getIconoCategoria(producto.categoria) : "bi-box-seam";
    var stockDisponible = producto ? producto.stock : 99;

    return (
      '<div class="gr-cart-item" data-codigo="' + item.codigo + '">' +
      '<div class="gr-cart-item-icono"><i class="bi ' + icono + '"></i></div>' +
      '<div class="flex-grow-1">' +
      '<div class="d-flex justify-content-between">' +
      "<h6 class=\"mb-1\">" + item.nombre + "</h6>" +
      '<button type="button" class="btn btn-sm btn-link text-accent-red p-0" data-quitar="' + item.codigo + '"><i class="bi bi-trash"></i></button>' +
      "</div>" +
      '<div class="small text-muted-gr mb-2">' + Data.formatoCLP(item.precio) + " c/u</div>" +
      (esPlan
        ? '<span class="badge text-bg-secondary">Membresía · 1 unidad</span>'
        : '<div class="input-group input-group-sm" style="width: 8rem">' +
          '<button class="btn btn-outline-light" type="button" data-restar="' + item.codigo + '">-</button>' +
          '<input type="number" class="form-control text-center" min="1" max="' + stockDisponible + '" value="' + item.cantidad + '" data-cantidad="' + item.codigo + '" />' +
          '<button class="btn btn-outline-light" type="button" data-sumar="' + item.codigo + '">+</button>' +
          "</div>") +
      "</div>" +
      '<div class="text-end" style="min-width: 6rem">' +
      '<strong>' + Data.formatoCLP(item.precio * item.cantidad) + "</strong>" +
      "</div>" +
      "</div>"
    );
  }

  function render() {
    var carrito = Data.getCarrito();

    if (carrito.length === 0) {
      vista.classList.add("d-none");
      vacio.classList.remove("d-none");
      return;
    }
    vacio.classList.add("d-none");
    vista.classList.remove("d-none");

    lista.innerHTML = carrito.map(filaCarrito).join("");
    document.getElementById("resumenCantidad").textContent = Data.getCantidadItemsCarrito();
    document.getElementById("resumenTotal").textContent = Data.formatoCLP(Data.getTotalCarrito());

    // Los suplementos se pueden comprar como invitado; un plan de gimnasio
    // siempre requiere una cuenta (queda asociado al alumno para gestionarlo).
    var sesion = window.Sesion.getSesion();
    var tienePlan = tieneCarritoUnPlan(carrito);
    avisoPlan.classList.toggle("d-none", !(tienePlan && !sesion));
    bloqueInvitado.classList.toggle("d-none", !(!tienePlan && !sesion));
    btnConfirmar.textContent = !sesion && tienePlan ? "Iniciar sesión para continuar" : "Confirmar compra";

    lista.querySelectorAll("[data-quitar]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        Data.quitarDelCarrito(boton.getAttribute("data-quitar"));
        window.Carrito.actualizarBadgeCarrito();
        render();
      });
    });

    lista.querySelectorAll("[data-cantidad]").forEach(function (input) {
      input.addEventListener("change", function () {
        var cantidad = Math.max(1, parseInt(input.value, 10) || 1);
        var max = parseInt(input.getAttribute("max"), 10);
        if (max && cantidad > max) cantidad = max;
        Data.actualizarCantidadCarrito(input.getAttribute("data-cantidad"), cantidad);
        window.Carrito.actualizarBadgeCarrito();
        render();
      });
    });

    lista.querySelectorAll("[data-sumar]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var codigo = boton.getAttribute("data-sumar");
        var input = lista.querySelector('[data-cantidad="' + codigo + '"]');
        var max = parseInt(input.getAttribute("max"), 10);
        var cantidad = parseInt(input.value, 10) + 1;
        if (max && cantidad > max) cantidad = max;
        Data.actualizarCantidadCarrito(codigo, cantidad);
        window.Carrito.actualizarBadgeCarrito();
        render();
      });
    });

    lista.querySelectorAll("[data-restar]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var codigo = boton.getAttribute("data-restar");
        var input = lista.querySelector('[data-cantidad="' + codigo + '"]');
        var cantidad = Math.max(1, parseInt(input.value, 10) - 1);
        Data.actualizarCantidadCarrito(codigo, cantidad);
        window.Carrito.actualizarBadgeCarrito();
        render();
      });
    });
  }

  btnConfirmar.addEventListener("click", function () {
    var carrito = Data.getCarrito();
    if (carrito.length === 0) return;

    var sesion = window.Sesion.getSesion();
    var tienePlan = tieneCarritoUnPlan(carrito);

    // Un plan de gimnasio siempre requiere cuenta (queda asociado al alumno).
    if (!sesion && tienePlan) {
      window.location.href = "login.html?volver=carrito.html";
      return;
    }

    // Sin sesión y solo suplementos: compra como invitado, validando sus datos.
    var invitado = null;
    if (!sesion) {
      var nombreInput = document.getElementById("invitadoNombre");
      var correoInput = document.getElementById("invitadoCorreo");
      var direccionInput = document.getElementById("invitadoDireccion");

      var valido = V.validarFormulario({
        invitadoNombre: function (v) { return V.texto(v, { requerido: true, max: 100 }); },
        invitadoCorreo: V.email,
        invitadoDireccion: function (v) { return V.texto(v, { requerido: true, max: 300 }); },
      });
      if (!valido) {
        window.Carrito.mostrarToast("Revisa tus datos de invitado antes de continuar.", "danger");
        return;
      }
      invitado = {
        nombre: nombreInput.value.trim(),
        correo: correoInput.value.trim(),
        direccion: direccionInput.value.trim(),
      };
    }

    // Descuenta stock/cupos real al momento de confirmar (no al agregar al carrito).
    for (var i = 0; i < carrito.length; i++) {
      var producto = Data.getProductoPorCodigo(carrito[i].codigo);
      if (!producto || producto.stock < carrito[i].cantidad) {
        window.Carrito.mostrarToast('No hay suficiente stock de "' + carrito[i].nombre + '".', "danger");
        render();
        return;
      }
    }
    carrito.forEach(function (item) {
      var producto = Data.getProductoPorCodigo(item.codigo);
      producto.stock -= item.cantidad;
      Data.guardarProducto(producto);
    });

    var orden = Data.crearOrden({
      run: sesion ? sesion.run : null,
      invitado: invitado,
      fecha: new Date().toISOString().slice(0, 10),
      items: carrito,
      total: Data.getTotalCarrito(),
      estado: "Pagada",
    });

    if (sesion) Data.aplicarMembresiaDesdeOrden(sesion.run, orden);
    Data.limpiarCarrito();
    window.Carrito.actualizarBadgeCarrito();

    vista.classList.add("d-none");
    vacio.classList.add("d-none");
    confirmacion.classList.remove("d-none");
    document.getElementById("confirmacionDetalle").textContent =
      "Orden #" + orden.id + " por " + Data.formatoCLP(orden.total) + ". Revisa tu correo para más detalles.";
  });

  render();
});

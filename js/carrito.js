/**
 * Gymratstore - utilidades de carrito compartidas por todas las páginas
 * (badge de cantidad en la navbar + aviso "agregado al carrito").
 */
(function (global) {
  "use strict";

  function actualizarBadgeCarrito() {
    var cantidad = global.GymratstoreData.getCantidadItemsCarrito();
    document.querySelectorAll(".gr-carrito-badge").forEach(function (el) {
      el.textContent = String(cantidad);
      el.classList.toggle("d-none", cantidad === 0);
    });
  }

  // Toast Bootstrap simple y reutilizable. Requiere un contenedor
  // <div id="grToastContainer" class="toast-container ..."></div> en la página.
  function mostrarToast(mensaje, tipo) {
    var contenedor = document.getElementById("grToastContainer");
    if (!contenedor) {
      window.alert(mensaje);
      return;
    }
    var toast = document.createElement("div");
    toast.className = "toast align-items-center text-bg-" + (tipo || "success") + " border-0";
    toast.setAttribute("role", "alert");
    toast.innerHTML =
      '<div class="d-flex">' +
      '<div class="toast-body">' + mensaje + "</div>" +
      '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>' +
      "</div>";
    contenedor.appendChild(toast);
    var instancia = new bootstrap.Toast(toast, { delay: 2500 });
    instancia.show();
    toast.addEventListener("hidden.bs.toast", function () {
      toast.remove();
    });
  }

  function agregarAlCarritoConAviso(codigo, cantidad) {
    var producto = global.GymratstoreData.getProductoPorCodigo(codigo);
    global.GymratstoreData.agregarAlCarrito(codigo, cantidad);
    actualizarBadgeCarrito();
    if (producto) {
      mostrarToast('"' + producto.nombre + '" se agregó al carrito.');
    }
  }

  global.Carrito = {
    actualizarBadgeCarrito: actualizarBadgeCarrito,
    mostrarToast: mostrarToast,
    agregarAlCarritoConAviso: agregarAlCarritoConAviso,
  };
})(window);

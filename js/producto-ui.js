/**
 * Gymratstore - construcción de la tarjeta de producto (HTML), reutilizada
 * en Home (destacados) y en el catálogo (productos.html).
 */
(function (global) {
  "use strict";

  // Foto real del producto si tiene una asignada (imagen), o el ícono de su
  // categoría como respaldo (por ejemplo, los planes de membresía no tienen foto).
  function mediaProducto(producto) {
    var Data = global.GymratstoreData;
    if (producto.imagen) {
      return '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" loading="lazy">';
    }
    return '<i class="bi ' + Data.getIconoCategoria(producto.categoria) + '"></i>';
  }

  function tarjetaProducto(producto) {
    var Data = global.GymratstoreData;
    var esPlan = producto.tipo === "Plan";
    var badgeClase = esPlan ? "gr-badge-plan" : "gr-badge-suplemento";
    var badgeIcono = esPlan ? "bi-calendar-check" : "bi-cup-straw";
    var stockBajo = producto.stockCritico && producto.stock <= producto.stockCritico;
    var etiquetaStock = esPlan ? "cupos" : "unidades";

    return (
      '<div class="col-sm-6 col-lg-4 col-xl-3">' +
      '<div class="gr-product-card">' +
      '<a href="producto-detalle.html?codigo=' + encodeURIComponent(producto.codigo) + '" class="text-decoration-none text-reset">' +
      '<div class="gr-product-media">' + mediaProducto(producto) + "</div>" +
      "</a>" +
      '<div class="gr-product-body">' +
      '<span class="gr-badge-tipo ' + badgeClase + '"><i class="bi ' + badgeIcono + '"></i>' + producto.categoria + "</span>" +
      '<a href="producto-detalle.html?codigo=' + encodeURIComponent(producto.codigo) + '" class="text-decoration-none text-reset">' +
      "<h6 class=\"mb-0\">" + producto.nombre + "</h6>" +
      "</a>" +
      '<div class="gr-precio">' + Data.formatoCLP(producto.precio) + "</div>" +
      '<div class="small ' + (stockBajo ? "gr-stock-critico" : "text-muted-gr") + '">' +
      (producto.stock > 0 ? producto.stock + " " + etiquetaStock + " disponibles" : "Sin stock por ahora") +
      "</div>" +
      "</div>" +
      '<div class="gr-product-footer">' +
      '<button type="button" class="btn btn-brand w-100 btn-sm" data-agregar-carrito="' + producto.codigo + '"' +
      (producto.stock <= 0 ? " disabled" : "") +
      "><i class=\"bi bi-cart-plus me-1\"></i>Agregar al carrito</button>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  // Engancha los botones [data-agregar-carrito] presentes en el contenedor dado.
  function activarBotonesAgregar(contenedor) {
    contenedor.querySelectorAll("[data-agregar-carrito]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        global.Carrito.agregarAlCarritoConAviso(boton.getAttribute("data-agregar-carrito"), 1);
      });
    });
  }

  global.ProductoUI = {
    tarjetaProducto: tarjetaProducto,
    mediaProducto: mediaProducto,
    activarBotonesAgregar: activarBotonesAgregar,
  };
})(window);

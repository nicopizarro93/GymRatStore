/**
 * Gymratstore - bootstrap común a todas las páginas: actualiza navbar según
 * sesión, badge del carrito, y engancha los botones de "cerrar sesión".
 */
document.addEventListener("DOMContentLoaded", function () {
  if (window.Sesion) window.Sesion.actualizarNavSesion();
  if (window.Carrito) window.Carrito.actualizarBadgeCarrito();

  document.querySelectorAll('[data-accion="cerrar-sesion"]').forEach(function (el) {
    el.addEventListener("click", function (evento) {
      evento.preventDefault();
      window.Sesion.cerrarSesion();
      window.location.href = el.getAttribute("data-ir") || "index.html";
    });
  });

  // Año dinámico en el footer, si existe el elemento.
  document.querySelectorAll("[data-anio-actual]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});

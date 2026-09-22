document.addEventListener("DOMContentLoaded", function () {
  var Data = window.GymratstoreData;
  var V = window.Validaciones;

  var parametros = new URLSearchParams(window.location.search);
  var codigo = parametros.get("codigo");
  var producto = codigo ? Data.getProductoPorCodigo(codigo) : null;

  if (!producto) {
    document.getElementById("detalleProducto").classList.add("d-none");
    document.getElementById("seccionRelacionados").classList.add("d-none");
    document.getElementById("detalleNoEncontrado").classList.remove("d-none");
    return;
  }

  document.title = producto.nombre + " - Gymratstore";

  var esPlan = producto.tipo === "Plan";
  var etiquetaStock = esPlan ? "cupos" : "unidades";

  document.getElementById("detalleIcono").innerHTML = window.ProductoUI.mediaProducto(producto);

  var badge = document.getElementById("detalleBadgeTipo");
  badge.textContent = producto.categoria;
  badge.classList.add(esPlan ? "gr-badge-plan" : "gr-badge-suplemento");

  document.getElementById("detalleNombre").textContent = producto.nombre;
  document.getElementById("detalleDescripcion").textContent = producto.descripcion || "Sin descripción disponible.";
  document.getElementById("detallePrecio").textContent = Data.formatoCLP(producto.precio);

  var stockEl = document.getElementById("detalleStock");
  if (producto.stock > 0) {
    var bajo = producto.stockCritico && producto.stock <= producto.stockCritico;
    stockEl.className = bajo ? "small gr-stock-critico" : "small text-muted-gr";
    stockEl.textContent = producto.stock + " " + etiquetaStock + " disponibles" + (bajo ? " (quedan pocos)" : "");
  } else {
    stockEl.className = "small gr-stock-critico";
    stockEl.textContent = "Sin stock por ahora.";
  }

  var inputCantidad = document.getElementById("cantidad");
  var filaCantidad = document.getElementById("filaCantidad");
  var errorCantidad = document.getElementById("errorCantidad");
  var btnAgregar = document.getElementById("btnAgregar");

  if (esPlan) {
    // Un plan de membresía se agrega de a una unidad, sin selector de cantidad.
    filaCantidad.querySelector(".col-auto").classList.add("d-none");
    inputCantidad.value = 1;
  } else {
    inputCantidad.max = producto.stock;
  }

  if (producto.stock <= 0) {
    btnAgregar.disabled = true;
    btnAgregar.textContent = "Sin stock";
  }

  if (esPlan && !window.Sesion.getSesion()) {
    document.getElementById("avisoPlanCuenta").classList.remove("d-none");
  }

  btnAgregar.addEventListener("click", function () {
    errorCantidad.textContent = "";
    var cantidad = esPlan ? 1 : parseInt(inputCantidad.value, 10);
    var resultado = V.cantidadCarrito(cantidad, producto.stock);
    if (!resultado.valido) {
      errorCantidad.textContent = resultado.mensaje;
      return;
    }
    window.Carrito.agregarAlCarritoConAviso(producto.codigo, cantidad);
  });

  // --- Relacionados: misma categoría, sin incluir el producto actual ---------
  var relacionados = Data.getProductos()
    .filter(function (p) {
      return p.codigo !== producto.codigo && p.categoria === producto.categoria;
    })
    .slice(0, 4);

  if (relacionados.length === 0) {
    relacionados = Data.getProductos()
      .filter(function (p) {
        return p.codigo !== producto.codigo && p.tipo === producto.tipo;
      })
      .slice(0, 4);
  }

  var grid = document.getElementById("gridRelacionados");
  if (relacionados.length === 0) {
    document.getElementById("seccionRelacionados").classList.add("d-none");
  } else {
    grid.innerHTML = relacionados.map(window.ProductoUI.tarjetaProducto).join("");
    window.ProductoUI.activarBotonesAgregar(grid);
  }
});

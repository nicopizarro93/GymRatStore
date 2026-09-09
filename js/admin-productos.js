document.addEventListener("DOMContentLoaded", function () {
  var Data = window.GymratstoreData;
  var V = window.Validaciones;

  var sesion = window.Sesion.requiereSesion(["Administrador", "Vendedor"], "../login.html");
  if (!sesion) return;

  // El rol Vendedor solo puede VER el listado de productos (spec del ramo);
  // crear/editar/eliminar queda reservado al Administrador.
  var soloLectura = sesion.tipoUsuario === "Vendedor";
  if (soloLectura) {
    document.getElementById("btnNuevoProducto").classList.add("d-none");
    document.querySelector("#tablaProductos").closest("table").querySelector("thead th:last-child").classList.add("d-none");
  }

  var modalEl = document.getElementById("modalProducto");
  var modal = new bootstrap.Modal(modalEl);
  var form = document.getElementById("formProducto");
  var mTipo = document.getElementById("mTipo");
  var mCategoria = document.getElementById("mCategoria");
  var mCodigo = document.getElementById("mCodigo");
  var codigoEnEdicion = null;

  function poblarCategoriaModal(seleccionActual) {
    var categorias = mTipo.value === "Plan" ? Data.CATEGORIAS_PLAN : Data.CATEGORIAS_SUPLEMENTO;
    mCategoria.innerHTML = "";
    categorias.forEach(function (categoria) {
      var opt = document.createElement("option");
      opt.value = categoria;
      opt.textContent = categoria;
      mCategoria.appendChild(opt);
    });
    if (seleccionActual && categorias.indexOf(seleccionActual) !== -1) mCategoria.value = seleccionActual;
  }

  mTipo.addEventListener("change", function () {
    poblarCategoriaModal();
  });

  function limpiarValidaciones() {
    form.querySelectorAll(".is-invalid, .is-valid").forEach(function (el) {
      el.classList.remove("is-invalid", "is-valid");
    });
    document.getElementById("alertaProducto").classList.add("d-none");
  }

  function abrirModalNuevo() {
    codigoEnEdicion = null;
    document.getElementById("tituloModalProducto").textContent = "Nuevo producto";
    form.reset();
    limpiarValidaciones();
    mCodigo.disabled = false;
    mTipo.value = "Plan";
    poblarCategoriaModal();
  }

  function abrirModalEditar(producto) {
    codigoEnEdicion = producto.codigo;
    document.getElementById("tituloModalProducto").textContent = "Editar producto";
    limpiarValidaciones();
    mTipo.value = producto.tipo;
    poblarCategoriaModal(producto.categoria);
    mCodigo.value = producto.codigo;
    mCodigo.disabled = true;
    document.getElementById("mNombre").value = producto.nombre;
    document.getElementById("mImagen").value = producto.imagen || "";
    document.getElementById("mDescripcion").value = producto.descripcion || "";
    document.getElementById("mPrecio").value = producto.precio;
    document.getElementById("mStock").value = producto.stock;
    document.getElementById("mStockCritico").value = producto.stockCritico != null ? producto.stockCritico : "";
    modal.show();
  }

  document.getElementById("btnNuevoProducto").addEventListener("click", abrirModalNuevo);

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarValidaciones();

    var valido = V.validarFormulario({
      mCategoria: function (v) { return V.texto(v, { requerido: true }); },
      mCodigo: function (v) { return V.texto(v, { requerido: true, min: 3 }); },
      mNombre: function (v) { return V.texto(v, { requerido: true, max: 100 }); },
      mDescripcion: function (v) { return V.texto(v, { requerido: false, max: 500 }); },
      mPrecio: function (v) { return V.numero(v, { requerido: true, min: 0 }); },
      mStock: function (v) { return V.numero(v, { requerido: true, min: 0, entero: true }); },
      mStockCritico: function (v) { return V.numero(v, { requerido: false, min: 0, entero: true }); },
    });

    var codigo = mCodigo.value.trim().toUpperCase();
    var alerta = document.getElementById("alertaProducto");

    if (valido && !codigoEnEdicion && Data.getProductoPorCodigo(codigo)) {
      V.mostrarError(mCodigo, "Ya existe un producto con ese código.");
      valido = false;
    }

    if (!valido) {
      alerta.textContent = "Revisa los campos marcados en rojo.";
      alerta.classList.remove("d-none");
      return;
    }

    var stockCriticoValor = document.getElementById("mStockCritico").value;

    Data.guardarProducto({
      codigo: codigo,
      tipo: mTipo.value,
      categoria: mCategoria.value,
      nombre: document.getElementById("mNombre").value.trim(),
      descripcion: document.getElementById("mDescripcion").value.trim(),
      precio: Number(document.getElementById("mPrecio").value),
      stock: parseInt(document.getElementById("mStock").value, 10),
      stockCritico: stockCriticoValor === "" ? null : parseInt(stockCriticoValor, 10),
      imagen: document.getElementById("mImagen").value.trim(),
    });

    modal.hide();
    window.Carrito.mostrarToast("Producto guardado correctamente.");
    render();
  });

  // --- Tabla / filtros ---------------------------------------------------

  var radiosTipo = document.querySelectorAll('input[name="filtroTipoAdmin"]');
  var inputBuscar = document.getElementById("buscarProducto");
  var tabla = document.getElementById("tablaProductos");
  var sinProductos = document.getElementById("sinProductos");

  function filaProducto(producto) {
    var stockBajo = producto.stockCritico != null && producto.stock <= producto.stockCritico;
    return (
      "<tr>" +
      "<td>" + producto.codigo + "</td>" +
      "<td>" + producto.tipo + "</td>" +
      "<td>" + producto.categoria + "</td>" +
      "<td>" + producto.nombre + "</td>" +
      "<td>" + Data.formatoCLP(producto.precio) + "</td>" +
      "<td>" + producto.stock + "</td>" +
      '<td class="' + (stockBajo ? "gr-stock-critico" : "") + '">' + (producto.stockCritico != null ? producto.stockCritico : "-") + "</td>" +
      (soloLectura
        ? ""
        : '<td class="text-end">' +
          '<button type="button" class="btn btn-sm btn-outline-light me-1" data-editar="' + producto.codigo + '"><i class="bi bi-pencil"></i></button>' +
          '<button type="button" class="btn btn-sm btn-outline-danger" data-eliminar="' + producto.codigo + '"><i class="bi bi-trash"></i></button>' +
          "</td>") +
      "</tr>"
    );
  }

  function render() {
    var tipo = document.querySelector('input[name="filtroTipoAdmin"]:checked').value;
    var texto = inputBuscar.value.trim().toLowerCase();

    var productos = Data.getProductos().filter(function (p) {
      if (tipo && p.tipo !== tipo) return false;
      if (texto && p.nombre.toLowerCase().indexOf(texto) === -1 && p.codigo.toLowerCase().indexOf(texto) === -1) return false;
      return true;
    });

    if (productos.length === 0) {
      tabla.innerHTML = "";
      sinProductos.classList.remove("d-none");
      return;
    }
    sinProductos.classList.add("d-none");
    tabla.innerHTML = productos.map(filaProducto).join("");

    tabla.querySelectorAll("[data-editar]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var producto = Data.getProductoPorCodigo(boton.getAttribute("data-editar"));
        if (producto) abrirModalEditar(producto);
      });
    });
    tabla.querySelectorAll("[data-eliminar]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var codigo = boton.getAttribute("data-eliminar");
        var producto = Data.getProductoPorCodigo(codigo);
        if (producto && window.confirm('¿Eliminar "' + producto.nombre + '"? Esta acción no se puede deshacer.')) {
          Data.eliminarProducto(codigo);
          window.Carrito.mostrarToast("Producto eliminado.");
          render();
        }
      });
    });
  }

  radiosTipo.forEach(function (radio) {
    radio.addEventListener("change", render);
  });
  inputBuscar.addEventListener("input", render);

  render();
});

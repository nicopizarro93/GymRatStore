document.addEventListener("DOMContentLoaded", function () {
  var Data = window.GymratstoreData;

  var radiosTipo = document.querySelectorAll('input[name="filtroTipo"]');
  var selectCategoria = document.getElementById("filtroCategoria");
  var inputTexto = document.getElementById("filtroTexto");
  var grid = document.getElementById("gridProductos");
  var estadoVacio = document.getElementById("estadoSinResultados");
  var botonLimpiarWrap = document.getElementById("botonLimpiarFiltros");

  // Preselecciona el tipo si viene por query string (?tipo=Plan|Suplemento), por
  // ejemplo desde los accesos rápidos del Home.
  var parametros = new URLSearchParams(window.location.search);
  var tipoInicial = parametros.get("tipo");
  if (tipoInicial === "Plan" || tipoInicial === "Suplemento") {
    var radio = document.querySelector('input[name="filtroTipo"][value="' + tipoInicial + '"]');
    if (radio) radio.checked = true;
  }

  function tipoActivo() {
    var seleccionado = document.querySelector('input[name="filtroTipo"]:checked');
    return seleccionado ? seleccionado.value : "";
  }

  function poblarCategorias() {
    var tipo = tipoActivo();
    var categorias = tipo === "Plan" ? Data.CATEGORIAS_PLAN : tipo === "Suplemento" ? Data.CATEGORIAS_SUPLEMENTO : Data.CATEGORIAS_PLAN.concat(Data.CATEGORIAS_SUPLEMENTO);
    var actual = selectCategoria.value;
    selectCategoria.innerHTML = '<option value="">Todas las categorías</option>';
    categorias.forEach(function (categoria) {
      var opt = document.createElement("option");
      opt.value = categoria;
      opt.textContent = categoria;
      selectCategoria.appendChild(opt);
    });
    if (categorias.indexOf(actual) !== -1) selectCategoria.value = actual;
  }

  function hayFiltrosActivos() {
    return !!tipoActivo() || !!selectCategoria.value || inputTexto.value.trim() !== "";
  }

  function render() {
    var tipo = tipoActivo();
    var categoria = selectCategoria.value;
    var texto = inputTexto.value.trim().toLowerCase();

    var productos = Data.getProductos().filter(function (producto) {
      if (tipo && producto.tipo !== tipo) return false;
      if (categoria && producto.categoria !== categoria) return false;
      if (texto && producto.nombre.toLowerCase().indexOf(texto) === -1) return false;
      return true;
    });

    botonLimpiarWrap.classList.toggle("d-none", !hayFiltrosActivos());

    if (productos.length === 0) {
      grid.innerHTML = "";
      estadoVacio.classList.remove("d-none");
      return;
    }
    estadoVacio.classList.add("d-none");
    grid.innerHTML = productos.map(window.ProductoUI.tarjetaProducto).join("");
    window.ProductoUI.activarBotonesAgregar(grid);
  }

  radiosTipo.forEach(function (radio) {
    radio.addEventListener("change", function () {
      poblarCategorias();
      render();
    });
  });
  selectCategoria.addEventListener("change", render);
  inputTexto.addEventListener("input", render);

  function limpiarFiltros() {
    document.getElementById("filtroTodos").checked = true;
    inputTexto.value = "";
    poblarCategorias();
    render();
  }
  document.getElementById("btnLimpiarFiltros").addEventListener("click", limpiarFiltros);
  document.getElementById("btnLimpiarFiltrosVacio").addEventListener("click", limpiarFiltros);

  poblarCategorias();
  if (tipoInicial === "Plan" || tipoInicial === "Suplemento") selectCategoria.value = "";
  render();
});

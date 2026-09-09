/**
 * Gymratstore - validaciones de formulario (Anexo 1) + helpers de UI de error
 * estilo Bootstrap (was-validated / invalid-feedback).
 */
(function (global) {
  "use strict";

  var DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

  // --- Reglas individuales -------------------------------------------------
  // Cada regla devuelve { valido: boolean, mensaje: string }

  function requerido(valor) {
    return valor !== null && valor !== undefined && String(valor).trim() !== "";
  }

  function texto(valor, opciones) {
    opciones = opciones || {};
    var v = valor === null || valor === undefined ? "" : String(valor).trim();
    if (opciones.requerido && !requerido(v)) {
      return { valido: false, mensaje: opciones.mensajeRequerido || "Este campo es obligatorio." };
    }
    if (!opciones.requerido && v === "") {
      return { valido: true, mensaje: "" };
    }
    if (opciones.min && v.length < opciones.min) {
      return { valido: false, mensaje: "Debe tener al menos " + opciones.min + " caracteres." };
    }
    if (opciones.max && v.length > opciones.max) {
      return { valido: false, mensaje: "No puede superar los " + opciones.max + " caracteres." };
    }
    return { valido: true, mensaje: "" };
  }

  function numero(valor, opciones) {
    opciones = opciones || {};
    var v = valor === null || valor === undefined ? "" : String(valor).trim();
    if (opciones.requerido && !requerido(v)) {
      return { valido: false, mensaje: opciones.mensajeRequerido || "Este campo es obligatorio." };
    }
    if (!opciones.requerido && v === "") {
      return { valido: true, mensaje: "" };
    }
    var n = Number(v);
    if (v === "" || isNaN(n)) {
      return { valido: false, mensaje: "Debe ser un número válido." };
    }
    if (opciones.entero && !Number.isInteger(n)) {
      return { valido: false, mensaje: "Debe ser un número entero (sin decimales)." };
    }
    if (opciones.min !== undefined && n < opciones.min) {
      return { valido: false, mensaje: "No puede ser menor que " + opciones.min + "." };
    }
    if (opciones.max !== undefined && n > opciones.max) {
      return { valido: false, mensaje: "No puede ser mayor que " + opciones.max + "." };
    }
    return { valido: true, mensaje: "" };
  }

  function email(valor, opciones) {
    opciones = opciones || {};
    var v = valor === null || valor === undefined ? "" : String(valor).trim();
    if (!requerido(v)) {
      return { valido: false, mensaje: "El correo es obligatorio." };
    }
    if (v.length > (opciones.max || 100)) {
      return { valido: false, mensaje: "El correo no puede superar los " + (opciones.max || 100) + " caracteres." };
    }
    var patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patron.test(v)) {
      return { valido: false, mensaje: "Ingresa un correo con formato válido." };
    }
    var dominio = v.split("@")[1].toLowerCase();
    if (DOMINIOS_PERMITIDOS.indexOf(dominio) === -1) {
      return {
        valido: false,
        mensaje: "Solo se aceptan correos " + DOMINIOS_PERMITIDOS.map(function (d) { return "@" + d; }).join(", ") + ".",
      };
    }
    return { valido: true, mensaje: "" };
  }

  function clave(valor) {
    var v = valor === null || valor === undefined ? "" : String(valor);
    if (!requerido(v)) {
      return { valido: false, mensaje: "La contraseña es obligatoria." };
    }
    if (v.length < 4 || v.length > 10) {
      return { valido: false, mensaje: "La contraseña debe tener entre 4 y 10 caracteres." };
    }
    return { valido: true, mensaje: "" };
  }

  // Dígito verificador de un RUN chileno (algoritmo módulo 11).
  function calcularDV(cuerpo) {
    var suma = 0;
    var multiplo = 2;
    for (var i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    var resto = 11 - (suma % 11);
    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return String(resto);
  }

  // El Anexo 1 pide RUN sin puntos ni guion, largo 7-9 (8 u 9 dígitos si se
  // cuenta el DV), validando el dígito verificador.
  function run(valor) {
    var v = valor === null || valor === undefined ? "" : String(valor).trim().toUpperCase();
    if (!requerido(v)) {
      return { valido: false, mensaje: "El RUN es obligatorio." };
    }
    if (!/^[0-9]{6,8}[0-9K]$/.test(v)) {
      return { valido: false, mensaje: "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion (ej: 193456782)." };
    }
    var cuerpo = v.slice(0, -1);
    var dvIngresado = v.slice(-1);
    var dvCalculado = calcularDV(cuerpo);
    if (dvIngresado !== dvCalculado) {
      return { valido: false, mensaje: "El dígito verificador del RUN no es válido." };
    }
    return { valido: true, mensaje: "" };
  }

  // --- Reglas de negocio para el carrito -----------------------------------

  function cantidadCarrito(valor, stockDisponible) {
    return numero(valor, { requerido: true, min: 1, max: stockDisponible, entero: true });
  }

  // --- Helpers de UI (Bootstrap invalid-feedback) --------------------------

  function mostrarError(input, mensaje) {
    if (!input) return;
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    var feedback = input.parentElement.querySelector(".invalid-feedback[data-para='" + input.id + "']");
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.className = "invalid-feedback";
      feedback.setAttribute("data-para", input.id);
      input.insertAdjacentElement("afterend", feedback);
    }
    feedback.textContent = mensaje;
  }

  function limpiarError(input) {
    if (!input) return;
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  // Aplica una regla a un input y refleja el resultado en la UI.
  // regla: función(valor) => {valido, mensaje}
  function aplicar(input, regla) {
    if (!input) return true;
    var resultado = regla(input.value);
    if (resultado.valido) {
      limpiarError(input);
    } else {
      mostrarError(input, resultado.mensaje);
    }
    return resultado.valido;
  }

  // Ejecuta un mapa { idInput: reglaFn } y devuelve true solo si todo es válido.
  // Se usa en el submit de cada formulario del sitio.
  function validarFormulario(mapaReglas) {
    var formValido = true;
    Object.keys(mapaReglas).forEach(function (id) {
      var input = document.getElementById(id);
      var ok = aplicar(input, mapaReglas[id]);
      if (!ok) formValido = false;
    });
    return formValido;
  }

  function poblarComunas(selectRegion, selectComuna, comunaSeleccionada) {
    if (!selectRegion || !selectComuna) return;
    var comunas = (global.GymratstoreData && global.GymratstoreData.getComunas(selectRegion.value)) || [];
    selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
    comunas.forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      if (c === comunaSeleccionada) opt.selected = true;
      selectComuna.appendChild(opt);
    });
    selectComuna.disabled = comunas.length === 0;
  }

  global.Validaciones = {
    DOMINIOS_PERMITIDOS: DOMINIOS_PERMITIDOS,
    requerido: requerido,
    texto: texto,
    numero: numero,
    email: email,
    clave: clave,
    run: run,
    cantidadCarrito: cantidadCarrito,
    mostrarError: mostrarError,
    limpiarError: limpiarError,
    aplicar: aplicar,
    validarFormulario: validarFormulario,
    poblarComunas: poblarComunas,
  };
})(window);

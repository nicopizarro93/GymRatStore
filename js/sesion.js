/**
 * Gymratstore - sesión mock (login/logout) + control de acceso por rol +
 * actualización de la navbar según haya o no sesión activa.
 *
 * Convenciones usadas en el HTML:
 *   data-sesion="fuera"   -> visible solo SIN sesión (login/crear cuenta)
 *   data-sesion="dentro"  -> visible solo CON sesión (mi cuenta/cerrar sesión)
 *   data-sesion-nombre    -> se rellena con el nombre del usuario
 *   data-rol="Administrador,Vendedor" -> visible solo si el rol de la sesión
 *                                        activa está en esa lista
 */
(function (global) {
  "use strict";

  var KEY_SESION = "gr_sesion";

  function guardarSesion(usuario) {
    var datos = {
      run: usuario.run,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      tipoUsuario: usuario.tipoUsuario,
    };
    try {
      localStorage.setItem(KEY_SESION, JSON.stringify(datos));
    } catch (e) {
      /* noop */
    }
    return datos;
  }

  function getSesion() {
    try {
      var raw = localStorage.getItem(KEY_SESION);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function cerrarSesion() {
    try {
      localStorage.removeItem(KEY_SESION);
    } catch (e) {
      /* noop */
    }
  }

  // Se llama al principio de cada página que requiere estar logueado.
  // rolesPermitidos: array de tipoUsuario permitidos, o null para "cualquier sesión activa".
  // urlSinSesion: a dónde mandar a quien no tiene sesión (típicamente login.html).
  // urlSinPermiso: a dónde mandar a quien SÍ tiene sesión pero con un rol no autorizado
  //                (por defecto, el mismo urlSinSesion).
  // Si no cumple, redirige y detiene el resto del script de la página.
  function requiereSesion(rolesPermitidos, urlSinSesion, urlSinPermiso) {
    var sesion = getSesion();
    if (!sesion) {
      window.location.href = urlSinSesion || "login.html";
      return null;
    }
    if (rolesPermitidos && rolesPermitidos.indexOf(sesion.tipoUsuario) === -1) {
      window.location.href = urlSinPermiso || urlSinSesion || "login.html";
      return null;
    }
    return sesion;
  }

  function actualizarNavSesion() {
    var sesion = getSesion();

    document.querySelectorAll('[data-sesion="fuera"]').forEach(function (el) {
      el.classList.toggle("d-none", !!sesion);
    });
    document.querySelectorAll('[data-sesion="dentro"]').forEach(function (el) {
      el.classList.toggle("d-none", !sesion);
    });
    document.querySelectorAll("[data-sesion-nombre]").forEach(function (el) {
      el.textContent = sesion ? sesion.nombre : "";
    });
    document.querySelectorAll("[data-rol]").forEach(function (el) {
      var roles = el.getAttribute("data-rol").split(",").map(function (r) { return r.trim(); });
      var visible = !!sesion && roles.indexOf(sesion.tipoUsuario) !== -1;
      el.classList.toggle("d-none", !visible);
    });
  }

  global.Sesion = {
    guardarSesion: guardarSesion,
    getSesion: getSesion,
    cerrarSesion: cerrarSesion,
    requiereSesion: requiereSesion,
    actualizarNavSesion: actualizarNavSesion,
  };
})(window);

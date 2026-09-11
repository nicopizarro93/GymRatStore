/**
 * Gymratstore - capa de datos mock (localStorage)
 * Reemplaza a un backend real por ahora. Todas las funciones de este archivo
 * son las únicas que deberían tocar localStorage directamente - el resto del
 * sitio siempre pasa por GymratstoreData.*
 */
(function (global) {
  "use strict";

  // Subir este número fuerza un re-seed completo (borra datos de prueba
  // guardados en el navegador y vuelve a cargar la semilla de abajo).
  var SEED_VERSION = "1";

  var KEYS = {
    seedVersion: "gr_seed_version",
    productos: "gr_productos",
    usuarios: "gr_usuarios",
    ordenes: "gr_ordenes",
    sesion: "gr_sesion",
    carrito: "gr_carrito",
  };

  // ---------------------------------------------------------------------
  // Datos de referencia (región/comuna, categorías por tipo de producto)
  // ---------------------------------------------------------------------

  var REGIONES = {
    "Región Metropolitana": [
      "Santiago",
      "Providencia",
      "Las Condes",
      "Maipú",
      "Puente Alto",
      "La Florida",
    ],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Quillota"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"],
    "Los Lagos": ["Puerto Montt", "Osorno", "Castro"],
  };

  var CATEGORIAS_PLAN = [
    "Plan Mensual",
    "Plan Trimestral",
    "Plan Semestral",
    "Plan Anual",
  ];

  var CATEGORIAS_SUPLEMENTO = [
    "Proteínas",
    "Creatina",
    "Pre-entreno",
    "Vitaminas",
    "Accesorios",
    "Snacks",
  ];

  // Ícono Bootstrap Icons por categoría, para no usar fotos de stock.
  var ICONO_POR_CATEGORIA = {
    "Plan Mensual": "bi-calendar-week",
    "Plan Trimestral": "bi-calendar3",
    "Plan Semestral": "bi-calendar3-range",
    "Plan Anual": "bi-calendar-heart",
    "Proteínas": "bi-cup-straw",
    "Creatina": "bi-capsule",
    "Pre-entreno": "bi-lightning-charge",
    "Vitaminas": "bi-capsule-pill",
    "Accesorios": "bi-bag",
    "Snacks": "bi-egg-fried",
  };

  // ---------------------------------------------------------------------
  // Semilla inicial
  // ---------------------------------------------------------------------

  function semillaProductos() {
    return [
      {
        codigo: "PLAN-MEN",
        tipo: "Plan",
        categoria: "Plan Mensual",
        nombre: "Plan Mensual",
        descripcion:
          "Acceso ilimitado a sala de musculación y máquinas de cardio durante 1 mes. Renovación mensual, sin permanencia.",
        precio: 24990,
        stock: 50,
        stockCritico: 10,
        imagen: "",
      },
      {
        codigo: "PLAN-TRI",
        tipo: "Plan",
        categoria: "Plan Trimestral",
        nombre: "Plan Trimestral",
        descripcion:
          "3 meses de acceso ilimitado + 1 evaluación física incluida. Ahorra frente al plan mensual.",
        precio: 64990,
        stock: 40,
        stockCritico: 8,
        imagen: "",
      },
      {
        codigo: "PLAN-SEM",
        tipo: "Plan",
        categoria: "Plan Semestral",
        nombre: "Plan Semestral",
        descripcion:
          "6 meses de acceso ilimitado + 2 evaluaciones físicas + rutina personalizada inicial.",
        precio: 119990,
        stock: 30,
        stockCritico: 6,
        imagen: "",
      },
      {
        codigo: "PLAN-ANU",
        tipo: "Plan",
        categoria: "Plan Anual",
        nombre: "Plan Anual",
        descripcion:
          "12 meses de acceso ilimitado + evaluaciones trimestrales + clases grupales incluidas. Nuestro plan más completo.",
        precio: 209990,
        stock: 25,
        stockCritico: 5,
        imagen: "",
      },
      {
        codigo: "SUP-WHEY01",
        tipo: "Suplemento",
        categoria: "Proteínas",
        nombre: "Proteína Whey Vainilla 900g",
        descripcion: "Proteína de suero de leche, sabor vainilla, 30 porciones.",
        precio: 32990,
        stock: 18,
        stockCritico: 5,
        imagen: "",
      },
      {
        codigo: "SUP-WHEY02",
        tipo: "Suplemento",
        categoria: "Proteínas",
        nombre: "Proteína Whey Chocolate 900g",
        descripcion: "Proteína de suero de leche, sabor chocolate, 30 porciones.",
        precio: 32990,
        stock: 15,
        stockCritico: 5,
        imagen: "",
      },
      {
        codigo: "SUP-CREA01",
        tipo: "Suplemento",
        categoria: "Creatina",
        nombre: "Creatina Monohidratada 300g",
        descripcion: "Creatina monohidratada pura, sin sabor, 60 porciones.",
        precio: 18990,
        stock: 22,
        stockCritico: 5,
        imagen: "",
      },
      {
        codigo: "SUP-PRE01",
        tipo: "Suplemento",
        categoria: "Pre-entreno",
        nombre: "Pre-entreno Frutos Rojos 300g",
        descripcion: "Pre-entreno con cafeína y beta-alanina, sabor frutos rojos.",
        precio: 21990,
        stock: 12,
        stockCritico: 4,
        imagen: "",
      },
      {
        codigo: "SUP-VIT01",
        tipo: "Suplemento",
        categoria: "Vitaminas",
        nombre: "Multivitamínico Deportivo 60 cáps",
        descripcion: "Complejo multivitamínico formulado para personas activas.",
        precio: 14990,
        stock: 30,
        stockCritico: 8,
        imagen: "",
      },
      {
        codigo: "SUP-ACC01",
        tipo: "Suplemento",
        categoria: "Accesorios",
        nombre: "Shaker Gymratstore 700ml",
        descripcion: "Vaso mezclador con malla anti-grumos, 700ml.",
        precio: 6990,
        stock: 40,
        stockCritico: 10,
        imagen: "",
      },
      {
        codigo: "SUP-ACC02",
        tipo: "Suplemento",
        categoria: "Accesorios",
        nombre: "Cinturón de Levantamiento",
        descripcion: "Cinturón de cuero reforzado para levantamientos pesados.",
        precio: 24990,
        stock: 8,
        stockCritico: 3,
        imagen: "",
      },
      {
        codigo: "SUP-SNK01",
        tipo: "Suplemento",
        categoria: "Snacks",
        nombre: "Barritas Proteicas Caja x12",
        descripcion: "Caja de 12 barritas proteicas sabor surtido.",
        precio: 15990,
        stock: 20,
        stockCritico: 5,
        imagen: "",
      },
    ];
  }

  function semillaUsuarios() {
    return [
      {
        run: "189012349",
        nombre: "Camila",
        apellidos: "Reyes Muñoz",
        correo: "admin@duoc.cl",
        clave: "admin123",
        fechaNacimiento: "1990-05-12",
        tipoUsuario: "Administrador",
        region: "Región Metropolitana",
        comuna: "Santiago",
        direccion: "Av. Libertador Bernardo O'Higgins 1234",
        membresia: null,
      },
      {
        run: "167890121",
        nombre: "Diego",
        apellidos: "Fuentes Lara",
        correo: "diego.fuentes@duoc.cl",
        clave: "vende123",
        fechaNacimiento: "1995-02-20",
        tipoUsuario: "Vendedor",
        region: "Región Metropolitana",
        comuna: "Maipú",
        direccion: "Calle Los Aromos 456",
        membresia: null,
      },
      {
        run: "193456782",
        nombre: "Matías",
        apellidos: "Fernández Soto",
        correo: "matias.fernandez@gmail.com",
        clave: "socio123",
        fechaNacimiento: "1998-11-03",
        tipoUsuario: "Cliente",
        region: "Región Metropolitana",
        comuna: "Puente Alto",
        direccion: "Pasaje Las Rosas 789",
        membresia: {
          productoCodigo: "PLAN-TRI",
          fechaInicio: "2026-08-05",
          fechaFin: "2026-11-05",
        },
      },
      {
        run: "204567891",
        nombre: "Valentina",
        apellidos: "Soto Pizarro",
        correo: "valentina.soto@gmail.com",
        clave: "socio123",
        fechaNacimiento: "2000-07-16",
        tipoUsuario: "Cliente",
        region: "Valparaíso",
        comuna: "Viña del Mar",
        direccion: "Av. San Martín 321",
        membresia: {
          productoCodigo: "PLAN-MEN",
          fechaInicio: "2026-06-01",
          fechaFin: "2026-07-01",
        },
      },
      {
        run: "215678903",
        nombre: "Benjamín",
        apellidos: "Rojas Castro",
        correo: "benjamin.rojas@gmail.com",
        clave: "socio123",
        fechaNacimiento: "2002-01-27",
        tipoUsuario: "Cliente",
        region: "Biobío",
        comuna: "Concepción",
        direccion: "Calle Freire 654",
        membresia: null,
      },
    ];
  }

  function semillaOrdenes() {
    return [
      {
        id: 1001,
        run: "193456782",
        fecha: "2026-08-05",
        items: [
          { codigo: "PLAN-TRI", nombre: "Plan Trimestral", tipo: "Plan", precio: 64990, cantidad: 1 },
          { codigo: "SUP-WHEY01", nombre: "Proteína Whey Vainilla 900g", tipo: "Suplemento", precio: 32990, cantidad: 1 },
        ],
        total: 97980,
        estado: "Pagada",
      },
      {
        id: 1002,
        run: "204567891",
        fecha: "2026-06-01",
        items: [
          { codigo: "PLAN-MEN", nombre: "Plan Mensual", tipo: "Plan", precio: 24990, cantidad: 1 },
        ],
        total: 24990,
        estado: "Pagada",
      },
      {
        id: 1003,
        run: "193456782",
        fecha: "2026-08-20",
        items: [
          { codigo: "SUP-CREA01", nombre: "Creatina Monohidratada 300g", tipo: "Suplemento", precio: 18990, cantidad: 2 },
          { codigo: "SUP-ACC01", nombre: "Shaker Gymratstore 700ml", tipo: "Suplemento", precio: 6990, cantidad: 1 },
        ],
        total: 44970,
        estado: "Pagada",
      },
    ];
  }

  // ---------------------------------------------------------------------
  // Almacenamiento base
  // ---------------------------------------------------------------------

  function leer(clave, porDefecto) {
    try {
      var raw = localStorage.getItem(clave);
      if (raw === null) return porDefecto;
      return JSON.parse(raw);
    } catch (e) {
      return porDefecto;
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
      /* localStorage no disponible: la sesión sigue funcionando en memoria por la vida de la página */
    }
  }

  function inicializar() {
    var versionGuardada = null;
    try {
      versionGuardada = localStorage.getItem(KEYS.seedVersion);
    } catch (e) {
      versionGuardada = SEED_VERSION;
    }
    if (versionGuardada !== SEED_VERSION) {
      guardar(KEYS.productos, semillaProductos());
      guardar(KEYS.usuarios, semillaUsuarios());
      guardar(KEYS.ordenes, semillaOrdenes());
      try {
        localStorage.setItem(KEYS.seedVersion, SEED_VERSION);
      } catch (e) {
        /* noop */
      }
    }
  }

  inicializar();

  // ---------------------------------------------------------------------
  // Productos
  // ---------------------------------------------------------------------

  function getProductos() {
    return leer(KEYS.productos, []);
  }

  function getProductoPorCodigo(codigo) {
    var productos = getProductos();
    for (var i = 0; i < productos.length; i++) {
      if (productos[i].codigo === codigo) return productos[i];
    }
    return null;
  }

  function getProductosPorTipo(tipo) {
    return getProductos().filter(function (p) {
      return p.tipo === tipo;
    });
  }

  // Crea o reemplaza un producto según su código (el código es la llave natural).
  function guardarProducto(producto) {
    var productos = getProductos();
    var idx = -1;
    for (var i = 0; i < productos.length; i++) {
      if (productos[i].codigo === producto.codigo) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) {
      productos[idx] = producto;
    } else {
      productos.push(producto);
    }
    guardar(KEYS.productos, productos);
  }

  function eliminarProducto(codigo) {
    var productos = getProductos().filter(function (p) {
      return p.codigo !== codigo;
    });
    guardar(KEYS.productos, productos);
  }

  // ---------------------------------------------------------------------
  // Usuarios / Alumnos
  // ---------------------------------------------------------------------

  function getUsuarios() {
    return leer(KEYS.usuarios, []);
  }

  function getUsuarioPorRun(run) {
    var usuarios = getUsuarios();
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].run === run) return usuarios[i];
    }
    return null;
  }

  function getUsuarioPorCorreo(correo) {
    var usuarios = getUsuarios();
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].correo.toLowerCase() === String(correo).toLowerCase()) return usuarios[i];
    }
    return null;
  }

  function existeCorreo(correo, runExcluir) {
    var u = getUsuarioPorCorreo(correo);
    return !!u && u.run !== runExcluir;
  }

  function guardarUsuario(usuario) {
    var usuarios = getUsuarios();
    var idx = -1;
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].run === usuario.run) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) {
      usuarios[idx] = usuario;
    } else {
      usuarios.push(usuario);
    }
    guardar(KEYS.usuarios, usuarios);
  }

  function eliminarUsuario(run) {
    var usuarios = getUsuarios().filter(function (u) {
      return u.run !== run;
    });
    guardar(KEYS.usuarios, usuarios);
  }

  function autenticar(correo, clave) {
    var usuario = getUsuarioPorCorreo(correo);
    if (!usuario) return null;
    if (usuario.clave !== clave) return null;
    return usuario;
  }

  // Devuelve "Activa" | "Vencida" | "Sin plan", recalculado contra la fecha
  // actual (no confía en un campo "estado" que se pueda desincronizar).
  function getEstadoMembresia(usuario) {
    if (!usuario || !usuario.membresia || !usuario.membresia.fechaFin) return "Sin plan";
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    var fin = new Date(usuario.membresia.fechaFin + "T00:00:00");
    return fin >= hoy ? "Activa" : "Vencida";
  }

  function getUsuariosAlumnos() {
    return getUsuarios().filter(function (u) {
      return u.tipoUsuario === "Cliente";
    });
  }

  // ---------------------------------------------------------------------
  // Órdenes
  // ---------------------------------------------------------------------

  function getOrdenes() {
    return leer(KEYS.ordenes, []);
  }

  function getOrdenesPorRun(run) {
    return getOrdenes().filter(function (o) {
      return o.run === run;
    });
  }

  // Nombre a mostrar para una orden: alumno registrado, o los datos de invitado
  // cuando la orden se compró sin cuenta (solo posible para órdenes de puros
  // suplementos - un plan de gimnasio siempre exige sesión iniciada).
  function nombreClienteOrden(orden) {
    if (orden.run) {
      var usuario = getUsuarioPorRun(orden.run);
      return usuario ? usuario.nombre + " " + usuario.apellidos : orden.run;
    }
    if (orden.invitado && orden.invitado.nombre) {
      return orden.invitado.nombre + " (invitado)";
    }
    return "Invitado";
  }

  function crearOrden(orden) {
    var ordenes = getOrdenes();
    var maxId = 1000;
    ordenes.forEach(function (o) {
      if (o.id > maxId) maxId = o.id;
    });
    orden.id = maxId + 1;
    ordenes.push(orden);
    guardar(KEYS.ordenes, ordenes);
    return orden;
  }

  // Aplica los planes comprados en una orden como membresía del cliente
  // (si compró más de un plan, se queda con el de fecha de término más lejana).
  function aplicarMembresiaDesdeOrden(run, orden) {
    var usuario = getUsuarioPorRun(run);
    if (!usuario) return;
    var mesesPorCategoria = {
      "Plan Mensual": 1,
      "Plan Trimestral": 3,
      "Plan Semestral": 6,
      "Plan Anual": 12,
    };
    var mejor = null;
    orden.items.forEach(function (item) {
      if (item.tipo !== "Plan") return;
      var producto = getProductoPorCodigo(item.codigo);
      if (!producto) return;
      var meses = mesesPorCategoria[producto.categoria] || 1;
      var inicio = new Date();
      var fin = new Date();
      fin.setMonth(fin.getMonth() + meses);
      var candidato = {
        productoCodigo: producto.codigo,
        fechaInicio: inicio.toISOString().slice(0, 10),
        fechaFin: fin.toISOString().slice(0, 10),
      };
      if (!mejor || candidato.fechaFin > mejor.fechaFin) mejor = candidato;
    });
    if (mejor) {
      usuario.membresia = mejor;
      guardarUsuario(usuario);
    }
  }

  // ---------------------------------------------------------------------
  // Carrito
  // ---------------------------------------------------------------------

  function getCarrito() {
    return leer(KEYS.carrito, []);
  }

  function guardarCarrito(carrito) {
    guardar(KEYS.carrito, carrito);
  }

  function agregarAlCarrito(codigo, cantidad) {
    cantidad = cantidad || 1;
    var producto = getProductoPorCodigo(codigo);
    if (!producto) return getCarrito();
    var carrito = getCarrito();
    var item = null;
    for (var i = 0; i < carrito.length; i++) {
      if (carrito[i].codigo === codigo) {
        item = carrito[i];
        break;
      }
    }
    // Un plan de membresía no tiene sentido duplicarlo: si ya está en el
    // carrito, no se suma cantidad de nuevo.
    if (item) {
      if (producto.tipo !== "Plan") item.cantidad += cantidad;
    } else {
      carrito.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        tipo: producto.tipo,
        precio: producto.precio,
        cantidad: producto.tipo === "Plan" ? 1 : cantidad,
      });
    }
    guardarCarrito(carrito);
    return carrito;
  }

  function actualizarCantidadCarrito(codigo, cantidad) {
    var carrito = getCarrito();
    carrito = carrito
      .map(function (item) {
        if (item.codigo === codigo) item.cantidad = cantidad;
        return item;
      })
      .filter(function (item) {
        return item.cantidad > 0;
      });
    guardarCarrito(carrito);
    return carrito;
  }

  function quitarDelCarrito(codigo) {
    var carrito = getCarrito().filter(function (item) {
      return item.codigo !== codigo;
    });
    guardarCarrito(carrito);
    return carrito;
  }

  function limpiarCarrito() {
    guardarCarrito([]);
  }

  function getTotalCarrito() {
    return getCarrito().reduce(function (acc, item) {
      return acc + item.precio * item.cantidad;
    }, 0);
  }

  function getCantidadItemsCarrito() {
    return getCarrito().reduce(function (acc, item) {
      return acc + item.cantidad;
    }, 0);
  }

  // ---------------------------------------------------------------------
  // Utilidades de formato
  // ---------------------------------------------------------------------

  function formatoCLP(valor) {
    try {
      return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
    } catch (e) {
      return "$" + valor;
    }
  }

  function getComunas(region) {
    return REGIONES[region] || [];
  }

  function getIconoCategoria(categoria) {
    return ICONO_POR_CATEGORIA[categoria] || "bi-box-seam";
  }

  // ---------------------------------------------------------------------
  // API pública
  // ---------------------------------------------------------------------

  global.GymratstoreData = {
    REGIONES: REGIONES,
    CATEGORIAS_PLAN: CATEGORIAS_PLAN,
    CATEGORIAS_SUPLEMENTO: CATEGORIAS_SUPLEMENTO,

    getProductos: getProductos,
    getProductoPorCodigo: getProductoPorCodigo,
    getProductosPorTipo: getProductosPorTipo,
    guardarProducto: guardarProducto,
    eliminarProducto: eliminarProducto,

    getUsuarios: getUsuarios,
    getUsuarioPorRun: getUsuarioPorRun,
    getUsuarioPorCorreo: getUsuarioPorCorreo,
    existeCorreo: existeCorreo,
    guardarUsuario: guardarUsuario,
    eliminarUsuario: eliminarUsuario,
    autenticar: autenticar,
    getEstadoMembresia: getEstadoMembresia,
    getUsuariosAlumnos: getUsuariosAlumnos,

    getOrdenes: getOrdenes,
    getOrdenesPorRun: getOrdenesPorRun,
    nombreClienteOrden: nombreClienteOrden,
    crearOrden: crearOrden,
    aplicarMembresiaDesdeOrden: aplicarMembresiaDesdeOrden,

    getCarrito: getCarrito,
    agregarAlCarrito: agregarAlCarrito,
    actualizarCantidadCarrito: actualizarCantidadCarrito,
    quitarDelCarrito: quitarDelCarrito,
    limpiarCarrito: limpiarCarrito,
    getTotalCarrito: getTotalCarrito,
    getCantidadItemsCarrito: getCantidadItemsCarrito,

    formatoCLP: formatoCLP,
    getComunas: getComunas,
    getIconoCategoria: getIconoCategoria,
  };
})(window);

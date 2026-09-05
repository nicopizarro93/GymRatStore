document.addEventListener("DOMContentLoaded", function () {
  var POSTS = {
    "1": {
      titulo: "5 errores comunes al elegir tu plan de gimnasio",
      fecha: "12 ago 2026",
      contenido:
        "<p>Elegir un plan de gimnasio no debería ser complicado, pero es fácil caer en errores que terminan costando caro o generando frustración. Estos son los más comunes que vemos en Gymratstore:</p>" +
        "<ol>" +
        "<li><strong>Elegir el plan más largo \"porque sale más barato\"</strong>, sin tener claro si vas a mantener la constancia. Un plan mensual que sí usas rinde más que un plan anual abandonado al segundo mes.</li>" +
        "<li><strong>No revisar los cupos disponibles.</strong> Cada plan tiene un cupo máximo de inscritos para que la sala nunca se sienta saturada - revisa la disponibilidad antes de comprar.</li>" +
        "<li><strong>Olvidar la evaluación física inicial.</strong> Los planes trimestral, semestral y anual la incluyen: úsala para partir con una rutina que realmente te sirva.</li>" +
        "<li><strong>No sumar la suplementación al presupuesto.</strong> Si vas a complementar tu entrenamiento con proteína o creatina, cotiza todo junto antes de decidir el plan.</li>" +
        "<li><strong>Registrarte con datos incompletos.</strong> Mantener tu ficha de alumno al día facilita cualquier trámite (renovación, cambio de plan, etc.).</li>" +
        "</ol>",
    },
    "2": {
      titulo: "Proteína en polvo: qué mirar antes de comprar",
      fecha: "25 ago 2026",
      contenido:
        "<p>El pasillo de suplementos puede ser abrumador. Antes de agregar una proteína al carrito, fíjate en estos puntos:</p>" +
        "<ul>" +
        "<li><strong>Gramos de proteína por porción</strong>, no solo el peso total del envase. Compara \"proteína por porción\" entre marcas, no el precio del bote.</li>" +
        "<li><strong>Tipo de proteína.</strong> La whey se absorbe rápido y es una buena opción post-entreno; otras variantes de absorción lenta rinden mejor de noche.</li>" +
        "<li><strong>Azúcares añadidos.</strong> Revisa la tabla nutricional, no solo el sabor en el empaque.</li>" +
        "<li><strong>Tu objetivo real.</strong> La proteína en polvo complementa una dieta, no la reemplaza - no es obligatoria para entrenar bien.</li>" +
        "</ul>" +
        "<p>En nuestro catálogo encontrarás variantes en distintos sabores y formatos, además de creatina y pre-entrenos para cuando el objetivo lo amerite.</p>",
    },
  };

  var parametros = new URLSearchParams(window.location.search);
  var id = parametros.get("id");
  var post = POSTS[id];

  if (!post) {
    document.getElementById("postNoEncontrado").classList.remove("d-none");
    document.getElementById("postTitulo").classList.add("d-none");
    document.getElementById("postFecha").classList.add("d-none");
    return;
  }

  document.title = post.titulo + " - Gymratstore";
  document.getElementById("postTitulo").textContent = post.titulo;
  document.getElementById("postFecha").textContent = post.fecha;
  document.getElementById("postContenido").innerHTML = post.contenido;
});

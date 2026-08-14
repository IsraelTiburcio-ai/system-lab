/* ============================================================
   SYSTEM LAB · data/challenge.js
   Desafío Integrador — Análisis Final.
   Sistema: Biblioteca Universitaria. Tres etapas:
   1) Anatomía (componentes)  2) Elementos  3) Clasificación
   ============================================================ */
(function (SL) {
  "use strict";

  SL.Data = SL.Data || {};

  SL.Data.challenge = {
    id: "challenge",
    name: "Desafío Final",
    title: "Análisis Final",
    icon: "trophy",
    systemName: "Biblioteca Universitaria",
    systemIcon: "book",
    systemDescription:
      "Integra todo lo aprendido: desarma la biblioteca en componentes, identifica sus elementos y clasifica el sistema completo.",
    intro: [
      "Has dominado los tres módulos del laboratorio.",
      "Ahora llega el ANÁLISIS FINAL: una biblioteca universitaria completa.",
      "Debes desarmarla, identificar sus elementos y clasificarla. Toma tu tiempo y aplica todo lo aprendido."
    ],
    stages: [
      {
        id: "anatomy",
        name: "Etapa 1",
        title: "Componentes de la biblioteca",
        type: "anatomy",
        context: "Identifica los componentes del sistema de la biblioteca universitaria: entrada, proceso, salida, retroalimentación y medio ambiente.",
        hint: "Pregúntate siempre: ¿qué entra?, ¿qué transforma?, ¿qué resulta?, ¿qué regresa como información?, ¿qué la rodea?",
        cards: [
          {
            id: "ch_lib_solicitudes",
            text: "Solicitudes de préstamo de los usuarios",
            category: "entrada",
            feedback: "Correcto. Las solicitudes ingresan a la biblioteca como información que deberá procesarse.",
            hint: "¿Las solicitudes entran a la biblioteca desde fuera para ser procesadas?"
          },
          {
            id: "ch_lib_adquisiciones",
            text: "Nuevos libros y materiales adquiridos",
            category: "entrada",
            feedback: "Correcto. Los materiales nuevos ingresan al sistema para ampliar el acervo.",
            hint: "¿Los libros nuevos entran a la biblioteca desde fuera?"
          },
          {
            id: "ch_lib_registro",
            text: "Registro y procesamiento de préstamos",
            category: "proceso",
            feedback: "Correcto. El registro transforma las solicitudes en préstamos controlados.",
            hint: "¿Qué mecanismo transforma una solicitud en un préstamo?"
          },
          {
            id: "ch_lib_entrega",
            text: "Libros entregados a los usuarios",
            category: "salida",
            feedback: "Correcto. Los libros entregados son el resultado que la biblioteca produce.",
            hint: "¿Qué resultado entrega la biblioteca después de procesar el préstamo?"
          },
          {
            id: "ch_lib_encuestas",
            text: "Encuestas y reportes de uso de la biblioteca",
            category: "retroalimentacion",
            feedback: "Correcto. Los reportes regresan información a la biblioteca para mejorar su servicio.",
            hint: "¿Qué información regresa a la biblioteca sobre el uso para permitir ajustes?"
          },
          {
            id: "ch_lib_entorno",
            text: "Comunidad universitaria y normativa institucional",
            category: "medio_ambiente",
            feedback: "Correcto. La comunidad y las normas rodean a la biblioteca y con ellas interactúa.",
            hint: "¿Qué entorno externo rodea a la biblioteca y condiciona su funcionamiento?"
          }
        ]
      },
      {
        id: "elements",
        name: "Etapa 2",
        title: "Elementos de la biblioteca",
        type: "elements",
        context: "Clasifica los elementos del sistema de la biblioteca como objeto, sujeto o concepto.",
        hint: "Objeto: elemento físico. Sujeto: persona. Concepto: idea o regla.",
        elements: [
          { id: "ch_el_bibliotecario", name: "Bibliotecario", category: "sujeto", icon: "user", feedback: "Es una persona que participa activamente dentro del sistema." },
          { id: "ch_el_libro", name: "Libro", category: "objeto", icon: "book", feedback: "Es un objeto físico no viviente que forma parte del sistema." },
          { id: "ch_el_catalogo", name: "Catálogo", category: "objeto", icon: "cube", feedback: "Es un elemento físico que registra y organiza el acervo." },
          { id: "ch_el_reglamento", name: "Reglamento de la biblioteca", category: "concepto", icon: "book", feedback: "Es una regla que existe de manera conceptual y regula al sistema." },
          { id: "ch_el_usuario", name: "Usuario", category: "sujeto", icon: "user", feedback: "Es una persona que interactúa activamente con el sistema." },
          { id: "ch_el_conocimiento", name: "Conocimiento", category: "concepto", icon: "idea", feedback: "Es un saber que existe de manera conceptual, sin existencia física." }
        ]
      },
      {
        id: "classification",
        name: "Etapa 3",
        title: "Clasificación de la biblioteca",
        type: "classification",
        context: "Construye el perfil de clasificación de la biblioteca universitaria.",
        hint: "Analiza si la biblioteca tiene vida, si existe físicamente, si intercambia con su ambiente y si su comportamiento cambia.",
        profile: { naturaleza: "no_viviente", representacion: "concreto", ambiente: "abierto", comportamiento: "dinamico" },
        justification: "La biblioteca es no viviente porque como organización no tiene vida biológica; es concreta porque existe físicamente con edificio, libros y equipos; es abierta porque intercambia información, personas y materiales con la comunidad; y es dinámica porque su acervo, servicios y procesos cambian constantemente."
      }
    ]
  };
})(window.SystemLab = window.SystemLab || {});

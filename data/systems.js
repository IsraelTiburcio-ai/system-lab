/* ============================================================
   SYSTEM LAB · data/systems.js
   Metadatos de conceptos y categorías del Gimnasio 1.
   Terminología del curso: componentes, elementos y clasificación.
   ============================================================ */
(function (SL) {
  "use strict";

  /* ---- Iconos SVG (path) para categorías y conceptos ---- */
  const ICON = {
    arrowIn: '<path d="M10 4v11l-4-4-1.4 1.4L12 19l7.4-6.6L18 11l-4 4V4h-4z" fill="currentColor"/>',
    arrowOut: '<path d="M14 4v11l4-4 1.4 1.4L12 19l-7.4-6.6L6 11l4 4V4h4z" fill="currentColor"/>',
    cog: '<path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5zM19 14l1.7 1.3-2 3.4-2-.8a7 7 0 0 1-2 1.2V22h-5v-2.9a7 7 0 0 1-2-1.2l-2 .8-2-3.4L4 14a7 7 0 0 1 0-2l-1.7-1.3 2-3.4 2 .8a7 7 0 0 1 2-1.2V4h5v2.9a7 7 0 0 1 2 1.2l2-.8 2 3.4L19 12a7 7 0 0 1 0 2z" fill="currentColor"/>',
    retro: '<path d="M19 9l-1.4 1.4L20 12.8a2.5 2.5 0 0 1-3.5 3.5l-2.4-2.4-5.7 5.7a1.6 1.6 0 0 1-2.3-2.3l5.7-5.7-2.4-2.4a2.5 2.5 0 0 1 3.5-3.5l2.4 2.4 2.4-2.4A2.5 2.5 0 0 1 21.2 8.2l-2.2 2.2.8.8z" fill="currentColor"/>',
    globe: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.9 5.6 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.6-3.9-9S9.5 5.6 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    cube: '<path d="M12 2.5l9 5v9l-9 5-9-5v-9l9-5zM12 2.5v9M3 7.5l9 4 9-4M12 11.5v10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    user: '<path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM3 21c0-3.3 4-6 9-6s9 2.7 9 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    idea: '<path d="M9 18a5 5 0 1 1 6 0 4 4 0 0 0-6 0zM10 21h4M11 17.5V20h2v-2.5M10 6V4M14 6V4M6 8H4M20 8h-2M7 5l-1.5-1.5M17 5l1.5-1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    dna: '<path d="M4 3c4 6 12 12 16 18M20 3c-4 6-12 12-16 18M8 6h8M8 12h8M8 18h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    brain: '<path d="M12 4a3 3 0 0 0-3 3v.5a3 3 0 0 0-2 5.2 3 3 0 0 0 1 5.8 3.5 3.5 0 0 0 6.5-1V7a3 3 0 0 0-2.5-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    leaf: '<path d="M5 19c0-8 5-14 14-14 0 9-5 14-14 14zM5 19c4-6 9-9 14-14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15zM20 18v3H6.5A2.5 2.5 0 0 1 4 18.5M9 7h6M9 11h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    lock: '<path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5V11z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0V4zM7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    target: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
    check: '<path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    x: '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    hint: '<path d="M9 18a5 5 0 1 1 6 0 4 4 0 0 0-6 0zM10 21h4M9 9a3 3 0 0 1 6 0c0 1.3-.7 2-1.4 2.8-.6.7-1.1 1.4-1.1 2.2h2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    info: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    soundOn: '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M18.8 6a9 9 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    soundOff: '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    refresh: '<path d="M4 4v6h6M20 20v-6h-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 9A7 7 0 0 1 18 8M18.5 15A7 7 0 0 1 6 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
    flag: '<path d="M5 21V4M5 4c4-2 7 2 14 0v9c-7 2-10-2-14 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    star: '<path d="M12 3l2.7 5.6 6.3.9-4.6 4.4 1.1 6.2L12 17.2 6.5 20l1.1-6.2L3 9.5l6.3-.9L12 3z" fill="currentColor"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    scan: '<path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M8 8h8v8H8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    heart: '<path d="M12 20s-7-4.6-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.4-9 9-9 9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'
  };

  /* ---- Componentes (Módulo 1) ---- */
  const COMPONENTS = {
    entrada: {
      label: "Entrada",
      short: "ENTRADA",
      icon: ICON.arrowIn,
      color: "var(--accent)",
      definition: "Son los insumos, impulsos o elementos que ingresan o dan arranque al sistema.",
      hint: "La entrada es lo que llega al sistema desde fuera y le da arranque. ¿Este elemento ingresa al sistema?"
    },
    proceso: {
      label: "Proceso",
      short: "PROCESO",
      icon: ICON.cog,
      color: "var(--accent-2)",
      definition: "Es la transformación o mecanismo mediante el cual las entradas se convierten en salidas.",
      hint: "El proceso transforma las entradas en salidas. ¿Este elemento se encarga de transformar?"
    },
    salida: {
      label: "Salida",
      short: "SALIDA",
      icon: ICON.arrowOut,
      color: "var(--accent-4)",
      definition: "Es el resultado o producto generado por el sistema.",
      hint: "La salida es el resultado o producto que el sistema entrega después del proceso."
    },
    retroalimentacion: {
      label: "Retroalimentación",
      short: "RETROALIMENTACIÓN",
      icon: ICON.retro,
      color: "var(--warn)",
      definition: "Es información que regresa al sistema y permite comparar resultados y realizar ajustes.",
      hint: "La retroalimentación regresa al sistema información de los resultados para permitir ajustes."
    },
    medio_ambiente: {
      label: "Medio ambiente",
      short: "MEDIO AMBIENTE",
      icon: ICON.globe,
      color: "var(--accent-3)",
      definition: "Es aquello que rodea externamente al sistema y con lo cual puede interactuar.",
      hint: "El medio ambiente es todo lo que rodea al sistema y con lo cual interactúa sin ser parte interna."
    }
  };

  /* Mensajes de error según la zona elegida (Módulo 1) */
  const COMPONENT_WRONG = {
    entrada: "Una entrada es un insumo que ingresa al sistema. Pregúntate: ¿este elemento entra desde afuera o pertenece a otra parte del sistema?",
    proceso: "Un proceso transforma las entradas en salidas. Pregúntate: ¿este elemento realiza la transformación, o es más bien un insumo o un resultado?",
    salida: "Una salida representa el resultado producido por el sistema. Pregúntate: ¿esta tarjeta entra al sistema o aparece después del proceso?",
    retroalimentacion: "La retroalimentación es información que regresa al sistema para ajustarlo. Pregúntate: ¿esta tarjeta regresa información sobre los resultados?",
    medio_ambiente: "El medio ambiente es todo lo que rodea externamente al sistema. Pregúntate: ¿esta tarjeta es algo externo que rodea al sistema, o forma parte de su funcionamiento interno?"
  };

  /* ---- Elementos (Módulo 2) ---- */
  const ELEMENT_CATEGORIES = {
    objeto: { label: "Objeto", icon: ICON.cube, definition: "Elementos no vivientes o elementos físicos que forman parte del sistema." },
    sujeto: { label: "Sujeto", icon: ICON.user, definition: "Personas o seres vivos pensantes involucrados en el sistema." },
    concepto: { label: "Concepto", icon: ICON.idea, definition: "Ideas, abstracciones, objetivos, reglas, conocimientos o elementos que existen de manera conceptual." }
  };

  const ELEMENT_WRONG = {
    objeto: "Un objeto es un elemento físico no viviente. Piensa: ¿este elemento tiene existencia física o se trata de una persona o de una idea?",
    sujeto: "Un sujeto es una persona o ser vivo pensante. Piensa: ¿este elemento es una persona, o es un objeto físico o una idea?",
    concepto: "Un concepto es una idea o abstracción sin existencia física. Piensa: ¿este elemento existe físicamente o solo de manera conceptual?"
  };

  /* ---- Clasificación (Módulo 3) ---- */
  const CLASSIFICATION = {
    naturaleza: {
      label: "Naturaleza",
      icon: ICON.leaf,
      options: [
        { id: "viviente", label: "Viviente", desc: "Tiene vida, crece y se desarrolla." },
        { id: "no_viviente", label: "No viviente", desc: "No posee vida biológica." }
      ],
      hint: "Naturaleza se refiere a si el sistema tiene vida o no. ¿Este sistema es un ser vivo?"
    },
    representacion: {
      label: "Representación",
      icon: ICON.idea,
      options: [
        { id: "abstracto", label: "Abstracto", desc: "No tiene existencia física; es conceptual." },
        { id: "concreto", label: "Concreto", desc: "Existe de manera física y tangible." }
      ],
      hint: "Representación se refiere a si el sistema tiene existencia física (concreto) o solo conceptual (abstracto)."
    },
    ambiente: {
      label: "Relación con el ambiente",
      icon: ICON.globe,
      options: [
        { id: "abierto", label: "Abierto", desc: "Intercambia materia, energía o información con el ambiente." },
        { id: "cerrado", label: "Cerrado", desc: "No intercambia materia, energía o información con el ambiente." }
      ],
      hint: "Un sistema abierto intercambia materia, energía o información con su ambiente; uno cerrado no lo hace."
    },
    comportamiento: {
      label: "Comportamiento",
      icon: ICON.dna,
      options: [
        { id: "estatico", label: "Estático", desc: "Mantiene su estructura sin cambios a lo largo del tiempo." },
        { id: "dinamico", label: "Dinámico", desc: "Cambia, se transforma o evoluciona con el tiempo." },
        { id: "homeostatico", label: "Homeostático", desc: "Regula internamente sus condiciones para mantenerse en equilibrio." }
      ],
      hint: "El comportamiento indica si el sistema es estable (estático), cambia con el tiempo (dinámico) o se autorregula para mantenerse en equilibrio (homeostático)."
    }
  };

  const CLASS_WRONG = {
    viviente: "Un sistema viviente tiene vida biológica. ¿Este sistema nace, crece y se desarrolla como un ser vivo?",
    no_viviente: "Un sistema no viviente no tiene vida biológica. ¿Este sistema podría considerarse un ser vivo?",
    abstracto: "Un sistema abstracto existe solo de manera conceptual, sin existencia física. ¿Tiene presencia física este sistema?",
    concreto: "Un sistema concreto tiene existencia física y tangible. ¿Este sistema se puede tocar o medir físicamente?",
    abierto: "Un sistema abierto intercambia materia, energía o información con su ambiente. ¿Este sistema intercambia algo con lo que lo rodea?",
    cerrado: "Un sistema cerrado no intercambia materia, energía ni información con su ambiente. ¿Realmente no intercambia nada con lo que lo rodea?",
    estatico: "Un sistema estático mantiene su estructura sin cambios. ¿Este sistema permanece igual en el tiempo o se transforma?",
    dinamico: "Un sistema dinámico cambia, se transforma o evoluciona. ¿Este sistema cambia a lo largo del tiempo?",
    homeostatico: "Un sistema homeostático se autorregula para mantener el equilibrio interno. ¿Este sistema regula activamente sus condiciones?"
  };

  const THEME = {
    name: "System Lab",
    gym: "Gimnasio 1 · Introducción a la Teoría de Sistemas",
    subject: "Optimización I"
  };

  SL.Systems = { ICON, COMPONENTS, COMPONENT_WRONG, ELEMENT_CATEGORIES, ELEMENT_WRONG, CLASSIFICATION, CLASS_WRONG, THEME };
})(window.SystemLab = window.SystemLab || {});

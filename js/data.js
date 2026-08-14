/* ============================================================
   SYSTEM CATCH · js/data.js
   Contenido académico: elementos y categorías.
   Objeto · Sujeto · Concepto (terminología del Gimnasio 1)
   ============================================================ */
window.SYSTEM_CATCH_DATA = {
  /* 8 elementos por partida */
  roundSize: 8,
  /* duración de caída base en ms (por elemento): 3-4 s de decisión */
  fallMs: 4200,
  /* se acelera un poco por cada acierto (mínimo 2400ms) */
  speedUp: 160,
  minFallMs: 2400,

  categories: {
    objeto: {
      label: "OBJETO",
      short: "Objeto",
      icon: "cube",
      tip: "Elemento físico no viviente"
    },
    sujeto: {
      label: "SUJETO",
      short: "Sujeto",
      icon: "user",
      tip: "Persona o ser vivo pensante"
    },
    concepto: {
      label: "CONCEPTO",
      short: "Concepto",
      icon: "idea",
      tip: "Idea, regla o conocimiento"
    }
  },

  elements: [
    { id: "pantalla", text: "Pantalla", category: "objeto" },
    { id: "profesor", text: "Profesor", category: "sujeto" },
    { id: "conocimiento", text: "Conocimiento", category: "concepto" },
    { id: "computadora", text: "Computadora", category: "objeto" },
    { id: "estudiante", text: "Estudiante", category: "sujeto" },
    { id: "objetivo", text: "Objetivo", category: "concepto" },
    { id: "maquina", text: "Máquina", category: "objeto" },
    { id: "trabajador", text: "Trabajador", category: "sujeto" },
    { id: "reglamento", text: "Reglamento", category: "concepto" },
    { id: "silla", text: "Silla", category: "objeto" },
    { id: "medico", text: "Médico", category: "sujeto" },
    { id: "diagnostico", text: "Diagnóstico", category: "concepto" },
    { id: "libro", text: "Libro", category: "objeto" },
    { id: "autor", text: "Autor", category: "sujeto" },
    { id: "informacion", text: "Información", category: "concepto" },
    { id: "herramienta", text: "Herramienta", category: "objeto" },
    { id: "cliente", text: "Cliente", category: "sujeto" },
    { id: "metodo", text: "Método", category: "concepto" },
    { id: "material", text: "Material", category: "objeto" },
    { id: "investigador", text: "Investigador", category: "sujeto" },
    { id: "sensor", text: "Sensor", category: "objeto" },
    { id: "usuario", text: "Usuario", category: "sujeto" },
    { id: "plan", text: "Plan de estudios", category: "concepto" },
    { id: "impresora", text: "Impresora", category: "objeto" },
    { id: "entrenador", text: "Entrenador", category: "sujeto" },
    { id: "norma", text: "Norma", category: "concepto" }
  ]
};

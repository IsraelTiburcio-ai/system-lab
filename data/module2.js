/* ============================================================
   SYSTEM LAB · data/module2.js
   Módulo 2 — Elementos del sistema.
   Escáner: clasifica cada elemento como OBJETO, SUJETO o CONCEPTO.
   ============================================================ */
(function (SL) {
  "use strict";

  SL.Data = SL.Data || {};

  SL.Data.module2 = {
    id: "module2",
    name: "Módulo 2",
    title: "Elementos del Sistema",
    icon: "scan",
    description:
      "Todo sistema está formado por objetos, sujetos y conceptos. Escanea cada elemento y colócalo en su categoría.",
    /* Se muestran 20 aleatorios por partida (se pueden ver más en repasos). */
    elementsPerRun: 20,
    elements: [
      { id: "pantalla", name: "Pantalla", category: "objeto", icon: "cube", feedback: "Es un dispositivo físico no viviente que forma parte del sistema." },
      { id: "profesor", name: "Profesor", category: "sujeto", icon: "user", feedback: "Es una persona que participa activamente dentro del sistema." },
      { id: "conocimiento", name: "Conocimiento", category: "concepto", icon: "idea", feedback: "Es un saber que existe de manera conceptual, sin existencia física." },
      { id: "computadora", name: "Computadora", category: "objeto", icon: "cube", feedback: "Es un equipo físico no viviente que forma parte del sistema." },
      { id: "estudiante", name: "Estudiante", category: "sujeto", icon: "user", feedback: "Es una persona involucrada en el sistema educativo." },
      { id: "objetivo", name: "Objetivo", category: "concepto", icon: "target", feedback: "Representa una idea o finalidad que orienta al sistema." },
      { id: "maquina", name: "Máquina", category: "objeto", icon: "cube", feedback: "Es un elemento físico no viviente que realiza tareas en el sistema." },
      { id: "trabajador", name: "Trabajador", category: "sujeto", icon: "user", feedback: "Es una persona que participa activamente dentro del sistema." },
      { id: "reglamento", name: "Reglamento", category: "concepto", icon: "book", feedback: "Es una regla o norma que existe de manera conceptual y guía al sistema." },
      { id: "silla", name: "Silla", category: "objeto", icon: "cube", feedback: "Es un elemento físico no viviente que forma parte del sistema." },
      { id: "medico", name: "Médico", category: "sujeto", icon: "user", feedback: "Es una persona que participa activamente dentro del sistema." },
      { id: "diagnostico", name: "Diagnóstico", category: "concepto", icon: "brain", feedback: "Es una idea o juicio que surge del análisis, sin existencia física." },
      { id: "libro", name: "Libro", category: "objeto", icon: "book", feedback: "Es un objeto físico no viviente que forma parte del sistema." },
      { id: "autor", name: "Autor", category: "sujeto", icon: "user", feedback: "Es una persona que participa activamente dentro del sistema." },
      { id: "informacion", name: "Información", category: "concepto", icon: "idea", feedback: "Son datos y significados que existen de manera conceptual." },
      { id: "herramienta", name: "Herramienta", category: "objeto", icon: "cube", feedback: "Es un elemento físico no viviente utilizado dentro del sistema." },
      { id: "cliente", name: "Cliente", category: "sujeto", icon: "user", feedback: "Es una persona que interactúa activamente con el sistema." },
      { id: "metodo", name: "Método", category: "concepto", icon: "idea", feedback: "Es una forma de proceder que existe de manera conceptual." },
      { id: "material", name: "Material", category: "objeto", icon: "cube", feedback: "Es un elemento físico no viviente que forma parte del sistema." },
      { id: "investigador", name: "Investigador", category: "sujeto", icon: "user", feedback: "Es una persona que participa activamente dentro del sistema." },
      { id: "sensor", name: "Sensor", category: "objeto", icon: "cube", feedback: "Es un dispositivo físico que capta señales dentro del sistema." },
      { id: "usuario", name: "Usuario", category: "sujeto", icon: "user", feedback: "Es una persona que interactúa activamente con el sistema." },
      { id: "plan_estudios", name: "Plan de estudios", category: "concepto", icon: "book", feedback: "Es un esquema académico que existe de manera conceptual." },
      { id: "impresora", name: "Impresora", category: "objeto", icon: "cube", feedback: "Es un equipo físico no viviente que forma parte del sistema." },
      { id: "entrenador", name: "Entrenador", category: "sujeto", icon: "user", feedback: "Es una persona que participa activamente dentro del sistema." },
      { id: "norma", name: "Norma", category: "concepto", icon: "idea", feedback: "Es una regla que existe de manera conceptual y regula al sistema." }
    ]
  };
})(window.SystemLab = window.SystemLab || {});

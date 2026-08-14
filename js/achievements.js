/* ============================================================
   SYSTEM LAB · js/achievements.js
   Logros / medallas. Definiciones + evaluación.
   ============================================================ */
(function (SL) {
  "use strict";

  const DEFS = [
    { id: "primer_analisis", name: "Primer Análisis", icon: "target", desc: "Completa tu primer escenario del Módulo 1.", check: (s) => s.progress.module1.completed.length >= 1 },
    { id: "arquitecto", name: "Arquitecto del Sistema", icon: "layers", desc: "Completa un escenario del Módulo 1 sin errores.", check: (s) => s.progress.module1.bestAccuracy === 100 },
    { id: "precision_total", name: "Precisión Total", icon: "star", desc: "Completa un escenario sin utilizar pistas.", check: (s) => s.progress.module1.noHintsScenario === true },
    { id: "analista", name: "Analista", icon: "scan", desc: "Alcanza 10 aciertos seguidos en el escáner de elementos.", check: (s) => s.stats.bestStreak >= 10 },
    { id: "sin_fronteras", name: "Sin Fronteras", icon: "globe", desc: "Completa todos los escenarios del Módulo 1.", check: (s) => s.progress.module1.completed.length >= SL.Data.module1.scenarios.length },
    { id: "escaneo_completo", name: "Escaneo Completo", icon: "brain", desc: "Completa el escáner de elementos del Módulo 2.", check: (s) => s.progress.module2.completed },
    { id: "clasificador", name: "Clasificador Experto", icon: "dna", desc: "Completa la clasificación de sistemas del Módulo 3.", check: (s) => s.progress.module3.completed },
    { id: "integracion", name: "Integración Total", icon: "trophy", desc: "Completa el Desafío Final del laboratorio.", check: (s) => s.progress.challenge.completed },
    { id: "puntaje_estelar", name: "Puntaje Estelar", icon: "star", desc: "Alcanza 3,000 puntos acumulados.", check: (s) => s.score >= 3000 },
    { id: "maestro", name: "Maestro de Sistemas", icon: "trophy", desc: "Completa el laboratorio al 100%.", check: (s) => Math.round(SL.State.completion() * 100) >= 100 }
  ];

  SL.Achievements = {
    DEFS,
    earned(state) {
      return DEFS.filter((d) => state.achievements.includes(d.id));
    },
    /* Devuelve los logros recién desbloqueados. */
    check() {
      const s = SL.State.get();
      const fresh = [];
      for (const def of DEFS) {
        if (!s.achievements.includes(def.id) && def.check(s)) {
          s.achievements.push(def.id);
          fresh.push(def);
        }
      }
      if (fresh.length) {
        SL.State.save();
        SL.Audio.play("achievement");
      }
      return fresh;
    }
  };
})(window.SystemLab = window.SystemLab || {});

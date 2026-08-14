/* ============================================================
   SYSTEM LAB · js/scoring.js
   Puntuación: acierto al 1º intento +100, 2º +70, 3º +40.
   Usar pista: -20.
   ============================================================ */
(function (SL) {
  "use strict";

  const POINTS = { 1: 100, 2: 70, 3: 40 };

  SL.Scoring = {
    POINTS,
    /* Puntos según el número de intento en el que se acierta. */
    pointsForAttempt(attempt) {
      return POINTS[Math.min(Math.max(attempt, 1), 3)] || 40;
    },
    /* Puntos por resolver una tarjeta, considerando intentos y pistas. */
    resolveCard(state, scenarioId, cardId, attempt) {
      let pts = SL.Scoring.pointsForAttempt(attempt);
      const info = state.progress.module1.cards[scenarioId] &&
        state.progress.module1.cards[scenarioId][cardId];
      if (info && info.hintUsed) pts -= 20;
      if (pts < 0) pts = 0;
      SL.State.addScore(pts);
      SL.State.save();
      return pts;
    },
    /* Mismo esquema para módulos 2, 3 y desafío. */
    resolve(state, attempt, hintUsed) {
      let pts = SL.Scoring.pointsForAttempt(attempt);
      if (hintUsed) pts -= 20;
      if (pts < 0) pts = 0;
      SL.State.addScore(pts);
      SL.State.save();
      return pts;
    },
    useHint() {
      SL.State.get().stats.hints += 1;
      SL.State.addScore(-20);
      SL.State.save();
    }
  };
})(window.SystemLab = window.SystemLab || {});

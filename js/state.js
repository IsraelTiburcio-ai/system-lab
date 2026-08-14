/* ============================================================
   SYSTEM LAB · js/state.js
   Estado central de la aplicación.
   ============================================================ */
(function (SL) {
  "use strict";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function defaultState() {
    return {
      version: 1,
      player: { name: "Aprendiz" },
      settings: { sound: true },
      score: 0,
      stats: {
        correct: 0,
        wrong: 0,
        hints: 0,
        bestStreak: 0,
        firstAttemptCorrect: 0,
        totalFirstAttempt: 0
      },
      progress: {
        tutorialSeen: false,
        introSeen: false,
        currentModule: "hub",
        module1: {
          completed: [],          // ids de escenarios completados
          current: null,          // escenario en curso
          cards: {},              // id tarjeta -> { attempts, hintUsed }
          bestAccuracy: 0
        },
        module2: {
          completed: false,
          runCount: 0,
          order: [],              // ids de elementos del recorrido actual
          index: 0,
          answers: {},            // id elemento -> { attempts }
          streak: 0,
          done: []                // ids ya respondidos correctamente (histórico)
        },
        module3: {
          completed: false,
          order: [],              // ids de sistemas
          index: 0,
          attempts: {},           // id sistema -> intentos de confirmación
          done: [],               // ids de sistemas completados
          currentProfile: {}
        },
        challenge: {
          completed: false,
          stage: 0,               // índice de la etapa actual
          stageDone: {},          // id etapa -> true
          anatomy: {},            // tarjetas de etapa 1
          elements: {},           // respuestas de etapa 2
          classification: { attempts: 0 }
        }
      },
      achievements: []
    };
  }

  let state = defaultState();

  SL.State = {
    get() { return state; },
    set(s) { state = s; },
    reset() { state = defaultState(); },
    save() { SL.Storage.save(state); },
    persist() { SL.Storage.save(state); },

    init() {
      const saved = SL.Storage.load();
      if (saved && saved.version === 1) {
        state = mergeState(defaultState(), saved);
      }
    },

    /* ---- helpers rápidos ---- */
    setScore(n) { state.score = Math.max(0, n); },
    addScore(n) { state.score = Math.max(0, state.score + n); },

    getScenarioCards(id) {
      return state.progress.module1.cards[id] || {};
    },
    setScenarioCard(scenarioId, cardId, data) {
      if (!state.progress.module1.cards[scenarioId]) state.progress.module1.cards[scenarioId] = {};
      state.progress.module1.cards[scenarioId][cardId] = data;
    },

    shuffleElements() {
      const pool = SL.Data.module2.elements.map((e) => e.id);
      const count = Math.min(SL.Data.module2.elementsPerRun, pool.length);
      state.progress.module2.order = shuffle(pool).slice(0, count);
      state.progress.module2.index = 0;
    },

    shuffleSystems() {
      state.progress.module3.order = shuffle(SL.Data.module3.systems.map((s) => s.id));
      state.progress.module3.index = 0;
      state.progress.module3.currentProfile = {};
    },

    /* ---- progreso global (0..1) ---- */
    completion() {
      const m1 = SL.Data.module1.scenarios;
      const m1Done = state.progress.module1.completed.length;
      const m1P = m1.length ? m1Done / m1.length : 0;

      const m2Total = SL.Data.module2.elements.length;
      const m2P = m2Total ? state.progress.module2.done.length / m2Total : 0;

      const m3Total = SL.Data.module3.systems.length;
      const m3P = m3Total ? state.progress.module3.done.length / m3Total : 0;

      const chP = state.progress.challenge.completed ? 1 : 0;

      return (m1P * 0.25) + (m2P * 0.25) + (m3P * 0.25) + (chP * 0.25);
    },

    moduleFraction(moduleId) {
      const p = state.progress;
      if (moduleId === "module1") {
        return p.module1.completed.length / SL.Data.module1.scenarios.length;
      }
      if (moduleId === "module2") {
        return p.module2.done.length / SL.Data.module2.elements.length;
      }
      if (moduleId === "module3") {
        return p.module3.done.length / SL.Data.module3.systems.length;
      }
      if (moduleId === "challenge") return p.challenge.completed ? 1 : 0;
      return 0;
    }
  };

  /* Une estado guardado sobre el default (soporta versiones futuras). */
  function mergeState(base, saved) {
    const out = JSON.parse(JSON.stringify(base));
    mergeDeep(out, saved);
    return out;
  }
  function mergeDeep(target, source) {
    for (const key of Object.keys(source || {})) {
      const sv = source[key];
      const tv = target[key];
      if (sv && typeof sv === "object" && !Array.isArray(sv) && tv && typeof tv === "object" && !Array.isArray(tv)) {
        mergeDeep(tv, sv);
      } else {
        target[key] = sv;
      }
    }
    return target;
  }

  SL._shuffle = shuffle;
})(window.SystemLab = window.SystemLab || {});

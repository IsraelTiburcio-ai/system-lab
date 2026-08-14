/* ============================================================
   SYSTEM LAB · js/audio.js
   Efectos de sonido procedurales (WebAudio). Sin archivos externos.
   ============================================================ */
(function (SL) {
  "use strict";

  let ctx = null;
  let master = null;
  let enabled = true;

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, gain, delay = 0) {
    const c = ensureCtx();
    if (!c || !enabled) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.25, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function sweep(f0, f1, dur, gain, type, delay = 0) {
    const c = ensureCtx();
    if (!c || !enabled) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || "sawtooth";
    osc.frequency.setValueAtTime(f0, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.2, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  const SOUNDS = {
    select: function () { tone(680, 0.08, "sine", 0.18); },
    tap: function () { tone(520, 0.06, "triangle", 0.15); },
    drag: function () { tone(300, 0.05, "triangle", 0.08); },
    correct: function () {
      tone(660, 0.12, "sine", 0.22);
      tone(880, 0.16, "sine", 0.22, 0.09);
      tone(1320, 0.22, "sine", 0.16, 0.18);
    },
    wrong: function () {
      sweep(220, 140, 0.3, 0.2, "square");
      tone(160, 0.25, "sawtooth", 0.12, 0.02);
    },
    hint: function () { tone(480, 0.1, "triangle", 0.16); tone(600, 0.12, "triangle", 0.14, 0.12); },
    unlock: function () {
      tone(523, 0.12, "sine", 0.2);
      tone(659, 0.12, "sine", 0.2, 0.1);
      tone(784, 0.12, "sine", 0.2, 0.2);
      tone(1047, 0.3, "sine", 0.22, 0.3);
    },
    achievement: function () {
      tone(880, 0.1, "sine", 0.2);
      tone(1109, 0.1, "sine", 0.2, 0.09);
      tone(1319, 0.24, "sine", 0.2, 0.18);
    },
    finish: function () {
      const notes = [523, 659, 784, 1047, 1319, 1568];
      notes.forEach((n, i) => tone(n, 0.18, "triangle", 0.2, i * 0.13));
    },
    count: function () { tone(1200, 0.04, "sine", 0.1); }
  };

  SL.Audio = {
    init() {
      ensureCtx();
    },
    setEnabled(v) { enabled = !!v; },
    isEnabled() { return enabled; },
    play(name) {
      if (!enabled) return;
      const fn = SOUNDS[name];
      if (fn) fn();
    },
    unlock() {
      // Pequeño gesto al tocar la interfaz: desbloquea audio en móviles.
      ensureCtx();
    }
  };
})(window.SystemLab = window.SystemLab || {});

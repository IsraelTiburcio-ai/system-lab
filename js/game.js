/* ============================================================
   SYSTEM CATCH · js/game.js
   Minijuego arcade: atrapa cada elemento en su categoría.
   Una mecánica · una partida · un resultado · ~60-90 s.
   ============================================================ */
(function () {
  "use strict";

  const DATA = window.SYSTEM_CATCH_DATA;
  const CATS = DATA.categories;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const BEST_KEY = "systemcatch_best";
  const SOUND_KEY = "systemcatch_sound";
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Estado ---------- */
  const game = {
    phase: "cover",       // cover | playing | result
    sequence: [],
    index: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    correct: 0,
    answered: false,      // bloquea doble respuesta del elemento actual
    fallMs: DATA.fallMs,
    sound: localStorage.getItem(SOUND_KEY) !== "off",
    best: parseInt(localStorage.getItem(BEST_KEY) || "0", 10)
  };

  /* ---------- Iconos (SVG originales) ---------- */
  const ICONS = {
    cube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l9 5v9l-9 5-9-5v-9l9-5zM12 2.5v9M3 7.5l9 4 9-4M12 11.5v10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM3 21c0-3.3 4-6 9-6s9 2.7 9 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    idea: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18a5 5 0 1 1 6 0 4 4 0 0 0-6 0zM10 21h4M11 17.5V20h2v-2.5M10 6V4M14 6V4M6 8H4M20 8h-2M7 5l-1.5-1.5M17 5l1.5-1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    soundOn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M18.8 6a9 9 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    soundOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };
  const icon = (name, cls) => `<span class="${cls || ""}">${ICONS[name]}</span>`;
  const CAT_ICON = { objeto: "cube", sujeto: "user", concepto: "idea" };

  /* ---------- Sonido (WebAudio, sin archivos) ---------- */
  let actx = null;
  function tone(freq, dur, type, gain, delay) {
    if (!game.sound) return;
    try {
      if (!actx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        actx = new AC();
      }
      if (actx.state === "suspended") actx.resume();
      const t0 = actx.currentTime + (delay || 0);
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain || 0.22, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) { /* el audio nunca debe romper el juego */ }
  }
  const sfx = {
    select: () => tone(640, 0.07, "triangle", 0.16),
    correct: () => { tone(660, 0.1, "sine", 0.2); tone(880, 0.14, "sine", 0.2, 0.08); },
    combo: () => { tone(660, 0.08, "sine", 0.2); tone(880, 0.08, "sine", 0.2, 0.07); tone(1109, 0.16, "sine", 0.2, 0.14); },
    wrong: () => { tone(200, 0.18, "sawtooth", 0.14); tone(150, 0.2, "square", 0.1, 0.05); },
    finish: () => [523, 659, 784, 1047, 1319].forEach((n, i) => tone(n, 0.16, "triangle", 0.2, i * 0.11))
  };

  /* ---------- Utilidades visuales ---------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function burst(x, y, color) {
    if (reduceMotion) return;
    const n = 12;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.className = "burst";
      p.style.background = color;
      p.style.left = x + "px";
      p.style.top = y + "px";
      const ang = Math.random() * Math.PI * 2;
      const dist = 34 + Math.random() * 56;
      p.style.setProperty("--tx", Math.cos(ang) * dist + "px");
      p.style.setProperty("--ty", Math.sin(ang) * dist + "px");
      document.body.appendChild(p);
      window.setTimeout(() => p.remove(), 700);
    }
  }

  function floatText(x, y, text, cls) {
    const t = document.createElement("div");
    t.className = "float-text " + (cls || "");
    t.textContent = text;
    t.style.left = x + "px";
    t.style.top = y + "px";
    document.body.appendChild(t);
    window.setTimeout(() => t.remove(), 750);
  }

  /* ---------- Pantallas ---------- */
  function showScreen(name) {
    ["cover", "game", "result"].forEach((s) => {
      const el = $("#screen-" + s);
      el.classList.toggle("is-active", s === name);
    });
    game.phase = name === "game" ? "playing" : name;
  }

  /* ---------- Ronda ---------- */
  function startRound() {
    const pool = shuffle(DATA.elements);
    game.sequence = pool.slice(0, DATA.roundSize);
    game.index = 0;
    game.score = 0;
    game.combo = 0;
    game.maxCombo = 0;
    game.correct = 0;
    game.fallMs = DATA.fallMs;
    renderDots();
    updateHud();
    showScreen("game");
    window.setTimeout(spawnNext, 400);
  }

  function renderDots() {
    $("#hud-dots").innerHTML = game.sequence.map((_, i) =>
      `<span class="hud-dot ${i === 0 ? "current" : ""}" id="dot-${i}"></span>`).join("");
  }

  function updateDots() {
    $$(".hud-dot").forEach((d, i) => {
      d.classList.toggle("current", i === game.index);
      d.classList.toggle("done", i < game.index && !!game.sequence[i]._ok);
      d.classList.toggle("missed", i < game.index && !game.sequence[i]._ok);
    });
  }

  function updateHud() {
    $("#score").textContent = game.score;
    const chip = $("#combo-chip");
    chip.textContent = "COMBO x" + game.combo;
    if (game.combo >= 2) {
      chip.classList.add("pop");
      window.setTimeout(() => chip.classList.remove("pop"), 180);
    }
  }

  function spawnNext() {
    if (game.phase !== "playing") return;
    const el = game.sequence[game.index];
    const zone = $("#fall-zone");
    const hint = $("#empty-hint");
    if (hint) hint.remove();
    zone.innerHTML = "";

    const node = document.createElement("div");
    node.className = "elem";
    node.dataset.id = el.id;
    node.style.transform = "translateX(-50%) rotate(" + (Math.random() * 3 - 1.5) + "deg)";
    // Sin icono: la palabra debe pensar su categoría, no adivinarla por el dibujo.
    node.innerHTML = "<span>" + el.text + "</span>";
    zone.appendChild(node);

    game.answered = false;
    startFall(node);
  }

  /* La caída se mueve por JS (rAF): funciona incluso con prefers-reduced-motion,
     y con esa preferencia activa da más tiempo de lectura. */
  function startFall(node) {
    const zone = $("#fall-zone");
    const zoneH = Math.max(zone.clientHeight, 200);
    const start = performance.now();
    const duration = reduceMotion ? game.fallMs * 1.6 : game.fallMs;
    const from = -78;
    const to = zoneH - 92;

    function tick(now) {
      if (!node.isConnected || game.phase !== "playing" || game.answered) return;
      const p = Math.min(1, (now - start) / duration);
      node.style.top = (from + (to - from) * p) + "px";
      if (p < 1) requestAnimationFrame(tick);
      else onMiss(node);
    }
    requestAnimationFrame(tick);
  }

  function catchElement(cat) {
    if (game.phase !== "playing" || game.answered) return;
    const el = game.sequence[game.index];
    if (!el) return;
    game.answered = true;
    const node = $(".elem", $("#fall-zone"));
    const rect = node ? node.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 3 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    if (cat === el.category) {
      // ---- CORRECTO ----
      game.correct++;
      game.combo++;
      game.maxCombo = Math.max(game.maxCombo, game.combo);
      game.score += 100;
      el._ok = true;

      if (node) {
        node.classList.remove("falling");
        node.classList.add("caught");
        window.setTimeout(() => node.remove(), 260);
      }
      const catcher = $('.catcher[data-cat="' + cat + '"]');
      if (catcher) {
        catcher.classList.add("hit");
        window.setTimeout(() => catcher.classList.remove("hit"), 220);
      }
      burst(cx, cy, game.combo >= 3 ? "#ffd166" : "#3ddc84");
      floatText(cx, cy - 14, "+100");
      if (game.combo >= 2) sfx.combo(); else sfx.correct();
      updateHud();
      next();
    } else {
      // ---- INCORRECTO ----
      if (node) {
        node.classList.remove("falling");
        node.classList.add("wrong");
        window.setTimeout(() => {
          node.classList.remove("wrong");
          node.classList.add("escaped");
        }, 430);
        window.setTimeout(() => node.remove(), 800);
      }
      const catcher = $('.catcher[data-cat="' + cat + '"]');
      if (catcher) {
        catcher.classList.add("wrong-hit");
        window.setTimeout(() => catcher.classList.remove("wrong-hit"), 400);
      }
      floatText(cx, cy - 10, "era: " + CATS[el.category].short, "era");
      game.combo = 0;
      sfx.wrong();
      updateHud();
      next();
    }
  }

  function onMiss(node) {
    if (game.phase !== "playing" || game.answered) return;
    game.answered = true;
    game.combo = 0;
    sfx.wrong();
    updateHud();
    const line = $(".danger-line");
    if (line) {
      line.classList.add("flash");
      window.setTimeout(() => line.classList.remove("flash"), 450);
    }
    window.setTimeout(() => { if (node) node.remove(); }, 120);
    next();
  }

  function next() {
    updateDots();
    game.index++;
    if (game.index >= game.sequence.length) {
      window.setTimeout(showResult, 650);
      return;
    }
    if (game.fallMs > DATA.minFallMs) game.fallMs = Math.max(DATA.minFallMs, game.fallMs - DATA.speedUp);
    window.setTimeout(spawnNext, 420);
  }

  /* ---------- Resultado ---------- */
  function showResult() {
    const total = game.sequence.length;
    const pct = game.correct / total;
    const msg = pct === 1 ? "¡Impecable!" : pct >= 0.75 ? "¡Gran partida!" : pct >= 0.5 ? "¡Bien jugado!" : "¡Sigue practicando!";
    $("#result-msg").textContent = msg;
    $("#r-correct").textContent = game.correct + "/" + total;
    $("#r-combo").textContent = "x" + game.maxCombo;
    $("#r-score").textContent = game.score;
    const isRecord = game.score > game.best;
    if (isRecord) {
      game.best = game.score;
      localStorage.setItem(BEST_KEY, String(game.best));
    }
    $("#r-best").textContent = game.best + (isRecord ? " · ¡NUEVO RÉCORD!" : "");
    $("#r-best").style.color = isRecord ? "var(--ok)" : "";
    updateBestOnCover();
    sfx.finish();
    showScreen("result");
  }

  function updateBestOnCover() {
    $("#best-cover").textContent = game.best;
  }

  /* ---------- Respuestas de la partida ---------- */
  function showAnswers() {
    const rows = game.sequence.map((el, i) => {
      const cat = CATS[el.category];
      const ok = !!el._ok;
      return `<div class="ans-row ${ok ? "ok" : "bad"}">
        <span class="ans-num">${i + 1}</span>
        <span class="ans-text">${el.text}</span>
        <span class="ans-cat c-${el.category}">${ICONS[CAT_ICON[el.category]]}${cat.label}</span>
        <span class="ans-mark" aria-hidden="true">${ok ? "✓" : "✗"}</span>
      </div>`;
    }).join("");

    const overlay = document.createElement("div");
    overlay.className = "answers-overlay";
    overlay.innerHTML = `
      <div class="answers-card" role="dialog" aria-modal="true" aria-label="Respuestas de la partida">
        <div class="answers-head">
          <h3>RESPUESTAS DE LA PARTIDA</h3>
          <button class="answers-close" aria-label="Cerrar">✕</button>
        </div>
        <div class="answers-list">${rows}</div>
        <div class="answers-foot">
          <button class="btn-sec">Entendido</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const close = () => {
      overlay.remove();
      document.removeEventListener("keydown", onKey, true);
    };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    overlay.querySelector(".answers-close").addEventListener("click", close);
    overlay.querySelector(".answers-foot .btn-sec").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", onKey, true);
  }

  /* ---------- Audio ---------- */
  function renderSoundIcon() {
    const el = $("#sound-icon");
    if (el) el.innerHTML = ICONS[game.sound ? "soundOn" : "soundOff"].replace(/^<svg/, '<svg width="19" height="19"');
  }
  function toggleSound() {
    game.sound = !game.sound;
    localStorage.setItem(SOUND_KEY, game.sound ? "on" : "off");
    renderSoundIcon();
    if (game.sound) sfx.select();
  }

  /* ---------- Entrada ---------- */
  function bind() {
    $("#btn-play").addEventListener("click", () => { sfx.select(); startRound(); });
    $("#btn-again").addEventListener("click", () => { sfx.select(); startRound(); });
    $("#btn-sound").addEventListener("click", toggleSound);
    $("#btn-answers").addEventListener("click", () => { sfx.select(); showAnswers(); });

    document.addEventListener("pointerdown", (e) => {
      const c = e.target.closest(".catcher");
      if (c && game.phase === "playing") catchElement(c.dataset.cat);
    });

    document.addEventListener("keydown", (e) => {
      if (game.phase !== "playing") return;
      const map = { "1": "objeto", "2": "sujeto", "3": "concepto" };
      if (map[e.key]) {
        e.preventDefault();
        catchElement(map[e.key]);
      }
    });
  }

  /* ---------- Arranque ---------- */
  function boot() {
    renderSoundIcon();
    updateBestOnCover();
    showScreen("cover");
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Exposición mínima para pruebas automatizadas.
  window.SYSTEM_CATCH = { startRound, catchElement, getState: () => game };
})();

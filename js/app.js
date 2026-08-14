/* ============================================================
   SYSTEM LAB · js/app.js
   Orquestación del laboratorio: inicio, tutorial, hub, módulos,
   desafío y resultados.
   ============================================================ */
(function (SL) {
  "use strict";

  const { Systems, Data } = SL;
  const UI = SL.UI;
  const I = (name, cls) => UI.icon(name, cls);
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  let dnD1 = null;  // DnD del Módulo 1 / desafío (anatomía)
  let dnD2 = null;  // DnD del Módulo 2 / desafío (elementos)
  let pendingFinal = false;
  const APP_VERSION = "v7";
  const runtimeErrors = [];

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    // Red de seguridad visible: si algo falla, se muestra en pantalla en lugar de fallar en silencio.
    window.addEventListener("error", (e) => {
      const msg = e.message || "Error desconocido";
      runtimeErrors.push(msg);
      showFatalError(msg);
    });
    window.addEventListener("unhandledrejection", (e) => {
      const msg = e.reason && e.reason.message ? e.reason.message : "Promesa rechazada";
      runtimeErrors.push(msg);
      showFatalError(msg);
    });

    try {
      // Verifica que todos los archivos de datos cargaron (evita pantallas en blanco).
      const missing = [];
      ["module1", "module2", "module3", "challenge"].forEach((k) => { if (!SL.Data[k]) missing.push("data/" + k + ".js"); });
      if (!SL.Systems) missing.push("data/systems.js");
      if (missing.length) throw new Error("No cargaron: " + missing.join(", ") + ". Recarga la página.");

      SL.State.init();
      const s = SL.State.get();
      SL.Audio.setEnabled(s.settings.sound);
      UI.renderSoundIcons(s.settings.sound);
      UI.bindGlobalSound();
      UI.attachRipple(document.body);
      initBackground();
      wireLanding();
      showScreen("landing");
      refreshSaveButtons();
      showDiagnosticsIfRequested();
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      runtimeErrors.push(msg);
      showFatalError(msg);
    }
  }

  /* Panel de diagnóstico en pantalla: /index.html?diag=1 */
  function showDiagnosticsIfRequested() {
    if (!/diag=1/.test(location.search)) return;
    const s = SL.State.get();
    const res = performance.getEntriesByType("resource").map((r) => r.name.replace(/^.*\//, "")).filter((n) => /\.js$/.test(n)).join(", ");
    const panel = document.createElement("div");
    panel.id = "diag-panel";
    panel.style.cssText = "position:fixed;left:12px;bottom:12px;right:12px;z-index:9998;max-height:46vh;overflow:auto;padding:14px 16px;border-radius:12px;background:rgba(8,12,26,.96);border:1px solid #38d6ff;color:#dce8ff;font:500 13px/1.5 Rajdhani,monospace,sans-serif;white-space:pre-wrap;";
    const lines = [
      "SYSTEM LAB · DIAGNÓSTICO",
      "Versión app: " + APP_VERSION,
      "Navegador: " + (navigator.userAgent || "desconocido"),
      "SystemLab cargado: " + (!!window.SystemLab),
      "Boot: " + (runtimeErrors.length ? "ERROR: " + runtimeErrors.join(" | ") : "OK"),
      "Pantalla activa: " + SL.Router.current,
      "Landing display: " + getComputedStyle(document.getElementById("screen-landing")).display,
      "Hub display: " + getComputedStyle(document.getElementById("screen-hub")).display,
      "Contenido hub (nodos): " + document.getElementById("screen-hub").children.length,
      "Contenido módulo1 (nodos): " + document.getElementById("screen-module1").children.length,
      "Score: " + s.score,
      "localStorage: " + (SL.Storage.load() ? "con datos" : "vacío"),
      "JS cargados: " + res
    ];
    panel.textContent = lines.join("\n");
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Cerrar diagnóstico";
    closeBtn.style.cssText = "margin-top:10px;padding:8px 16px;border-radius:8px;border:1px solid #38d6ff;background:#0e1a33;color:#38d6ff;font:700 13px Rajdhani,sans-serif;cursor:pointer;";
    closeBtn.addEventListener("click", () => panel.remove());
    panel.appendChild(closeBtn);
    document.body.appendChild(panel);
  }

  /* Muestra un error de arranque visible (para depuración con la profesora/alumnos). */
  function showFatalError(msg) {
    if (document.getElementById("fatal-banner")) return;
    const banner = document.createElement("div");
    banner.id = "fatal-banner";
    banner.style.cssText = "position:fixed;bottom:16px;left:16px;right:16px;z-index:9999;padding:12px 16px;border-radius:12px;background:#2a0d0d;border:1px solid #ff6b6b;color:#ffd9d9;font:600 0.9rem Rajdhani,system-ui,sans-serif;";
    banner.textContent = "System Lab detectó un error: " + msg + " · Recarga la página (Cmd+Shift+R) o revisa la consola (F12).";
    document.body.appendChild(banner);
  }

  function refreshSaveButtons() {
    const hasSave = !!SL.Storage.load();
    const btn = $("#btn-continue");
    if (hasSave) btn.classList.remove("hidden");
    else btn.classList.add("hidden");
  }

  /* ============================================================
     LANZADOR DE PANTALLAS (re-render al entrar)
     ============================================================ */
  function showScreen(name) {
    const s = SL.State.get();
    SL.Router.go(name, () => {
      updateTopbar(name);
      if (name === "hub") renderHub();
      else if (name === "module1") renderModule1();
      else if (name === "module2") renderModule2();
      else if (name === "module3") renderModule3();
      else if (name === "challenge") renderChallenge();
      else if (name === "results") renderResults(pendingFinal), (pendingFinal = false);
    });
  }

  function updateTopbar(name) {
    const titles = {
      hub: "Mapa del laboratorio",
      module1: "Módulo 1 · Anatomía",
      module2: "Módulo 2 · Elementos",
      module3: "Módulo 3 · Clasificación",
      challenge: "Desafío · Análisis Final",
      results: "Resultados"
    };
    $("#topbar-title").textContent = titles[name] || "";
    updateStats();
  }

  function updateStats() {
    const s = SL.State.get();
    $("#score-value").textContent = s.score.toLocaleString("es-MX");
    $("#streak-value").textContent = s.stats.bestStreak;
    UI.renderSoundIcons(s.settings.sound);
  }

  /* ============================================================
     PANTALLA DE INICIO
     ============================================================ */
  function wireLanding() {
    $("#btn-start").addEventListener("click", () => {
      SL.Audio.unlock();
      const s = SL.State.get();
      if (!s.progress.introSeen) {
        showIntroModal(() => {
          s.progress.introSeen = true;
          SL.State.save();
          afterIntro();
        });
      } else {
        afterIntro();
      }
    });

    $("#btn-continue").addEventListener("click", () => {
      SL.Audio.unlock();
      showScreen("hub");
    });

    $("#btn-instructions").addEventListener("click", () => showInstructionsModal());
    $("#btn-tutorial-landing").addEventListener("click", () => showTutorialModal());

    $("#btn-sound-landing").addEventListener("click", toggleSound);
    $("#btn-sound-top").addEventListener("click", toggleSound);

    $("#btn-reset-landing").addEventListener("click", () => {
      UI.confirmDialog({
        title: "Reiniciar progreso",
        iconName: "refresh",
        message: "Se borrará todo tu progreso, puntuación y logros en System Lab. ¿Continuar?",
        confirmLabel: "Sí, reiniciar",
        danger: true,
        onConfirm: () => {
          SL.Storage.clear();
          SL.State.reset();
          UI.renderSoundIcons(SL.State.get().settings.sound);
          refreshSaveButtons();
          UI.toast("Progreso reiniciado.", "info");
        }
      });
    });

    $("#btn-home").addEventListener("click", () => {
      const s = SL.State.get();
      s.progress.currentModule = "hub";
      SL.State.save();
      showScreen("hub");
    });

    $("#btn-tutorial-top").addEventListener("click", () => showTutorialModal());
  }

  function toggleSound() {
    const s = SL.State.get();
    s.settings.sound = !s.settings.sound;
    SL.Audio.setEnabled(s.settings.sound);
    SL.State.save();
    UI.renderSoundIcons(s.settings.sound);
    SL.Audio.play("select");
  }

  function afterIntro() {
    const s = SL.State.get();
    if (!s.progress.tutorialSeen) {
      showTutorialModal(() => {
        s.progress.tutorialSeen = true;
        SL.State.save();
        showScreen("hub");
      });
    } else {
      showScreen("hub");
    }
  }

  function showIntroModal(onDone) {
    const lines = [
      { icon: "info", text: "Bienvenido al System Lab. Tu misión será analizar sistemas reales, descubrir cómo están construidos y clasificarlos correctamente." },
      { icon: "layers", text: "Primero desarmarás sistemas en sus componentes: entrada, proceso, salida, retroalimentación y medio ambiente." },
      { icon: "trophy", text: "Después identificarás sus elementos y los clasificarás. Completa los tres módulos para desbloquear el Análisis Final." }
    ];
    let i = 0;
    let m = null;
    const body = document.createElement("div");
    function paint() {
      const l = lines[i];
      body.innerHTML = `
        <div class="center" style="display:flex;flex-direction:column;gap:14px;align-items:center">
          <div style="width:70px;height:70px;display:grid;place-items:center;border-radius:20px;background:var(--accent-soft);border:1px solid rgba(56,214,255,.4);color:var(--accent)">${I(l.icon, "")}</div>
          <p style="font-size:1.05rem;color:var(--text-0)">${UI.escapeHtml(l.text)}</p>
          <div style="display:flex;gap:6px">${lines.map((_, k) => `<span style="width:${k === i ? 22 : 8}px;height:8px;border-radius:99px;background:${k === i ? "var(--accent)" : "rgba(255,255,255,.15)"};transition:all .3s"></span>`).join("")}</div>
        </div>`;
    }
    m = UI.openModal({
      title: "System Lab",
      iconName: "dna",
      body,
      actions: [
        {
          label: "Omitir", kind: "btn-ghost", keepOpen: true,
          onClick: () => { i = lines.length; if (m) m.close(); onDone && onDone(); }
        },
        {
          label: "Continuar", kind: "btn-primary", keepOpen: true,
          onClick: () => {
            i++;
            if (i >= lines.length) { if (m) m.close(); onDone && onDone(); return; }
            paint();
          }
        }
      ],
      onClose: () => { if (i < lines.length) onDone && onDone(); }
    });
    paint();
    return m;
  }

  /* ============================================================
     TUTORIAL
     ============================================================ */
  const TUTORIAL_STEPS = [
    { icon: "scan", title: "1. Observa el sistema", text: "Cada escenario muestra un sistema real desarmado. Primero obsérvalo y piensa en qué hace cada parte." },
    { icon: "layers", title: "2. Arrastra cada elemento", text: "Toma una tarjeta y arrástrala a su zona. En pantallas táctiles, toca la tarjeta y después toca el destino." },
    { icon: "info", title: "3. Recibirás feedback", text: "Cada respuesta muestra una explicación breve: por qué es correcta o qué debes reconsiderar." },
    { icon: "hint", title: "4. Usa pistas si lo necesitas", text: "El botón PISTA te da orientación. Úsalo con moderación: cada pista resta 20 puntos." },
    { icon: "trophy", title: "5. Desbloquea el Análisis Final", text: "Completa los tres módulos para desbloquear el Desafío Integrador y obtener tu calificación final." }
  ];

  function showTutorialModal(onDone) {
    let i = 0;
    let m = null;
    const body = document.createElement("div");
    body.className = "tutorial-steps";
    function paint() {
      const st = TUTORIAL_STEPS[i];
      body.innerHTML = `
        <div class="tut-step is-active">
          <div class="ts-ico">${I(st.icon)}</div>
          <h4>${st.title}</h4>
          <p>${st.text}</p>
        </div>
        <div class="tut-dots">${TUTORIAL_STEPS.map((_, k) => `<span class="tut-dot${k === i ? " is-active" : ""}"></span>`).join("")}</div>`;
    }
    m = UI.openModal({
      title: "Tutorial",
      iconName: "hint",
      body,
      wide: true,
      actions: [
        { label: "Omitir", kind: "btn-ghost", keepOpen: true, onClick: () => { i = TUTORIAL_STEPS.length; if (m) m.close(); onDone && onDone(); } },
        {
          label: "Siguiente", kind: "btn-primary", keepOpen: true,
          onClick: () => {
            i++;
            if (i >= TUTORIAL_STEPS.length) { if (m) m.close(); onDone && onDone(); return; }
            paint();
          }
        }
      ],
      onClose: () => { if (i < TUTORIAL_STEPS.length) onDone && onDone(); }
    });
    paint();
    return m;
  }

  /* ============================================================
     INSTRUCCIONES
     ============================================================ */
  function showInstructionsModal() {
    const rows = [
      { chip: "Entrada", color: "var(--accent)", def: "Insumos o impulsos que ingresan al sistema." },
      { chip: "Proceso", color: "var(--accent-2)", def: "Transformación de las entradas en salidas." },
      { chip: "Salida", color: "var(--accent-4)", def: "Resultado o producto del sistema." },
      { chip: "Retroalimentación", color: "var(--warn)", def: "Información que regresa al sistema para ajustarlo." },
      { chip: "Medio ambiente", color: "var(--accent-3)", def: "Todo lo que rodea externamente al sistema." },
      { chip: "Objeto", color: "var(--accent)", def: "Elementos físicos no vivientes." },
      { chip: "Sujeto", color: "var(--accent-2)", def: "Personas o seres vivos pensantes." },
      { chip: "Concepto", color: "var(--accent-3)", def: "Ideas, reglas o conocimientos." }
    ];
    const list = rows.map((r) => `
      <div class="def-row">
        <span class="dr-chip chip"><span class="dot" style="background:${r.color}"></span>${r.chip}</span>
        <p>${r.def}</p>
      </div>`).join("");

    UI.openModal({
      title: "Instrucciones",
      iconName: "info",
      wide: true,
      body: `
        <div class="def-list" style="margin-bottom:18px">${list}</div>
        <div class="panel panel-pad" style="display:grid;gap:8px">
          <p style="color:var(--text-0)"><strong>Cómo jugar</strong></p>
          <p>• Arrastra las tarjetas con el mouse o el dedo. En móvil: toca la tarjeta y luego el destino.</p>
          <p>• <strong>Acierto al primer intento: +100 pts</strong>. Al segundo: +70. Al tercero: +40.</p>
          <p>• Usar una pista resta 20 puntos. Tu progreso se guarda automáticamente.</p>
          <p>• Navega con el teclado: <span class="key-cap">Tab</span> para enfocar, <span class="key-cap">Enter</span> para seleccionar o colocar.</p>
        </div>`,
      actions: [{ label: "Entendido", kind: "btn-primary", onClick: () => {} }]
    });
  }

  /* ============================================================
     HUB
     ============================================================ */
  function renderHub() {
    const s = SL.State.get();
    const root = $("#screen-hub");
    const pct = Math.round(SL.State.completion() * 100);
    const m1Done = s.progress.module1.completed.length;
    const m2Pct = Math.round((s.progress.module2.done.length / Data.module2.elements.length) * 100);
    const m3Pct = Math.round((s.progress.module3.done.length / Data.module3.systems.length) * 100);
    const allModules = s.progress.module1.completed.length >= Data.module1.scenarios.length &&
      s.progress.module2.completed &&
      s.progress.module3.completed;

    const ach = SL.Achievements.earned(s);

    root.innerHTML = `
      <div class="container">
        <div class="hub-header">
          <h2>Mapa del laboratorio</h2>
          <p>Recorre los módulos en orden. Al completar los tres, se desbloquea el Análisis Final.</p>
        </div>

        <div class="progress-block">
          <div class="progress-row">
            <span class="plabel">Progreso del laboratorio</span>
            <span class="pvalue" id="hub-pct">${pct}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" id="hub-fill"></div></div>
          <div class="progress-row" style="margin-top:10px;margin-bottom:0">
            <span class="plabel">Puntuación</span>
            <span class="pvalue" style="color:var(--accent-2)">${s.score.toLocaleString("es-MX")}</span>
          </div>
        </div>

        <div class="hub-grid">
          ${hubCard("module1", "01", "layers", "Anatomía del Sistema", "Componentes del sistema: entrada, proceso, salida, retroalimentación y medio ambiente.", m1Done / Data.module1.scenarios.length, m1Done === Data.module1.scenarios.length, false, `${m1Done}/${Data.module1.scenarios.length} escenarios`)}
          ${hubCard("module2", "02", "scan", "Elementos del Sistema", "Clasifica los elementos como objeto, sujeto o concepto.", m2Pct / 100, s.progress.module2.completed, false, `${m2Pct}%`)}
          ${hubCard("module3", "03", "dna", "Clasificación de Sistemas", "Construye el perfil completo de cada sistema.", m3Pct / 100, s.progress.module3.completed, false, `${m3Pct}%`)}
          ${hubCard("challenge", "04", "trophy", "Análisis Final", "Desafío integrador: desarma, identifica y clasifica una biblioteca universitaria.", s.progress.challenge.completed ? 1 : 0, s.progress.challenge.completed, !allModules, s.progress.challenge.completed ? "Completado" : "Bloqueado")}
        </div>

        <div class="hub-footer">
          <button class="btn btn-ghost btn-sm" id="btn-ach-hub" data-sound="tap">${I("trophy")} Logros (${ach.length}/${SL.Achievements.DEFS.length})</button>
          <button class="btn btn-ghost btn-sm" id="btn-tutorial-hub" data-sound="tap">${I("hint")} Ver tutorial</button>
          <button class="btn btn-ghost btn-sm" id="btn-results-hub" data-sound="tap">${I("target")} Mis resultados</button>
        </div>
      </div>`;

    requestAnimationFrame(() => {
      const fill = $("#hub-fill");
      if (fill) fill.style.width = pct + "%";
    });

    $("#btn-ach-hub").addEventListener("click", () => showAchievementsModal());
    $("#btn-tutorial-hub").addEventListener("click", () => showTutorialModal());
    $("#btn-results-hub").addEventListener("click", () => showScreen("results"));

    $$(".module-card", root).forEach((card) => {
      const activate = () => {
        const mod = card.dataset.mod;
        if (mod === "challenge" && !allModules) {
          UI.toast("Completa los tres módulos para desbloquear el Análisis Final.", "info");
          SL.Audio.play("wrong");
          return;
        }
        SL.Audio.play("select");
        showScreen(mod);
      };
      card.addEventListener("click", activate);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });
  }

  function hubCard(id, num, iconName, title, desc, frac, done, locked, status) {
    const statusChip = locked
      ? `<span class="status-chip locked">${I("lock", "")} Bloqueado</span>`
      : done
        ? `<span class="status-chip done">${I("check", "")} Completado</span>`
        : `<span class="status-chip pending">En curso</span>`;
    return `
      <div class="module-card ${locked ? "is-locked" : ""}" data-mod="${id}" role="button" tabindex="${locked ? -1 : 0}" aria-label="${title}" ${locked ? 'aria-disabled="true"' : ""}>
        ${locked ? `<span class="lock-badge">${I("lock")}</span>` : ""}
        <div class="mc-top">
          <span class="mc-num">MÓDULO ${num}</span>
          ${statusChip}
        </div>
        <div class="mc-icon">${I(iconName)}</div>
        <h3>${title}</h3>
        <p>${desc}</p>
        <div class="mc-progress"><i style="width:${Math.round(frac * 100)}%"></i></div>
        <div class="mc-actions">
          <span class="chip">${status}</span>
        </div>
      </div>`;
  }

  /* ============================================================
     MÓDULO 1 — ANATOMÍA DEL SISTEMA
     ============================================================ */
  function renderModule1() {
    const s = SL.State.get();
    const root = $("#screen-module1");
    let current = s.progress.module1.current;
    if (!current || !Data.module1.scenarios.find((sc) => sc.id === current)) {
      current = pickNextScenario();
      s.progress.module1.current = current;
      SL.State.save();
    }

    root.innerHTML = `
      <div class="container">
        <div class="page-head">
          <div>
            <h2>${Data.module1.title}</h2>
            <div class="head-sub">${Data.module1.description}</div>
          </div>
          <div class="scenario-actions" style="justify-content:flex-end">
            <button class="btn btn-ghost btn-sm" id="m1-back" data-sound="tap">${I("home")} Mapa</button>
          </div>
        </div>
        <div id="m1-scenario-selector" class="scenario-selector"></div>
        <div id="m1-body" style="margin-top:18px"></div>
      </div>`;

    $("#m1-back").addEventListener("click", () => showScreen("hub"));
    renderScenarioSelector();
    renderScenario(current);

    dnD1 = SL.DnD.create({
      root,
      sourceSelector: ".card-data.is-draggable",
      targetSelector: ".zone[data-zone]",
      onPlace: (source, target, mode) => handleM1Place(source, target),
      onSelect: () => {}
    });
  }

  function pickNextScenario() {
    const s = SL.State.get();
    const first = Data.module1.scenarios.find((sc) => !s.progress.module1.completed.includes(sc.id));
    return first ? first.id : Data.module1.scenarios[0].id;
  }

  function renderScenarioSelector() {
    const s = SL.State.get();
    const wrap = $("#m1-scenario-selector");
    const chips = Data.module1.scenarios.map((sc) => {
      const done = s.progress.module1.completed.includes(sc.id);
      const active = s.progress.module1.current === sc.id;
      return `
        <button class="sc-chip ${done ? "is-done" : ""} ${active ? "is-active" : ""}" data-id="${sc.id}" data-sound="tap" aria-pressed="${active}">
          <span class="sc-emoji">${sc.emoji}</span>
          <span class="sc-name">${UI.escapeHtml(sc.name)}</span>
          ${done ? `<span class="sc-mark">${I("check")}</span>` : ""}
        </button>`;
    }).join("");
    wrap.innerHTML = `<div class="sc-selector-row">${chips}</div>`;
    $$(".sc-chip", wrap).forEach((chip) => {
      chip.addEventListener("click", () => {
        const id = chip.dataset.id;
        const s2 = SL.State.get();
        if (s2.progress.module1.completed.includes(id)) {
          UI.confirmDialog({
            title: "Repetir escenario",
            iconName: "refresh",
            message: "Este escenario ya está completado. ¿Quieres volver a practicarlo? (Se reiniciarán sus tarjetas).",
            confirmLabel: "Repetir",
            onConfirm: () => {
              resetScenario(id);
              SL.State.get().progress.module1.current = id;
              SL.State.save();
              renderScenarioSelector();
              renderScenario(id);
            }
          });
          return;
        }
        s2.progress.module1.current = id;
        SL.State.save();
        renderScenarioSelector();
        renderScenario(id);
      });
    });
  }

  function resetScenario(id) {
    const s = SL.State.get();
    const sc = Data.module1.scenarios.find((x) => x.id === id);
    sc.cards.forEach((c) => {
      s.progress.module1.cards[id] = s.progress.module1.cards[id] || {};
      s.progress.module1.cards[id][c.id] = { attempts: 0, hintUsed: false, placed: false };
    });
    SL.State.save();
  }

  function normalizeScenarioState(sc) {
    const s = SL.State.get();
    s.progress.module1.cards[sc.id] = s.progress.module1.cards[sc.id] || {};
    sc.cards.forEach((c) => {
      if (!s.progress.module1.cards[sc.id][c.id]) {
        s.progress.module1.cards[sc.id][c.id] = { attempts: 0, hintUsed: false, placed: false };
      }
    });
  }

  const ZONES_ORDER = ["entrada", "proceso", "salida"];

  /* Mapas de categoría académica -> clase CSS de zona */
  const ZONE_CLASS = {
    entrada: "entrada",
    proceso: "proceso",
    salida: "salida",
    retroalimentacion: "retro",
    medio_ambiente: "ambient"
  };

  function zoneHtml(cat, label, iconName, cards, hintText) {
    const chips = cards.map((c) =>
      `<div class="card-data is-locked" data-card="${c.id}">${UI.escapeHtml(c.text)}</div>`).join("");
    return `
      <div class="zone zone-${ZONE_CLASS[cat] || cat}" data-zone="${cat}" tabindex="0" role="group" aria-label="Zona ${label}">
        <span class="zlabel">${I(iconName)} ${label}${hintText ? `<em style="font-style:normal;opacity:.55"> · ${hintText}</em>` : ""}</span>
        <div class="zcards">${chips}</div>
        ${chips ? "" : `<span class="zslot">Suelta aquí</span>`}
      </div>`;
  }

  function renderScenario(id) {
    const sc = Data.module1.scenarios.find((x) => x.id === id);
    if (!sc) return;
    normalizeScenarioState(sc);
    const s = SL.State.get();
    const cardsState = s.progress.module1.cards[sc.id];

    const placed = sc.cards.filter((c) => cardsState[c.id].placed);
    const remaining = sc.cards.filter((c) => !cardsState[c.id].placed);

    const zones = {
      entrada: placed.filter((c) => c.category === "entrada"),
      proceso: placed.filter((c) => c.category === "proceso"),
      salida: placed.filter((c) => c.category === "salida"),
      retroalimentacion: placed.filter((c) => c.category === "retroalimentacion"),
      medio_ambiente: placed.filter((c) => c.category === "medio_ambiente")
    };

    const body = $("#m1-body");
    body.innerHTML = `
      <div class="panel panel-pad m1-scenario-head">
        <h3>${sc.emoji} ${UI.escapeHtml(sc.name)}</h3>
        <p class="ctx">${UI.escapeHtml(sc.context)}</p>
        <div class="progress-row" style="max-width:420px;margin:14px auto 0">
          <span class="plabel">Tarjetas colocadas</span>
          <span class="pvalue" id="m1-count">${placed.length}/${sc.cards.length}</span>
        </div>
        <div class="progress-track" style="max-width:420px;margin:0 auto"><div class="progress-fill" id="m1-fill" style="width:${(placed.length / sc.cards.length) * 100}%"></div></div>
      </div>

      <div class="diagram-shell" style="margin-top:18px">
        <div class="diagram-frame">
          ${zoneHtml("medio_ambiente", "Medio ambiente", "globe", zones.medio_ambiente, "rodea al sistema")}
          <div class="zones-core">
            ${zoneHtml("entrada", "Entrada", "arrowIn", zones.entrada)}
            <span class="flow-arrows">${I("arrowOut")}</span>
            ${zoneHtml("proceso", "Proceso", "cog", zones.proceso)}
            <span class="flow-arrows">${I("arrowOut")}</span>
            ${zoneHtml("salida", "Salida", "arrowOut", zones.salida)}
          </div>
          <div class="zone-retro-row">
            ${zoneHtml("retroalimentacion", "Retroalimentación", "retro", zones.retroalimentacion, "regresa al sistema")}
          </div>
        </div>
      </div>

      <div class="scenario-actions" style="margin-top:16px">
        <div class="btn-hint-wrap">
          <button class="btn btn-secondary" id="m1-hint" data-sound="hint">${I("hint")} Pista <span class="count-badge" id="m1-hints-left"></span></button>
        </div>
        <span class="chip">Arrastra las tarjetas a su zona</span>
      </div>

      <div class="feedback-box" id="m1-feedback" role="status" aria-live="polite"></div>

      <div class="deck" id="m1-deck" aria-label="Tarjetas disponibles">
        <div class="deck-hint">${I("layers")} Coloca cada elemento del sistema en su componente:</div>
        ${remaining.map((c, i) =>
          `<div class="card-data is-draggable" draggable="false" tabindex="0" role="button" aria-label="Tarjeta: ${UI.escapeHtml(c.text)}" data-card="${c.id}" style="animation-delay:${i * 40}ms">${UI.escapeHtml(c.text)}</div>`
        ).join("")}
      </div>`;

    updateM1HintCount();
    wireM1Keyboard(body);
  }

  function updateM1HintCount() {
    const s = SL.State.get();
    const el = $("#m1-hints-left");
    if (!el) return;
    const scId = s.progress.module1.current;
    const sc = Data.module1.scenarios.find((x) => x.id === scId);
    if (!sc) return;
    const used = sc.cards.filter((c) => s.progress.module1.cards[scId][c.id].hintUsed).length;
    const remaining = Math.max(0, 2 - used);
    el.textContent = `(${remaining} restantes)`;
    if (remaining === 0) {
      const btn = $("#m1-hint");
      if (btn) btn.disabled = true;
    }
  }

  function wireM1Keyboard(body) {
    $$(".card-data.is-draggable", body).forEach((card) => {
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dnD1 && dnD1.clearSelection();
          selectM1Card(card);
        }
      });
    });
    $$(".zone[data-zone]", body).forEach((zone) => {
      zone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const selected = $(".card-data.is-selected", body);
          if (selected) handleM1Place(selected, zone);
        }
      });
    });
  }

  function selectM1Card(card) {
    $$(".card-data.is-selected", document).forEach((c) => c.classList.remove("is-selected"));
    card.classList.add("is-selected");
    SL.Audio.play("select");
  }

  function handleM1Place(source, target) {
    const s = SL.State.get();
    const scId = s.progress.module1.current;
    const sc = Data.module1.scenarios.find((x) => x.id === scId);
    const cardId = source.dataset.card;
    const card = sc.cards.find((c) => c.id === cardId);
    const cat = target.dataset.zone;
    if (!card || !cat) return { ok: false };

    const info = s.progress.module1.cards[scId][cardId];
    info.attempts += 1;

    if (card.category === cat) {
      // --- Correcto ---
      s.stats.correct += 1;
      if (info.attempts === 1) s.stats.firstAttemptCorrect += 1;
      s.stats.totalFirstAttempt += 1;
      info.placed = true;
      const pts = SL.Scoring.resolveCard(s, scId, cardId, info.attempts);
    updateStats();
      SL.State.save();

      // DOM
      source.remove();
      const zoneEl = $(".zone[data-zone='" + cat + "']", $("#m1-body"));
      if (zoneEl) {
        const slot = $(".zslot", zoneEl);
        if (slot) slot.remove();
        const zc = $(".zcards", zoneEl);
        const chip = UI.el(`<div class="card-data is-locked" data-card="${cardId}">${UI.escapeHtml(card.text)}</div>`);
        zc.appendChild(chip);
        zoneEl.classList.add("is-filled");
      }
      updateM1Count();
      showM1Feedback(true, `Correcto · +${pts}`, card.feedback, source);
      SL.Audio.play("correct");
      UI.burst(midpoint(zoneEl || source), { green: true });

      checkM1Completion(sc);
      return { ok: true };
    }

    // --- Incorrecto ---
    s.stats.wrong += 1;
    if (info.attempts === 1) s.stats.totalFirstAttempt += 1;
    SL.State.save();
    const wrongMsg = Systems.COMPONENT_WRONG[cat] || Systems.COMPONENT_WRONG.entrada;
    showM1Feedback(false, `No es ${Systems.COMPONENTS[cat].label}`, wrongMsg, target);
    SL.Audio.play("wrong");
    target.classList.add("is-wrong-drop");
    window.setTimeout(() => target.classList.remove("is-wrong-drop"), 600);
    return { ok: false };
  }

  function midpoint(el) {
    if (!el) return { x: innerWidth / 2, y: innerHeight / 2 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function updateM1Count() {
    const s = SL.State.get();
    const scId = s.progress.module1.current;
    const sc = Data.module1.scenarios.find((x) => x.id === scId);
    const placed = sc.cards.filter((c) => s.progress.module1.cards[scId][c.id].placed).length;
    const el = $("#m1-count");
    const fill = $("#m1-fill");
    if (el) el.textContent = `${placed}/${sc.cards.length}`;
    if (fill) fill.style.width = (placed / sc.cards.length) * 100 + "%";
  }

  function showM1Feedback(ok, title, text, anchorEl) {
    const box = $("#m1-feedback");
    if (!box) return;
    const kind = ok ? "ok" : "bad";
    box.className = "feedback-box is-visible " + kind;
    box.innerHTML = `
      <span class="fb-ico">${I(ok ? "check" : "x")}</span>
      <div>
        <div class="fb-title">${title}</div>
        <p style="color:var(--text-1)">${text}</p>
      </div>`;
  }

  function checkM1Completion(sc) {
    const s = SL.State.get();
    const cardsState = s.progress.module1.cards[sc.id];
    const allPlaced = sc.cards.every((c) => cardsState[c.id].placed);
    if (!allPlaced) return;

    const total = sc.cards.length;
    const firstOk = sc.cards.filter((c) => cardsState[c.id].attempts === 1).length;
    const accuracy = Math.round((firstOk / total) * 100);
    const hintsUsed = sc.cards.some((c) => cardsState[c.id].hintUsed);

    if (!s.progress.module1.completed.includes(sc.id)) s.progress.module1.completed.push(sc.id);
    s.progress.module1.bestAccuracy = Math.max(s.progress.module1.bestAccuracy || 0, accuracy);
    if (!hintsUsed) s.progress.module1.noHintsScenario = true;
    SL.State.save();

    const fresh = SL.Achievements.check();
    SL.Audio.play("unlock");

    const allDone = s.progress.module1.completed.length >= Data.module1.scenarios.length;
    UI.openModal({
      title: "Escenario completado",
      iconName: "check",
      wide: true,
      body: `
        <div class="center" style="display:grid;gap:16px">
          <div style="font-family:var(--font-display);font-size:2.4rem;font-weight:900;color:var(--ok)">${sc.emoji} ${UI.escapeHtml(sc.name)}</div>
          <div style="display:flex;justify-content:center;gap:10px">
            <span class="chip">Precisión: <strong style="color:var(--accent)">${accuracy}%</strong></span>
            <span class="chip">${hintsUsed ? "Pistas usadas" : "Sin pistas"}</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${accuracy}%"></div></div>
          ${allDone ? `<p style="color:var(--ok);font-weight:700">¡Has completado todos los escenarios del Módulo 1!</p>` : ""}
        </div>`,
      actions: [
        { label: "Mapa", kind: "btn-ghost", onClick: () => showScreen("hub") },
        {
          label: allDone ? "Continuar" : "Siguiente escenario", kind: "btn-primary",
          onClick: () => {
            if (!allDone) {
              const next = pickNextScenario();
              s.progress.module1.current = next;
              SL.State.save();
              renderScenarioSelector();
              renderScenario(next);
            } else {
              s.progress.module1.current = Data.module1.scenarios[0].id;
              SL.State.save();
              showScreen("module2");
            }
          }
        }
      ]
    });
    if (fresh.length) UI.queueAchievements(fresh);
  }

  /* Pista del Módulo 1 */
  function useM1Hint() {
    const s = SL.State.get();
    const scId = s.progress.module1.current;
    const sc = Data.module1.scenarios.find((x) => x.id === scId);
    const cardsState = s.progress.module1.cards[scId];
    const remaining = sc.cards.filter((c) => !cardsState[c.id].placed);
    if (!remaining.length) return;

    const used = sc.cards.filter((c) => cardsState[c.id].hintUsed).length;
    if (used >= 2) {
      UI.toast("Ya usaste las dos pistas de este escenario.", "info");
      return;
    }

    const target = remaining[0];
    cardsState[target.id].hintUsed = true;
    SL.Scoring.useHint();
    updateStats();
    SL.State.save();

    updateM1HintCount();
    const box = $("#m1-feedback");
    if (box) {
      box.className = "feedback-box is-visible hint-box";
      box.innerHTML = `
        <span class="fb-ico">${I("hint")}</span>
        <div>
          <div class="fb-title">Pista · orientación (-20 pts)</div>
          <p style="color:var(--text-1)"><strong style="color:var(--text-0)">${UI.escapeHtml(target.text)}:</strong> ${target.hint}</p>
        </div>`;
    }
    const deckEl = $$(".card-data.is-draggable[data-card='" + target.id + "']", $("#m1-deck"))[0];
    if (deckEl) {
      deckEl.classList.add("anim-pulse");
      window.setTimeout(() => deckEl.classList.remove("anim-pulse"), 800);
    }
  }

  /* ============================================================
     MÓDULO 2 — ELEMENTOS DEL SISTEMA
     ============================================================ */
  function renderModule2() {
    const s = SL.State.get();
    const root = $("#screen-module2");

    // Asegurar un recorrido válido
    if (!s.progress.module2.order.length) SL.State.shuffleElements();
    if (s.progress.module2.index >= s.progress.module2.order.length && !s.progress.module2.completed) {
      SL.State.shuffleElements();
    }

    root.innerHTML = `
      <div class="container">
        <div class="page-head">
          <div>
            <h2>${Data.module2.title}</h2>
            <div class="head-sub">${Data.module2.description}</div>
          </div>
          <button class="btn btn-ghost btn-sm" id="m2-back" data-sound="tap">${I("home")} Mapa</button>
        </div>
        <div id="m2-body"></div>
      </div>`;

    $("#m2-back").addEventListener("click", () => showScreen("hub"));

    dnD2 = SL.DnD.create({
      root,
      sourceSelector: ".element-card",
      targetSelector: ".cat-btn[data-cat]",
      fallbackSource: ".element-card",
      onPlace: (source, target, mode) => handleM2Place(source, target),
      onSelect: () => {}
    });

    renderM2Body();
  }

  function renderM2Body() {
    const s = SL.State.get();
    const body = $("#m2-body");

    if (s.progress.module2.completed) {
      renderM2Completed(body);
      return;
    }

    const doneCount = s.progress.module2.done.length;
    const total = Data.module2.elements.length;
    const idx = s.progress.module2.index;
    const order = s.progress.module2.order;
    const elemId = order[idx];

    if (!elemId) {
      SL.State.shuffleElements();
      renderM2Body();
      return;
    }

    const elem = Data.module2.elements.find((e) => e.id === elemId);
    if (!elem) {
      s.progress.module2.index++;
      SL.State.save();
      renderM2Body();
      return;
    }

    body.innerHTML = `
      <div class="m2-scanner">
        <div class="m2-progress">
          <div class="m2-counter">
            <span>Progreso del escáner</span>
            <span><strong id="m2-done">${doneCount}</strong>/${total} clasificados</span>
          </div>
          <div class="progress-track"><div class="progress-fill" id="m2-fill" style="width:${(doneCount / total) * 100}%"></div></div>
        </div>

        <div class="scanner-stage">
          <div class="scanner-beam scan"></div>
          <div class="element-card" data-element="${elem.id}" tabindex="0" role="button" aria-label="Elemento: ${UI.escapeHtml(elem.name)}. Elige su categoría.">
            <div class="el-icon">${I(elem.icon || "cube")}</div>
            <h3>${UI.escapeHtml(elem.name)}</h3>
            <span class="el-tag">¿Objeto, sujeto o concepto?</span>
          </div>
        </div>

        <div class="category-rail" role="group" aria-label="Categorías">
          ${catBtnHtml("objeto")}
          ${catBtnHtml("sujeto")}
          ${catBtnHtml("concepto")}
        </div>

        <div class="scenario-actions" style="margin-top:16px">
          <button class="btn btn-secondary" id="m2-hint" data-sound="hint">${I("hint")} Pista (-20 pts)</button>
          <span class="m2-streak">${I("star")} Mejor racha: <strong>${s.stats.bestStreak}</strong></span>
        </div>

        <div class="feedback-box" id="m2-feedback" role="status" aria-live="polite"></div>
      </div>`;

    wireM2Keyboard(body);
  }

  function catBtnHtml(cat) {
    const c = Systems.ELEMENT_CATEGORIES[cat];
    return `<button class="cat-btn" data-cat="${cat}" data-sound="tap" aria-label="${c.label}">${I(c.icon)} ${c.label}</button>`;
  }

  function wireM2Keyboard(body) {
    const card = $(".element-card", body);
    if (card) {
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dnD2 && dnD2.clearSelection();
          card.classList.add("is-selected");
          SL.Audio.play("select");
        }
      });
    }
    // El clic directo sobre una categoría lo resuelve el motor (fallbackSource).
    $$(".cat-btn", body).forEach((btn) => {
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const selected = $(".element-card.is-selected", body);
          handleM2Place(selected || $(".element-card", body), btn);
        }
      });
    });
  }

  function handleM2Place(source, target) {
    const s = SL.State.get();
    if (s.progress.module2.completed) return { ok: false };
    const card = source && source.dataset ? source.dataset.element || source.dataset.card : null;
    const cat = target.dataset.cat;
    if (!card || !cat) return { ok: false };

    const elem = Data.module2.elements.find((e) => e.id === card);
    if (!elem) return { ok: false };

    const body = $("#m2-body");
    const info = s.progress.module2.answers[card] || { attempts: 0, hintUsed: false };
    info.attempts += 1;
    s.progress.module2.answers[card] = info;

    const fb = $("#m2-feedback");

    if (elem.category === cat) {
      // Correcto
      s.stats.correct += 1;
      s.progress.module2.streak += 1;
      s.stats.bestStreak = Math.max(s.stats.bestStreak, s.progress.module2.streak);
      if (!s.progress.module2.done.includes(card)) s.progress.module2.done.push(card);
      const pts = SL.Scoring.resolve(s, info.attempts, info.hintUsed);
    updateStats();
      SL.State.save();

      if (fb) {
        fb.className = "feedback-box is-visible ok";
        fb.innerHTML = `
          <span class="fb-ico">${I("check")}</span>
          <div>
            <div class="fb-title">${UI.escapeHtml(elem.name)} → ${Systems.ELEMENT_CATEGORIES[cat].label.toUpperCase()} · +${pts}</div>
            <p style="color:var(--text-1)">${elem.feedback}</p>
          </div>`;
      }
      SL.Audio.play("correct");
      const stage = $(".scanner-stage", body);
      UI.burst(midpoint(stage), { green: true });

      s.progress.module2.index++;
      SL.State.save();

      if (s.progress.module2.done.length >= Data.module2.elements.length) {
        s.progress.module2.completed = true;
        SL.State.save();
        const fresh = SL.Achievements.check();
        SL.Audio.play("unlock");
        window.setTimeout(() => {
          renderM2Body();
          showM2CompletedModal();
        }, 550);
        if (fresh.length) UI.queueAchievements(fresh);
      } else if (s.progress.module2.index >= s.progress.module2.order.length) {
        // Ronda terminada
        SL.State.shuffleElements();
        renderM2Body();
        UI.toast("Ronda completada. Nuevos elementos en pantalla.", "info");
        SL.Audio.play("select");
      } else {
        renderM2Body();
      }
      return { ok: true };
    }

    // Incorrecto
    s.stats.wrong += 1;
    s.progress.module2.streak = 0;
    SL.State.save();
    const wrongMsg = Systems.ELEMENT_WRONG[cat] || Systems.ELEMENT_WRONG.objeto;
    if (fb) {
      fb.className = "feedback-box is-visible bad";
      fb.innerHTML = `
        <span class="fb-ico">${I("x")}</span>
        <div>
          <div class="fb-title">${UI.escapeHtml(elem.name)} no es ${Systems.ELEMENT_CATEGORIES[cat].label}</div>
          <p style="color:var(--text-1)">${wrongMsg}</p>
        </div>`;
    }
    SL.Audio.play("wrong");
    const cardEl = $(".element-card", body);
    if (cardEl) {
      cardEl.classList.add("is-wrong-shake");
      window.setTimeout(() => cardEl.classList.remove("is-wrong-shake"), 500);
    }
    return { ok: false };
  }

  function useM2Hint() {
    const s = SL.State.get();
    const idx = s.progress.module2.index;
    const elemId = s.progress.module2.order[idx];
    const info = s.progress.module2.answers[elemId] || { attempts: 0, hintUsed: false };
    if (info.hintUsed) {
      UI.toast("Ya usaste la pista de este elemento.", "info");
      return;
    }
    info.hintUsed = true;
    s.progress.module2.answers[elemId] = info;
    SL.Scoring.useHint();
    updateStats();
    SL.State.save();
    const fb = $("#m2-feedback");
    if (fb) {
      const cats = ["objeto", "sujeto", "concepto"].map((c) => {
        const cc = Systems.ELEMENT_CATEGORIES[c];
        return `<strong style="color:var(--accent)">${cc.label}:</strong> ${cc.definition}`;
      }).join("<br><br>");
      fb.className = "feedback-box is-visible hint-box";
      fb.innerHTML = `
        <span class="fb-ico">${I("hint")}</span>
        <div>
          <div class="fb-title">Pista · recuerda las categorías (-20 pts)</div>
          <p style="color:var(--text-1)">${cats}</p>
        </div>`;
    }
  }

  function renderM2Completed(body) {
    const s = SL.State.get();
    body.innerHTML = `
      <div class="panel panel-pad center" style="max-width:560px;margin:40px auto;display:grid;gap:16px">
        <div style="width:80px;height:80px;margin:0 auto;display:grid;place-items:center;border-radius:24px;background:var(--ok-soft);border:1px solid rgba(61,220,132,.5);color:var(--ok)">${I("check")}</div>
        <h3 style="font-size:1.4rem">Escáner completado</h3>
        <p>Clasificaste todos los elementos del laboratorio. Puedes repasar con nuevas rondas aleatorias.</p>
        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap">
          <button class="btn btn-primary" id="m2-replay" data-sound="tap">${I("refresh")} Nueva ronda</button>
          <button class="btn btn-ghost" id="m2-next" data-sound="tap">${I("arrowOut")} Continuar</button>
        </div>
      </div>`;
    $("#m2-replay").addEventListener("click", () => {
      s.progress.module2.runCount += 1;
      s.progress.module2.answers = {};
      s.progress.module2.streak = 0;
      SL.State.shuffleElements();
      SL.State.save();
      renderM2Body();
    });
    $("#m2-next").addEventListener("click", () => showScreen("module3"));
  }

  function showM2CompletedModal() {
    const s = SL.State.get();
    UI.openModal({
      title: "Módulo 2 completado",
      iconName: "check",
      body: `
        <div class="center" style="display:grid;gap:12px">
          <p style="font-size:1.05rem;color:var(--text-0)">¡Identificaste todos los elementos como objetos, sujetos o conceptos!</p>
          <p>Continúa con el Módulo 3 para clasificar sistemas completos.</p>
        </div>`,
      actions: [
        { label: "Mapa", kind: "btn-ghost", onClick: () => showScreen("hub") },
        { label: "Módulo 3", kind: "btn-primary", onClick: () => showScreen("module3") }
      ]
    });
  }

  /* ============================================================
     MÓDULO 3 — CLASIFICACIÓN DE SISTEMAS
     ============================================================ */
  function renderModule3() {
    const s = SL.State.get();
    const root = $("#screen-module3");

    if (!s.progress.module3.order.length) SL.State.shuffleSystems();
    if (s.progress.module3.index >= s.progress.module3.order.length && !s.progress.module3.completed) {
      SL.State.shuffleSystems();
    }

    root.innerHTML = `
      <div class="container">
        <div class="page-head">
          <div>
            <h2>${Data.module3.title}</h2>
            <div class="head-sub">${Data.module3.description}</div>
          </div>
          <button class="btn btn-ghost btn-sm" id="m3-back" data-sound="tap">${I("home")} Mapa</button>
        </div>
        <div id="m3-body"></div>
      </div>`;

    $("#m3-back").addEventListener("click", () => showScreen("hub"));
    renderM3Body();
  }

  function renderM3Body() {
    const s = SL.State.get();
    const body = $("#m3-body");

    if (s.progress.module3.completed) {
      renderM3Completed(body);
      return;
    }

    const idx = s.progress.module3.index;
    const sysId = s.progress.module3.order[idx];
    const sys = Data.module3.systems.find((x) => x.id === sysId);
    if (!sys) {
      SL.State.shuffleSystems();
      renderM3Body();
      return;
    }

    body.innerHTML = `
      <div class="m3-layout">
        <div class="panel panel-pad sys-card-lg">
          <div class="sys-ico">${I(sys.icon)}</div>
          <h3>${UI.escapeHtml(sys.name)}</h3>
          <p>${UI.escapeHtml(sys.description)}</p>
          <button class="btn btn-secondary btn-sm" id="m3-hint" data-sound="hint" style="margin-top:16px">${I("hint")} Pista (-20 pts)</button>
          <div style="margin-top:12px"><span class="chip">Sistema ${idx + 1} de ${s.progress.module3.order.length}</span></div>
        </div>

        <div>
          <div class="axis-list" id="m3-axes"></div>
          <div class="profile-panel panel" id="m3-profile" style="display:none"></div>
          <div class="scenario-actions" style="margin-top:16px">
            <button class="btn btn-primary btn-lg" id="m3-confirm" data-sound="tap" style="flex:1">${I("check")} Confirmar perfil</button>
          </div>
          <div class="feedback-box" id="m3-feedback" role="status" aria-live="polite"></div>
        </div>
      </div>`;

    renderM3Axes(sys);
    wireM3Keyboard(sys);
  }

  function renderM3Axes(sys) {
    const axes = $("#m3-axes");
    axes.innerHTML = Object.keys(Systems.CLASSIFICATION).map((axis) => {
      const ax = Systems.CLASSIFICATION[axis];
      const opts = ax.options.map((o) =>
        `<button class="opt-btn" data-axis="${axis}" data-opt="${o.id}" data-sound="tap">${UI.escapeHtml(o.label)}</button>`
      ).join("");
      return `
        <div class="axis-group panel">
          <div class="ax-label">${I(ax.icon)} ${ax.label}</div>
          <div class="axis-opts" role="radiogroup" aria-label="${ax.label}">${opts}</div>
        </div>`;
    }).join("");

    $$(".opt-btn", axes).forEach((btn) => {
      btn.addEventListener("click", () => {
        const axis = btn.dataset.axis;
        $$(".opt-btn[data-axis='" + axis + "']", axes).forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        SL.Audio.play("tap");
        updateM3ConfirmState();
      });
    });
  }

  function updateM3ConfirmState() {
    const axes = $("#m3-axes");
    if (!axes) return;
    const all = Object.keys(Systems.CLASSIFICATION).every((axis) =>
      $(".opt-btn[data-axis='" + axis + "'].is-selected", axes)
    );
    const btn = $("#m3-confirm");
    if (btn) btn.disabled = !all;
  }

  function wireM3Keyboard(sys) {
    const confirmBtn = $("#m3-confirm");
    confirmBtn.addEventListener("click", () => confirmM3Profile(sys));
    const hintBtn = $("#m3-hint");
    hintBtn.addEventListener("click", () => useM3Hint(sys));
  }

  function confirmM3Profile(sys) {
    const s = SL.State.get();
    const axes = $("#m3-axes");
    if (!axes) return;

    const hintsUsed = s.progress.module3.attempts[sys.id] ? s.progress.module3.attempts[sys.id].hintUsed : false;

    let allCorrect = true;
    let firstWrongAxis = null;

    Object.keys(Systems.CLASSIFICATION).forEach((axis) => {
      const sel = $(".opt-btn[data-axis='" + axis + "'].is-selected", axes);
      const expected = sys.profile[axis];
      const btn = sel;
      $$(".opt-btn[data-axis='" + axis + "']", axes).forEach((b) => {
        b.classList.remove("is-correct", "is-wrong");
      });
      if (sel && sel.dataset.opt === expected) {
        btn.classList.add("is-correct");
      } else {
        allCorrect = false;
        if (!firstWrongAxis) firstWrongAxis = { axis, selected: sel };
        if (sel) sel.classList.add("is-wrong");
      }
    });

    const attemptInfo = s.progress.module3.attempts[sys.id] || { attempts: 0, hintUsed: false };
    attemptInfo.attempts += 1;
    s.progress.module3.attempts[sys.id] = attemptInfo;

    const fb = $("#m3-feedback");

    if (allCorrect) {
      // Éxito
      s.stats.correct += 1;
      if (!s.progress.module3.done.includes(sys.id)) s.progress.module3.done.push(sys.id);
      const pts = SL.Scoring.resolve(s, attemptInfo.attempts, hintsUsed);
    updateStats();
      SL.State.save();

      if (fb) {
        fb.className = "feedback-box is-visible ok";
        fb.innerHTML = `
          <span class="fb-ico">${I("check")}</span>
          <div>
            <div class="fb-title">Perfil correcto · +${pts}</div>
            <p style="color:var(--text-1)">${sys.justification}</p>
          </div>`;
      }
      SL.Audio.play("correct");

      // Perfil
      const profile = $("#m3-profile");
      profile.style.display = "block";
      profile.innerHTML = `
        <h4>Perfil del sistema · ${UI.escapeHtml(sys.name)}</h4>
        <div class="profile-grid">
          ${Object.keys(Systems.CLASSIFICATION).map((axis) => {
            const ax = Systems.CLASSIFICATION[axis];
            const val = ax.options.find((o) => o.id === sys.profile[axis]);
            return `<div class="profile-item">
              <div class="pi-axis">${ax.label}</div>
              <div class="pi-value">${I("check")} ${UI.escapeHtml(val.label)}</div>
            </div>`;
          }).join("")}
        </div>
        <div class="justification">${sys.justification}</div>`;

      const confirmBtn = $("#m3-confirm");
      const parent = confirmBtn.parentElement;
      const nextBtn = UI.el(`<button class="btn btn-primary btn-lg" id="m3-next" data-sound="tap">${I("arrowOut")} Continuar</button>`);
      parent.replaceChild(nextBtn, confirmBtn);
      nextBtn.addEventListener("click", () => {
        s.progress.module3.index++;
        SL.State.save();
        if (s.progress.module3.index >= s.progress.module3.order.length) {
          s.progress.module3.completed = true;
          SL.State.save();
          const fresh = SL.Achievements.check();
          SL.Audio.play("unlock");
          if (fresh.length) UI.queueAchievements(fresh);
          renderM3Body();
          showM3CompletedModal();
        } else {
          renderM3Body();
        }
      });
      UI.burst(midpoint(profile), { violet: true });
    } else {
      // Algunos ejes incorrectos
      s.stats.wrong += 1;
      SL.State.save();
      if (fb) {
        const ax = Systems.CLASSIFICATION[firstWrongAxis.axis];
        fb.className = "feedback-box is-visible bad";
        fb.innerHTML = `
          <span class="fb-ico">${I("x")}</span>
          <div>
            <div class="fb-title">Revisa el eje: ${ax.label}</div>
            <p style="color:var(--text-1)">${Systems.CLASS_WRONG[firstWrongAxis.selected ? firstWrongAxis.selected.dataset.opt : sys.profile[firstWrongAxis.axis]] || ax.hint}</p>
          </div>`;
      }
      SL.Audio.play("wrong");
      const panel = $("#m3-profile");
      if (panel) panel.style.display = "none";
    }
  }

  function useM3Hint(sys) {
    const s = SL.State.get();
    const info = s.progress.module3.attempts[sys.id] || { attempts: 0, hintUsed: false };
    if (info.hintUsed) {
      UI.toast("Ya usaste la pista de este sistema.", "info");
      return;
    }
    info.hintUsed = true;
    s.progress.module3.attempts[sys.id] = info;
    SL.Scoring.useHint();
    updateStats();
    SL.State.save();
    const fb = $("#m3-feedback");
    if (fb) {
      const hints = Object.keys(Systems.CLASSIFICATION).map((axis) =>
        `<strong style="color:var(--accent)">${Systems.CLASSIFICATION[axis].label}:</strong> ${Systems.CLASSIFICATION[axis].hint}`
      ).join("<br><br>");
      fb.className = "feedback-box is-visible hint-box";
      fb.innerHTML = `
        <span class="fb-ico">${I("hint")}</span>
        <div>
          <div class="fb-title">Pista · pregúntate (-20 pts)</div>
          <p style="color:var(--text-1)">${hints}</p>
        </div>`;
    }
  }

  function renderM3Completed(body) {
    const s = SL.State.get();
    body.innerHTML = `
      <div class="panel panel-pad center" style="max-width:560px;margin:40px auto;display:grid;gap:16px">
        <div style="width:80px;height:80px;margin:0 auto;display:grid;place-items:center;border-radius:24px;background:var(--accent-3-soft);border:1px solid rgba(154,123,255,.5);color:var(--accent-3)">${I("dna")}</div>
        <h3 style="font-size:1.4rem">Clasificación completada</h3>
        <p>Construiste el perfil de todos los sistemas. El Desafío Final está desbloqueado.</p>
        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap">
          <button class="btn btn-primary" id="m3-challenge" data-sound="tap">${I("trophy")} Ir al Análisis Final</button>
          <button class="btn btn-ghost" id="m3-replay" data-sound="tap">${I("refresh")} Repasar</button>
        </div>
      </div>`;
    $("#m3-challenge").addEventListener("click", () => showScreen("challenge"));
    $("#m3-replay").addEventListener("click", () => {
      s.progress.module3.attempts = {};
      SL.State.shuffleSystems();
      SL.State.save();
      renderM3Body();
    });
  }

  function showM3CompletedModal() {
    UI.openModal({
      title: "Módulo 3 completado",
      iconName: "trophy",
      body: `
        <div class="center" style="display:grid;gap:12px">
          <p style="font-size:1.05rem;color:var(--text-0)">¡Construiste todos los perfiles de clasificación!</p>
          <p style="color:var(--accent);font-weight:700">El Análisis Final está desbloqueado.</p>
        </div>`,
      actions: [
        { label: "Mapa", kind: "btn-ghost", onClick: () => showScreen("hub") },
        { label: "Desafío Final", kind: "btn-primary", onClick: () => showScreen("challenge") }
      ]
    });
  }

  /* ============================================================
     DESAFÍO — ANÁLISIS FINAL
     ============================================================ */
  function renderChallenge() {
    const s = SL.State.get();
    const root = $("#screen-challenge");
    const st = Data.challenge;

    // Si ya está completado, mostrar resumen y resultados
    if (s.progress.challenge.completed) {
      root.innerHTML = `
        <div class="container">
          <div class="page-head">
            <div>
              <h2>${st.title}</h2>
              <div class="head-sub">${UI.escapeHtml(st.systemName)}</div>
            </div>
            <button class="btn btn-ghost btn-sm" id="ch-back" data-sound="tap">${I("home")} Mapa</button>
          </div>
          <div class="panel panel-pad center" style="max-width:560px;margin:40px auto;display:grid;gap:16px">
            <div style="width:80px;height:80px;margin:0 auto;display:grid;place-items:center;border-radius:24px;background:var(--warn-soft);border:1px solid rgba(255,209,102,.5);color:var(--warn)">${I("trophy")}</div>
            <h3 style="font-size:1.4rem">Análisis Final completado</h3>
            <p>Ya completaste el desafío integrador del laboratorio.</p>
            <button class="btn btn-primary" id="ch-results" data-sound="tap">${I("target")} Ver resultados finales</button>
          </div>
        </div>`;
      $("#ch-back").addEventListener("click", () => showScreen("hub"));
      $("#ch-results").addEventListener("click", () => { pendingFinal = true; showScreen("results"); });
      return;
    }

    const stage = s.progress.challenge.stage;
    const stageDef = st.stages[stage];

    root.innerHTML = `
      <div class="container">
        <div class="page-head">
          <div>
            <h2>${st.title}</h2>
            <div class="head-sub">${UI.escapeHtml(st.systemDescription)}</div>
          </div>
          <button class="btn btn-ghost btn-sm" id="ch-back" data-sound="tap">${I("home")} Mapa</button>
        </div>
        <div class="ch-stage-pill">${renderStagePills()}</div>
        <div id="ch-body"></div>
      </div>`;

    $("#ch-back").addEventListener("click", () => showScreen("hub"));
    renderChallengeStage(stage, stageDef);
  }

  function renderStagePills() {
    const s = SL.State.get();
    return Data.challenge.stages.map((st, i) => {
      const done = s.progress.challenge.stageDone[st.id] === true;
      const active = s.progress.challenge.stage === i;
      return `
        <span class="stage-pill ${done ? "is-done" : ""} ${active ? "is-active" : ""}">
          <span class="sp-num">${done ? I("check") : i + 1}</span> ${st.name}
        </span>`;
    }).join("");
  }

  function renderChallengeStage(stageIdx, stage) {
    const body = $("#ch-body");
    const s = SL.State.get();

    const head = `
      <div class="panel panel-pad m1-scenario-head" style="margin-bottom:18px">
        <h3 style="color:var(--accent-3)">${stage.name} · ${stage.title}</h3>
        <p class="ctx">${UI.escapeHtml(stage.context)}</p>
      </div>`;

    if (stage.type === "anatomy") {
      // ===== Etapa 1: anatomía =====
      const state = s.progress.challenge.anatomy;
      Object.keys(stage.cards).forEach((i) => {
        const cid = stage.cards[i].id;
        if (!state[cid]) state[cid] = { attempts: 0, hintUsed: false, placed: false };
      });
      const placed = stage.cards.filter((c) => state[c.id].placed);
      const remaining = stage.cards.filter((c) => !state[c.id].placed);
      const zones = {};
      ["entrada", "proceso", "salida", "retroalimentacion", "medio_ambiente"].forEach((z) => {
        zones[z] = placed.filter((c) => c.category === z);
      });

      body.innerHTML = head + `
        <div class="diagram-shell">
          <div class="diagram-frame">
            ${zoneHtml("medio_ambiente", "Medio ambiente", "globe", zones.medio_ambiente, "rodea al sistema")}
            <div class="zones-core">
              ${zoneHtml("entrada", "Entrada", "arrowIn", zones.entrada)}
              <span class="flow-arrows">${I("arrowOut")}</span>
              ${zoneHtml("proceso", "Proceso", "cog", zones.proceso)}
              <span class="flow-arrows">${I("arrowOut")}</span>
              ${zoneHtml("salida", "Salida", "arrowOut", zones.salida)}
            </div>
            <div class="zone-retro-row">
              ${zoneHtml("retroalimentacion", "Retroalimentación", "retro", zones.retroalimentacion, "regresa al sistema")}
            </div>
          </div>
        </div>
        <div class="scenario-actions" style="margin-top:16px">
          <button class="btn btn-secondary" id="ch-hint" data-sound="hint">${I("hint")} Pista (-20 pts)</button>
          <span class="chip">${placed.length}/${stage.cards.length} colocadas</span>
        </div>
        <div class="feedback-box" id="ch-feedback" role="status" aria-live="polite"></div>
        <div class="deck" id="ch-deck" aria-label="Tarjetas de la etapa 1">
          <div class="deck-hint">${I("layers")} Identifica los componentes de la biblioteca:</div>
          ${remaining.map((c, i) =>
            `<div class="card-data is-draggable" draggable="false" tabindex="0" role="button" aria-label="Tarjeta: ${UI.escapeHtml(c.text)}" data-card="${c.id}" style="animation-delay:${i * 40}ms">${UI.escapeHtml(c.text)}</div>`
          ).join("")}
        </div>`;

      dnD1 = SL.DnD.create({
        root: $("#screen-challenge"),
        sourceSelector: ".card-data.is-draggable",
        targetSelector: ".zone[data-zone]",
        onPlace: (source, target) => handleChallengeAnatomy(source, target, stage),
        onSelect: () => {}
      });
      wireChallengeKeys(body, stage);
      return;
    }

    if (stage.type === "elements") {
      // ===== Etapa 2: elementos =====
      const idx = s.progress.challenge.elements && s.progress.challenge.elements.idx !== undefined
        ? s.progress.challenge.elements.idx
        : 0;
      if (idx >= stage.elements.length) {
        finishChallengeStage(stageIdx, stage);
        return;
      }
      const elem = stage.elements[idx];
      body.innerHTML = head + `
        <div class="scanner-stage">
          <div class="scanner-beam scan"></div>
          <div class="element-card" data-element="${elem.id}" tabindex="0" role="button" aria-label="Elemento: ${UI.escapeHtml(elem.name)}">
            <div class="el-icon">${I(elem.icon || "cube")}</div>
            <h3>${UI.escapeHtml(elem.name)}</h3>
            <span class="el-tag">¿Objeto, sujeto o concepto?</span>
          </div>
        </div>
        <div class="category-rail" role="group" aria-label="Categorías">
          ${catBtnHtml("objeto")}
          ${catBtnHtml("sujeto")}
          ${catBtnHtml("concepto")}
        </div>
        <div class="feedback-box" id="ch-feedback" role="status" aria-live="polite"></div>`;

      // Rebind DnD para la etapa 2 (sobre todo el documento de pantalla)
      dnD2 = SL.DnD.create({
        root: $("#screen-challenge"),
        sourceSelector: ".element-card",
        targetSelector: ".cat-btn[data-cat]",
        fallbackSource: ".element-card",
        onPlace: (source, target) => handleChallengeElement(source, target, stage),
        onSelect: () => {}
      });
      wireChallengeElementKeys(stage);
      return;
    }

    if (stage.type === "classification") {
      // ===== Etapa 3: clasificación =====
      const profile = stage.profile;
      body.innerHTML = head + `
        <div class="m3-layout" style="grid-template-columns:1fr">
          <div class="axis-list" id="ch-axes"></div>
          <div class="profile-panel panel" id="ch-profile" style="display:none"></div>
          <div class="scenario-actions" style="margin-top:16px">
            <button class="btn btn-primary btn-lg" id="ch-confirm" data-sound="tap" style="flex:1">${I("check")} Confirmar perfil</button>
          </div>
          <div class="feedback-box" id="ch-feedback" role="status" aria-live="polite"></div>
        </div>`;
      const axes = $("#ch-axes");
      axes.innerHTML = Object.keys(Systems.CLASSIFICATION).map((axis) => {
        const ax = Systems.CLASSIFICATION[axis];
        const opts = ax.options.map((o) =>
          `<button class="opt-btn" data-axis="${axis}" data-opt="${o.id}" data-sound="tap">${UI.escapeHtml(o.label)}</button>`
        ).join("");
        return `
          <div class="axis-group panel">
            <div class="ax-label">${I(ax.icon)} ${ax.label}</div>
            <div class="axis-opts">${opts}</div>
          </div>`;
      }).join("");
      $$(".opt-btn", axes).forEach((btn) => {
        btn.addEventListener("click", () => {
          const axis = btn.dataset.axis;
          $$(".opt-btn[data-axis='" + axis + "']", axes).forEach((b) => b.classList.remove("is-selected"));
          btn.classList.add("is-selected");
          const all = Object.keys(Systems.CLASSIFICATION).every((ax) =>
            $(".opt-btn[data-axis='" + ax + "'].is-selected", axes)
          );
          $("#ch-confirm").disabled = !all;
          SL.Audio.play("tap");
        });
      });
      $("#ch-confirm").addEventListener("click", () => confirmChallengeClassification(stage));
      return;
    }
  }

  function wireChallengeKeys(body, stage) {
    $$(".card-data.is-draggable", body).forEach((card) => {
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dnD1 && dnD1.clearSelection();
          card.classList.add("is-selected");
          SL.Audio.play("select");
        }
      });
    });
    $$(".zone[data-zone]", body).forEach((zone) => {
      zone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const selected = $(".card-data.is-selected", body);
          if (selected) handleChallengeAnatomy(selected, zone, stage);
        }
      });
    });
    const hint = $("#ch-hint");
    if (hint) hint.addEventListener("click", () => useChallengeHint(stage));
  }

  function handleChallengeAnatomy(source, target, stage) {
    const s = SL.State.get();
    const cardId = source.dataset.card;
    const card = stage.cards.find((c) => c.id === cardId);
    const cat = target.dataset.zone;
    const info = s.progress.challenge.anatomy[cardId] || { attempts: 0, hintUsed: false, placed: false };
    info.attempts += 1;
    s.progress.challenge.anatomy[cardId] = info;

    if (card.category === cat) {
      s.stats.correct += 1;
      info.placed = true;
      const pts = SL.Scoring.resolve(s, info.attempts, info.hintUsed);
    updateStats();
      SL.State.save();

      source.remove();
      const zoneEl = $(".zone[data-zone='" + cat + "']", $("#ch-body"));
      if (zoneEl) {
        const slot = $(".zslot", zoneEl);
        if (slot) slot.remove();
        const zc = $(".zcards", zoneEl);
        zc.appendChild(UI.el(`<div class="card-data is-locked">${UI.escapeHtml(card.text)}</div>`));
        zoneEl.classList.add("is-filled");
      }
      showChallengeFeedback(true, `Correcto · +${pts}`, card.feedback);
      SL.Audio.play("correct");

      const allPlaced = stage.cards.every((c) => s.progress.challenge.anatomy[c.id].placed);
      if (allPlaced) {
        window.setTimeout(() => finishChallengeStage(stageIndex(stage.id), stage), 650);
      }
      return { ok: true };
    }

    s.stats.wrong += 1;
    SL.State.save();
    showChallengeFeedback(false, `No es ${Systems.COMPONENTS[cat].label}`, Systems.COMPONENT_WRONG[cat]);
    SL.Audio.play("wrong");
    return { ok: false };
  }

  function stageIndex(id) {
    return Data.challenge.stages.findIndex((st) => st.id === id);
  }

  function wireChallengeElementKeys(stage) {
    const body = $("#ch-body");
    const card = $(".element-card", body);
    if (card) {
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dnD2 && dnD2.clearSelection();
          card.classList.add("is-selected");
          SL.Audio.play("select");
        }
      });
    }
    $$(".cat-btn", body).forEach((btn) => {
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const selected = $(".element-card.is-selected", body);
          handleChallengeElement(selected || $(".element-card", body), btn, stage);
        }
      });
    });
  }

  function handleChallengeElement(source, target, stage) {
    const s = SL.State.get();
    const card = source && source.dataset ? source.dataset.element || source.dataset.card : null;
    const cat = target.dataset.cat;
    const elem = stage.elements.find((e) => e.id === card);
    if (!elem || !cat) return { ok: false };

    // Solo acepta el elemento que corresponde al índice actual (evita dobles respuestas rápidas).
    const idxNow = s.progress.challenge.elements.idx || 0;
    const expected = stage.elements[idxNow];
    if (!expected || expected.id !== elem.id) return { ok: false };

    const answers = s.progress.challenge.elements.answers || {};
    const info = answers[elem.id] || { attempts: 0 };
    info.attempts += 1;
    answers[elem.id] = info;
    s.progress.challenge.elements = s.progress.challenge.elements || {};
    s.progress.challenge.elements.answers = answers;
    SL.State.save();

    const fb = $("#ch-feedback");

    if (elem.category === cat) {
      s.stats.correct += 1;
      const pts = SL.Scoring.resolve(s, info.attempts, false);
    updateStats();
      if (fb) {
        fb.className = "feedback-box is-visible ok";
        fb.innerHTML = `
          <span class="fb-ico">${I("check")}</span>
          <div>
            <div class="fb-title">${UI.escapeHtml(elem.name)} → ${Systems.ELEMENT_CATEGORIES[cat].label.toUpperCase()} · +${pts}</div>
            <p style="color:var(--text-1)">${elem.feedback}</p>
          </div>`;
      }
      SL.Audio.play("correct");
      UI.burst(midpoint($(".scanner-stage", $("#ch-body"))), { green: true });

      const idx = (s.progress.challenge.elements.idx || 0) + 1;
      s.progress.challenge.elements.idx = idx;
      SL.State.save();
      if (idx >= stage.elements.length) {
        window.setTimeout(() => finishChallengeStage(stageIndex(stage.id), stage), 550);
      } else {
        window.setTimeout(() => renderChallengeStage(s.progress.challenge.stage, stage), 450);
      }
      return { ok: true };
    }

    s.stats.wrong += 1;
    SL.State.save();
    if (fb) {
      fb.className = "feedback-box is-visible bad";
      fb.innerHTML = `
        <span class="fb-ico">${I("x")}</span>
        <div>
          <div class="fb-title">${UI.escapeHtml(elem.name)} no es ${Systems.ELEMENT_CATEGORIES[cat].label}</div>
          <p style="color:var(--text-1)">${Systems.ELEMENT_WRONG[cat]}</p>
        </div>`;
    }
    SL.Audio.play("wrong");
    const cardEl = $(".element-card", $("#ch-body"));
    if (cardEl) {
      cardEl.classList.add("is-wrong-shake");
      window.setTimeout(() => cardEl.classList.remove("is-wrong-shake"), 500);
    }
    return { ok: false };
  }

  function confirmChallengeClassification(stage) {
    const s = SL.State.get();
    const axes = $("#ch-axes");
    const cl = s.progress.challenge.classification || { attempts: 0 };
    cl.attempts += 1;
    s.progress.challenge.classification = cl;

    let allCorrect = true;
    let firstWrong = null;
    Object.keys(Systems.CLASSIFICATION).forEach((axis) => {
      const sel = $(".opt-btn[data-axis='" + axis + "'].is-selected", axes);
      $$(".opt-btn[data-axis='" + axis + "']", axes).forEach((b) => b.classList.remove("is-correct", "is-wrong"));
      if (sel && sel.dataset.opt === stage.profile[axis]) {
        sel.classList.add("is-correct");
      } else {
        allCorrect = false;
        if (sel) sel.classList.add("is-wrong");
        if (!firstWrong) firstWrong = { axis, selected: sel };
      }
    });

    const fb = $("#ch-feedback");

    if (allCorrect) {
      s.stats.correct += 1;
      const pts = SL.Scoring.resolve(s, cl.attempts, false);
    updateStats();
      if (fb) {
        fb.className = "feedback-box is-visible ok";
        fb.innerHTML = `
          <span class="fb-ico">${I("check")}</span>
          <div>
            <div class="fb-title">Perfil correcto · +${pts}</div>
            <p style="color:var(--text-1)">${stage.justification}</p>
          </div>`;
      }
      SL.Audio.play("correct");
      const profile = $("#ch-profile");
      profile.style.display = "block";
      profile.innerHTML = `
        <h4>Perfil del sistema · ${UI.escapeHtml(Data.challenge.systemName)}</h4>
        <div class="profile-grid">
          ${Object.keys(Systems.CLASSIFICATION).map((axis) => {
            const ax = Systems.CLASSIFICATION[axis];
            const val = ax.options.find((o) => o.id === stage.profile[axis]);
            return `<div class="profile-item">
              <div class="pi-axis">${ax.label}</div>
              <div class="pi-value">${I("check")} ${UI.escapeHtml(val.label)}</div>
            </div>`;
          }).join("")}
        </div>
        <div class="justification">${stage.justification}</div>`;
      UI.burst(midpoint(profile), { violet: true });

      const btn = $("#ch-confirm");
      const parent = btn.parentElement;
      const nextBtn = UI.el(`<button class="btn btn-primary btn-lg" id="ch-next" data-sound="tap">${I("check")} Finalizar análisis</button>`);
      parent.replaceChild(nextBtn, btn);
      nextBtn.addEventListener("click", () => finishChallengeStage(stageIndex(stage.id), stage));
    } else {
      s.stats.wrong += 1;
      SL.State.save();
      const ax = Systems.CLASSIFICATION[firstWrong.axis];
      if (fb) {
        fb.className = "feedback-box is-visible bad";
        fb.innerHTML = `
          <span class="fb-ico">${I("x")}</span>
          <div>
            <div class="fb-title">Revisa el eje: ${ax.label}</div>
            <p style="color:var(--text-1)">${Systems.CLASS_WRONG[firstWrong.selected ? firstWrong.selected.dataset.opt : stage.profile[firstWrong.axis]] || ax.hint}</p>
          </div>`;
      }
      SL.Audio.play("wrong");
    }
  }

  function useChallengeHint(stage) {
    const s = SL.State.get();
    if (stage.type === "anatomy") {
      const state = s.progress.challenge.anatomy;
      const remaining = stage.cards.filter((c) => !state[c.id].placed);
      if (!remaining.length) return;
      const target = remaining[0];
      if (state[target.id].hintUsed) {
        UI.toast("Ya usaste la pista de esta tarjeta.", "info");
        return;
      }
      state[target.id].hintUsed = true;
      SL.Scoring.useHint();
    updateStats();
      SL.State.save();
      const fb = $("#ch-feedback");
      if (fb) {
        fb.className = "feedback-box is-visible hint-box";
        fb.innerHTML = `
          <span class="fb-ico">${I("hint")}</span>
          <div>
            <div class="fb-title">Pista · orientación (-20 pts)</div>
            <p style="color:var(--text-1)"><strong style="color:var(--text-0)">${UI.escapeHtml(target.text)}:</strong> ${target.hint}</p>
          </div>`;
      }
      const deckEl = $$(".card-data.is-draggable[data-card='" + target.id + "']", $("#ch-deck"))[0];
      if (deckEl) {
        deckEl.classList.add("anim-pulse");
        window.setTimeout(() => deckEl.classList.remove("anim-pulse"), 800);
      }
      return;
    }
    UI.toast("Lee con atención el enunciado de la etapa.", "info");
  }

  function showChallengeFeedback(ok, title, text) {
    const box = $("#ch-feedback");
    if (!box) return;
    box.className = "feedback-box is-visible " + (ok ? "ok" : "bad");
    box.innerHTML = `
      <span class="fb-ico">${I(ok ? "check" : "x")}</span>
      <div>
        <div class="fb-title">${title}</div>
        <p style="color:var(--text-1)">${text}</p>
      </div>`;
  }

  function finishChallengeStage(idx, stage) {
    const s = SL.State.get();
    s.progress.challenge.stageDone[stage.id] = true;

    if (idx + 1 < Data.challenge.stages.length) {
      s.progress.challenge.stage = idx + 1;
      SL.State.save();
      UI.openModal({
        title: `${stage.name} completada`,
        iconName: "check",
        body: `<div class="center" style="display:grid;gap:12px">
          <p style="font-size:1.05rem;color:var(--text-0)">Avanzaste en el Análisis Final del sistema.</p>
          <p>Continúa con la siguiente etapa.</p>
        </div>`,
        actions: [{ label: "Continuar", kind: "btn-primary", onClick: () => showScreen("challenge") }]
      });
      return;
    }

    // Desafío completo
    s.progress.challenge.completed = true;
    s.progress.challenge.stage = 0;
    SL.State.save();
    const fresh = SL.Achievements.check();
    SL.Audio.play("finish");
    window.setTimeout(() => {
      UI.openModal({
        title: "Análisis Final completado",
        iconName: "trophy",
        body: `<div class="center" style="display:grid;gap:12px">
          <p style="font-size:1.1rem;color:var(--text-0)">¡Completaste el laboratorio completo de System Lab!</p>
          <p>Generando tu reporte final…</p>
        </div>`,
        actions: [{
          label: "Ver resultados", kind: "btn-primary",
          onClick: () => { pendingFinal = true; showScreen("results"); }
        }]
      });
      if (fresh.length) UI.queueAchievements(fresh);
    }, 600);
  }

  /* ============================================================
     RESULTADOS FINALES
     ============================================================ */
  function rankFor(pct) {
    if (pct >= 90) return { name: "Maestro de Sistemas", icon: "trophy", desc: "Dominio completo del laboratorio.", lvl: 4 };
    if (pct >= 70) return { name: "Especialista de Sistemas", icon: "dna", desc: "Excelente dominio de los sistemas.", lvl: 3 };
    if (pct >= 45) return { name: "Analista de Sistemas", icon: "scan", desc: "Buen dominio de la teoría de sistemas.", lvl: 2 };
    return { name: "Explorador de Sistemas", icon: "target", desc: "Estás comenzando tu exploración.", lvl: 1 };
  }

  function modulePct(moduleId) {
    const s = SL.State.get();
    if (moduleId === "module1") return s.progress.module1.completed.length / Data.module1.scenarios.length;
    if (moduleId === "module2") return s.progress.module2.done.length / Data.module2.elements.length;
    if (moduleId === "module3") return s.progress.module3.done.length / Data.module3.systems.length;
    return 0;
  }

  function renderResults(isFinal) {
    const s = SL.State.get();
    const root = $("#screen-results");
    const pct = Math.round(SL.State.completion() * 100);
    const rank = rankFor(pct);

    const m1P = Math.round(modulePct("module1") * 100);
    const m2P = Math.round(modulePct("module2") * 100);
    const m3P = Math.round(modulePct("module3") * 100);
    const modules = [
      { id: "module1", name: "Anatomía", pct: m1P },
      { id: "module2", name: "Elementos", pct: m2P },
      { id: "module3", name: "Clasificación", pct: m3P }
    ];
    const best = modules.reduce((a, b) => (b.pct > a.pct ? b : a));
    const weak = modules.reduce((a, b) => (a.pct === 0 && b.pct === 0 ? a : b.pct < a.pct || a.pct === 0 ? b : a));
    const started = modules.some((m) => m.pct > 0);

    const achEarned = SL.Achievements.earned(s);
    const achHtml = SL.Achievements.DEFS.map((d) => {
      const earned = achEarned.some((e) => e.id === d.id);
      return `
        <div class="ach-item ${earned ? "un" : "lk"}">
          <span class="ai-ico">${I(d.icon)}</span>
          <div>
            <div class="ai-name">${UI.escapeHtml(d.name)}</div>
            <div class="ai-desc">${UI.escapeHtml(d.desc)}</div>
          </div>
          ${earned ? `<span style="color:var(--ok);margin-left:auto">${I("check")}</span>` : ""}
        </div>`;
    }).join("");

    root.innerHTML = `
      <div class="container results-wrap">
        <div class="page-head" style="justify-content:center;text-align:center">
          <div style="width:100%">
            <h2>${isFinal ? "Laboratorio completado" : "Mis resultados"}</h2>
            <div class="head-sub">${isFinal ? "¡Felicidades! Terminaste System Lab." : "Así va tu avance en System Lab."}</div>
          </div>
        </div>

        <div class="results-score">
          <div class="percent-ring" style="display:grid;place-items:center">
            <svg viewBox="0 0 190 190">
              <defs>
                <linearGradient id="gradRing" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#38d6ff"/>
                  <stop offset="100%" stop-color="#9a7bff"/>
                </linearGradient>
              </defs>
              <circle class="ring-track" cx="95" cy="95" r="80"></circle>
              <circle class="ring-fill" id="ring-fill" cx="95" cy="95" r="80"
                stroke-dasharray="${2 * Math.PI * 80}" stroke-dashoffset="${2 * Math.PI * 80}"></circle>
            </svg>
            <div class="ring-center">
              <div>
                <div class="ring-num" id="pct-num">0%</div>
                <div class="ring-label">Avance global</div>
              </div>
            </div>
          </div>
        </div>

        <div class="rank-banner">
          <span class="rb-ico">${I(rank.icon)}</span>
          <div>
            <h3>${rank.name}</h3>
            <p>${rank.desc}</p>
          </div>
          <span class="chip" style="margin-left:auto">Nivel ${rank.lvl}</span>
        </div>

        <div class="results-stats">
          <div class="panel panel-pad rstat"><div class="rs-value">${s.score.toLocaleString("es-MX")}</div><div class="rs-label">Puntuación</div></div>
          <div class="panel panel-pad rstat"><div class="rs-value">${s.stats.correct}</div><div class="rs-label">Respuestas correctas</div></div>
          <div class="panel panel-pad rstat"><div class="rs-value">${s.stats.wrong}</div><div class="rs-label">Errores</div></div>
          <div class="panel panel-pad rstat"><div class="rs-value">${s.stats.hints}</div><div class="rs-label">Pistas utilizadas</div></div>
          <div class="panel panel-pad rstat best"><div class="rs-value">${started ? best.name : "—"}</div><div class="rs-label">Mejor módulo</div></div>
          <div class="panel panel-pad rstat ${started && weak.pct < 100 ? "weak" : ""}"><div class="rs-value">${started && weak.pct < 100 ? weak.name : "—"}</div><div class="rs-label">Módulo a repasar</div></div>
        </div>

        <div class="achievements-final">
          <h4>Logros ${achEarned.length}/${SL.Achievements.DEFS.length}</h4>
          <div class="ach-list">${achHtml}</div>
        </div>

        <div class="results-actions">
          <button class="btn btn-ghost" id="res-hub" data-sound="tap">${I("home")} Volver al mapa</button>
          ${isFinal ? `<button class="btn btn-ghost" id="res-replay" data-sound="tap">${I("refresh")} Repetir laboratorio</button>` : ""}
        </div>
      </div>`;

    // Animación del anillo y contador
    const C = 2 * Math.PI * 80;
    const fill = $("#ring-fill");
    const num = $("#pct-num");
    requestAnimationFrame(() => {
      UI.countUp(num, pct, { suffix: "%", duration: 1400 });
      window.setTimeout(() => {
        if (fill) fill.style.strokeDashoffset = (C - (pct / 100) * C).toFixed(2);
      }, 60);
    });

    if (isFinal) SL.Audio.play("finish");

    $("#res-hub").addEventListener("click", () => showScreen("hub"));
    const replay = $("#res-replay");
    if (replay) {
      replay.addEventListener("click", () => {
        UI.confirmDialog({
          title: "Repetir laboratorio",
          iconName: "refresh",
          message: "Se reiniciará todo el progreso y la puntuación. ¿Continuar?",
          confirmLabel: "Sí, reiniciar",
          danger: true,
          onConfirm: () => {
            SL.Storage.clear();
            SL.State.reset();
            showScreen("landing");
            refreshSaveButtons();
          }
        });
      });
    }
  }

  /* ============================================================
     LOGROS
     ============================================================ */
  function showAchievementsModal() {
    const s = SL.State.get();
    const earned = SL.Achievements.earned(s);
    const list = SL.Achievements.DEFS.map((d) => {
      const ok = earned.some((e) => e.id === d.id);
      return `
        <div class="ach-item ${ok ? "un" : "lk"}">
          <span class="ai-ico">${I(d.icon)}</span>
          <div>
            <div class="ai-name">${UI.escapeHtml(d.name)}</div>
            <div class="ai-desc">${UI.escapeHtml(d.desc)}</div>
          </div>
          ${ok ? `<span style="color:var(--ok);margin-left:auto">${I("check")}</span>` : ""}
        </div>`;
    }).join("");
    UI.openModal({
      title: "Logros",
      iconName: "trophy",
      wide: true,
      body: `<div class="ach-list" style="grid-template-columns:1fr">${list}</div>`,
      actions: [{ label: "Cerrar", kind: "btn-primary", onClick: () => {} }]
    });
  }

  /* ============================================================
     FONDO DINÁMICO (canvas)
     ============================================================ */
  function initBackground() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1;
    const particles = [];
    const MAX = reduce ? 0 : 70;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles.length = 0;
      const count = Math.min(MAX, Math.floor((w * h) / 26000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 2,
          hue: Math.random() > 0.5 ? "56,214,255" : "154,123,255"
        });
      }
    }

    let raf = null;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      if (reduce) return;
      const linkDist = 120;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;
      }
      // enlaces
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.28;
            ctx.strokeStyle = "rgba(110,160,255," + alpha.toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // nodos
      for (const p of particles) {
        ctx.fillStyle = "rgba(" + p.hue + ",0.7)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    function start() {
      if (raf) cancelAnimationFrame(raf);
      draw();
    }
    function stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    resize();
    seed();
    start();

    let resizeT = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => { resize(); seed(); }, 200);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
  }

  /* ============================================================
     EVENTOS GLOBALES (hint buttons vía delegación)
     ============================================================ */
  document.addEventListener("click", (e) => {
    if (e.target.closest("#m1-hint")) useM1Hint();
    if (e.target.closest("#m2-hint")) useM2Hint();
  });

  document.addEventListener("DOMContentLoaded", boot);
})(window.SystemLab = window.SystemLab || {});

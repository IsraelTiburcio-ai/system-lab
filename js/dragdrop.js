/* ============================================================
   SYSTEM LAB · js/dragdrop.js
   Motor de arrastre universal (Pointer Events: mouse + touch).
   Incluye alternativa táctil: tocar tarjeta y luego tocar destino.
   ============================================================ */
(function (SL) {
  "use strict";

  const MOVE_THRESHOLD = 8;   // px para distinguir tap de drag

  function createDnD(options) {
    const opts = Object.assign({}, options);
    const { root = document } = opts;

    // Una sola instancia por contenedor: evita listeners acumulados.
    if (root.__slDnD) {
      root.__slDnD._setOptions(options);
      return root.__slDnD;
    }

    let dragging = null;   // { el, downX, downY, moved, lastTarget }
    let selected = null;   // elemento seleccionado por tap

    const isSource = (el) => el && el.matches && el.matches(opts.sourceSelector);
    const isTarget = (el) => el && el.matches && el.matches(opts.targetSelector);

    function clearHighlight() {
      root.querySelectorAll(opts.targetSelector + ".is-over").forEach((t) => t.classList.remove("is-over"));
    }

    function targetAt(x, y) {
      const targets = root.querySelectorAll(opts.targetSelector);
      for (const t of targets) {
        const r = t.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return t;
      }
      return null;
    }

    function deselect() {
      if (selected) {
        selected.classList.remove("is-selected");
        selected = null;
      }
    }

    function beginDrag(el, x, y) {
      if (el.classList.contains("is-locked")) return;
      if (selected && selected !== el) deselect();
      el.classList.remove("is-selected");
      dragging = { el, downX: x, downY: y, moved: false, lastTarget: null };
      el.classList.add("is-dragging");
      el.style.transition = "none";
      if (opts.onDragChange) opts.onDragChange(true);
      SL.Audio.play("drag");
    }

    function moveDrag(x, y) {
      if (!dragging) return;
      const dx = x - dragging.downX;
      const dy = y - dragging.downY;
      if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) dragging.moved = true;
      dragging.el.style.transform = `translate(${dx}px, ${dy}px) scale(1.04) rotate(1deg)`;

      const t = targetAt(x, y);
      if (t !== dragging.lastTarget) {
        if (dragging.lastTarget) dragging.lastTarget.classList.remove("is-over");
        dragging.lastTarget = t;
        if (t) t.classList.add("is-over");
      }
    }

    function endDrag(x, y) {
      if (!dragging) return;
      const d = dragging;
      dragging = null;
      const el = d.el;
      el.classList.remove("is-dragging");
      el.style.transition = "";

      const wasDrag = d.moved;
      const target = d.lastTarget || targetAt(x, y);
      clearHighlight();

      if (wasDrag && target && isTarget(target)) {
        const res = opts.onPlace(el, target, "drop");
        el.style.transform = "";
        if (res && res.ok) {
          if (opts.onDragChange) opts.onDragChange(false);
          return;
        }
        // Incorrecto: sacude y regresa.
        el.classList.add("is-wrong-shake");
        window.setTimeout(() => el.classList.remove("is-wrong-shake"), 500);
        if (opts.onDragChange) opts.onDragChange(false);
        return;
      }

      el.style.transform = "";
      if (!wasDrag) {
        // Fue un tap: seleccionar la tarjeta.
        selectCard(el);
      } else if (opts.onDragChange) {
        opts.onDragChange(false);
      }
    }

    function selectCard(el) {
      deselect();
      selected = el;
      el.classList.add("is-selected");
      SL.Audio.play("select");
      if (opts.onSelect) opts.onSelect(el);
    }

    /* --- Fuente: arrastre / tap --- */
    root.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
      const source = e.target.closest(opts.sourceSelector);
      if (!source || !isSource(source)) return;
      e.preventDefault();
      beginDrag(source, e.clientX, e.clientY);
    });

    root.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      e.preventDefault();
      moveDrag(e.clientX, e.clientY);
    });

    root.addEventListener("pointerup", (e) => {
      if (dragging) endDrag(e.clientX, e.clientY);
    });

    root.addEventListener("pointercancel", () => {
      if (dragging) endDrag(0, 0);
    });

    /* --- Destino: colocación por tap cuando hay tarjeta seleccionada --- */
    root.addEventListener("pointerup", (e) => {
      if (dragging) return;
      const target = e.target.closest(opts.targetSelector);
      if (!target) return;
      // Soporta selección por teclado y, si se define, un origen automático.
      const source = selected ||
        root.querySelector(opts.sourceSelector + ".is-selected") ||
        (opts.fallbackSource ? root.querySelector(opts.fallbackSource) : null);
      if (!source) return;
      const res = opts.onPlace(source, target, "tap");
      if (res && res.ok) {
        deselect();
      }
    });

    /* Limpiar selección al hacer clic fuera */
    root.addEventListener("pointerdown", (e) => {
      if (dragging) return;
      if (selected && !e.target.closest(opts.sourceSelector) && !e.target.closest(opts.targetSelector)) {
        deselect();
      }
    });

    const api = {
      deselect,
      clearSelection: deselect,
      isSource,
      isTarget,
      _setOptions(o) { Object.assign(opts, o); }
    };
    root.__slDnD = api;
    return api;
  }

  SL.DnD = { create: createDnD };
})(window.SystemLab = window.SystemLab || {});

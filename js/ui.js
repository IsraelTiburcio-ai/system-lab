/* ============================================================
   SYSTEM LAB · js/ui.js
   Helpers de interfaz: iconos SVG, modales, toasts, logros,
   efectos, contadores.
   ============================================================ */
(function (SL) {
  "use strict";

  const ICONS = SL.Systems.ICON;

  function icon(name, cls) {
    const body = ICONS[name] || ICONS.info;
    return `<svg class="${cls || ""}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
  }

  function el(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  /* ---------- Contador animado ---------- */
  function countUp(node, target, { duration = 1200, suffix = "", prefix = "" } = {}) {
    const start = 0;
    const t0 = performance.now();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.textContent = prefix + Math.round(target) + suffix;
      return;
    }
    function tick(now) {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = prefix + Math.round(start + (target - start) * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else node.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Ripple ---------- */
  function attachRipple(container) {
    container.addEventListener("pointerdown", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const ink = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 1.1;
      ink.className = "ripple-ink";
      ink.style.width = ink.style.height = size + "px";
      ink.style.left = e.clientX - rect.left - size / 2 + "px";
      ink.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(ink);
      ink.addEventListener("animationend", () => ink.remove());
    });
  }

  /* ---------- Partículas de confirmación ---------- */
  function burst(x, y, opts = {}) {
    const root = document.getElementById("fx-root");
    if (!root) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = reduce ? 6 : (opts.count || 14);
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      p.className = "fx-particle" + (opts.green ? " green" : "") + (opts.violet ? " violet" : "");
      const ang = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 70;
      p.style.left = (x + (Math.random() - 0.5) * 10) + "px";
      p.style.top = (y + (Math.random() - 0.5) * 10) + "px";
      p.style.width = p.style.height = (4 + Math.random() * 6) + "px";
      p.style.setProperty("--tx", Math.cos(ang) * dist + "px");
      p.style.setProperty("--ty", Math.sin(ang) * dist + "px");
      root.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
  }

  /* ---------- Modal ---------- */
  function openModal({ title, iconName, body, actions, wide, onClose }) {
    const root = document.getElementById("modal-root");
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const card = document.createElement("div");
    card.className = "modal-card" + (wide ? " is-wide" : "");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-label", title || "Diálogo");

    const head = document.createElement("div");
    head.className = "modal-head";
    const h = document.createElement("h3");
    if (iconName) h.innerHTML = icon(iconName);
    h.insertAdjacentHTML("beforeend", escapeHtml(title || ""));
    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.setAttribute("aria-label", "Cerrar");
    closeBtn.innerHTML = icon("x");
    closeBtn.dataset.sound = "tap";
    head.appendChild(h);
    head.appendChild(closeBtn);

    const bodyEl = document.createElement("div");
    bodyEl.className = "modal-body";
    if (typeof body === "string") bodyEl.innerHTML = body;
    else if (body && body.nodeType) bodyEl.appendChild(body);

    card.appendChild(head);
    card.appendChild(bodyEl);

    if (actions && actions.length) {
      const foot = document.createElement("div");
      foot.className = "modal-foot";
      actions.forEach((a) => {
        const b = document.createElement("button");
        b.className = "btn " + (a.kind || "btn-ghost") + " " + (a.size || "");
        b.innerHTML = a.label;
        b.dataset.sound = "tap";
        if (a.href) { b.className += " hidden"; }
        b.addEventListener("click", (e) => {
          if (a.keepOpen) { a.onClick && a.onClick(e, b); return; }
          // Primero ejecuta la acción y luego cierra (así el callback puede decidir).
          let result;
          try { result = a.onClick && a.onClick(e, b); }
          finally { if (result !== false) close(); }
        });
        foot.appendChild(b);
      });
      card.appendChild(foot);
    }

    root.appendChild(backdrop);
    root.appendChild(card);
    root.classList.remove("is-hidden");

    function close() {
      root.classList.add("is-hidden");
      card.remove();
      backdrop.remove();
      onClose && onClose();
    }

    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", escHandler);
    function escHandler(e) {
      if (e.key === "Escape") {
        document.removeEventListener("keydown", escHandler);
        close();
      }
    }

    const firstFocus = card.querySelector("button, [tabindex]");
    if (firstFocus) firstFocus.focus();
    return { close };
  }

  function confirmDialog({ title, message, confirmLabel, danger, onConfirm }) {
    return openModal({
      title,
      iconName: "info",
      body: `<p style="font-size:1rem;color:var(--text-1)">${message}</p>`,
      actions: [
        { label: "Cancelar", kind: "btn-ghost", onClick: () => {} },
        { label: confirmLabel || "Confirmar", kind: danger ? "btn-danger" : "btn-primary", onClick: onConfirm }
      ]
    });
  }

  /* ---------- Toast ---------- */
  function toast(message, kind) {
    const root = document.getElementById("toast-root");
    const t = document.createElement("div");
    t.className = "toast " + (kind || "info");
    const ico = kind === "ok" ? "check" : kind === "bad" ? "x" : "info";
    t.innerHTML = icon(ico, "t-ico") + `<span>${message}</span>`;
    root.appendChild(t);
    window.setTimeout(() => {
      t.style.transition = "opacity .4s, transform .4s";
      t.style.opacity = "0";
      t.style.transform = "translateY(10px)";
      window.setTimeout(() => t.remove(), 400);
    }, 2600);
  }

  /* ---------- Logro ---------- */
  const queuedAch = [];
  let achShowing = false;
  function showAchievement(def) {
    const root = document.getElementById("achievement-root");
    const t = document.createElement("div");
    t.className = "achievement-toast";
    t.setAttribute("role", "status");
    t.innerHTML = `
      <div class="at-ico">${icon(def.icon)}</div>
      <div>
        <div class="at-kicker">Logro desbloqueado</div>
        <div class="at-name">${escapeHtml(def.name)}</div>
        <div class="at-desc">${escapeHtml(def.desc)}</div>
      </div>`;
    root.appendChild(t);
    window.setTimeout(() => t.classList.add("is-hiding"), 3400);
    window.setTimeout(() => t.remove(), 4000);
  }
  function queueAchievements(defs) {
    defs.forEach((d) => queuedAch.push(d));
    pumpAchievements();
  }
  function pumpAchievements() {
    if (achShowing || !queuedAch.length) return;
    achShowing = true;
    const def = queuedAch.shift();
    showAchievement(def);
    window.setTimeout(() => {
      achShowing = false;
      pumpAchievements();
    }, 3200);
  }

  /* ---------- Iconos de sonido ---------- */
  function soundIconNode(enabled) {
    return icon(enabled ? "soundOn" : "soundOff");
  }
  function renderSoundIcons(enabled) {
    const a = document.getElementById("sound-icon-landing");
    const b = document.getElementById("sound-icon-top");
    if (a) a.innerHTML = soundIconNode(enabled).replace(/^<svg/, '<svg style="width:19px;height:19px"');
    if (b) b.innerHTML = soundIconNode(enabled).replace(/^<svg/, '<svg style="width:19px;height:19px"');
  }

  /* ---------- Delegación de sonido global ---------- */
  function bindGlobalSound() {
    document.addEventListener("pointerdown", (e) => {
      const node = e.target.closest("[data-sound]");
      if (node) {
        SL.Audio.unlock();
        SL.Audio.play(node.dataset.sound);
      }
    }, true);
  }

  SL.UI = {
    icon,
    el,
    escapeHtml,
    countUp,
    attachRipple,
    burst,
    openModal,
    confirmDialog,
    toast,
    queueAchievements,
    renderSoundIcons,
    bindGlobalSound
  };
})(window.SystemLab = window.SystemLab || {});

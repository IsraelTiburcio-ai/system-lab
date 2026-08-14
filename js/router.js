/* ============================================================
   SYSTEM LAB · js/router.js
   Transiciones entre pantallas.
   ============================================================ */
(function (SL) {
  "use strict";

  let current = null;

  const SCREENS = {
    landing: "screen-landing",
    hub: "screen-hub",
    module1: "screen-module1",
    module2: "screen-module2",
    module3: "screen-module3",
    challenge: "screen-challenge",
    results: "screen-results"
  };

  SL.Router = {
    get current() { return current; },

    go(name, renderFn) {
      const targetId = SCREENS[name];
      if (!targetId) return;
      const target = document.getElementById(targetId);
      const topbar = document.getElementById("topbar");

      const show = () => {
        target.classList.add("is-active", "screen-enter");
        window.setTimeout(() => target.classList.remove("screen-enter"), 600);
        if (name === "landing") topbar.classList.add("hidden");
        else topbar.classList.remove("hidden");
        if (renderFn) renderFn();
        if (current && current !== name) {
          const prev = document.getElementById(SCREENS[current]);
          if (prev) prev.classList.remove("is-active");
        }
        current = name;
        window.scrollTo(0, 0);

        // Limpieza forzada: garantiza la visibilidad aunque la animación se interrumpa.
        window.setTimeout(() => {
          target.classList.remove("screen-enter", "screen-exit");
          target.style.opacity = "";
          target.style.transform = "";
        }, 700);
      };

      // Navegar a la pantalla ya activa: solo re-renderiza (sin animaciones).
      if (current === name) {
        show();
        return;
      }

      if (!current) {
        show();
        return;
      }

      const prev = document.getElementById(SCREENS[current]);
      if (prev) {
        prev.classList.add("screen-exit");
        window.setTimeout(() => prev.classList.remove("screen-exit"), 280);
      }
      window.setTimeout(show, 60);
    }
  };
})(window.SystemLab = window.SystemLab || {});

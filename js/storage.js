/* ============================================================
   SYSTEM LAB · js/storage.js
   Persistencia del estado en localStorage.
   ============================================================ */
(function (SL) {
  "use strict";

  const KEY = "systemlab_save_v1";

  SL.Storage = {
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },
    save(state) {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
        return true;
      } catch (e) {
        return false;
      }
    },
    clear() {
      try {
        localStorage.removeItem(KEY);
      } catch (e) { /* noop */ }
    }
  };
})(window.SystemLab = window.SystemLab || {});

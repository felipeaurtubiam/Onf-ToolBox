/*
 * Gate de acceso client-side para ON*NET Toolbox.
 * IMPORTANTE: esto NO es seguridad real. El sitio es estatico (GitHub Pages),
 * por lo que el hash y la logica viven en el navegador y son inspeccionables.
 * Sirve solo como filtro basico para que el sitio no quede abierto a cualquiera.
 * Revisitar con una solucion de hosting/autenticacion real a futuro.
 */
(function () {
  "use strict";

  var PASSWORD_HASH = "26109b7674fb1b20821c3ca895d3cac977e5bb8af5397bef1ab3a9f7b97f0491";
  var STORAGE_KEY = "onf_toolbox_auth";
  var MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

  // Oculta el body de inmediato para evitar flash de contenido sin autenticar.
  var hideStyle = document.createElement("style");
  hideStyle.id = "onf-gate-hide";
  hideStyle.textContent = "body{visibility:hidden !important}";
  document.head.appendChild(hideStyle);

  function sha256Hex(message) {
    var data = new TextEncoder().encode(message);
    return crypto.subtle.digest("SHA-256", data).then(function (buf) {
      return Array.from(new Uint8Array(buf))
        .map(function (b) {
          return b.toString(16).padStart(2, "0");
        })
        .join("");
    });
  }

  function isAuthed() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      if (!data.exp || Date.now() > data.exp) return false;
      return data.hash === PASSWORD_HASH;
    } catch (e) {
      return false;
    }
  }

  function reveal() {
    var s = document.getElementById("onf-gate-hide");
    if (s) s.remove();
  }

  function buildOverlay() {
    var overlay = document.createElement("div");
    overlay.id = "onf-gate";
    overlay.style.cssText =
      "visibility:visible;position:fixed;inset:0;z-index:99999;display:flex;" +
      "align-items:center;justify-content:center;padding:28px;" +
      "background:linear-gradient(to right,#06EFFF 0,#06EFFF 4px,transparent 4px),#FFFFFF;" +
      "font-family:'Open Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

    overlay.innerHTML =
      '<main style="visibility:visible;width:min(420px,100%);border:1px solid #E2E4EC;border-radius:6px;background:#fff;box-shadow:0 16px 40px rgba(32,23,81,.12);overflow:hidden">' +
      '<div style="visibility:visible;background:#201751;color:#fff;padding:20px 24px;position:relative">' +
      '<h1 style="visibility:visible;margin:0 0 4px 0;font-size:20px;letter-spacing:.4px">ON<span style="color:#06EFFF">*</span>NET Toolbox</h1>' +
      '<div style="visibility:visible;color:#cdd0e0;font-size:12px">Acceso protegido</div>' +
      "</div>" +
      '<form style="visibility:visible;padding:22px 24px 24px;display:flex;flex-direction:column;gap:12px">' +
      '<label for="onf-gate-pw" style="visibility:visible;font-size:10.5px;color:#5A5E72;text-transform:uppercase;letter-spacing:.6px;font-weight:700">Password</label>' +
      '<input id="onf-gate-pw" type="password" autocomplete="current-password" autofocus required style="visibility:visible;width:100%;border:1px solid #E2E4EC;border-radius:4px;padding:10px 12px;font:inherit;color:#191919;box-sizing:border-box"/>' +
      '<p id="onf-gate-error" style="visibility:visible;display:none;margin:0;color:#C62828;font-weight:700;font-size:12px">Password incorrecto. Intenta nuevamente.</p>' +
      '<button type="submit" style="visibility:visible;border:0;border-radius:4px;background:#201751;color:#fff;font:inherit;font-weight:700;padding:10px 14px;cursor:pointer">Ingresar</button>' +
      "</form>" +
      "</main>";

    document.body.appendChild(overlay);

    var form = overlay.querySelector("form");
    var input = overlay.querySelector("#onf-gate-pw");
    var error = overlay.querySelector("#onf-gate-error");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      sha256Hex(input.value).then(function (hash) {
        if (hash === PASSWORD_HASH) {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ hash: PASSWORD_HASH, exp: Date.now() + MAX_AGE_MS })
          );
          overlay.remove();
          reveal();
        } else {
          error.style.display = "block";
          input.value = "";
          input.focus();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (isAuthed()) {
      reveal();
    } else {
      buildOverlay();
    }
  });
})();

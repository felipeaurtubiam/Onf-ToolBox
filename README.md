# ON*NET Toolbox

Portal interno con herramientas de ON*NET FIBRA para uso del equipo.

## Estructura

- `index.html` — portal de entrada, lista las herramientas disponibles.
- `dashboard-sla-eecc/` — Dashboard de SLA por EECC (datos en `payload.json`, actualizado automaticamente por `Copia_Consolidado_EECC.ps1`).
- `portal-baremos/` — Portal de Baremos & Precios del contrato PEXT INFRACO (estatico, datos embebidos en el HTML; sin pipeline).
- `assets/gate.js` — gate de acceso con contrasena compartida (client-side).

## Agregar una nueva herramienta

1. Crear una carpeta nueva en la raiz del repo (ej. `mi-herramienta/`).
2. Incluir `<script src="../assets/gate.js"></script>` en el `<head>`, antes de otros scripts, para heredar la proteccion por contrasena.
3. Agregar una tarjeta en `index.html` (seccion `.grid`) que enlace a la nueva carpeta.

## Nota sobre seguridad

El gate de contrasena es client-side (SHA-256 en el navegador). Es un filtro basico, no seguridad real. Plan a futuro: **Cloudflare Access** (login real por email/PIN, gratis hasta 50 usuarios) + pasar el repositorio a privado.

## Hosting

Publicado con **Cloudflare Pages** (`onf-toolbox.pages.dev`), conectado al repositorio de GitHub. Cada push reconstruye el sitio automaticamente. El pipeline `Copia_Consolidado_EECC.ps1` hace `git push` a GitHub y Cloudflare redespliega.

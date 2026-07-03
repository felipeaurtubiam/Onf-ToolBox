# ON*NET Toolbox

Portal interno con herramientas de ON*NET FIBRA para uso del equipo.

## Estructura

- `index.html` — portal de entrada, lista las herramientas disponibles.
- `dashboard-sla-eecc/` — Dashboard de SLA por EECC (datos en `payload.json`, actualizado automaticamente por `Copia_Consolidado_EECC.ps1`).
- `assets/gate.js` — gate de acceso con contrasena compartida (client-side).

## Agregar una nueva herramienta

1. Crear una carpeta nueva en la raiz del repo (ej. `mi-herramienta/`).
2. Incluir `<script src="../assets/gate.js"></script>` en el `<head>`, antes de otros scripts, para heredar la proteccion por contrasena.
3. Agregar una tarjeta en `index.html` (seccion `.grid`) que enlace a la nueva carpeta.

## Nota sobre seguridad

El gate de contrasena es client-side (SHA-256 en el navegador). GitHub Pages es hosting estatico y no soporta validacion server-side como Netlify Edge Functions. Es un filtro basico, no seguridad real — revisar una solucion de hosting/autenticacion definitiva a futuro.

## Hosting

Repositorio publico en GitHub, publicado con GitHub Pages.

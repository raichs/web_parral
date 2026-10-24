# Restobar El Parral — web

Sitio estático de una sola página. HTML + CSS + JS, sin frameworks ni proceso de build.

## Estructura

- `index.html` — la página
- `css/styles.css` — estilos (responsive con container queries sobre `.pg`)
- `js/main.js` — menú móvil, carta filtrable, detalles de platos, WhatsApp y Maps
- `img/` — imágenes optimizadas en WebP (`*-sm.webp` = versión para móvil) y logos SVG
- `_original/` — exportación original de la herramienta de diseño (referencia; se puede borrar)
- `assets/` — PNG originales sin optimizar (ya no se usan; se pueden borrar)

## Configurar

Al inicio de `js/main.js`:

- `WHATSAPP` — número en formato internacional sin `+` (ej. `51987654321`). Vacío = modo demo.
- `MAPS_URL` — enlace de Google Maps del local.
- `MENU` / `CATS` — platos y categorías de la carta.

Los textos entre `[corchetes]` en `index.html` son datos por completar (dirección, horario, precios, redes).

## Ver en local

```
python3 -m http.server 8765
```

y abrir http://127.0.0.1:8765. Para publicar, basta subir la carpeta (sin `_original/` ni `assets/`) a cualquier hosting estático: Netlify, Vercel, Cloudflare Pages o GitHub Pages.

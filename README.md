# Restobar El Parral — web

Sitio estático de una sola página. HTML + CSS + JS, sin frameworks ni proceso de build.

## Estructura

- `index.html` — la página
- `css/styles.css` — estilos (responsive con container queries sobre `.pg`)
- `js/main.js` — menú móvil, carta filtrable, detalles de platos, WhatsApp y Maps
- `img/` — imágenes optimizadas en WebP (`*-sm.webp` = versión para móvil) y logos SVG

## Configurar

Al inicio de `js/main.js`:

- `WHATSAPP` — número en formato internacional sin `+` (`51958640141`). Vacío = modo demo.
- `MAPS_URL` — enlace de Google Maps del local.
- `MENU` / `CATS` — platos y categorías de la carta.

Los textos entre `[corchetes]` son datos por completar (la historia del local y algunos precios).

## Ver en local

```
python3 -m http.server 8765
```

y abrir http://127.0.0.1:8765. Para publicar, basta subir la carpeta a cualquier hosting estático: Netlify, Vercel, Cloudflare Pages o GitHub Pages.

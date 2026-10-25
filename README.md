# Restobar El Parral — web

Sitio estático de una sola página. HTML + CSS + JS, sin frameworks ni proceso de build.

## Estructura

- `index.html` — la página
- `css/styles.css` — estilos (responsive con container queries sobre `.pg`)
- `js/main.js` — menú móvil, carta filtrable, detalles de platos, feed de Instagram, WhatsApp y Maps
- `js/instagram.js` — copia local de las últimas publicaciones de Instagram (`IG_POSTS`)
- `img/` — imágenes optimizadas en WebP (`*-sm.webp` = versión para móvil) y logos SVG
- `img/ig/` — miniaturas de las publicaciones de Instagram

## Configurar

Al inicio de `js/main.js`:

- `WHATSAPP` — número en formato internacional sin `+` (`51958640141`). Vacío = modo demo.
- `MAPS_URL` — enlace de Google Maps del local.
- `MENU` / `CATS` — platos y categorías de la carta.
- `IG_FEED_URL` — feed de Instagram en vivo (opcional, ver abajo).

## Feed de Instagram

La sección «Lo último en nuestras redes» muestra 8 publicaciones. Hay dos modos:

- **Copia local** (por defecto): `js/instagram.js` + imágenes en `img/ig/`. Para actualizar, reemplaza las imágenes y edita la lista.
- **En vivo**: Instagram no permite leer el perfil desde una web estática sin token. Conecta la cuenta en un servicio como [Behold](https://behold.so) (plan gratuito), copia la URL del «JSON feed» y pégala en `IG_FEED_URL`. Si la carga falla, se usa la copia local.

Los textos entre `[corchetes]` son datos por completar (la historia del local y algunos precios).

## Ver en local

```
python3 -m http.server 8765
```

y abrir http://127.0.0.1:8765. Para publicar, basta subir la carpeta a cualquier hosting estático: Netlify, Vercel, Cloudflare Pages o GitHub Pages.

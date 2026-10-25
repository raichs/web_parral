// ===== Configuración del local =====
// Número en formato internacional sin "+" ni espacios, ej. '51987654321'.
// Mientras esté vacío, los botones muestran un aviso de demo en lugar de abrir WhatsApp.
const WHATSAPP = '51958640141';
// Enlace de Google Maps del local (Compartir → Copiar enlace).
// Horario de atención (hora de Perú), para el aviso «Abierto ahora» del pie de página.
const HOURS = { open: '09:00', close: '18:00' };
const MAPS_URL = 'https://maps.app.goo.gl/JhTRKgAn8uHUZHtN9';
// URL opcional de un feed JSON de Instagram en vivo (por ejemplo Behold.so).
// Vacío = se muestra la copia local de js/instagram.js.
const IG_FEED_URL = '';

// Precio por defecto para platos que aún no tienen precio en el POS
const P = 'S/ [00.00]';
const IMG = {
  ceviche: 'img/ceviche-mixto-sm.webp',
  fuente: 'img/fuente-marina-sm.webp',
  arroz: 'img/arroz-con-mariscos-sm.webp',
  conchas: 'img/conchas-de-abanico-sm.webp'
};
const CATS = [
  ['ceviches', 'Ceviches'], ['arroces', 'Arroces y platos marinos'], ['jaleas', 'Jaleas y frituras'],
  ['pescados', 'Pescados'], ['sopas', 'Sopas y sudados'], ['entradas', 'Entradas'], ['bebidas', 'Bebidas']
];
const MENU = [
  { cat: 'ceviches', name: 'Ceviche clásico', price: 'S/ 45.00', desc: 'Pescado del día en limón, ají limo y cebolla roja, con camote y choclo.', img: IMG.ceviche, featured: true },
  { cat: 'ceviches', name: 'Ceviche mixto', price: 'S/ 43.00', desc: 'Pescado, calamar y langostinos en leche de tigre al ají amarillo.', img: IMG.ceviche },
  { cat: 'ceviches', name: 'Leche de tigre', price: 'S/ 20.00', desc: 'El jugo del ceviche servido en copa, con trozos de pescado y cancha.' },
  { cat: 'arroces', name: 'Arroz con mariscos', price: 'S/ 38.00', desc: 'Arroz meloso al ají panca con choros, almejas y calamar.', img: IMG.arroz, featured: true },
  { cat: 'arroces', name: 'Chaufa de mariscos', price: 'S/ 38.00', desc: 'Arroz salteado al wok con mariscos, cebollita china y sillao.' },
  { cat: 'arroces', name: 'Tacu tacu marino', price: 'S/ 38.00', desc: 'Tacu tacu dorado coronado con mariscos en salsa criolla.' },
  { cat: 'jaleas', name: 'Jalea mixta', price: 'S/ 68.00', desc: 'Pescado y mariscos fritos y crocantes, con yuca, sarza y tártara.', featured: true },
  { cat: 'jaleas', name: 'Chicharrón de pescado', price: 'S/ 35.00', desc: 'Trozos de pescado apanados, con yuca frita y salsa criolla.' },
  { cat: 'pescados', name: 'Pescado a lo macho', price: 'S/ 55.00', desc: 'Filete frito bañado en salsa cremosa de mariscos y ají panca.' },
  { cat: 'pescados', name: 'Pescado frito entero', price: 'S/ 35.00', desc: 'Pescado del día frito entero, con arroz, yuca y ensalada.' },
  { cat: 'sopas', name: 'Sudado de pescado', price: 'S/ 38.00', desc: 'Pescado cocido en su jugo con tomate, cebolla, chicha de jora y culantro.', featured: true },
  { cat: 'sopas', name: 'Parihuela', price: 'S/ 45.00', desc: 'Sopa marina concentrada con pescado, mariscos y ají panca.' },
  { cat: 'entradas', name: 'Causa de langostinos', price: 'S/ 38.00', desc: 'Causa de papa amarilla al limón con langostinos y palta.' },
  { cat: 'entradas', name: 'Conchas de abanico', desc: 'Al natural o a la chalaca, con limón y ají.', img: IMG.conchas, featured: true },
  { cat: 'entradas', name: 'Fuente marina fría', desc: 'Ostras en cuatro preparaciones, sobre hielo, para compartir.', img: IMG.fuente },
  { cat: 'bebidas', name: 'Chicha morada', price: 'S/ 18.00', desc: 'Jarra o vaso, preparada con maíz morado, piña y canela.' },
  { cat: 'bebidas', name: 'Limonada', price: 'S/ 15.00', desc: 'Clásica o frozen. [Opciones disponibles]' },
  { cat: 'bebidas', name: 'Cervezas y bebidas', desc: '[Marcas y presentaciones disponibles]' }
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Scroll suave y lento hacia las anclas =====
let raf = null;
function smoothTo(target) {
  const start = scrollY;
  const dist = target.getBoundingClientRect().top;
  if (raf) cancelAnimationFrame(raf);
  if (reduceMotion() || Math.abs(dist) < 2) { scrollTo(0, start + dist); return; }
  const dur = Math.min(2600, Math.max(1400, Math.abs(dist) * 0.6));
  const t0 = performance.now();
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    scrollTo(0, start + dist * ease(p));
    raf = p < 1 ? requestAnimationFrame(step) : null;
  };
  raf = requestAnimationFrame(step);
}

// ===== Aviso flotante =====
let t1, t2;
function toast(msg, loading = false) {
  const el = $('#toast');
  clearTimeout(t1); clearTimeout(t2);
  $('.spin', el).hidden = !loading;
  $('.ok', el).hidden = loading;
  $('.toast-msg', el).textContent = msg;
  el.hidden = false;
  if (!loading) t2 = setTimeout(() => { el.hidden = true; }, 5000);
}

function askWhatsApp(label) {
  const text = 'Hola, quiero consultar por ' + label + '.';
  if (WHATSAPP) {
    open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    return;
  }
  toast('Preparando tu mensaje de WhatsApp…', true);
  t1 = setTimeout(() => toast('Demo: se abrirá WhatsApp con «' + text + '». Número por configurar.'), 900);
}

// ===== Menú móvil =====
function setMenu(open) {
  const m = $('#mmenu'), b = $('.burger');
  const isOpen = !m.hidden && !m.classList.contains('closing');
  if (open === isOpen) return;
  b.setAttribute('aria-expanded', open);
  b.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  $('.i-open', b).hidden = open;
  $('.i-close', b).hidden = !open;
  const finish = () => {
    m.hidden = true;
    m.classList.remove('closing');
    $('.hdr').classList.remove('menu-open');
    document.documentElement.style.overflow = '';
  };
  if (open) {
    m.classList.remove('closing');
    m.hidden = false;
    $('.hdr').classList.add('menu-open');
    document.documentElement.style.overflow = 'hidden';
    return;
  }
  // Al cerrar se reproduce la animación de apertura al revés
  if (reduceMotion()) { finish(); return; }
  m.classList.add('closing');
  m.addEventListener('animationend', function done(e) {
    if (e.target !== m) return;
    m.removeEventListener('animationend', done);
    if (m.classList.contains('closing')) finish();
  });
}

// ===== Cabecera fija, progreso de lectura y sección activa =====
const hdr = $('.hdr');
function syncHeader() {
  hdr.classList.toggle('is-fixed', scrollY > 160);
  const max = document.documentElement.scrollHeight - innerHeight;
  hdr.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max) : 0);
}
addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    $$('.nav a, .mmenu a.ml').forEach((a) => a.classList.toggle('on', a.hash === '#' + en.target.id && a.pathname === location.pathname));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('.pg section[id]').forEach((s) => spy.observe(s));

// ===== Carta digital =====
const FISH = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12c3-4.5 9-6 14-3l3.5-2.5-1 4.5 1 4.5L17 13c-5 3-11 1.5-14-1Z"></path><circle cx="14" cy="11" r=".6" fill="currentColor"></circle></svg>';
const catLabel = Object.fromEntries(CATS);
let currentCat = 'todos';

function renderCarta() {
  $('#cats').innerHTML = [['todos', 'Todos'], ...CATS].map(([id, label]) => {
    const n = id === 'todos' ? MENU.length : MENU.filter((m) => m.cat === id).length;
    const on = id === currentCat;
    return `<button class="cat ${on ? 'on' : ''}" type="button" aria-pressed="${on}" data-cat="${id}">${esc(label)} <small>${n}</small></button>`;
  }).join('');

  $('#items').innerHTML = MENU.filter((m) => currentCat === 'todos' || m.cat === currentCat).map((m) => `
<article class="item">
<div class="item-img">${m.img
    ? `<img src="${m.img}" alt="${esc(m.name)}" width="112" height="112" loading="lazy" decoding="async">`
    : `<div class="ph">${FISH}Foto pendiente</div>`}</div>
<div style="min-width: 0">
<p class="item-cat">${esc(catLabel[m.cat])}</p>
<div class="dish-row"><h3>${esc(m.name)}</h3><span class="lead"></span><span class="price">${m.price || P}</span></div>
<p class="d">${esc(m.desc)}</p>
${m.featured ? '<div class="item-foot"><span class="badge">Recomendado</span></div>' : ''}
</div>
</article>`).join('');
}

// ===== Feed de Instagram =====
const REEL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"></rect><path d="M3 8h18M8 3l3 5M14 3l3 5"></path><path d="m10 11.5 4.5 2.5-4.5 2.5z" fill="currentColor"></path></svg>';
const PHOTO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect><circle cx="12" cy="12" r="4"></circle></svg>';

function renderInstagram(posts) {
  const el = $('#ig-feed');
  if (!el || !posts.length) return;
  el.innerHTML = posts.slice(0, 8).map((p, i) => `
<a class="ig-post" href="${esc(p.url)}" target="_blank" rel="noopener" style="animation-delay: ${i * 0.06}s">
<img src="${esc(p.img)}" alt="${esc(p.caption || 'Publicación de Instagram')}" width="480" height="640" loading="lazy" decoding="async">
<span class="ig-type" aria-hidden="true">${p.type === 'reel' ? REEL : PHOTO}</span>
<span class="ig-cap"><span>${esc(p.caption || '')}</span><b>Ver en Instagram</b></span>
</a>`).join('');
}

// Normaliza el formato de Behold.so ({ posts: [...] } o [...]) al de IG_POSTS
async function loadInstagram() {
  const local = typeof IG_POSTS !== 'undefined' ? IG_POSTS : [];
  if (!IG_FEED_URL) { renderInstagram(local); return; }
  try {
    const data = await (await fetch(IG_FEED_URL)).json();
    const live = (Array.isArray(data) ? data : data.posts || []).map((p) => ({
      url: p.permalink,
      img: p.sizes?.medium?.mediaUrl || p.thumbnailUrl || p.mediaUrl,
      type: p.mediaType === 'VIDEO' ? 'reel' : 'post',
      caption: p.prunedCaption || p.caption || ''
    })).filter((p) => p.url && p.img);
    renderInstagram(live.length ? live : local);
  } catch {
    renderInstagram(local);
  }
}

// ===== Abierto / cerrado =====
const fmtHour = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a.m.' : 'p.m.'}`;
};
function syncOpen() {
  const el = $('#hc-status');
  if (!el) return;
  const now = new Date(Date.now() + (new Date().getTimezoneOffset() - 300) * 60000); // Perú: UTC−5
  const mins = now.getHours() * 60 + now.getMinutes();
  const [o, c] = [HOURS.open, HOURS.close].map((t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; });
  const open = mins >= o && mins < c;
  el.className = 'hc-status ' + (open ? 'open' : 'closed');
  $('b', el).textContent = open
    ? 'Abierto ahora · cerramos a las ' + fmtHour(HOURS.close)
    : 'Cerrado · abrimos ' + (mins < o ? 'hoy' : 'mañana') + ' a las ' + fmtHour(HOURS.open);
}

// ===== Visor de imágenes (lightbox) =====
const LB_HOSTS = '.g';
let lbList = [], lbIdx = 0, lbBack = null, lbX = null;

// La versión más grande disponible: el mayor ancho del srcset, o la imagen sin «-sm»
function bigSrc(img) {
  const set = (img.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)).filter((x) => x[0]);
  if (set.length) return set.sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0][0];
  return img.getAttribute('src').replace(/-sm\.webp(?=\?|$)/, '.webp');
}
function lbCaption(img) {
  const cap = img.closest('figure')?.querySelector('figcaption em');
  return cap ? cap.textContent : img.alt;
}
function lbBuild() {
  const el = document.createElement('div');
  el.className = 'lb';
  el.hidden = true;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Imagen ampliada');
  el.innerHTML = `
<button class="lb-btn lb-close" type="button" aria-label="Cerrar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button>
<button class="lb-btn lb-prev" type="button" aria-label="Imagen anterior"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"></path></svg></button>
<button class="lb-btn lb-next" type="button" aria-label="Imagen siguiente"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"></path></svg></button>
<figure class="lb-fig"><div class="lb-frame"><img class="lb-img" alt=""><span class="lb-spin" aria-hidden="true"></span></div>
<figcaption class="lb-cap"><em></em><span class="lb-count"></span></figcaption></figure>`;
  document.body.appendChild(el);
  el.addEventListener('click', (e) => {
    if (e.target.closest('.lb-close') || e.target === el || e.target.classList.contains('lb-fig')) lbClose();
    else if (e.target.closest('.lb-prev')) lbGo(-1);
    else if (e.target.closest('.lb-next')) lbGo(1);
  });
  el.addEventListener('touchstart', (e) => { lbX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - (lbX ?? 0);
    if (Math.abs(dx) > 50) lbGo(dx < 0 ? 1 : -1);
    lbX = null;
  });
  return el;
}
function lbShow() {
  const el = $('.lb'), img = lbList[lbIdx], big = $('.lb-img', el);
  el.classList.add('loading');
  big.classList.remove('in');
  big.onload = () => { el.classList.remove('loading'); requestAnimationFrame(() => big.classList.add('in')); };
  big.src = bigSrc(img);
  big.alt = img.alt;
  $('.lb-cap em', el).textContent = lbCaption(img);
  $('.lb-count', el).textContent = lbList.length > 1 ? `${lbIdx + 1} / ${lbList.length}` : '';
  el.classList.toggle('single', lbList.length < 2);
  // precarga la siguiente
  if (lbList.length > 1) new Image().src = bigSrc(lbList[(lbIdx + 1) % lbList.length]);
}
function lbOpen(img) {
  const el = $('.lb') || lbBuild();
  // Se recorren las imágenes de la misma sección
  const scope = img.closest('section') || document;
  lbList = $$(LB_HOSTS, scope).map((h) => (h.matches('img') ? h : $('img', h))).filter(Boolean);
  lbIdx = Math.max(0, lbList.indexOf(img));
  lbBack = document.activeElement;
  el.hidden = false;
  document.documentElement.style.overflow = 'hidden';
  lbShow();
  $('.lb-close', el).focus();
}
function lbClose() {
  const el = $('.lb');
  if (!el || el.hidden) return;
  el.hidden = true;
  document.documentElement.style.overflow = '';
  lbBack?.focus?.();
}
function lbGo(d) {
  if (lbList.length < 2) return;
  lbIdx = (lbIdx + d + lbList.length) % lbList.length;
  lbShow();
}
document.addEventListener('keydown', (e) => {
  const el = $('.lb');
  if (!el || el.hidden) return;
  if (e.key === 'ArrowRight') lbGo(1);
  else if (e.key === 'ArrowLeft') lbGo(-1);
  else if (e.key === 'Escape') lbClose();
});

// ===== Eventos (delegados) =====
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a) {
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (t) { e.preventDefault(); setMenu(false); smoothTo(t); history.replaceState(null, '', a.hash); }
    return;
  }
  const wa = e.target.closest('[data-wa]');
  if (wa) { setMenu(false); askWhatsApp(wa.dataset.wa); return; }

  const lbHost = !e.target.closest('button, a') && e.target.closest(LB_HOSTS);
  const lbImg = lbHost && (lbHost.matches('img') ? lbHost : $('img', lbHost));
  if (lbImg) { lbOpen(lbImg); return; }

  const tg = e.target.closest('[data-toggle]');
  if (tg) {
    const open = tg.closest('.dish').classList.toggle('is-open');
    tg.setAttribute('aria-expanded', open);
    $('.u', tg).textContent = open ? 'Ocultar detalles' : 'Ver detalles';
    return;
  }
  const cat = e.target.closest('[data-cat]');
  if (cat) { currentCat = cat.dataset.cat; renderCarta(); return; }

  if (e.target.closest('.burger')) { setMenu($('.burger').getAttribute('aria-expanded') !== 'true'); return; }

  if (e.target.closest('[data-map]')) {
    if (MAPS_URL) open(MAPS_URL, '_blank', 'noopener');
    else toast('Demo: aquí se abrirá Google Maps con la ruta, cuando se configure la dirección exacta.');
  }
});

// ===== Volver arriba =====
const toTop = $('.to-top');
const syncTop = () => toTop.classList.toggle('show', scrollY > 300);
addEventListener('scroll', syncTop, { passive: true });
syncTop();
toTop.addEventListener('click', () => smoothTo($('#inicio')));

// ===== Pantalla completa =====
const fsBtn = $('.fs-btn');
const root = document.documentElement;
const requestFs = root.requestFullscreen || root.webkitRequestFullscreen;
if (requestFs) {
  fsBtn.hidden = false;
  const syncFs = () => {
    const on = !!(document.fullscreenElement || document.webkitFullscreenElement);
    $('use', fsBtn).setAttribute('href', on ? '#i-compress' : '#i-expand');
    fsBtn.setAttribute('aria-label', on ? 'Salir de pantalla completa' : 'Ver en pantalla completa');
    fsBtn.title = on ? 'Salir de pantalla completa' : 'Pantalla completa';
  };
  fsBtn.addEventListener('click', () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else requestFs.call(root)?.catch?.(() => {});
  });
  document.addEventListener('fullscreenchange', syncFs);
  document.addEventListener('webkitfullscreenchange', syncFs);
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

renderCarta();
loadInstagram();
syncOpen();
setInterval(syncOpen, 60000);

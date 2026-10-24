// ===== Configuración del local =====
// Número en formato internacional sin "+" ni espacios, ej. '51987654321'.
// Mientras esté vacío, los botones muestran un aviso de demo en lugar de abrir WhatsApp.
const WHATSAPP = '51958640141';
// Enlace de Google Maps del local (Compartir → Copiar enlace).
const MAPS_URL = 'https://maps.app.goo.gl/JhTRKgAn8uHUZHtN9';

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
  const b = $('.burger');
  $('#mmenu').hidden = !open;
  b.setAttribute('aria-expanded', open);
  b.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  $('.i-open', b).hidden = open;
  $('.i-close', b).hidden = !open;
}

// ===== Carta digital =====
const FISH = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12c3-4.5 9-6 14-3l3.5-2.5-1 4.5 1 4.5L17 13c-5 3-11 1.5-14-1Z"></path><circle cx="14" cy="11" r=".6" fill="currentColor"></circle></svg>';
const ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"></path></svg>';
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
    ? `<img src="${m.img}" alt="${esc(m.name)}" loading="lazy" decoding="async">`
    : `<div class="ph">${FISH}Foto pendiente</div>`}</div>
<div style="min-width: 0">
<p class="item-cat">${esc(catLabel[m.cat])}</p>
<div class="dish-row"><h3>${esc(m.name)}</h3><span class="lead"></span><span class="price">${m.price || P}</span></div>
<p class="d">${esc(m.desc)}</p>
<div class="item-foot">
${m.featured ? '<span class="badge">Recomendado</span>' : ''}
<button class="txtbtn" type="button" data-wa="${esc(m.name)}"><span class="u">Consultar por WhatsApp</span>${ARROW}</button>
</div>
</div>
</article>`).join('');
}

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

  const tg = e.target.closest('[data-toggle]');
  if (tg) {
    const open = tg.closest('.dish').classList.toggle('is-open');
    tg.setAttribute('aria-expanded', open);
    $('.u', tg).textContent = open ? 'Ocultar detalles' : 'Ver detalles';
    return;
  }
  const cat = e.target.closest('[data-cat]');
  if (cat) { currentCat = cat.dataset.cat; renderCarta(); return; }

  if (e.target.closest('.burger')) { setMenu($('#mmenu').hidden); return; }

  if (e.target.closest('[data-map]')) {
    if (MAPS_URL) open(MAPS_URL, '_blank', 'noopener');
    else toast('Demo: aquí se abrirá Google Maps con la ruta, cuando se configure la dirección exacta.');
  }
});

// ===== Pantalla completa =====
const fsBtn = $('.fs-btn');
const root = document.documentElement;
const requestFs = root.requestFullscreen || root.webkitRequestFullscreen;
if (requestFs) {
  fsBtn.hidden = false;
  const syncFs = () => {
    const on = !!(document.fullscreenElement || document.webkitFullscreenElement);
    $('i', fsBtn).className = 'fa-solid ' + (on ? 'fa-compress' : 'fa-expand');
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

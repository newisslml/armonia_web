// ---- Fondo espacial animado (canvas) ----
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let active = false;
let rafId = null;

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  buildParticles();
}

function buildParticles() {
  const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + 0.3,
    baseAlpha: Math.random() * 0.6 + 0.3,
    speed: Math.random() * 0.15 + 0.02,
    twinkle: Math.random() * Math.PI * 2,
  }));
}

function draw(t) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const p of particles) {
    p.twinkle += 0.02 + p.speed * 0.1;
    p.y += p.speed;
    if (p.y > window.innerHeight) p.y = 0;
    const alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(p.twinkle));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 220, 255, ${alpha})`;
    ctx.fill();
  }
  if (active) rafId = requestAnimationFrame(draw);
}

const stars = {
  setActive(on) {
    active = on;
    if (on && !rafId) rafId = requestAnimationFrame(draw);
    if (!on && rafId) { cancelAnimationFrame(rafId); rafId = null; }
  },
};

window.addEventListener('resize', resize);
resize();

// ---- Tema (claro/oscuro) ----
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('armonia-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(mode) {
  root.setAttribute('data-theme', mode);
  root.style.colorScheme = mode;
  localStorage.setItem('armonia-theme', mode);
  stars.setActive(mode === 'dark');
}

setTheme(saved || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ---- Menú móvil ----
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));

// ---- API ----
// Backend real (ver ../Vault-Front/CONEXION_FRONTEND.md): cookies httpOnly,
// SIEMPRE credentials:'include'.
const API_BASE = 'http://localhost:4000/api';
const formatCLP = (n) => '$' + Number(n).toLocaleString('es-CL');

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error de conexión con el servidor');
  return data;
}

// ---- Carrito: contador en el header ----
async function refreshCartCount() {
  try {
    const carrito = await apiFetch('/carrito');
    const total = (carrito.items || []).reduce((sum, it) => sum + it.cantidad, 0);
    document.querySelectorAll('.cart-count').forEach((el) => (el.textContent = total));
  } catch {
    // backend no disponible: se deja el contador tal cual está en el HTML
  }
}
refreshCartCount();

async function addToCart(productoId, btn) {
  const textoOriginal = btn.textContent;
  btn.disabled = true;
  try {
    await apiFetch('/carrito/items', {
      method: 'POST',
      body: JSON.stringify({ productoId, cantidad: 1 }),
    });
    btn.textContent = 'Agregado ✓';
    refreshCartCount();
  } catch (err) {
    btn.textContent = 'Error';
    console.error(err);
  } finally {
    setTimeout(() => {
      btn.textContent = textoOriginal;
      btn.disabled = false;
    }, 1500);
  }
}

// ---- Newsletter ----
const form = document.getElementById('newsletterForm');
const msg = document.getElementById('newsletterMsg');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    try {
      await apiFetch('/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
      msg.textContent = '¡Gracias por suscribirte! Revisa tu correo para confirmar.';
      form.reset();
    } catch {
      msg.textContent = 'No pudimos conectar con el servidor. Intenta más tarde.';
    }
  });
}

// ---- Grillas de productos (destacados en home, catálogo en categorías) ----
function renderProductGrid(gridEl, productos) {
  gridEl.innerHTML = productos
    .map(
      (p) => `
    <article class="prod-card">
      <div class="prod-img">✦</div>
      ${p.destacado ? '<span class="prod-badge">Destacado</span>' : ''}
      <h3>${p.nombre}</h3>
      <p class="prod-price">${formatCLP(p.precio)}</p>
      <button class="btn btn-primary btn-sm" data-id="${p.id}">Agregar</button>
    </article>`
    )
    .join('');

  gridEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-id]');
    if (btn) addToCart(Number(btn.dataset.id), btn);
  });
}

const destacadosGrid = document.getElementById('destacadosGrid');
if (destacadosGrid) {
  apiFetch('/productos?destacado=true')
    .then(({ productos }) => {
      if (productos && productos.length) renderProductGrid(destacadosGrid, productos);
    })
    .catch(() => {
      // backend no disponible: se mantienen los productos de ejemplo del HTML
    });
}

const catGrid = document.getElementById('prodGrid');
if (catGrid) {
  const categoriaSlug = catGrid.dataset.categoria;
  const resultCount = document.getElementById('resultCount');
  apiFetch(`/productos?categoria=${categoriaSlug}`)
    .then(({ productos }) => {
      if (!productos || !productos.length) {
        catGrid.innerHTML = '<p class="cat-empty">Todavía no hay productos cargados en esta categoría.</p>';
        if (resultCount) resultCount.textContent = '0 productos';
        return;
      }
      renderProductGrid(catGrid, productos);
      if (resultCount) resultCount.textContent = `${productos.length} producto${productos.length === 1 ? '' : 's'}`;
    })
    .catch(() => {
      catGrid.innerHTML = '<p class="cat-empty">No pudimos conectar con el servidor. Intenta más tarde.</p>';
    });
}

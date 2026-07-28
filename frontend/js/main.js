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

// ---- Newsletter ----
// Backend real (ver ../Vault-Front/CONEXION_FRONTEND.md): cookies httpOnly,
// usar siempre credentials:'include'.
const API_BASE = 'http://localhost:4000/api';
const form = document.getElementById('newsletterForm');
const msg = document.getElementById('newsletterMsg');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.querySelector('input[type="email"]').value;
  try {
    const res = await fetch(`${API_BASE}/newsletter`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Error');
    msg.textContent = '¡Gracias por suscribirte! Revisa tu correo para confirmar.';
    form.reset();
  } catch {
    msg.textContent = 'No pudimos conectar con el servidor. Intenta más tarde.';
  }
});

// ---- Productos destacados (desde la API, si está disponible) ----
const destacadosGrid = document.getElementById('destacadosGrid');
if (destacadosGrid) {
  fetch(`${API_BASE}/productos?destacado=true`, { credentials: 'include' })
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then(({ productos }) => {
      if (!productos || !productos.length) return;
      const formatCLP = (n) => '$' + Number(n).toLocaleString('es-CL');
      destacadosGrid.innerHTML = productos
        .map(
          (p) => `
        <article class="prod-card">
          <div class="prod-img">✦</div>
          <h3>${p.nombre}</h3>
          <p class="prod-price">${formatCLP(p.precio)}</p>
          <button class="btn btn-primary btn-sm">Agregar</button>
        </article>`
        )
        .join('');
    })
    .catch(() => {
      // backend no disponible: se mantienen los productos de ejemplo del HTML
    });
}

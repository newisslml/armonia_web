import { nextTheme, applyTheme } from './theme.js';
import { isValidEmail } from './utils.js';
import { catCard, prodCard, renderList, renderError } from './render.js';

const API_URL = 'http://localhost:4000';

const root = document.documentElement;
const els = {
  root,
  icon: document.getElementById('theme-icon'),
  label: document.getElementById('theme-label'),
};
const toggleBtn = document.getElementById('theme-toggle');

const stored = localStorage.getItem('armonia-theme');
if (stored === 'dark' || stored === 'light') applyTheme(els, stored);

toggleBtn.addEventListener('click', () => {
  const next = nextTheme(root.getAttribute('data-theme'));
  applyTheme(els, next);
  localStorage.setItem('armonia-theme', next);
});

// Newsletter — POST /api/newsletter (ver CONEXION_FRONTEND.md).
const form = document.getElementById('newsletter-form');
const note = document.getElementById('newsletter-note');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  if (!isValidEmail(email)) {
    note.dataset.state = 'error';
    note.textContent = 'Ingresa un correo válido.';
    return;
  }
  try {
    const r = await fetch(`${API_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || 'No se pudo suscribir.');
    note.dataset.state = 'ok';
    note.textContent = 'Listo, te suscribiste correctamente.';
    form.reset();
  } catch (err) {
    note.dataset.state = 'error';
    note.textContent = err.message || 'No se pudo conectar con el servidor.';
  }
});

// Categorías y productos destacados — datos reales del backend.
const gridCategorias = document.getElementById('grid-categorias');
fetch(`${API_URL}/api/categorias`)
  .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
  .then((categorias) => renderList(gridCategorias, categorias, (c) => catCard(API_URL, c), 'Aún no hay categorías cargadas.'))
  .catch(() => renderError(gridCategorias, 'No se pudo conectar con el servidor.'));

const gridProductos = document.getElementById('grid-productos');
fetch(`${API_URL}/api/productos?destacado=true`)
  .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
  .then((data) => renderList(gridProductos, data.productos, (p) => prodCard(API_URL, p), 'Aún no hay productos destacados.'))
  .catch(() => renderError(gridProductos, 'No se pudo conectar con el servidor.'));

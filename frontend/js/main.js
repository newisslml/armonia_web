import { nextTheme, applyTheme } from './theme.js';
import { isValidEmail, money } from './utils.js';
import { catCard, prodCard, renderList, renderError, productModalBody, cartRow } from './render.js';
import { getCart, addToCart, removeFromCart, setQty, cartCount, cartTotal } from './cart.js';

const API_URL = 'http://localhost:4000';
const productsById = new Map();

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
  .then((data) => {
    data.productos.forEach((p) => productsById.set(String(p.id), p));
    renderList(gridProductos, data.productos, (p) => prodCard(API_URL, p), 'Aún no hay productos destacados.');
  })
  .catch(() => renderError(gridProductos, 'No se pudo conectar con el servidor.'));

// Carrito y detalle de producto — todo en localStorage, sin backend.
const productModal = document.getElementById('product-modal');
const productModalContent = document.getElementById('product-modal-content');
const cartModal = document.getElementById('cart-modal');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total-value');
const cartCheckoutBtn = document.getElementById('cart-checkout');
const cartCountEl = document.getElementById('cart-count');
const toastEl = document.getElementById('toast');

let toastHideTimer, toastPopoverTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.togglePopover(true);
  requestAnimationFrame(() => { toastEl.dataset.show = 'true'; });
  clearTimeout(toastHideTimer);
  clearTimeout(toastPopoverTimer);
  toastHideTimer = setTimeout(() => { toastEl.dataset.show = 'false'; }, 2000);
  toastPopoverTimer = setTimeout(() => toastEl.togglePopover(false), 2250);
}

function openProductModal(id) {
  const product = productsById.get(String(id));
  if (!product) return;
  productModalContent.innerHTML = '';
  productModalContent.appendChild(productModalBody(API_URL, product));
  productModal.showModal();
}

function renderCart() {
  const cart = getCart();
  cartCountEl.textContent = String(cartCount(cart));
  renderList(cartItemsEl, cart, cartRow, 'Tu carrito está vacío.');
  cartTotalEl.textContent = money(cartTotal(cart));
  cartCheckoutBtn.disabled = cart.length === 0;
}

gridProductos.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add-to-cart]');
  if (addBtn) {
    e.stopPropagation();
    const product = productsById.get(String(addBtn.dataset.addToCart));
    if (product) { addToCart(product); showToast(`${product.nombre} agregado al carrito`); }
    return;
  }
  const card = e.target.closest('.prod-card');
  if (card) openProductModal(card.dataset.productId);
});

productModalContent.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add-to-cart]');
  if (!addBtn) return;
  const product = productsById.get(String(addBtn.dataset.addToCart));
  if (product) { addToCart(product); showToast(`${product.nombre} agregado al carrito`); }
});

document.getElementById('product-modal-close').addEventListener('click', () => productModal.close());
productModal.addEventListener('click', (e) => { if (e.target === productModal) productModal.close(); });

document.getElementById('cart-toggle').addEventListener('click', () => {
  renderCart();
  cartModal.showModal();
});
document.getElementById('cart-modal-close').addEventListener('click', () => cartModal.close());
cartModal.addEventListener('click', (e) => { if (e.target === cartModal) cartModal.close(); });

cartItemsEl.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('[data-remove-from-cart]');
  if (removeBtn) removeFromCart(Number(removeBtn.dataset.removeFromCart));
});
cartItemsEl.addEventListener('change', (e) => {
  const qtyInput = e.target.closest('[data-qty-for]');
  if (qtyInput) setQty(Number(qtyInput.dataset.qtyFor), Number(qtyInput.value));
});

window.addEventListener('cart:change', renderCart);
renderCart();

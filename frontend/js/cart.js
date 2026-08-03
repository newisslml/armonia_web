const STORAGE_KEY = 'armonia-cart';

export function getCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart:change', { detail: cart }));
  return cart;
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagenUrl: product.imagenUrl,
      qty,
    });
  }
  return saveCart(cart);
}

export function removeFromCart(id) {
  return saveCart(getCart().filter((item) => item.id !== id));
}

export function setQty(id, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return cart;
  if (qty <= 0) return removeFromCart(id);
  item.qty = qty;
  return saveCart(cart);
}

export function cartCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

export function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + Number(item.precio) * item.qty, 0);
}

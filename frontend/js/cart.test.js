import { describe, it, expect, beforeEach } from 'vitest';
import { getCart, addToCart, removeFromCart, setQty, cartCount, cartTotal } from './cart.js';

const product = { id: 1, nombre: 'Vela', precio: '8990', imagenUrl: null };

beforeEach(() => localStorage.clear());

describe('addToCart', () => {
  it('adds a new item with qty 1 by default', () => {
    addToCart(product);
    expect(getCart()).toEqual([{ id: 1, nombre: 'Vela', precio: '8990', imagenUrl: null, qty: 1 }]);
  });

  it('increments qty when the product is already in the cart', () => {
    addToCart(product);
    addToCart(product, 2);
    expect(getCart()[0].qty).toBe(3);
  });
});

describe('removeFromCart', () => {
  it('removes the matching item', () => {
    addToCart(product);
    removeFromCart(1);
    expect(getCart()).toEqual([]);
  });
});

describe('setQty', () => {
  it('updates the quantity', () => {
    addToCart(product);
    setQty(1, 5);
    expect(getCart()[0].qty).toBe(5);
  });

  it('removes the item when qty drops to 0 or less', () => {
    addToCart(product);
    setQty(1, 0);
    expect(getCart()).toEqual([]);
  });
});

describe('cartCount and cartTotal', () => {
  it('sums quantities and totals across items', () => {
    addToCart(product, 2);
    addToCart({ id: 2, nombre: 'Difusor', precio: '10000', imagenUrl: null });
    const cart = getCart();
    expect(cartCount(cart)).toBe(3);
    expect(cartTotal(cart)).toBe(2 * 8990 + 10000);
  });
});

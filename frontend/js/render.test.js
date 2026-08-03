import { describe, it, expect } from 'vitest';
import { catCard, prodCard, productModalBody, cartRow, renderList, renderError } from './render.js';

const API = 'http://localhost:4000';

describe('catCard', () => {
  it('shows the placeholder slot with the category name when there is no image', () => {
    const el = catCard(API, { nombre: 'Aromaterapia', imagenUrl: null });
    expect(el.querySelector('.img-slot').textContent).toBe('Aromaterapia');
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('.name').textContent).toBe('Aromaterapia');
  });

  it('renders an <img> pointed at the API when imagenUrl is set', () => {
    const el = catCard(API, { nombre: 'Velas', imagenUrl: '/uploads/velas.jpg' });
    const img = el.querySelector('img');
    expect(img.src).toBe('http://localhost:4000/uploads/velas.jpg');
    expect(img.alt).toBe('Velas');
  });
});

describe('prodCard', () => {
  it('formats the price and shows the product name', () => {
    const el = prodCard(API, { nombre: 'Vela aromatica lavanda', precio: '8990', imagenUrl: null });
    expect(el.querySelector('.prod-card__name').textContent).toBe('Vela aromatica lavanda');
    expect(el.querySelector('.prod-card__price').textContent).toBe('$8.990');
  });

  it('renders an <img> pointed at the API when imagenUrl is set', () => {
    const el = prodCard(API, { nombre: 'Difusor', precio: '24990', imagenUrl: '/uploads/difusor.jpg' });
    const img = el.querySelector('img');
    expect(img.src).toBe('http://localhost:4000/uploads/difusor.jpg');
    expect(img.alt).toBe('Difusor');
  });
});

describe('productModalBody', () => {
  it('shows the placeholder slot and default description when data is missing', () => {
    const el = productModalBody(API, { nombre: 'Sahumerio', precio: '3990', imagenUrl: null, descripcion: null });
    expect(el.querySelector('.img-slot').textContent).toBe('Sahumerio');
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('h3').textContent).toBe('Sahumerio');
    expect(el.querySelector('.product-modal__price').textContent).toBe('$3.990');
    expect(el.querySelector('.product-modal__desc').textContent).toBe('Sin descripción disponible por ahora.');
  });

  it('renders an <img> and the description when provided', () => {
    const el = productModalBody(API, {
      id: 7,
      nombre: 'Cuarzo rosa',
      precio: '12990',
      imagenUrl: '/uploads/cuarzo.jpg',
      descripcion: 'Piedra del amor propio.',
    });
    const img = el.querySelector('img');
    expect(img.src).toBe('http://localhost:4000/uploads/cuarzo.jpg');
    expect(img.alt).toBe('Cuarzo rosa');
    expect(el.querySelector('.product-modal__desc').textContent).toBe('Piedra del amor propio.');
    expect(el.querySelector('[data-add-to-cart]').dataset.addToCart).toBe('7');
  });
});

describe('cartRow', () => {
  it('renders name, quantity, computed price and remove button', () => {
    const el = cartRow({ id: 3, nombre: 'Vela lavanda', precio: '5000', qty: 2 });
    expect(el.dataset.cartId).toBe('3');
    expect(el.querySelector('.cart-row__name').textContent).toBe('Vela lavanda');
    expect(el.querySelector('.cart-row__qty').value).toBe('2');
    expect(el.querySelector('.cart-row__price').textContent).toBe('$10.000');
    expect(el.querySelector('.cart-row__remove').dataset.removeFromCart).toBe('3');
  });
});

describe('renderList', () => {
  it('shows the empty message when there are no items', () => {
    const container = document.createElement('div');
    renderList(container, [], () => document.createElement('div'), 'Nada por aquí.');
    expect(container.querySelector('.fetch-note').textContent).toBe('Nada por aquí.');
    expect(container.dataset.state).toBeUndefined();
  });

  it('renders one node per item via the given render function', () => {
    const container = document.createElement('div');
    renderList(container, [1, 2, 3], (n) => {
      const d = document.createElement('div');
      d.className = 'item';
      d.textContent = String(n);
      return d;
    }, 'vacio');
    expect(container.querySelectorAll('.item')).toHaveLength(3);
  });
});

describe('renderError', () => {
  it('sets data-state=error and shows the message', () => {
    const container = document.createElement('div');
    renderError(container, 'No se pudo conectar con el servidor.');
    expect(container.dataset.state).toBe('error');
    expect(container.querySelector('.fetch-note').textContent).toBe('No se pudo conectar con el servidor.');
  });
});

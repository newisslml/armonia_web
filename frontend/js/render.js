import { money, imgUrl } from './utils.js';

export function imgSlot(labelText) {
  const div = document.createElement('div');
  div.className = 'img-slot';
  div.textContent = labelText;
  return div;
}

export function catCard(apiUrl, cat) {
  const a = document.createElement('a');
  a.href = '#';
  a.className = 'cat-card';
  const url = imgUrl(apiUrl, cat.imagenUrl);
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = cat.nombre;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    a.appendChild(img);
  } else {
    a.appendChild(imgSlot(cat.nombre));
  }
  const scrim = document.createElement('div');
  scrim.className = 'cat-card__scrim';
  a.appendChild(scrim);
  const labelDiv = document.createElement('div');
  labelDiv.className = 'cat-card__label';
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = cat.nombre;
  const link = document.createElement('div');
  link.className = 'link';
  link.textContent = 'Ver más →';
  labelDiv.append(name, link);
  a.appendChild(labelDiv);
  return a;
}

export function prodCard(apiUrl, p) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'prod-card';
  card.dataset.productId = p.id;
  const imgWrap = document.createElement('div');
  imgWrap.className = 'prod-card__img';
  const url = imgUrl(apiUrl, p.imagenUrl);
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = p.nombre;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    imgWrap.appendChild(img);
  } else {
    imgWrap.appendChild(imgSlot(p.nombre));
  }
  const name = document.createElement('div');
  name.className = 'prod-card__name';
  name.textContent = p.nombre;
  const price = document.createElement('div');
  price.className = 'prod-card__price';
  price.textContent = money(p.precio);
  const addBtn = document.createElement('span');
  addBtn.className = 'prod-card__add';
  addBtn.dataset.addToCart = p.id;
  addBtn.textContent = 'Agregar al carrito';
  card.append(imgWrap, name, price, addBtn);
  return card;
}

export function productModalBody(apiUrl, p) {
  const wrap = document.createElement('div');
  wrap.className = 'product-modal__body';
  const imgWrap = document.createElement('div');
  imgWrap.className = 'product-modal__img';
  const url = imgUrl(apiUrl, p.imagenUrl);
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = p.nombre;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    imgWrap.appendChild(img);
  } else {
    imgWrap.appendChild(imgSlot(p.nombre));
  }
  const info = document.createElement('div');
  info.className = 'product-modal__info';
  const name = document.createElement('h3');
  name.textContent = p.nombre;
  const price = document.createElement('div');
  price.className = 'product-modal__price';
  price.textContent = money(p.precio);
  const desc = document.createElement('p');
  desc.className = 'product-modal__desc';
  desc.textContent = p.descripcion || 'Sin descripción disponible por ahora.';
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'pill pill--solid';
  addBtn.dataset.addToCart = p.id;
  addBtn.textContent = 'Agregar al carrito';
  info.append(name, price, desc, addBtn);
  wrap.append(imgWrap, info);
  return wrap;
}

export function cartRow(item) {
  const row = document.createElement('div');
  row.className = 'cart-row';
  row.dataset.cartId = item.id;
  const name = document.createElement('div');
  name.className = 'cart-row__name';
  name.textContent = item.nombre;
  const qty = document.createElement('input');
  qty.type = 'number';
  qty.min = '1';
  qty.className = 'cart-row__qty';
  qty.value = String(item.qty);
  qty.dataset.qtyFor = item.id;
  const price = document.createElement('div');
  price.className = 'cart-row__price';
  price.textContent = money(Number(item.precio) * item.qty);
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'cart-row__remove';
  removeBtn.dataset.removeFromCart = item.id;
  removeBtn.textContent = 'Quitar';
  row.append(name, qty, price, removeBtn);
  return row;
}

export function renderList(container, items, renderItem, emptyMsg) {
  container.innerHTML = '';
  container.removeAttribute('data-state');
  if (!items.length) {
    const p = document.createElement('p');
    p.className = 'fetch-note';
    p.textContent = emptyMsg;
    container.appendChild(p);
    return;
  }
  items.forEach((item) => container.appendChild(renderItem(item)));
}

export function renderError(container, msg) {
  container.innerHTML = '';
  container.dataset.state = 'error';
  const p = document.createElement('p');
  p.className = 'fetch-note';
  p.textContent = msg;
  container.appendChild(p);
}

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
  const card = document.createElement('div');
  card.className = 'prod-card';
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
  card.append(imgWrap, name, price);
  return card;
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

(() => {
  const API_URL = 'http://localhost:4000';

  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');

  const ICONS = {
    dark: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    light: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>',
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    icon.innerHTML = ICONS[theme];
    label.textContent = theme === 'dark' ? 'Oscuro' : 'Claro';
  };

  const stored = localStorage.getItem('armonia-theme');
  if (stored === 'dark' || stored === 'light') applyTheme(stored);

  toggleBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('armonia-theme', next);
  });

  // Newsletter — POST /api/newsletter (ver CONEXION_FRONTEND.md).
  const form = document.getElementById('newsletter-form');
  const note = document.getElementById('newsletter-note');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
  // No hay endpoint de "imagen de categoría": las cards muestran el
  // placeholder visual con el nombre real de la categoría.
  const money = (n) => '$' + Math.round(Number(n)).toLocaleString('es-CL');
  const imgUrl = (path) => (path ? (/^https?:\/\//.test(path) ? path : `${API_URL}${path}`) : null);

  const imgSlot = (label) => {
    const div = document.createElement('div');
    div.className = 'img-slot';
    div.textContent = label;
    return div;
  };

  const catCard = (cat) => {
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'cat-card';
    const url = imgUrl(cat.imagenUrl);
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
  };

  const prodCard = (p) => {
    const card = document.createElement('div');
    card.className = 'prod-card';
    const imgWrap = document.createElement('div');
    imgWrap.className = 'prod-card__img';
    const url = imgUrl(p.imagenUrl);
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
  };

  const renderList = (container, items, renderItem, emptyMsg) => {
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
  };

  const renderError = (container, msg) => {
    container.innerHTML = '';
    container.dataset.state = 'error';
    const p = document.createElement('p');
    p.className = 'fetch-note';
    p.textContent = msg;
    container.appendChild(p);
  };

  const gridCategorias = document.getElementById('grid-categorias');
  fetch(`${API_URL}/api/categorias`)
    .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
    .then((categorias) => renderList(gridCategorias, categorias, catCard, 'Aún no hay categorías cargadas.'))
    .catch(() => renderError(gridCategorias, 'No se pudo conectar con el servidor.'));

  const gridProductos = document.getElementById('grid-productos');
  fetch(`${API_URL}/api/productos?destacado=true`)
    .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
    .then((data) => renderList(gridProductos, data.productos, prodCard, 'Aún no hay productos destacados.'))
    .catch(() => renderError(gridProductos, 'No se pudo conectar con el servidor.'));
})();

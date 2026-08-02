(() => {
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

  // Newsletter form: no backend wired yet — see CONEXION_FRONTEND.md.
  const form = document.getElementById('newsletter-form');
  const note = document.getElementById('newsletter-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.dataset.state = 'error';
      note.textContent = 'Ingresa un correo válido.';
      return;
    }
    note.dataset.state = 'ok';
    note.textContent = 'Endpoint de newsletter aún no conectado — ver CONEXION_FRONTEND.md.';
    form.reset();
  });
})();

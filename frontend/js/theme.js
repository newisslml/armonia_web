export const ICONS = {
  dark: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
  light: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>',
};

export function nextTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}

export function applyTheme({ root, icon, label }, theme) {
  root.setAttribute('data-theme', theme);
  icon.innerHTML = ICONS[theme];
  label.textContent = theme === 'dark' ? 'Oscuro' : 'Claro';
}

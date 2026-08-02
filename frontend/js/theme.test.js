import { describe, it, expect } from 'vitest';
import { nextTheme, applyTheme } from './theme.js';

describe('nextTheme', () => {
  it('flips dark to light and vice versa', () => {
    expect(nextTheme('dark')).toBe('light');
    expect(nextTheme('light')).toBe('dark');
  });
});

describe('applyTheme', () => {
  it('sets data-theme on root and updates the toggle label/icon', () => {
    const root = document.createElement('html');
    const icon = document.createElement('span');
    const label = document.createElement('span');

    applyTheme({ root, icon, label }, 'light');
    expect(root.getAttribute('data-theme')).toBe('light');
    expect(label.textContent).toBe('Claro');
    expect(icon.innerHTML).toContain('<svg');

    applyTheme({ root, icon, label }, 'dark');
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(label.textContent).toBe('Oscuro');
  });
});

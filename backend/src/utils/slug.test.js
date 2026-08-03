import { slugify } from './slug';

describe('slugify', () => {
  it('pasa a minusculas y separa por guiones', () => {
    expect(slugify('Aceites Esenciales')).toBe('aceites-esenciales');
  });

  it('saca acentos', () => {
    expect(slugify('Sahumerio Palo Santo')).toBe('sahumerio-palo-santo');
    expect(slugify('Cristalería')).toBe('cristaleria');
  });

  it('saca guiones al inicio y al final', () => {
    expect(slugify('  -- Kits y Cajas --  ')).toBe('kits-y-cajas');
  });

  it('acepta numeros', () => {
    expect(slugify('Sahumerio Palo Santo x5')).toBe('sahumerio-palo-santo-x5');
  });
});

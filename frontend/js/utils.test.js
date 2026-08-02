import { describe, it, expect } from 'vitest';
import { money, imgUrl, isValidEmail } from './utils.js';

describe('money', () => {
  it('formats an integer CLP amount with thousands separator', () => {
    expect(money(12990)).toBe('$12.990');
  });

  it('rounds a decimal-string price (Prisma Decimal serialized)', () => {
    expect(money('8990.00')).toBe('$8.990');
  });

  it('rounds non-integer amounts', () => {
    expect(money(999.6)).toBe('$1.000');
  });
});

describe('imgUrl', () => {
  const API = 'http://localhost:4000';

  it('returns null when there is no path', () => {
    expect(imgUrl(API, null)).toBeNull();
    expect(imgUrl(API, '')).toBeNull();
  });

  it('prefixes a relative /uploads path with the API url', () => {
    expect(imgUrl(API, '/uploads/foo.jpg')).toBe('http://localhost:4000/uploads/foo.jpg');
  });

  it('leaves an absolute http(s) url untouched', () => {
    expect(imgUrl(API, 'https://cdn.example.com/foo.jpg')).toBe('https://cdn.example.com/foo.jpg');
  });
});

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('persona@armoniachile.cl')).toBe(true);
  });

  it('rejects missing @ or domain', () => {
    expect(isValidEmail('persona')).toBe(false);
    expect(isValidEmail('persona@armoniachile')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

import { firmarToken, verificarToken } from './jwt';

describe('jwt', () => {
  it('firma y verifica un payload, ida y vuelta', () => {
    const token = firmarToken({ id: 1, rol: 'cliente' });
    const decoded = verificarToken(token);
    expect(decoded.id).toBe(1);
    expect(decoded.rol).toBe('cliente');
  });

  it('rechaza un token invalido', () => {
    expect(() => verificarToken('token-inventado')).toThrow();
  });
});

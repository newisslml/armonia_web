import { firmarToken } from '../utils/jwt';
import { auth_opcional, auth_requerida, requerir_admin } from './auth';

function fakeRes() {
  const res = {};
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
}

describe('auth_opcional', () => {
  it('deja pasar sin usuario y pone cookie guest_id si no hay ninguna sesion', () => {
    const req = { cookies: {} };
    const res = fakeRes();
    const next = vi.fn();

    auth_opcional(req, res, next);

    expect(req.usuario).toBeUndefined();
    expect(res.cookie).toHaveBeenCalledWith('guest_id', expect.any(String), expect.any(Object));
    expect(next).toHaveBeenCalled();
  });

  it('decodifica el usuario si el token es valido', () => {
    const token = firmarToken({ id: 1, rol: 'cliente' });
    const req = { cookies: { token } };
    const res = fakeRes();
    const next = vi.fn();

    auth_opcional(req, res, next);

    expect(req.usuario.id).toBe(1);
    expect(res.cookie).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('limpia la cookie si el token es invalido y sigue como invitado', () => {
    const req = { cookies: { token: 'basura' } };
    const res = fakeRes();
    const next = vi.fn();

    auth_opcional(req, res, next);

    expect(req.usuario).toBeUndefined();
    expect(res.clearCookie).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});

describe('auth_requerida', () => {
  it('tira 401 si no hay cookie token', () => {
    const req = { cookies: {} };
    const next = vi.fn();
    expect(() => auth_requerida(req, {}, next)).toThrow(expect.objectContaining({ status: 401 }));
  });

  it('tira 401 si el token es invalido', () => {
    const req = { cookies: { token: 'basura' } };
    const next = vi.fn();
    expect(() => auth_requerida(req, {}, next)).toThrow(expect.objectContaining({ status: 401 }));
  });

  it('deja pasar y setea req.usuario con token valido', () => {
    const token = firmarToken({ id: 7, rol: 'admin' });
    const req = { cookies: { token } };
    const next = vi.fn();

    auth_requerida(req, {}, next);

    expect(req.usuario.id).toBe(7);
    expect(next).toHaveBeenCalled();
  });
});

describe('requerir_admin', () => {
  it('tira 403 si el usuario no es admin', () => {
    const req = { usuario: { rol: 'cliente' } };
    expect(() => requerir_admin(req, {}, vi.fn())).toThrow(
      expect.objectContaining({ status: 403 }),
    );
  });

  it('deja pasar si es admin', () => {
    const req = { usuario: { rol: 'admin' } };
    const next = vi.fn();
    requerir_admin(req, {}, next);
    expect(next).toHaveBeenCalled();
  });
});

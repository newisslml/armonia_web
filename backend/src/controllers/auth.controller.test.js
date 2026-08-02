const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
import { registro, login, logout, me } from './auth.controller';

function fakeRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);
  return res;
}

describe('auth.controller', () => {
  beforeEach(() => {
    prisma.usuario = {
      findUnique: vi.fn(),
      create: vi.fn(),
    };
    bcrypt.hash = vi.fn();
    bcrypt.compare = vi.fn();
  });

  describe('registro', () => {
    it('crea el usuario, no expone passwordHash y pone cookie de sesion', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hash-falso');
      prisma.usuario.create.mockResolvedValue({
        id: 1,
        email: 'a@a.com',
        passwordHash: 'hash-falso',
        rol: 'cliente',
      });
      const req = { body: { email: 'a@a.com', password: 'password123' } };
      const res = fakeRes();

      await registro(req, res);

      expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(201);
      const body = res.json.mock.calls[0][0];
      expect(body.passwordHash).toBeUndefined();
      expect(body.email).toBe('a@a.com');
    });

    it('rechaza email ya registrado con 409', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: 1, email: 'a@a.com' });
      const req = { body: { email: 'a@a.com', password: 'password123' } };
      const res = fakeRes();

      await expect(registro(req, res)).rejects.toMatchObject({ status: 409 });
    });
  });

  describe('login', () => {
    it('rechaza password incorrecta con 401', async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        id: 1,
        email: 'a@a.com',
        passwordHash: 'hash-real',
        rol: 'cliente',
      });
      bcrypt.compare.mockResolvedValue(false);
      const req = { body: { email: 'a@a.com', password: 'mala' } };
      const res = fakeRes();

      await expect(login(req, res)).rejects.toMatchObject({ status: 401 });
    });

    it('rechaza usuario inexistente con 401', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);
      const req = { body: { email: 'noexiste@a.com', password: 'password123' } };
      const res = fakeRes();

      await expect(login(req, res)).rejects.toMatchObject({ status: 401 });
    });

    it('login correcto pone cookie y devuelve usuario sin hash', async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        id: 1,
        email: 'a@a.com',
        passwordHash: 'hash-real',
        rol: 'cliente',
      });
      bcrypt.compare.mockResolvedValue(true);
      const req = { body: { email: 'a@a.com', password: 'buena' } };
      const res = fakeRes();

      await login(req, res);

      expect(res.cookie).toHaveBeenCalled();
      const body = res.json.mock.calls[0][0];
      expect(body.passwordHash).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('limpia la cookie y responde 204', async () => {
      const res = fakeRes();
      await logout({}, res);
      expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('me', () => {
    it('404... 401 si el usuario del token ya no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);
      const req = { usuario: { id: 99 } };
      const res = fakeRes();

      await expect(me(req, res)).rejects.toMatchObject({ status: 401 });
    });

    it('devuelve el usuario actual sin passwordHash', async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        id: 1,
        email: 'a@a.com',
        passwordHash: 'hash-real',
        rol: 'cliente',
      });
      const req = { usuario: { id: 1 } };
      const res = fakeRes();

      await me(req, res);

      const body = res.json.mock.calls[0][0];
      expect(body.passwordHash).toBeUndefined();
      expect(body.id).toBe(1);
    });
  });
});

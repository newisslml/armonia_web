const prisma = require('../lib/prisma');
import { obtenerOCrearCarrito } from './carrito.service';

describe('obtenerOCrearCarrito', () => {
  beforeEach(() => {
    prisma.carrito = { upsert: vi.fn() };
  });

  it('usa usuarioId cuando hay usuario logueado', async () => {
    prisma.carrito.upsert.mockResolvedValue({ id: 1, usuarioId: 5, items: [] });
    const req = { usuario: { id: 5 }, cookies: {} };

    const carrito = await obtenerOCrearCarrito(req);

    expect(prisma.carrito.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { usuarioId: 5 } }),
    );
    expect(carrito.usuarioId).toBe(5);
  });

  it('usa la cookie guest_id cuando no hay usuario', async () => {
    prisma.carrito.upsert.mockResolvedValue({ id: 2, sessionId: 'abc', items: [] });
    const req = { usuario: null, cookies: { guest_id: 'abc' } };

    const carrito = await obtenerOCrearCarrito(req);

    expect(prisma.carrito.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { sessionId: 'abc' } }),
    );
    expect(carrito.sessionId).toBe('abc');
  });

  it('tira ApiError 400 si no hay usuario ni cookie de invitado', async () => {
    const req = { usuario: null, cookies: {} };
    await expect(obtenerOCrearCarrito(req)).rejects.toThrow('Sesion de invitado no disponible');
  });
});

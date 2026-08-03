const prisma = require('../lib/prisma');
import { listar, detalle } from './productos.controller';

function fakeRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('productos.controller', () => {
  beforeEach(() => {
    prisma.producto = {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    };
  });

  describe('listar', () => {
    it('filtra por categoria y destacado, con paginacion default', async () => {
      prisma.producto.findMany.mockResolvedValue([{ id: 1, nombre: 'Vela' }]);
      prisma.producto.count.mockResolvedValue(1);
      const req = { query: { categoria: 'velas-aromaticas', destacado: 'true' } };
      const res = fakeRes();

      await listar(req, res);

      expect(prisma.producto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { categoria: { slug: 'velas-aromaticas' }, destacado: true },
          skip: 0,
          take: 24,
        }),
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ total: 1, pagina: 1, porPagina: 24 }),
      );
    });

    it('respeta pagina y porPagina custom', async () => {
      prisma.producto.findMany.mockResolvedValue([]);
      prisma.producto.count.mockResolvedValue(0);
      const req = { query: { pagina: '2', porPagina: '5' } };
      const res = fakeRes();

      await listar(req, res);

      expect(prisma.producto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 5, take: 5 }),
      );
    });
  });

  describe('detalle', () => {
    it('devuelve 404 si el producto no existe', async () => {
      prisma.producto.findUnique.mockResolvedValue(null);
      const req = { params: { slug: 'no-existe' } };
      const res = fakeRes();

      await expect(detalle(req, res)).rejects.toMatchObject({ status: 404 });
    });

    it('devuelve el producto por slug', async () => {
      prisma.producto.findUnique.mockResolvedValue({ id: 1, slug: 'vela', nombre: 'Vela' });
      const req = { params: { slug: 'vela' } };
      const res = fakeRes();

      await detalle(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ slug: 'vela' }));
    });
  });
});

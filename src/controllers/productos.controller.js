const { z } = require('zod');
const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');

const listaQuerySchema = z.object({
  categoria: z.string().optional(),
  destacado: z.enum(['true', 'false']).optional(),
  busqueda: z.string().optional(),
  pagina: z.coerce.number().int().min(1).default(1),
  porPagina: z.coerce.number().int().min(1).max(100).default(24),
});

async function listar(req, res) {
  const q = listaQuerySchema.parse(req.query);

  const where = {
    ...(q.categoria ? { categoria: { slug: q.categoria } } : {}),
    ...(q.destacado ? { destacado: q.destacado === 'true' } : {}),
    ...(q.busqueda
      ? { nombre: { contains: q.busqueda, mode: 'insensitive' } }
      : {}),
  };

  const [productos, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      include: { categoria: true },
      orderBy: { creadoEn: 'desc' },
      skip: (q.pagina - 1) * q.porPagina,
      take: q.porPagina,
    }),
    prisma.producto.count({ where }),
  ]);

  res.json({ productos, total, pagina: q.pagina, porPagina: q.porPagina });
}

async function detalle(req, res) {
  const producto = await prisma.producto.findUnique({
    where: { slug: req.params.slug },
    include: { categoria: true },
  });
  if (!producto) throw new ApiError(404, 'Producto no encontrado');
  res.json(producto);
}

module.exports = { listar, detalle };

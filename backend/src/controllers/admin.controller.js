const { z } = require('zod');
const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');
const { slugify } = require('../utils/slug');

const productoSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  precio: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0).default(0),
  categoriaId: z.coerce.number().int().positive().optional(),
  destacado: z.coerce.boolean().default(false),
});

const categoriaSchema = z.object({
  nombre: z.string().min(1),
  padreId: z.coerce.number().int().positive().optional(),
});

const estadoPedidoSchema = z.object({
  estado: z.enum(['pendiente', 'pagado', 'rechazado', 'enviado', 'completado']),
});

// --- productos ---

async function crearProducto(req, res) {
  const datos = productoSchema.parse(req.body);
  const producto = await prisma.producto.create({
    data: { ...datos, slug: slugify(datos.nombre) },
  });
  res.status(201).json(producto);
}

async function actualizarProducto(req, res) {
  const id = Number(req.params.id);
  const datos = productoSchema.partial().parse(req.body);
  const producto = await prisma.producto
    .update({
      where: { id },
      data: { ...datos, ...(datos.nombre ? { slug: slugify(datos.nombre) } : {}) },
    })
    .catch(() => {
      throw new ApiError(404, 'Producto no encontrado');
    });
  res.json(producto);
}

async function eliminarProducto(req, res) {
  const id = Number(req.params.id);
  await prisma.producto.delete({ where: { id } }).catch(() => {
    throw new ApiError(404, 'Producto no encontrado');
  });
  res.status(204).end();
}

async function subirImagenProducto(req, res) {
  const id = Number(req.params.id);
  if (!req.file) throw new ApiError(400, 'Falta el archivo de imagen');

  const producto = await prisma.producto
    .update({
      where: { id },
      data: { imagenUrl: `/uploads/${req.file.filename}` },
    })
    .catch(() => {
      throw new ApiError(404, 'Producto no encontrado');
    });
  res.json(producto);
}

// --- categorias ---

async function crearCategoria(req, res) {
  const datos = categoriaSchema.parse(req.body);
  const categoria = await prisma.categoria.create({
    data: { ...datos, slug: slugify(datos.nombre) },
  });
  res.status(201).json(categoria);
}

async function actualizarCategoria(req, res) {
  const id = Number(req.params.id);
  const datos = categoriaSchema.partial().parse(req.body);
  const categoria = await prisma.categoria
    .update({
      where: { id },
      data: { ...datos, ...(datos.nombre ? { slug: slugify(datos.nombre) } : {}) },
    })
    .catch(() => {
      throw new ApiError(404, 'Categoria no encontrada');
    });
  res.json(categoria);
}

async function eliminarCategoria(req, res) {
  const id = Number(req.params.id);
  await prisma.categoria.delete({ where: { id } }).catch(() => {
    throw new ApiError(404, 'Categoria no encontrada');
  });
  res.status(204).end();
}

// --- pedidos ---

async function listarPedidos(req, res) {
  const pedidos = await prisma.pedido.findMany({
    include: {
      items: true,
      pago: true,
      usuario: { select: { id: true, email: true, nombre: true } },
    },
    orderBy: { creadoEn: 'desc' },
  });
  res.json(pedidos);
}

async function actualizarEstadoPedido(req, res) {
  const id = Number(req.params.id);
  const { estado } = estadoPedidoSchema.parse(req.body);
  const pedido = await prisma.pedido.update({ where: { id }, data: { estado } }).catch(() => {
    throw new ApiError(404, 'Pedido no encontrado');
  });
  res.json(pedido);
}

module.exports = {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  subirImagenProducto,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  listarPedidos,
  actualizarEstadoPedido,
};

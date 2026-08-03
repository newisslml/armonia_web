const { z } = require('zod');
const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');
const { obtenerOCrearCarrito, INCLUDE_ITEMS } = require('../services/carrito.service');

const agregarSchema = z.object({
  productoId: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().int().positive().default(1),
});

const cantidadSchema = z.object({
  cantidad: z.coerce.number().int().positive(),
});

async function ver(req, res) {
  const carrito = await obtenerOCrearCarrito(req);
  res.json(carrito);
}

async function agregarItem(req, res) {
  const datos = agregarSchema.parse(req.body);
  const carrito = await obtenerOCrearCarrito(req);

  const producto = await prisma.producto.findUnique({ where: { id: datos.productoId } });
  if (!producto) throw new ApiError(404, 'Producto no encontrado');

  await prisma.carritoItem.upsert({
    where: { carritoId_productoId: { carritoId: carrito.id, productoId: datos.productoId } },
    create: { carritoId: carrito.id, productoId: datos.productoId, cantidad: datos.cantidad },
    update: { cantidad: { increment: datos.cantidad } },
  });

  const actualizado = await prisma.carrito.findUnique({
    where: { id: carrito.id },
    include: INCLUDE_ITEMS,
  });
  res.status(201).json(actualizado);
}

async function actualizarItem(req, res) {
  const datos = cantidadSchema.parse(req.body);
  const itemId = Number(req.params.id);
  const carrito = await obtenerOCrearCarrito(req);

  const item = carrito.items.find((i) => i.id === itemId);
  if (!item) throw new ApiError(404, 'Item no encontrado en el carrito');

  await prisma.carritoItem.update({ where: { id: itemId }, data: { cantidad: datos.cantidad } });

  const actualizado = await prisma.carrito.findUnique({
    where: { id: carrito.id },
    include: INCLUDE_ITEMS,
  });
  res.json(actualizado);
}

async function eliminarItem(req, res) {
  const itemId = Number(req.params.id);
  const carrito = await obtenerOCrearCarrito(req);

  const item = carrito.items.find((i) => i.id === itemId);
  if (!item) throw new ApiError(404, 'Item no encontrado en el carrito');

  await prisma.carritoItem.delete({ where: { id: itemId } });

  const actualizado = await prisma.carrito.findUnique({
    where: { id: carrito.id },
    include: INCLUDE_ITEMS,
  });
  res.json(actualizado);
}

module.exports = { ver, agregarItem, actualizarItem, eliminarItem };

const { z } = require('zod');
const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');

const crearPedidoSchema = z.object({
  direccionEnvio: z.string().min(1),
});

async function crear(req, res) {
  const datos = crearPedidoSchema.parse(req.body);

  const carrito = await prisma.carrito.findUnique({
    where: { usuarioId: req.usuario.id },
    include: { items: { include: { producto: true } } },
  });
  if (!carrito || carrito.items.length === 0) throw new ApiError(400, 'El carrito esta vacio');

  const pedido = await prisma.$transaction(async (tx) => {
    for (const item of carrito.items) {
      if (item.producto.stock < item.cantidad) {
        throw new ApiError(409, `Stock insuficiente para "${item.producto.nombre}"`);
      }
    }

    const total = carrito.items.reduce(
      (acc, item) => acc + Number(item.producto.precio) * item.cantidad,
      0,
    );

    const nuevoPedido = await tx.pedido.create({
      data: {
        usuarioId: req.usuario.id,
        total,
        direccionEnvio: datos.direccionEnvio,
        items: {
          create: carrito.items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precio,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of carrito.items) {
      await tx.producto.update({
        where: { id: item.productoId },
        data: { stock: { decrement: item.cantidad } },
      });
    }

    await tx.carritoItem.deleteMany({ where: { carritoId: carrito.id } });

    return nuevoPedido;
  });

  res.status(201).json(pedido);
}

async function detalle(req, res) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(req.params.id) },
    include: { items: { include: { producto: true } }, pago: true },
  });
  if (!pedido || pedido.usuarioId !== req.usuario.id) throw new ApiError(404, 'Pedido no encontrado');
  res.json(pedido);
}

async function listar(req, res) {
  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId: req.usuario.id },
    include: { items: true, pago: true },
    orderBy: { creadoEn: 'desc' },
  });
  res.json(pedidos);
}

module.exports = { crear, detalle, listar };

const { z } = require('zod');
const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');
const { iniciarTransaccion, confirmarTransaccion } = require('../services/transbank.service');

const iniciarSchema = z.object({
  pedidoId: z.coerce.number().int().positive(),
  returnUrl: z.string().url(),
});

async function iniciar(req, res) {
  const datos = iniciarSchema.parse(req.body);

  const pedido = await prisma.pedido.findUnique({ where: { id: datos.pedidoId } });
  if (!pedido || pedido.usuarioId !== req.usuario.id)
    throw new ApiError(404, 'Pedido no encontrado');
  if (pedido.estado !== 'pendiente') throw new ApiError(409, 'El pedido ya fue procesado');

  const buyOrder = `pedido-${pedido.id}`;
  const sessionId = `usuario-${req.usuario.id}`;
  const monto = Math.round(Number(pedido.total));

  const respuesta = await iniciarTransaccion({
    buyOrder,
    sessionId,
    amount: monto,
    returnUrl: datos.returnUrl,
  });

  await prisma.pago.upsert({
    where: { pedidoId: pedido.id },
    create: { pedidoId: pedido.id, tokenTransbank: respuesta.token, monto, estado: 'iniciado' },
    update: { tokenTransbank: respuesta.token, estado: 'iniciado' },
  });

  res.json({ token: respuesta.token, url: respuesta.url });
}

async function confirmar(req, res) {
  const token = req.body.token_ws || req.query.token_ws;
  if (!token) throw new ApiError(400, 'Falta token_ws');

  const pago = await prisma.pago.findFirst({ where: { tokenTransbank: token } });
  if (!pago) throw new ApiError(404, 'Pago no encontrado');

  const respuesta = await confirmarTransaccion(token);
  const aprobado = respuesta.status === 'AUTHORIZED' && respuesta.responseCode === 0;

  await prisma.$transaction([
    prisma.pago.update({
      where: { id: pago.id },
      data: { estado: aprobado ? 'autorizado' : 'rechazado' },
    }),
    prisma.pedido.update({
      where: { id: pago.pedidoId },
      data: { estado: aprobado ? 'pagado' : 'rechazado' },
    }),
  ]);

  res.json({ aprobado, detalle: respuesta });
}

module.exports = { iniciar, confirmar };

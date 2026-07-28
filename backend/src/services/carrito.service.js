const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');

const INCLUDE_ITEMS = { items: { include: { producto: true } } };

// El carrito pertenece al usuario logueado (usuarioId) o a un invitado
// identificado por la cookie guest_id (sessionId). auth_opcional garantiza
// que siempre exista uno de los dos antes de llegar aqui.
async function obtenerOCrearCarrito(req) {
  if (req.usuario) {
    return prisma.carrito.upsert({
      where: { usuarioId: req.usuario.id },
      create: { usuarioId: req.usuario.id },
      update: {},
      include: INCLUDE_ITEMS,
    });
  }

  const sessionId = req.cookies.guest_id;
  if (!sessionId) throw new ApiError(400, 'Sesion de invitado no disponible');

  return prisma.carrito.upsert({
    where: { sessionId },
    create: { sessionId },
    update: {},
    include: INCLUDE_ITEMS,
  });
}

module.exports = { obtenerOCrearCarrito, INCLUDE_ITEMS };

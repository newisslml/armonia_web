const { z } = require('zod');
const prisma = require('../lib/prisma');

const suscribirSchema = z.object({ email: z.string().email() });

async function suscribir(req, res) {
  const { email } = suscribirSchema.parse(req.body);

  // ponytail: confirmado queda en false, sin email de confirmacion real.
  // Agregar envio (Resend/Nodemailer) cuando se implemente Fase 7.
  await prisma.newsletterSuscriptor.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  res.status(201).json({ ok: true });
}

module.exports = { suscribir };

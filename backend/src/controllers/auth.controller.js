const bcrypt = require('bcrypt');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { firmarToken } = require('../utils/jwt');
const { COOKIE_OPTS } = require('../middleware/auth');
const { ApiError } = require('../middleware/errorHandler');

const registroSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nombre: z.string().min(1).optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function emitirSesion(res, usuario) {
  const token = firmarToken({ id: usuario.id, rol: usuario.rol });
  res.cookie('token', token, { ...COOKIE_OPTS, maxAge: 1000 * 60 * 60 * 24 * 7 });
}

function usuarioPublico(usuario) {
  const { passwordHash, ...resto } = usuario;
  return resto;
}

async function registro(req, res) {
  const datos = registroSchema.parse(req.body);

  const existente = await prisma.usuario.findUnique({ where: { email: datos.email } });
  if (existente) throw new ApiError(409, 'Ese email ya esta registrado');

  const passwordHash = await bcrypt.hash(datos.password, 12);
  const usuario = await prisma.usuario.create({
    data: {
      email: datos.email,
      passwordHash,
      nombre: datos.nombre,
      telefono: datos.telefono,
      direccion: datos.direccion,
    },
  });

  emitirSesion(res, usuario);
  res.status(201).json(usuarioPublico(usuario));
}

async function login(req, res) {
  const datos = loginSchema.parse(req.body);

  const usuario = await prisma.usuario.findUnique({ where: { email: datos.email } });
  if (!usuario) throw new ApiError(401, 'Credenciales invalidas');

  const ok = await bcrypt.compare(datos.password, usuario.passwordHash);
  if (!ok) throw new ApiError(401, 'Credenciales invalidas');

  emitirSesion(res, usuario);
  res.json(usuarioPublico(usuario));
}

async function logout(req, res) {
  res.clearCookie('token', COOKIE_OPTS);
  res.status(204).end();
}

async function me(req, res) {
  const usuario = await prisma.usuario.findUnique({ where: { id: req.usuario.id } });
  if (!usuario) throw new ApiError(401, 'No autenticado');
  res.json(usuarioPublico(usuario));
}

module.exports = { registro, login, logout, me };

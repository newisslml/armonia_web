const bcrypt = require('bcrypt');
const prisma = require('../src/lib/prisma');
const { slugify } = require('../src/utils/slug');

// No se encontro el frontend estatico para extraer categorias reales:
// esta carpeta y "Desktop/Armonia" solo tenian imagenes. Se deja un set
// generico editable desde el panel admin (Fase 6).
const CATEGORIAS = [
  { nombre: 'Aromaterapia', hijos: ['Aceites esenciales', 'Difusores'] },
  { nombre: 'Velas', hijos: ['Velas aromaticas', 'Velas de soya'] },
  { nombre: 'Bienestar', hijos: ['Inciensos', 'Accesorios'] },
];

async function main() {
  for (const cat of CATEGORIAS) {
    const padre = await prisma.categoria.upsert({
      where: { slug: slugify(cat.nombre) },
      create: { nombre: cat.nombre, slug: slugify(cat.nombre) },
      update: {},
    });

    for (const hijoNombre of cat.hijos) {
      await prisma.categoria.upsert({
        where: { slug: slugify(hijoNombre) },
        create: { nombre: hijoNombre, slug: slugify(hijoNombre), padreId: padre.id },
        update: {},
      });
    }
  }

  const difusores = await prisma.categoria.findUnique({ where: { slug: 'difusores' } });
  const velasAromaticas = await prisma.categoria.findUnique({ where: { slug: 'velas-aromaticas' } });

  const productos = [
    {
      nombre: 'Difusor de aromas ultrasonico',
      descripcion: 'Difusor ultrasonico con luz LED, ideal para aceites esenciales.',
      precio: 24990,
      stock: 15,
      categoriaId: difusores?.id,
      destacado: true,
    },
    {
      nombre: 'Vela aromatica lavanda',
      descripcion: 'Vela de soya con esencia de lavanda, 200g.',
      precio: 8990,
      stock: 30,
      categoriaId: velasAromaticas?.id,
      destacado: true,
    },
  ];

  for (const p of productos) {
    await prisma.producto.upsert({
      where: { slug: slugify(p.nombre) },
      create: { ...p, slug: slugify(p.nombre) },
      update: {},
    });
  }

  const adminEmail = 'admin@armonia.cl';
  await prisma.usuario.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash('cambiar123', 12),
      nombre: 'Admin',
      rol: 'admin',
    },
    update: {},
  });

  console.log('Seed completo. Admin:', adminEmail, '(password: cambiar123, cambiarla)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

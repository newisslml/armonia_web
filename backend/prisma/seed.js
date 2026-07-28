const bcrypt = require('bcrypt');
const prisma = require('../src/lib/prisma');

// Categorías y slugs alineados con las páginas estáticas en /frontend
// (categoria-<slug>.html). Si cambias un slug acá, actualiza también el
// href correspondiente en el frontend.
const CATEGORIAS = [
  { nombre: 'Protección Hogar Zen', slug: 'hogar-zen' },
  { nombre: 'Rituales y Terapias', slug: 'rituales-terapias' },
  { nombre: 'Biblioteca Zen', slug: 'biblioteca-zen' },
  { nombre: 'Protección Personal Zen', slug: 'proteccion-personal' },
  { nombre: 'Kits y Cajas', slug: 'kits-cajas' },
  { nombre: 'Amuletos del Mundo', slug: 'amuletos-mundo' },
];

const PRODUCTOS = [
  { nombre: 'Sahumerio Palo Santo x5', slug: 'sahumerio-palo-santo-x5', precio: 5990, stock: 40, categoriaSlug: 'hogar-zen', destacado: true, descripcion: 'Sahumerio de palo santo natural, caja de 5 varillas.' },
  { nombre: 'Vela de Protección 7 Colores', slug: 'vela-proteccion-7-colores', precio: 6990, stock: 25, categoriaSlug: 'hogar-zen', descripcion: 'Vela ritual de 7 colores para protección del hogar.' },
  { nombre: 'Herradura Protectora de Puerta', slug: 'herradura-protectora-puerta', precio: 8490, stock: 15, categoriaSlug: 'hogar-zen', descripcion: 'Herradura decorativa para la entrada del hogar.' },
  { nombre: 'Kit Ritual de Abundancia', slug: 'kit-ritual-abundancia', precio: 19990, stock: 12, categoriaSlug: 'rituales-terapias', destacado: true, descripcion: 'Kit completo para ritual de abundancia y prosperidad.' },
  { nombre: 'Baraja Tarot Rider-Waite', slug: 'baraja-tarot-rider-waite', precio: 14990, stock: 20, categoriaSlug: 'rituales-terapias', descripcion: 'Mazo de 78 cartas, edición clásica Rider-Waite.' },
  { nombre: 'Set de Cristales para Chakras', slug: 'set-cristales-chakras', precio: 16990, stock: 10, categoriaSlug: 'rituales-terapias', descripcion: 'Set de 7 cristales, uno por cada chakra.' },
  { nombre: 'Guía Completa de Tarot', slug: 'guia-completa-tarot', precio: 12990, stock: 18, categoriaSlug: 'biblioteca-zen', destacado: true, descripcion: 'Libro guía para aprender e interpretar el tarot.' },
  { nombre: 'Meditación para Principiantes', slug: 'meditacion-principiantes', precio: 9990, stock: 22, categoriaSlug: 'biblioteca-zen', descripcion: 'Libro introductorio a la práctica de meditación.' },
  { nombre: 'Manual de Cristaloterapia', slug: 'manual-cristaloterapia', precio: 11490, stock: 14, categoriaSlug: 'biblioteca-zen', descripcion: 'Guía práctica de sanación con cristales.' },
  { nombre: 'Pulsera de Obsidiana Negra', slug: 'pulsera-obsidiana-negra', precio: 6490, stock: 30, categoriaSlug: 'proteccion-personal', destacado: true, descripcion: 'Pulsera elástica de obsidiana negra natural.' },
  { nombre: 'Colgante Ojo Turco Plateado', slug: 'colgante-ojo-turco-plateado', precio: 7990, stock: 25, categoriaSlug: 'proteccion-personal', descripcion: 'Colgante de protección bañado en plata.' },
  { nombre: 'Mala Tibetana 108 Cuentas', slug: 'mala-tibetana-108', precio: 11990, stock: 16, categoriaSlug: 'proteccion-personal', descripcion: 'Mala tradicional de 108 cuentas de madera.' },
  { nombre: 'Caja Zen Iniciación', slug: 'caja-zen-iniciacion', precio: 24990, stock: 10, categoriaSlug: 'kits-cajas', destacado: true, descripcion: 'Caja regalo con sahumerio, vela, cristal y guía.' },
  { nombre: 'Kit Regalo Abundancia y Prosperidad', slug: 'kit-regalo-abundancia', precio: 27990, stock: 8, categoriaSlug: 'kits-cajas', descripcion: 'Set curado para ritual de abundancia, ideal para regalo.' },
  { nombre: 'Set Meditación Completo', slug: 'set-meditacion-completo', precio: 21990, stock: 9, categoriaSlug: 'kits-cajas', descripcion: 'Incluye cojín, incienso, cristal y música guiada.' },
  { nombre: 'Amuleto Ojo Turco', slug: 'amuleto-ojo-turco', precio: 7490, stock: 35, categoriaSlug: 'amuletos-mundo', destacado: true, descripcion: 'Amuleto de protección de origen turco.' },
  { nombre: 'Cuarzo Rosa Pulido', slug: 'cuarzo-rosa-pulido', precio: 4290, stock: 40, categoriaSlug: 'amuletos-mundo', destacado: true, descripcion: 'Cristal de cuarzo rosa pulido, tamaño de bolsillo.' },
  { nombre: 'Mano de Fátima (Hamsa)', slug: 'mano-de-fatima-hamsa', precio: 8990, stock: 20, categoriaSlug: 'amuletos-mundo', descripcion: 'Amuleto Hamsa de protección, tradición del Medio Oriente.' },
];

async function main() {
  const categoriasPorSlug = {};
  for (const c of CATEGORIAS) {
    categoriasPorSlug[c.slug] = await prisma.categoria.upsert({
      where: { slug: c.slug },
      create: { nombre: c.nombre, slug: c.slug },
      update: { nombre: c.nombre },
    });
  }

  for (const p of PRODUCTOS) {
    const { categoriaSlug, ...data } = p;
    const categoria = categoriasPorSlug[categoriaSlug];
    await prisma.producto.upsert({
      where: { slug: p.slug },
      create: { ...data, categoriaId: categoria.id },
      update: { ...data, categoriaId: categoria.id },
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

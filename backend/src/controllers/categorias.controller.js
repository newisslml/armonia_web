const prisma = require('../lib/prisma');

async function arbol(req, res) {
  const categorias = await prisma.categoria.findMany({ orderBy: { nombre: 'asc' } });

  const porId = new Map(categorias.map((c) => [c.id, { ...c, hijos: [] }]));
  const raiz = [];

  for (const c of porId.values()) {
    if (c.padreId && porId.has(c.padreId)) {
      porId.get(c.padreId).hijos.push(c);
    } else {
      raiz.push(c);
    }
  }

  res.json(raiz);
}

module.exports = { arbol };

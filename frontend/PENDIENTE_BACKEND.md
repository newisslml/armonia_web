# Pendiente de backend / no cableado en este frontend

Este documento reemplaza y actualiza `CONEXION_FRONTEND.md` con el estado real
después de conectar el home a un backend corriendo. Regla seguida: **si el
endpoint no existe en el backend, no se inventó nada en el frontend** — se
deja documentado acá para el dev que siga con el backend.

## Ya cableado (funciona contra `http://localhost:4000`)

- `GET /api/categorias` → grilla de categorías (`#grid-categorias`, `js/main.js`)
- `GET /api/productos?destacado=true` → grilla de productos destacados (`#grid-productos`)
- `POST /api/newsletter` → formulario de newsletter

`API_URL` está hardcodeado como `http://localhost:4000` en `js/main.js` — cambiar
a la URL real antes de publicar (idealmente sacarlo a una variable de build/env
en vez de una constante en el código, eso no se hizo acá para no agregar
tooling que el proyecto no tiene).

## Discrepancia de contenido (no es un bug, es dato faltante)

El diseño (`design_handoff_armonia_redesign/`) especifica categorías fijas:
*Baño Sagrado, Cristales, Protección Personal Zen, Rituales y Terapias, Kits y
Box Zen, Biblioteca Zen* — y productos como *Cuarzo Rosa Pulido, Sahumerio
Palo Santo*, etc.

El seed actual del backend (`backend/prisma/seed.js`) trae categorías y
productos **genéricos de ejemplo** (Aromaterapia, Velas, Bienestar / Difusor
ultrasónico, Vela aromática lavanda) — el propio comentario del seed dice que
no se encontró el catálogo real al momento de escribirlo.

El home ahora muestra **lo que el backend realmente tiene**, no lo que dice
el diseño. Falta:
- Cargar el catálogo real (categorías y productos de Armonía Chile) en la
  base de datos, vía seed actualizado o panel admin.
- Ninguna categoría/producto tiene `imagenUrl` seteado — el home cae al
  placeholder visual (`.img-slot`) con el nombre. Subir imágenes reales vía
  `POST /api/admin/productos/:id/imagen` (no hay endpoint equivalente para
  imagen de categoría — ver abajo).

## No existe en el backend (no se agregó nada en el frontend para esto)

- **Imagen de categoría**: no hay campo `imagenUrl` en el modelo de
  categoría ni endpoint para subirla (sí existe para producto). Si se quiere
  foto real en las cards de categoría, hay que agregarlo en el backend
  (schema + endpoint admin).
- **Merge de carrito invitado → usuario al hacer login**: documentado como
  "no implementado" en el `CONEXION_FRONTEND.md` original de backend.
- **Confirmación por email de newsletter**: el endpoint responde `{ok:true}`
  pero no envía correo (marcado como pendiente "Fase 7" en el propio backend).
- **Página de categoría / listado completo de tienda**: el diseño solo cubre
  el home; "Ver más →" en cada categoría y "Ver toda la tienda →" quedan con
  `href="#"` a propósito — no hay ruta de detalle implementada ni en frontend
  ni backend.

## No cableado en este home (fuera de alcance del diseño, existe en backend)

El backend ya tiene funcionando (ver `CONEXION_FRONTEND.md` original,
sección 5-8) pero el home no lo consume porque el diseño no lo pide:

- Auth (`/api/auth/registro`, `login`, `logout`, `me`)
- Carrito (`/api/carrito*`)
- Pedidos (`/api/pedidos*`)
- Pago Webpay/Transbank (`/api/pagos/webpay/*`)
- Panel admin (`/api/admin/*`)

Los botones "Comprar ahora" (nav) y "Ver productos" (hero) solo anclan a
`#productos` — no abren carrito ni checkout. Si el próximo alcance es
"tienda completa" (listado, detalle de producto, carrito, checkout, pago),
son pantallas nuevas que no existen todavía ni en diseño ni en frontend.

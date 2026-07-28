# Conectar el frontend al backend Armonía

Backend: Express + Prisma + Postgres, corriendo en `http://localhost:4000` (o el `PORT` que definas en `.env`). Todas las rutas bajo `/api`.

## 1. Config previa

Backend:
```
cp .env.example .env   # completar DATABASE_URL real
npx prisma migrate dev
npm run seed            # opcional: datos de ejemplo + admin@armonia.cl / cambiar123
npm run dev
```

`.env` clave para el frontend: `FRONTEND_ORIGIN` debe ser el origen exacto donde sirvas el sitio estático (ej. `http://localhost:5500` con Live Server). CORS solo acepta ese origen.

## 2. Regla de oro: `credentials: 'include'`

Sesión (JWT) y carrito de invitado viajan en **cookies httpOnly** (`token`, `guest_id`). El frontend nunca las lee ni las guarda a mano — solo tiene que mandarlas en cada request:

```js
fetch(`${API_URL}/api/carrito`, { credentials: 'include' })
```

Sin `credentials: 'include'` el navegador no envía ni guarda esas cookies y todo (login, carrito, pedidos) falla en silencio. Ponlo en **cada** fetch al backend.

Define en el frontend una constante:
```js
const API_URL = 'http://localhost:4000';
```

## 3. Formato de error

Cualquier endpoint que falla responde:
```json
{ "error": "mensaje legible" }
```
o si falla validación (zod):
```json
{ "error": "Datos invalidos", "detalles": [ ... ] }
```
Status codes: 400 validación, 401 no autenticado, 403 sin permiso, 404 no encontrado, 409 conflicto (ej. stock, email duplicado), 500 error interno.

## 4. Catálogo (público, sin login)

### `GET /api/productos`
Query params opcionales: `categoria` (slug), `destacado` (`true`/`false`), `busqueda`, `pagina`, `porPagina`.

```
GET /api/productos?categoria=velas-aromaticas&destacado=true
```
```json
{
  "productos": [
    {
      "id": 1, "nombre": "Vela aromatica lavanda", "slug": "vela-aromatica-lavanda",
      "descripcion": "...", "precio": "8990", "stock": 30, "destacado": true,
      "imagenUrl": "/uploads/xxx.jpg", "categoriaId": 3,
      "categoria": { "id": 3, "nombre": "Velas aromaticas", "slug": "velas-aromaticas", "padreId": 2 }
    }
  ],
  "total": 1, "pagina": 1, "porPagina": 24
}
```
`precio` viene como string decimal (Prisma Decimal serializado) — convertir con `Number(p.precio)` para operar/formatear.

Imágenes: si `imagenUrl` empieza con `/uploads/`, la URL completa es `${API_URL}${producto.imagenUrl}`.

### `GET /api/productos/:slug`
Detalle de un producto (mismo shape que arriba, sin envolver en `productos`).

### `GET /api/categorias`
Árbol completo (padres con `hijos: []` anidados), para armar el menú:
```json
[
  { "id": 1, "nombre": "Aromaterapia", "slug": "aromaterapia", "padreId": null,
    "hijos": [ { "id": 2, "nombre": "Difusores", "slug": "difusores", "padreId": 1, "hijos": [] } ] }
]
```

## 5. Cuentas (JWT en cookie httpOnly)

### `POST /api/auth/registro`
Body: `{ "email", "password" (min 8), "nombre"?, "telefono"?, "direccion"? }`
Respuesta 201: usuario (sin passwordHash) + set-cookie `token` automático — ya queda logueado.

### `POST /api/auth/login`
Body: `{ "email", "password" }`. Mismo efecto que registro.
Rate limit: 10 intentos / 15 min por IP en login y registro.

### `POST /api/auth/logout`
Sin body. Limpia la cookie `token`. 204.

### `GET /api/auth/me`
Requiere sesión. 401 si no hay cookie válida. Devuelve el usuario actual — úsalo al cargar la página para saber si mostrar "Mi cuenta" o "Login".

```js
async function usuarioActual() {
  const r = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
  if (!r.ok) return null;
  return r.json();
}
```

## 6. Carrito (funciona logueado o invitado, sin nada especial que hacer)

Todas requieren `credentials: 'include'`. El backend decide solo si usa el carrito del usuario o el de invitado (cookie `guest_id`, se crea sola en la primera visita).

### `GET /api/carrito`
```json
{ "id": 5, "usuarioId": null, "sessionId": "uuid...", "items": [
  { "id": 10, "carritoId": 5, "productoId": 1, "cantidad": 2,
    "producto": { "id": 1, "nombre": "...", "precio": "8990", "imagenUrl": "..." } }
] }
```

### `POST /api/carrito/items`
Body: `{ "productoId": 1, "cantidad": 1 }` (cantidad default 1). Si el producto ya está en el carrito, suma cantidad. Devuelve el carrito completo actualizado (201).

### `PATCH /api/carrito/items/:id`
`:id` es el `id` del **item del carrito** (no el productoId). Body: `{ "cantidad": 3 }` — la reemplaza (no suma).

### `DELETE /api/carrito/items/:id`
Sin body. Devuelve carrito actualizado.

Importante: cuando el usuario hace login estando de invitado, el carrito de invitado **no se fusiona automáticamente** con el suyo — quedan separados. Si esto importa para el flujo de compra, avisar para agregar merge en login (no implementado).

## 7. Pedidos (requiere login)

Todas exigen sesión válida (`GET /api/auth/me` debe funcionar antes de llamar esto).

### `POST /api/pedidos`
Body: `{ "direccionEnvio": "calle 123, comuna, ciudad" }`
Toma el carrito del usuario logueado, valida stock, crea el pedido, descuenta stock y vacía el carrito. 409 si no hay stock suficiente, 400 si el carrito está vacío.
```json
{ "id": 7, "usuarioId": 3, "estado": "pendiente", "total": "17980",
  "direccionEnvio": "...", "items": [ { "productoId": 1, "cantidad": 2, "precioUnitario": "8990" } ] }
```

### `GET /api/pedidos`
Historial del usuario logueado (array, más reciente primero).

### `GET /api/pedidos/:id`
Detalle de un pedido propio (404 si es de otro usuario).

## 8. Pago con Webpay (Transbank)

Flujo: crear pedido → iniciar transacción → **redirigir el navegador** a la URL que devuelve Transbank → Transbank redirige de vuelta a tu `returnUrl` con `token_ws` en el body (POST) → tu página de retorno llama a confirmar.

### `POST /api/pagos/webpay/iniciar` (requiere login)
Body: `{ "pedidoId": 7, "returnUrl": "http://localhost:5500/pago-retorno.html" }`
```json
{ "token": "01ab...", "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction" }
```
El frontend arma un form POST a `url` con el campo `token_ws=<token>` y lo hace submit (Transbank exige POST, no un simple `location.href`):
```js
function irAWebpay(url, token) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'token_ws';
  input.value = token;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}
```

### En la página de retorno (`pago-retorno.html`)
Transbank hace un POST a tu `returnUrl` con `token_ws` en el body — necesitas un endpoint del backend o una página que lo reciba y llame a confirmar. Más simple: que esa página lea `token_ws` (Transbank también lo puede mandar como query en algunos flujos) y llame:

### `POST /api/pagos/webpay/confirmar`
Body: `{ "token_ws": "..." }` (no requiere login — el pago ya quedó ligado al pedido en el paso anterior).
```json
{ "aprobado": true, "detalle": { "status": "AUTHORIZED", "responseCode": 0, "... resto de Transbank ..." } }
```
Con `aprobado === true` el pedido queda `estado: "pagado"`; si no, `"rechazado"`. Mostrar pantalla de éxito/rechazo según ese campo.

Credenciales de prueba: si no configuras `TBK_COMMERCE_CODE`/`TBK_API_KEY` en `.env`, el SDK usa las credenciales de integración (sandbox) de Transbank — sirve para probar todo el flujo sin plata real. En la página de checkout de prueba de Transbank usar tarjeta de test (VISA `4051 8856 0044 6623`, cualquier CVV/fecha futura, RUT/clave que entrega el sandbox).

## 9. Newsletter

### `POST /api/newsletter`
Body: `{ "email" }`. 201 `{ "ok": true }`. Nota: no envía email de confirmación todavía (pendiente, Fase 7).

## 10. Panel admin (solo `rol: "admin"`)

Mismas reglas de cookie/login, pero el usuario debe tener `rol === 'admin'` (el seed crea `admin@armonia.cl`). Si no, 403.

```
POST   /api/admin/productos
PUT    /api/admin/productos/:id
DELETE /api/admin/productos/:id
POST   /api/admin/productos/:id/imagen   (multipart/form-data, campo "imagen")
POST   /api/admin/categorias
PUT    /api/admin/categorias/:id
DELETE /api/admin/categorias/:id
GET    /api/admin/pedidos
PATCH  /api/admin/pedidos/:id             body: { "estado": "pagado" | "enviado" | ... }
```

Subir imagen de producto:
```js
const form = new FormData();
form.append('imagen', archivoInput.files[0]);
fetch(`${API_URL}/api/admin/productos/${id}/imagen`, {
  method: 'POST', credentials: 'include', body: form,
});
```

## 11. Checklist rápido de integración

1. Reemplazar productos hardcodeados del `index.html` por `fetch(`${API_URL}/api/productos`)`.
2. Armar menú de categorías con `fetch(`${API_URL}/api/categorias`)`.
3. Formularios de login/registro → `credentials: 'include'`, revisar `res.ok` y mostrar `data.error` si falla.
4. Botón "agregar al carrito" → `POST /api/carrito/items`, refrescar contador con el `items.length` de la respuesta.
5. Página de carrito → `GET /api/carrito`, inputs de cantidad → `PATCH`, botón eliminar → `DELETE`.
6. Checkout → requiere estar logueado (si `GET /api/auth/me` da 401, mandar a login) → `POST /api/pedidos` → `POST /api/pagos/webpay/iniciar` → submit del form a Webpay.
7. Página de retorno de pago → leer `token_ws`, `POST /api/pagos/webpay/confirmar`, mostrar resultado.

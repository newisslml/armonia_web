# Conexión Frontend ↔ Backend

Este `frontend/` es solo maquetación estática (HTML/CSS/JS vanilla), basada en
`design_handoff_armonia_redesign/`. No consume ningún backend todavía. Notas
para quien conecte los endpoints:

## Puntos de integración en `index.html`

| Sección | Elemento | Qué falta |
|---|---|---|
| Categorías (`#categorias`) | `.cat-card` (6) | Listar categorías reales (nombre, slug/href, imagen) desde `GET /categorias`. Hoy son estáticas con `href="#"`. |
| Productos destacados (`#productos`) | `.prod-card` (4) | Traer productos destacados desde `GET /productos?destacado=true` (o similar). Hoy son estáticos. |
| Newsletter | `#newsletter-form` (`js/main.js`) | `fetch` a `POST /newsletter` con `{ email }`. Hoy solo valida formato y muestra un mensaje fijo (ver `main.js`, bloque `newsletter-form`). |
| "Comprar ahora" / CTAs de producto | `.btn-buy`, `.prod-card` | No hay carrito ni checkout implementado en esta pasada — futuro `POST /carrito`, integración de pago (Transbank u otro). |
| Nav "Visítanos" → mapa | `.ubicacion__map` | Placeholder visual; reemplazar por imagen real o embed de mapa. |

## Imágenes

Todas las fotos son placeholders (`.img-slot`, ver `css/style.css`). Reemplazar
por `<img src="...">` o `background-image` reales antes de producción — ver
lista de assets requeridos en `design_handoff_armonia_redesign/README.md`
(sección "Assets").

## Tema claro/oscuro

Estado en `localStorage` (`armonia-theme`), sin dependencia de backend.
Tokens de color en `css/style.css` (`:root[data-theme="dark|light"]`).

## Estructura sugerida de endpoints (a definir por backend)

- `GET /categorias` — lista de categorías (id, nombre, slug, imagen)
- `GET /productos` — lista de productos (id, nombre, precio, imagen, destacado)
- `POST /newsletter` — alta de suscriptor `{ email }`
- `POST /carrito`, `POST /pedidos`, `POST /pagos` — flujo de compra (fuera de alcance de este rediseño; el proyecto tenía antes un backend Express/Prisma con estas rutas, hoy no presente en el repo)

Ninguno de estos endpoints está implementado ni llamado desde este frontend
todavía — queda para la persona que conecte el backend.

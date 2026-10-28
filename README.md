# Tasks App

Monorepo de ejemplo: una página web pequeña de tareas con **Next.js** (frontend por componentes), una **API en NestJS** y **PostgreSQL**, todo con **Node 22 + pnpm** y orquestado con **Docker Compose**.

## Inicio rápido

Requisitos: Docker (con Compose v2) y `make`.

```bash
make build
```

Eso construye las imágenes y levanta los tres servicios, esperando a que estén sanos:

| Servicio | URL                              |
| -------- | -------------------------------- |
| Web      | http://localhost:3000            |
| API      | http://localhost:3001/api/tasks  |
| Postgres | `postgres://app:app@localhost:5432/tasks` |

`make help` muestra todos los comandos (`up`, `down`, `logs`, `clean`, `db-shell`, `dev`, `test`, `lint`).

Para cambiar puertos o credenciales: `cp .env.example .env` y edita los valores.

## Estructura

```
.
├── apps/
│   ├── api/                  # NestJS
│   │   ├── src/
│   │   │   ├── main.ts       # bootstrap: prefijo /api, ValidationPipe, CORS
│   │   │   ├── app.module.ts # Config + TypeORM (Postgres)
│   │   │   ├── health/       # GET /api/health (verifica la DB)
│   │   │   └── tasks/        # módulo de dominio: entity, DTOs, service, controller, tests
│   │   └── Dockerfile
│   └── web/                  # Next.js (App Router)
│       ├── src/
│       │   ├── app/          # layout.tsx, page.tsx, globals.css
│       │   ├── components/   # Header, Footer, TaskForm, TaskList, TaskItem, TaskStats, ...
│       │   └── lib/          # api.ts (cliente HTTP), actions.ts (Server Actions), types.ts
│       └── Dockerfile
├── docker-compose.yml
├── Makefile
├── pnpm-workspace.yaml
└── .env.example
```

## Arquitectura

```
Navegador ──► web (Next.js :3000) ──► api (NestJS :3001) ──► db (Postgres :5432)
```

- El navegador **solo habla con Next.js**. La lista se renderiza en un Server Component y las mutaciones (crear, completar, borrar) son **Server Actions** que llaman a la API por la red interna de Docker (`API_URL=http://api:3001/api`). Así no hay URLs de la API "horneadas" en el bundle del cliente ni problemas de CORS.
- La página usa **Partial Prerendering**: el encabezado y el formulario se sirven estáticos al instante y la lista se transmite dentro de un `<Suspense>`.
- La API expone un CRUD REST con validación (`class-validator`) y persiste con **TypeORM**.

### Endpoints

| Método | Ruta             | Descripción                    |
| ------ | ---------------- | ------------------------------ |
| GET    | `/api/health`    | Estado de la API y la DB       |
| GET    | `/api/tasks`     | Lista (pendientes primero)     |
| GET    | `/api/tasks/:id` | Detalle                        |
| POST   | `/api/tasks`     | Crea `{ "title": "..." }`      |
| PATCH  | `/api/tasks/:id` | Actualiza `{ title?, done? }`  |
| DELETE | `/api/tasks/:id` | Elimina (204)                  |

## Desarrollo local (hot reload)

```bash
make dev
```

Levanta solo Postgres en Docker y corre `web` y `api` en modo watch con pnpm. También puedes usar los scripts de la raíz: `pnpm dev:web`, `pnpm dev:api`.

## Docker

Ambos Dockerfiles son **multi-stage** y se construyen desde la raíz (el contexto es el monorepo):

- **deps**: copia solo los `package.json` y el lockfile → la instalación queda en caché mientras no cambien las dependencias.
- **build**: compila (`nest build` / `next build`).
- **runner**: imagen final mínima, usuario `node` sin privilegios y `HEALTHCHECK`.
  - API: solo dependencias de producción + `dist/`.
  - Web: salida `standalone` de Next.js (un `server.js` con las dependencias trazadas).

## Notas para producción

- `DB_SYNCHRONIZE=true` crea las tablas automáticamente. Es cómodo para desarrollo, pero en producción hay que desactivarlo y usar **migraciones de TypeORM**.
- Cambia las credenciales por defecto de Postgres (`.env`) y no expongas el puerto 5432 públicamente.
- Las Server Actions son endpoints públicos: si agregas usuarios, valida autenticación dentro de cada acción.

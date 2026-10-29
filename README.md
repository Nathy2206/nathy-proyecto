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
| Postgres | `postgres://zigo:zigo2026@localhost:5432/tasks` |

`make help` muestra todos los comandos (`up`, `down`, `logs`, `clean`, `db-shell`, `dev`, `test`, `lint`).

## Variables de entorno

Cada app tiene su propio `.env` (no se versiona; `make env` los crea desde los `.env.example`):

| Archivo         | Variables                                                                 |
| --------------- | ------------------------------------------------------------------------- |
| `apps/api/.env` | `PORT`, `CORS_ORIGIN`, `DB_HOST`, `DB_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DB_SYNCHRONIZE` |
| `apps/web/.env` | `NEXT_PUBLIC_API_URL` (URL de la API que usa el navegador)                |

- El contenedor `db` lee las credenciales `POSTGRES_*` del mismo `apps/api/.env`; en Docker, compose sobrescribe `DB_HOST=db`.
- `NEXT_PUBLIC_API_URL` se incrusta en el bundle al compilar: si la cambias, vuelve a ejecutar `make build` (en Docker se pasa como build arg).

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
│   │   ├── .env.example
│   │   └── Dockerfile
│   └── web/                  # Next.js (App Router)
│       ├── src/
│       │   ├── app/          # layout.tsx, page.tsx, globals.css
│       │   ├── components/   # TaskBoard, TaskForm, TaskColumn, TaskItem, TaskStats, ...
│       │   ├── hooks/        # useTasks (estado + llamadas a la API)
│       │   └── lib/          # config.ts (lee .env), http/ (cliente axios + tasksApi), types.ts
│       ├── .env.example
│       └── Dockerfile
├── docker-compose.yml
├── Makefile
└── pnpm-workspace.yaml
```

## Arquitectura

```
Navegador ──(HTML)──► web (Next.js :3000)
    └─────(fetch)──────► api (NestJS :3001) ──► db (Postgres :5432)
```

- Next.js sirve la página; el navegador llama directamente a la API en `NEXT_PUBLIC_API_URL` con axios (`lib/http`). Por eso la API habilita CORS para `CORS_ORIGIN`.
- `useTasks` carga la lista y aplica las mutaciones (crear, completar, borrar) de forma optimista, revirtiendo si la API falla.
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

Levanta solo Postgres en Docker y corre `web` y `api` en modo watch con pnpm; cada app lee su propio `.env`. También puedes usar los scripts de la raíz: `pnpm dev:web`, `pnpm dev:api`.

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
- La API es pública para el navegador: si agregas usuarios, protege los endpoints con autenticación.

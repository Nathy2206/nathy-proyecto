# Uso: make <objetivo>   (make help para ver todos)
COMPOSE := docker compose

.DEFAULT_GOAL := help
.PHONY: help env urls build up down restart logs ps clean install dev db test lint db-shell

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

env: ## Crea los .env de api y web a partir de los .env.example (si no existen)
	@cp -n apps/api/.env.example apps/api/.env 2>/dev/null || true
	@cp -n apps/web/.env.example apps/web/.env 2>/dev/null || true

# ---------- Docker (todo el stack) ----------
build: env ## Construye, levanta web + api + postgres y sigue los logs (Ctrl+C no los detiene)
	$(COMPOSE) up -d --build --wait
	@$(MAKE) --no-print-directory urls
	$(COMPOSE) logs -f

up: env ## Levanta el stack sin reconstruir y sigue los logs
	$(COMPOSE) up -d --wait
	@$(MAKE) --no-print-directory urls
	$(COMPOSE) logs -f

urls:
	@echo ""
	@echo "  Web:  http://localhost:3000"
	@echo "  API:  http://localhost:3001/api/tasks"
	@echo "  DB:   postgres://localhost:5432"
	@echo ""
	@echo "  Mostrando logs. Ctrl+C sale de los logs; los contenedores siguen corriendo (make down para detenerlos)."
	@echo ""

down: ## Detiene los contenedores (conserva los datos)
	$(COMPOSE) down

restart: down up ## Reinicia el stack

logs: ## Sigue los logs de todos los servicios
	$(COMPOSE) logs -f

ps: ## Estado de los servicios
	$(COMPOSE) ps

clean: ## Detiene todo y BORRA el volumen de la base de datos
	$(COMPOSE) down -v --rmi local

db-shell: ## Abre psql dentro del contenedor de Postgres
	$(COMPOSE) exec db sh -c 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

# ---------- Desarrollo local (hot reload) ----------
install: ## Instala dependencias con pnpm
	pnpm install

db: env ## Levanta solo Postgres (para desarrollo local)
	$(COMPOSE) up -d --wait db

dev: install db ## Postgres en Docker + web y api en modo watch (cada app lee su .env)
	pnpm dev

test: ## Ejecuta los tests de la API
	pnpm --filter api test

lint: ## Lint de todo el monorepo
	pnpm lint

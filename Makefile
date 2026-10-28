# Uso: make <objetivo>   (make help para ver todos)
COMPOSE := docker compose
-include .env
export

.DEFAULT_GOAL := help
.PHONY: help build up down restart logs ps clean install dev db test lint db-shell

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

# ---------- Docker (todo el stack) ----------
build: ## Construye las imágenes y levanta web + api + postgres
	$(COMPOSE) up -d --build --wait
	@echo ""
	@echo "  Web:  http://localhost:$${WEB_PORT:-3000}"
	@echo "  API:  http://localhost:$${API_PORT:-3001}/api/tasks"
	@echo "  DB:   postgres://localhost:$${DB_PORT:-5432}"

up: ## Levanta el stack sin reconstruir
	$(COMPOSE) up -d --wait

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
	$(COMPOSE) exec db psql -U $${POSTGRES_USER:-zigo} -d $${POSTGRES_DB:-tasks}

# ---------- Desarrollo local (hot reload) ----------
install: ## Instala dependencias con pnpm
	pnpm install

db: ## Levanta solo Postgres (para desarrollo local)
	$(COMPOSE) up -d --wait db

dev: install db ## Postgres en Docker + web y api en modo watch
	DATABASE_URL=postgres://$${POSTGRES_USER:-zigo}:$${POSTGRES_PASSWORD:-zigo2026}@localhost:$${DB_PORT:-5432}/$${POSTGRES_DB:-tasks} \
	API_URL=http://localhost:3001/api \
	pnpm dev

test: ## Ejecuta los tests de la API
	pnpm --filter api test

lint: ## Lint de todo el monorepo
	pnpm lint

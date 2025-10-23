.PHONY: bootstrap up down logs api
bootstrap:
	@cp -n .env.example .env || true
	@pnpm i

up:
	docker compose -f infra/docker/compose.yml up -d

down:
	docker compose -f infra/docker/compose.yml down

logs:
	docker compose -f infra/docker/compose.yml logs -f api

api:
	cd services/api && uvicorn app.main:app --reload

# Maya RPG API — Cloud Native (Entrega 2)

Backend REST da Clínica Maya RPG containerizado. Esta pasta agrupa os artefatos da disciplina **Sistemas Operacionais e Arquiteturas Cloud Native** da Entrega 2 do PI 3ADS — FECAP 2026.

## Documentação

- [docs/01-entrega-2-mobile-e-cloud.md](docs/01-entrega-2-mobile-e-cloud.md) — visão geral da Entrega 2 (Mobile + Cloud Native)
- [docs/02-cloud-native-e-automacao.md](docs/02-cloud-native-e-automacao.md) — Docker, Compose, volumes, scripts Bash
- [docs/03-testes-e-evidencias.md](docs/03-testes-e-evidencias.md) — testes, k6 e prints
- [RELATORIO_CLOUD_NATIVE.md](RELATORIO_CLOUD_NATIVE.md) — relatório técnico individual

## Execução rápida

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up --build -d
docker compose ps
```

Swagger: `http://localhost:3000/api/docs`

## Scripts

```bash
./scripts/setup_env.sh         # verifica dependências do ambiente
./scripts/monitor_system.sh    # coleta métricas (CPU/mem/disco/containers)
./scripts/backup_db.sh         # backup do PostgreSQL via pg_dump
./scripts/manage_services.sh   # up/down/status/logs/restart/watch
./scripts/deploy.sh            # deploy automatizado com rollback
```

## Evidências visuais

25 prints validados em 11/05/2026 estão em [`imagens-maya/cloud-native/`](../../../imagens-maya/cloud-native/). Lista completa em [`imagens-maya/README.md`](../../../imagens-maya/README.md).

# Evidências Visuais — Entrega 2 (Maya RPG)

Pasta de prints e evidências da Entrega 2, organizada por área.

## Estrutura

```
imagens-maya/
├── cloud-native/   # Prints de Docker, scripts Bash, k6, build, testes da API
├── mobile/         # Prints do app Android (pendente)
└── postman-api/    # Prints de requisições à API via Postman/Swagger (pendente)
```

## cloud-native/ (25 prints — todos validados em 11/05/2026)

Sequência cronológica seguida na demonstração local:

| # | Arquivo | Evidência |
|---:|---|---|
| 1 | `01-env-configurado.png` | `.env` real preenchido (DB, JWT, CORS, SMTP, FCM, MP) |
| 2 | `02-npm-lint.png` | `npm run lint` sem erros |
| 3 | `03-npm-build.png` | `npm run build` (nest build) concluído |
| 4 | `04-npm-test-23-passing.png` | `npm test -- --runInBand` → 6 suites, 23 testes, 100% PASS |
| 5 | `05-docker-compose-config-api.png` | `docker compose config` (bloco `api`) |
| 6 | `06-docker-compose-config-db.png` | `docker compose config` (bloco `db`, rede, volume `pg_data`) |
| 7 | `07-arquivos-docker.png` | Listagem de `Dockerfile`, `Dockerfile.db`, `docker-compose.yml` |
| 8 | `08-docker-compose-build.png` | `docker compose build` finalizado (db + api) |
| 9 | `09-docker-compose-up-healthy.png` | `docker compose up -d` com containers `Healthy`/`Started` |
| 10 | `10-docker-compose-ps.png` | `docker compose ps` mostrando API e DB `Up ... (healthy)` |
| 11 | `11-docker-desktop-container.png` | Docker Desktop com container `maya-rpg-api` em execução |
| 12 | `12-docker-desktop-logs.png` | Logs do container API no Docker Desktop |
| 13 | `13-swagger.png` | Swagger UI aberto em `http://localhost:3000/api/docs` |
| 14 | `14-volume-ls-pg-isready.png` | `docker volume ls` (`maya-rpg-api_pg_data`) + `pg_isready` accepting connections |
| 15 | `15-uploads-logs.png` | `ls -la /app/uploads` e `/app/logs` dentro do container API |
| 16 | `16-backup-db-sh.png` | Execução de `./scripts/backup_db.sh` |
| 17 | `17-backup-arquivo-gerado.png` | Arquivo `backup_20260511_125410.sql` em `backups/` |
| 18 | `18-monitor-system-sh.png` | `./scripts/monitor_system.sh` coletando CPU/MEM/DISK/Containers |
| 19 | `19-manage-services-sh.png` | `./scripts/manage_services.sh status` e `restart` |
| 20 | `20-deploy-sh-inicio.png` | `./scripts/deploy.sh` — etapa inicial (rollback tag + build) |
| 21 | `21-deploy-sh-npm-ci-1.png` | `deploy.sh` — `npm ci` parte 1 |
| 22 | `22-deploy-sh-npm-ci-2.png` | `deploy.sh` — `npm ci` parte 2 (audit, install) |
| 23 | `23-deploy-sh-build.png` | `deploy.sh` — exportação da imagem da API + backup pré-deploy |
| 24 | `24-deploy-sh-healthy.png` | `deploy.sh` — migrações aplicadas, containers `healthy`, deploy concluído |
| 25 | `25-k6-load-test.png` | `k6 run test/load/load-test.js` — p95=2.42ms, 0% falha, 5451 checks |

## mobile/ — pendente

Prints recomendados (a tirar):
- Build do app: `gradlew.bat :app:assembleDebug`
- Tela de login
- Tela de aceite LGPD
- Tela do plano de exercícios
- Tela de check-in com slider de dor
- Tela de histórico/evolução com gráfico
- Notificação FCM/ReminderWorker no dispositivo

## postman-api/ — pendente

Prints recomendados (a tirar):
- `POST /api/auth/login` retornando token JWT
- `GET /api/exercises` autenticado
- `POST /api/check-ins` registrando execução
- `GET /api/dashboard/...` indicadores

# Cloud Native, Docker e Automação Linux/Bash

> **Projeto:** Maya Fisioterapia/RPG — Backend/API
> **Objetivo:** documentar a containerização da API, banco PostgreSQL, volumes, variáveis de ambiente e scripts de automação exigidos na Entrega 2.
> **Validação técnica:** 11/05/2026 — ambiente local Windows 11 + Docker Desktop + Git Bash
> **Evidências:** [`imagens-maya/cloud-native/`](../../../../imagens-maya/cloud-native/)

---

## 1. Objetivo Técnico

A infraestrutura Cloud Native foi preparada para que a API e o banco rodem em containers, com persistência, configuração externa e automação. A solução utiliza:

- Dockerfile multi-stage para o backend (NestJS, Node 20-alpine);
- Dockerfile do PostgreSQL 16-alpine (mantido como artefato exigido pelo PI);
- Docker Compose para orquestrar API + DB, rede interna e volumes;
- volume nomeado `pg_data` para persistência do banco;
- bind mounts para uploads e logs;
- variáveis de ambiente injetadas via `.env`;
- cinco scripts Shell/Bash (setup, monitoramento, backup, gerenciamento, deploy);
- teste de carga com k6 (resultado real registrado na Seção 13).

---

## 2. Arquivos da Infraestrutura

Todos os artefatos estão em `Documentos/Entrega2/Sistemas Operacionais e Arquiteturas Cloud Native/`:

| Arquivo | Função | Print |
|---|---|---|
| `Dockerfile` | Imagem da API NestJS (multi-stage) | `07-arquivos-docker.png`, `08-docker-compose-build.png` |
| `Dockerfile.db` | Imagem do banco PostgreSQL | `06-docker-compose-config-db.png`, `08-docker-compose-build.png` |
| `docker-compose.yml` | Orquestra API + banco + rede + volumes | `05-` e `06-docker-compose-config-*.png`, `09-docker-compose-up-healthy.png` |
| `.env.example` | Modelo de configuração por variáveis de ambiente | `01-env-configurado.png` (`.env` real preenchido) |
| `scripts/setup_env.sh` | **Verificação automatizada** de dependências do ambiente | — (script é silencioso quando tudo OK) |
| `scripts/monitor_system.sh` | Métricas de CPU/memória/disco/containers | `18-monitor-system-sh.png` |
| `scripts/backup_db.sh` | Backup do PostgreSQL via `pg_dump` em container | `16-backup-db-sh.png`, `17-backup-arquivo-gerado.png` |
| `scripts/manage_services.sh` | Start/stop/status/logs/restart/watch | `19-manage-services-sh.png` |
| `scripts/deploy.sh` | Deploy automatizado com rollback e healthcheck | `20-` a `24-deploy-sh-*.png` |
| `scripts/migrations/*.sql` | Migrações aplicadas pelo `deploy.sh` | `24-deploy-sh-healthy.png` |

---

## 3. Backend em Container

Dockerfile multi-stage:

```text
Stage 1 (builder, Node 20-alpine):
  npm ci → COPY src → npm run build (nest build) → /app/dist

Stage 2 (runtime, Node 20-alpine):
  addgroup/adduser appuser → npm ci --omit=dev → COPY --from=builder /app/dist
  → mkdir /app/uploads /app/logs (chown appuser) → apk add curl → USER appuser
  → EXPOSE 3000 → CMD ["npm", "run", "start:prod"]
```

Características:

| Item | Descrição |
|---|---|
| Base | Node.js 20 Alpine |
| Aplicação | API NestJS |
| Porta | 3000 |
| Execução | `npm run start:prod` |
| Segurança | Usuário não-root (`appuser`) |
| Healthcheck | `curl -f http://localhost:3000/api/docs` |
| Diretórios persistentes | `/app/uploads`, `/app/logs` |

Evidência do build: `08-docker-compose-build.png` (`Image maya-rpg-api-api Built`).

---

## 4. Banco PostgreSQL em Container

```dockerfile
FROM postgres:16-alpine
ENV POSTGRES_DB=maya_rpg
ENV POSTGRES_USER=maya_user
ENV POSTGRES_PASSWORD=maya_pass
EXPOSE 5432
```

Os defaults acima são sobrescritos pelo Compose/`.env` em runtime (evidência: bloco `environment` em `06-docker-compose-config-db.png`). O Dockerfile.db é mantido como artefato exigido pelo PI; em produção real, o ambiente substituiria as credenciais por valores seguros via `.env`.

---

## 5. Docker Compose

Serviços:

| Serviço | Função |
|---|---|
| `db` | PostgreSQL 16-alpine, volume `pg_data`, healthcheck `pg_isready` |
| `api` | NestJS, depende do banco healthy, healthcheck via `curl /api/docs` |

Recursos:

- rede `maya-network` (bridge) para comunicação interna;
- `depends_on: db.condition: service_healthy`;
- `restart: always`;
- volumes:
  - nomeado: `pg_data:/var/lib/postgresql/data` (persistência do banco);
  - bind: `./uploads:/app/uploads`, `./logs:/app/logs`.

Prints:

- `05-docker-compose-config-api.png` — bloco resolvido do `api`.
- `06-docker-compose-config-db.png` — bloco resolvido do `db`, rede e volume.
- `09-docker-compose-up-healthy.png` — `compose up -d` finalizando com containers Healthy/Started.
- `10-docker-compose-ps.png` — `compose ps` mostrando `Up X seconds (healthy)`.
- `11-docker-desktop-container.png` — Docker Desktop exibindo container `maya-rpg-api`.
- `12-docker-desktop-logs.png` — logs da API no Docker Desktop.

---

## 6. Variáveis de Ambiente

Modelo (`.env.example`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=maya_user
DB_PASSWORD=
DB_NAME=maya_rpg
DB_SSL=false

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=15m

CORS_ORIGINS=http://localhost:4200,http://localhost:3000,https://maya-rpg-web.vercel.app
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000

# Seed, SMTP, FCM, Mercado Pago, Deploy — ver .env.example completo
```

Em execução via Compose, `DB_HOST=db` (nome do serviço na rede interna). Evidência do `.env` real preenchido para demonstração: `01-env-configurado.png`.

Boas práticas adotadas:

- `.env` listado em `.gitignore`;
- `.env.example` sem senhas reais;
- `JWT_SECRET` distinto por ambiente;
- credenciais sobrescritas pelo Compose/`.env`, nunca hardcoded no código.

---

## 7. Volumes e Persistência

| Volume/Pasta | Tipo | Uso |
|---|---|---|
| `pg_data:/var/lib/postgresql/data` | Volume nomeado | Dados do PostgreSQL preservados entre recriações de container |
| `./uploads:/app/uploads` | Bind mount | Arquivos enviados pela aplicação |
| `./logs:/app/logs` | Bind mount | Logs gerados pela API |
| `./backups` | Diretório local | Dumps do `backup_db.sh` |

Prints:

- `14-volume-ls-pg-isready.png` — `docker volume ls` listando `maya-rpg-api_pg_data` e `pg_isready` retornando `accepting connections`.
- `15-uploads-logs.png` — `docker compose exec api ls -la /app/uploads /app/logs`.

---

## 8. Ambiente Tradicional vs Containerizado

| Critério | Tradicional | Containerizado |
|---|---|---|
| Instalação | Node, PostgreSQL e dependências manuais | Imagens Docker definem o ambiente |
| Reprodutibilidade | Varia por máquina/SO | Mesmo Compose, mesmo comportamento |
| Configuração | Depende do host | Centralizada em `.env` e Compose |
| Isolamento | Compartilha SO | Containers em rede dedicada |
| Persistência | Instalação local do banco | Volume nomeado `pg_data` |
| Deploy | Passos manuais | `./scripts/deploy.sh` automatizado |

---

## 9. Comandos Principais

### 9.1 Preparar ambiente

```bash
cp .env.example .env
chmod +x scripts/*.sh
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

### 9.2 Validar Compose

```bash
docker compose config
```

→ `05-docker-compose-config-api.png`, `06-docker-compose-config-db.png`.

### 9.3 Build

```bash
docker compose build
```

→ `08-docker-compose-build.png`.

### 9.4 Subir containers

```bash
docker compose up --build -d
```

→ `09-docker-compose-up-healthy.png`.

### 9.5 Status

```bash
docker compose ps
```

→ `10-docker-compose-ps.png` (API e DB `Up ... (healthy)`).

### 9.6 Logs da API

```bash
docker compose logs api --tail=80
```

→ `12-docker-desktop-logs.png` (visualização equivalente no Docker Desktop).

### 9.7 Swagger

```text
http://localhost:3000/api/docs
```

→ `13-swagger.png`.

### 9.8 Parar ambiente

```bash
docker compose down            # preserva volumes
docker compose down -v         # remove também pg_data
```

---

## 10. Scripts de Automação

### 10.1 `setup_env.sh` — verificação automatizada de dependências

> **Escopo desta entrega:** verificação (não instalação). O script reporta se Docker, Docker Compose, Node ≥ 20, npm, `.env` e `node_modules` estão presentes e orienta o passo manual quando algum item falta. Decisão deliberada — instalar Java/Android SDK exigiria gerenciadores diferentes por SO (apt, brew, choco) e privilégios elevados, o que tornaria o script frágil. O ciclo de bootstrap real é coberto por `docker compose up --build -d` e `./scripts/deploy.sh`.

Verificações executadas:

- Docker (`docker --version`)
- Docker Compose v2 ou standalone
- Node.js (versão ≥ 20)
- npm
- arquivo `.env` na raiz
- `node_modules/` presente

Uso:

```bash
./scripts/setup_env.sh
bash scripts/setup_env.sh   # alternativa via Git Bash no Windows
```

### 10.2 `monitor_system.sh` — métricas e logs

Coleta CPU (via `/proc/stat` em Linux/WSL, fallback `top` em outros), memória (`/proc/meminfo`), disco (`df`) e status de containers (`docker ps --filter "name=maya-rpg"`). Saída via `tee` para terminal e `logs/monitor/metrics_YYYYMMDD_HHMMSS.log`.

Uso:

```bash
./scripts/monitor_system.sh 5 15   # 5s de intervalo, 15s de duração
```

→ `18-monitor-system-sh.png` mostra a coleta real, `chmod 644` aplicado ao log e dica de cron impressa no final.

### 10.3 `backup_db.sh` — dump do PostgreSQL

`docker compose exec -T db pg_dump -U $POSTGRES_USER $POSTGRES_DB > backups/backup_TIMESTAMP.sql`. Aplica retenção em dias via `find ... -mtime +N -delete`.

Uso:

```bash
./scripts/backup_db.sh
```

→ `16-backup-db-sh.png` (execução com `[OK] Backup concluido`), `17-backup-arquivo-gerado.png` (`backup_20260511_125410.sql` listado em `backups/`).

### 10.4 `manage_services.sh` — gerenciamento

```bash
./scripts/manage_services.sh up
./scripts/manage_services.sh down
./scripts/manage_services.sh status
./scripts/manage_services.sh logs
./scripts/manage_services.sh restart
./scripts/manage_services.sh watch
```

→ `19-manage-services-sh.png` mostra `status` (containers `Up`/`healthy`) seguido de `restart` completo terminando com `[OK] Servicos reiniciados com sucesso.`.

### 10.5 `deploy.sh` — deploy automatizado

Fluxo:

1. Verifica Docker e Docker Compose;
2. Salva tag de rollback para imagens atuais;
3. `docker compose build --no-cache` (com log em `logs/build_*.log`);
4. Backup pré-deploy (`backup_db.sh`);
5. `docker compose down`;
6. Aplica migrações SQL pendentes em `scripts/migrations/`;
7. `docker compose up -d`;
8. Healthcheck com timeout configurável (`DEPLOY_TIMEOUT`, default 60s);
9. `docker compose ps` final.

Uso:

```bash
./scripts/deploy.sh
./scripts/deploy.sh --rollback
```

Prints da execução completa: `20-deploy-sh-inicio.png`, `21-deploy-sh-npm-ci-1.png`, `22-deploy-sh-npm-ci-2.png`, `23-deploy-sh-build.png`, `24-deploy-sh-healthy.png` (deploy concluído com sucesso, migrações aplicadas, containers healthy, Swagger disponível em `/api/docs`).

---

## 11. Conceitos Linux/Bash Demonstrados

| Conceito | Onde aparece | Print |
|---|---|---|
| Variáveis | `DEPLOY_ENV`, `API_URL`, `BACKUP_RETENTION_DAYS`, `INTERVAL`, `DURATION` | 18, 20, 24 |
| Condicionais (`if`, `case`) | `manage_services.sh`, `deploy.sh` | 19, 24 |
| Funções | `check_health`, `save_current_images`, `rollback` | 20–24 |
| Pipes | `awk`, `grep`, `tee`, `paste -sd ';'` | 18 |
| Redirecionamento (`>`, `>>`, `2>&1`) | Todos os scripts | 18, 19, 23 |
| Logs | `logs/monitor/*.log`, `logs/deploy.log`, `logs/build_*.log` | 18 |
| Permissões | `chmod 644` no log; orientação `chmod +x scripts/*.sh` | 18 |
| Cron | Sugestão impressa pelo `monitor_system.sh` + Seção 12 | 18 |

---

## 12. Exemplos de Cron

```cron
# Backup diário às 02:00
0 2 * * * cd /path/to/maya-rpg-api && ./scripts/backup_db.sh >> /var/log/maya-rpg/backup.log 2>&1

# Monitoramento a cada 5 minutos
*/5 * * * * cd /path/to/maya-rpg-api && ./scripts/monitor_system.sh 5 30 >> /var/log/maya-rpg/monitor.log 2>&1
```

---

## 13. Teste de Carga (k6) — resultado real

Execução em 11/05/2026 com `k6 run test/load/load-test.js`. Evidência: `25-k6-load-test.png`.

| Métrica | Valor | Threshold | Resultado |
|---|---|---|---|
| `http_req_duration` p(95) | **2.42 ms** | `< 500 ms` | ✅ |
| `http_req_failed` | **0.00%** | `< 1%` | ✅ |
| Checks succeeded | **5451 / 5451 (100%)** | — | ✅ |
| Iterations | 1817 (15.07/s) | — | — |
| VUs máx | 20 | — | — |
| Duração | 2m30s | — | — |

Cenários validados:

- `login responde 401 ou 429`
- `check-in responde 401, 403 ou 429`
- `historico responde 401, 403 ou 429`

> Os retornos 401/403 são esperados porque o teste mede o gateway de autenticação sob carga, sem token válido. A taxa de falha 0% e o p95 de 2.42ms indicam que a API mantém o comportamento esperado mesmo com 20 VUs concorrentes.

---

## 14. Evidências visuais (Cloud Native)

Ordem cronológica recomendada para o avaliador:

1. **Pré-condições locais** — 01–04 (`.env`, lint, build, testes 23 PASS)
2. **Validação do Compose** — 05–07
3. **Build e execução em container** — 08–12
4. **Aplicação respondendo** — 13 (Swagger)
5. **Persistência e isolamento** — 14, 15
6. **Scripts de automação** — 16–19
7. **Deploy automatizado** — 20–24
8. **Teste de carga** — 25

Todos em [`imagens-maya/cloud-native/`](../../../../imagens-maya/cloud-native/). Descrição arquivo a arquivo em `imagens-maya/README.md`.

---

## 15. Conclusão

A infraestrutura cobre todos os itens obrigatórios da Entrega 2 de Cloud Native: Dockerfile da API, Dockerfile do banco, Compose com volume persistente, variáveis de ambiente, script de deploy automatizado, documentação de build/execução, demonstração do sistema em containers, relatório com vantagens/diferenças/persistência, scripts de monitoramento, backup, gerenciamento e demonstração de conceitos Linux/Bash. Os 25 prints em `imagens-maya/cloud-native/` evidenciam execução real em 11/05/2026, incluindo um teste de carga com 0% de falha e p95 de 2.42ms.

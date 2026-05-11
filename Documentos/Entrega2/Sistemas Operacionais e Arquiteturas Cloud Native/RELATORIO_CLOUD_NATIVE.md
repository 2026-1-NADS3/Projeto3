# Relatório Cloud Native e Linux — Entrega 2

> **Projeto:** Maya Fisioterapia/RPG — Backend/API
> **Aluno responsável (escopo individual):** Programação Mobile + Cloud Native
> **Validação técnica:** 11/05/2026 em ambiente local containerizado (Docker Desktop, Windows 11 + WSL/Git Bash)
> **Evidências visuais:** [`imagens-maya/cloud-native/`](../../../imagens-maya/cloud-native/)

Documento principal da entrega individual de Cloud Native/Infraestrutura com Linux. Cobre Dockerfile, docker-compose, scripts Shell/Bash, healthchecks, persistência por volume, variáveis de ambiente, deploy automatizado e teste de carga com k6. Cada item abaixo aponta para um print real anexado em `imagens-maya/cloud-native/`.

---

## 1. Visão geral

A solução foi organizada para funcionar em ambiente local containerizado, com backend, banco de dados e automação por scripts Shell/Bash.

O objetivo é demonstrar uma arquitetura replicável, com persistência, parâmetros de ambiente e separação entre aplicação e infraestrutura.

### Caminhos reais dos artefatos

Os arquivos da entrega de Cloud Native estão nesta pasta (`Documentos/Entrega2/Sistemas Operacionais e Arquiteturas Cloud Native/`). O ambiente de validação local utilizou a cópia de trabalho do backend em `C:\Users\nelso\OneDrive\Nelson\Desktop\Workspace\maya-rpg-api`, motivo pelo qual os prints do Docker exibem esse caminho. Os artefatos versionados nesta pasta são os mesmos validados nos prints.

| Artefato | Caminho versionado |
|---|---|
| Dockerfile da API | `./Dockerfile` |
| Dockerfile do banco | `./Dockerfile.db` |
| Compose | `./docker-compose.yml` |
| Variáveis de ambiente | `./.env.example` |
| Scripts Shell/Bash | `./scripts/*.sh` |
| Migrações SQL | `./scripts/migrations/*.sql` |

---

## 2. Docker no backend

### 2.1 Dockerfile da API

Build multi-stage Node.js 20-alpine com etapa de build separada do runtime, usuário não-root (`appuser`), `curl` instalado para healthcheck e diretórios `/app/uploads` e `/app/logs` com permissão correta para o usuário do container.

Prints relacionados:

- `07-arquivos-docker.png` — listagem dos três arquivos (`Dockerfile`, `Dockerfile.db`, `docker-compose.yml`) no diretório de trabalho.
- `08-docker-compose-build.png` — `docker compose build` finalizando com `Image maya-rpg-api-api Built`.

### 2.2 Dockerfile.db

Base `postgres:16-alpine`, variáveis `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` definidas como defaults (sobrescritas pelo Compose/`.env` em runtime), porta 5432 exposta. Mantido como artefato acadêmico exigido pelo PI (a Entrega 2 pede explicitamente "Dockerfile para o banco de dados (PostgreSQL/MySQL)").

Prints relacionados:

- `08-docker-compose-build.png` — `Image maya-rpg-db:latest Built`.
- `14-volume-ls-pg-isready.png` — `docker compose exec db pg_isready -U maya_user -d maya_rpg` → `accepting connections`.

---

## 3. Docker Compose

O `docker-compose.yml` organiza dois serviços (`api`, `db`) na rede interna `maya-network`, com `depends_on: db.condition: service_healthy`, volume nomeado `pg_data` para o PostgreSQL, bind mounts `./uploads:/app/uploads` e `./logs:/app/logs`, healthchecks para ambos os serviços e variáveis de ambiente injetadas a partir do `.env`.

Prints relacionados:

- `05-docker-compose-config-api.png` — bloco resolvido do serviço `api` (build, healthcheck `curl -f /api/docs`, ports `3000:3000`, bind mounts).
- `06-docker-compose-config-db.png` — bloco resolvido do serviço `db` (healthcheck `pg_isready`, ports `5432:5432`, volume `pg_data:/var/lib/postgresql/data`, rede `maya-network`).
- `09-docker-compose-up-healthy.png` — `docker compose up -d` finalizando com `Container maya-rpg-db Healthy` e `Container maya-rpg-api Started`.

### 3.1 Volume persistente

`pg_data:/var/lib/postgresql/data` garante a persistência dos dados do PostgreSQL entre reinicializações. Evidenciado em `14-volume-ls-pg-isready.png` (volume `maya-rpg-api_pg_data` listado por `docker volume ls`).

### 3.2 Volumes de uploads e logs

Bind mounts `./uploads` e `./logs` separam dados gerados em runtime do código-fonte. Evidenciado em `15-uploads-logs.png` (`docker compose exec api ls -la /app/uploads` e `/app/logs`).

---

## 4. Variáveis de ambiente

O `.env.example` documenta os campos esperados (banco, JWT, CORS, porta, SMTP, FCM, Mercado Pago, deploy). O `.env` real fica fora do Git (referenciado no `.gitignore`).

Boas práticas adotadas:

- `.env` não é versionado;
- `.env.example` serve como modelo, sem credenciais reais;
- cada ambiente ajusta suas variáveis sem alterar o código;
- durante execução via Docker Compose, `DB_HOST=db` (nome do serviço na rede interna).

Print relacionado:

- `01-env-configurado.png` — `.env` local preenchido para a demonstração (DB, JWT, CORS, PORT, SMTP, FCM, MP_*).

---

## 5. Healthchecks

| Serviço | Healthcheck | Evidência |
|---|---|---|
| `api` | `curl -f http://localhost:3000/api/docs` | `09-docker-compose-up-healthy.png`, `10-docker-compose-ps.png` |
| `db` | `pg_isready -U $DB_USER -d $DB_NAME` | `10-docker-compose-ps.png`, `14-volume-ls-pg-isready.png` |

A coluna `STATUS` em `10-docker-compose-ps.png` mostra `Up X seconds (healthy)` em ambos os containers.

---

## 6. Scripts Shell e Bash

Cinco scripts mantidos em `./scripts/`. A função de cada um e os prints que evidenciam execução real:

| Script | Função | Evidência |
|---|---|---|
| `setup_env.sh` | **Verificação automatizada** das dependências do ambiente (Docker, Docker Compose, Node 20+, npm, `.env`, `node_modules`). Não instala dependências — relata o que está faltando e orienta o passo manual. | (Sem print dedicado — execução é silenciosa quando tudo está OK; o efeito prático aparece no fluxo do `deploy.sh`.) |
| `monitor_system.sh` | Coleta métricas (CPU via `/proc/stat`, memória via `/proc/meminfo`, disco via `df`, containers via `docker ps`) e grava em `logs/monitor/metrics_*.log`. | `18-monitor-system-sh.png` |
| `backup_db.sh` | `pg_dump` do banco via `docker compose exec -T db`, salva em `backups/backup_YYYYMMDD_HHMMSS.sql` e aplica retenção em dias. | `16-backup-db-sh.png` (execução), `17-backup-arquivo-gerado.png` (arquivo `backup_20260511_125410.sql` listado em `backups/`) |
| `manage_services.sh` | `up`, `down`, `status`, `logs`, `restart` e modo `watch` (restart automático em falha). | `19-manage-services-sh.png` (`status` + `restart` completo com `API esta respondendo`) |
| `deploy.sh` | Deploy automatizado: verifica dependências → salva tag de rollback → `docker compose build --no-cache` → backup pré-deploy → `compose down` → aplica migrações SQL → `compose up -d` → healthcheck com timeout. Suporta `--rollback`. | `20-deploy-sh-inicio.png` a `24-deploy-sh-healthy.png` (5 prints sequenciais cobrindo o deploy completo) |

### 6.1 Importante: escopo do `setup_env.sh`

O PI menciona "automatizar instalação de dependências (Java, Android SDK, ferramentas de build)" como exemplo da Entrega 1 (Infraestrutura e Automação com Linux). Na Entrega 2, o foco passou para containerização. O `setup_env.sh` mantido nesta entrega tem escopo de **verificação automatizada** (não instalação): confirma que Docker, Docker Compose, Node ≥ 20, npm, `.env` e `node_modules` estão presentes, e orienta o passo manual quando algum item falta. Esta decisão é deliberada — instalar Java/Android SDK exige privilégios e gerenciadores diferentes por SO (apt, brew, choco), o que tornaria o script frágil e não-reproduzível. O ciclo prático de bootstrap é coberto pelo Compose (`docker compose up --build -d`) e pelo `deploy.sh`.

---

## 7. Matriz de aderência ao PDF (Entrega 2)

| Exigência da Entrega 2 | Artefato | Evidência (print) | Aderência |
|---|---|---|---|
| Containerizar a API REST | `./Dockerfile` | `07-arquivos-docker.png`, `08-docker-compose-build.png` | Atendido |
| Preparar banco em container | `./Dockerfile.db` + serviço `db` no Compose | `06-docker-compose-config-db.png`, `08-docker-compose-build.png` | Atendido |
| Orquestrar API + BD | `./docker-compose.yml` | `05-docker-compose-config-api.png`, `06-docker-compose-config-db.png`, `09-docker-compose-up-healthy.png`, `10-docker-compose-ps.png` | Atendido |
| Volume persistente | `pg_data` nomeado | `14-volume-ls-pg-isready.png` | Atendido |
| Variáveis de ambiente | `./.env.example` + bloco `environment` do Compose | `01-env-configurado.png`, `05-docker-compose-config-api.png` | Atendido |
| Script de deploy automatizado | `./scripts/deploy.sh` | `20-deploy-sh-inicio.png` → `24-deploy-sh-healthy.png` | Atendido |
| Documentação de build/execução | Seção 9 deste documento + `docs/02-cloud-native-e-automacao.md` | — | Atendido |
| Demonstração do sistema rodando em containers | `compose ps` healthy + Swagger | `10-docker-compose-ps.png`, `11-docker-desktop-container.png`, `13-swagger.png` | Atendido |
| Relatório de vantagens/diferenças/persistência | Seções 9 e 10 deste documento | — | Atendido |
| Monitoramento de CPU/memória/disco/logs | `./scripts/monitor_system.sh` | `18-monitor-system-sh.png` | Atendido |
| Backup de banco | `./scripts/backup_db.sh` | `16-backup-db-sh.png`, `17-backup-arquivo-gerado.png` | Atendido |
| Gerenciamento de processos | `./scripts/manage_services.sh` | `19-manage-services-sh.png` | Atendido |
| Pipes / redirecionamento / variáveis / cron / permissões | Scripts + Seção 8 | Visíveis em `18-monitor-system-sh.png` (pipes/tee/redir), `19-manage-services-sh.png`, prints do `deploy.sh` | Atendido |

---

## 8. Conceitos Linux/Bash demonstrados

| Conceito | Onde aparece nos scripts | Evidência |
|---|---|---|
| Variáveis | `DEPLOY_ENV`, `API_URL`, `BACKUP_RETENTION_DAYS`, `INTERVAL`, `DURATION`, `HEALTH_TIMEOUT` | Prints 16, 18, 20–24 |
| Condicionais | `if`, `case` em `manage_services.sh` e `deploy.sh` | Prints 19, 24 |
| Funções | `check_health`, `save_current_images`, `rollback`, `restart_with_healthcheck` | Prints 20–24 |
| Pipes | `awk`, `grep`, `tee`, `paste -sd ';'` em `monitor_system.sh` | Print 18 |
| Redirecionamento | `>`, `>>`, `2>&1` em todos os scripts | Prints 18, 19, 23 |
| Logs | `logs/deploy.log`, `logs/monitor/metrics_*.log` | Print 18 (mostra o caminho do log gerado) |
| Permissões | `chmod 644` no log final do `monitor_system.sh`; `chmod +x` nos scripts | Print 18 |
| Cron | Sugestões impressas pelo `monitor_system.sh` ao final e documentadas em `docs/02-cloud-native-e-automacao.md` | Print 18 |

### Exemplos de cron documentados

```cron
0 2 * * * cd /path/to/maya-rpg-api && ./scripts/backup_db.sh >> /var/log/maya-rpg/backup.log 2>&1
*/5 * * * * cd /path/to/maya-rpg-api && ./scripts/monitor_system.sh 5 30 >> /var/log/maya-rpg/monitor.log 2>&1
```

---

## 9. Ambiente tradicional vs. containerizado

| Critério | Ambiente tradicional | Ambiente containerizado |
|---|---|---|
| Instalação | Node, PostgreSQL e dependências instalados manualmente | Imagens Docker definem o ambiente |
| Reprodutibilidade | Varia entre máquinas/SOs | Mesmo Compose sobe os mesmos serviços |
| Configuração | Depende da máquina local | Centralizada em `.env` e Compose |
| Isolamento | Processos compartilham o SO host | Containers isolados em rede dedicada (`maya-network`) |
| Persistência | Depende da instalação local do banco | Volume nomeado `pg_data` + bind mounts |
| Deploy | Passos manuais | `./scripts/deploy.sh` automatizado |

### Vantagens da containerização observadas nesta entrega

- ambiente reproduzível em qualquer máquina com Docker;
- isolamento claro entre API e banco;
- persistência explícita via volume nomeado;
- previsibilidade na demonstração acadêmica;
- menor acoplamento ao SO local (Windows neste caso, mas equivalente em Linux).

### Estratégia de volumes/persistência

| Volume/Pasta | Tipo | Função |
|---|---|---|
| `pg_data:/var/lib/postgresql/data` | Volume nomeado | Persistência do PostgreSQL entre recriações de container |
| `./uploads:/app/uploads` | Bind mount | Arquivos enviados pelo paciente/profissional |
| `./logs:/app/logs` | Bind mount | Logs gerados pela API |
| `./backups` | Diretório local | Dumps gerados pelo `backup_db.sh` |

`down -v` é usado apenas quando se deseja descartar o volume do banco — caso contrário, `down` preserva os dados.

---

## 10. Como os scripts ajudam o ciclo de desenvolvimento

- `setup_env.sh` reduz erros de configuração no primeiro uso da máquina.
- `monitor_system.sh` documenta o uso de recursos durante a demonstração.
- `backup_db.sh` protege dados de desenvolvimento e demonstração.
- `manage_services.sh` padroniza start/stop/restart e oferece modo `watch` para resiliência.
- `deploy.sh` reúne build, backup, migração e healthcheck em um único fluxo auditável (com `logs/deploy.log`).

---

## 11. Teste de carga (k6) — resultado real

Validado em 11/05/2026 com `k6 run test/load/load-test.js`. Evidência: `25-k6-load-test.png`.

| Métrica | Valor obtido | Threshold | Resultado |
|---|---|---|---|
| `http_req_duration` p(95) | **2.42 ms** | `< 500 ms` | ✅ Aprovado |
| `http_req_failed` rate | **0.00%** | `< 1%` | ✅ Aprovado |
| Checks succeeded | **5451 / 5451 (100%)** | — | ✅ |
| Iterations | **1817** (15.07/s) | — | — |
| VUs (max) | **20** | — | — |
| Duração | 2m30s (3 stages com graceful ramp-down) | — | — |

Cenários validados pelo `load-test.js`:

- `login responde 401 ou 429`
- `check-in responde 401, 403 ou 429`
- `historico responde 401, 403 ou 429`

> Nota: os 401/403 são esperados nesse cenário porque o teste de carga não envia token válido — o objetivo é medir o comportamento do gateway de autenticação sob carga, não autenticar de fato.

---

## 12. Evidências visuais — índice completo

Todos os prints estão em [`imagens-maya/cloud-native/`](../../../imagens-maya/cloud-native/). Ordem de leitura recomendada para o avaliador:

1. **Pré-condições (build local fora de container)** — `01-env-configurado.png`, `02-npm-lint.png`, `03-npm-build.png`, `04-npm-test-23-passing.png`.
2. **Validação do Compose** — `05-docker-compose-config-api.png`, `06-docker-compose-config-db.png`, `07-arquivos-docker.png`.
3. **Build e execução em container** — `08-docker-compose-build.png`, `09-docker-compose-up-healthy.png`, `10-docker-compose-ps.png`, `11-docker-desktop-container.png`, `12-docker-desktop-logs.png`.
4. **Aplicação respondendo** — `13-swagger.png`.
5. **Persistência e isolamento** — `14-volume-ls-pg-isready.png`, `15-uploads-logs.png`.
6. **Scripts de automação** — `16-backup-db-sh.png`, `17-backup-arquivo-gerado.png`, `18-monitor-system-sh.png`, `19-manage-services-sh.png`.
7. **Deploy automatizado** — `20-deploy-sh-inicio.png` → `24-deploy-sh-healthy.png` (5 prints sequenciais).
8. **Teste de carga** — `25-k6-load-test.png`.

---

## 13. Conclusão

A entrega de Cloud Native cobre todos os requisitos obrigatórios da Entrega 2 do PI (Dockerfile da API, Dockerfile do banco, `docker-compose.yml` com volume persistente, variáveis de ambiente, script de deploy automatizado, documentação e demonstração do sistema rodando em containers). Os 25 prints em `imagens-maya/cloud-native/` evidenciam execução real em 11/05/2026, incluindo o teste de carga com k6 (p95=2.42ms, 0% de falha em 5451 checks). A solução está pronta para demonstração acadêmica em ambiente local containerizado.

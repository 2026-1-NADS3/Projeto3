# Entrega 2 — Programação Mobile e Cloud Native

> **Projeto:** Maya Fisioterapia/RPG
> **Curso:** Projeto Interdisciplinar — 3º ADS — FECAP 2026
> **Aluno (escopo individual desta entrega):** Programação Mobile + Cloud Native (backend/API containerizada)
> **Validação técnica:** 11/05/2026 — ambiente local containerizado
> **Evidências visuais:** [`Imagens/`](../../../../Imagens/)

Este documento é o ponto de entrada da Entrega 2 para o avaliador. Apresenta de forma objetiva o que foi implementado, como executar e onde estão as evidências.

> Para um roteiro visual completo com cada etapa seguida da sua captura de tela real, consulte **[00-guia-ilustrado.md](00-guia-ilustrado.md)**.

---

## 1. Visão Geral

O projeto **Maya Fisioterapia/RPG** apoia o acompanhamento fisioterapêutico de pacientes da Clínica Maya Yoshiko Yamamoto por meio de aplicativo mobile, API backend, banco de dados e infraestrutura containerizada.

O escopo individual desta entrega cobre duas frentes:

| Frente | Objetivo |
|---|---|
| **Programação Mobile** | App Android do paciente — autenticação, plano de exercícios, check-in com dor 0–10, histórico/evolução, persistência local (Room/SQLite) e consumo da API. |
| **Cloud Native** | API NestJS + PostgreSQL containerizados com Docker Compose, volume persistente, variáveis de ambiente, scripts Bash/Linux (setup, monitoramento, backup, gerenciamento, deploy) e teste de carga com k6. |

O backend (NestJS), o módulo web e a parte de testes/qualidade são entregas integradas do projeto. O foco deste documento é o que o aluno entrega individualmente nas disciplinas de Programação Mobile e Cloud Native — partes do grupo aparecem apenas como contexto quando são dependência direta.

---

## 2. Escopo e Estrutura

```text
Projeto3/
├── Documentos/Entrega2/
│   ├── ProgramacaoMobile/        # Documentação do app Android
│   └── Sistemas Operacionais e Arquiteturas Cloud Native/
│       ├── Dockerfile            # API NestJS (multi-stage, Node 20-alpine)
│       ├── Dockerfile.db         # PostgreSQL 16-alpine
│       ├── docker-compose.yml    # api + db + rede + volume
│       ├── .env.example          # Modelo de variáveis de ambiente
│       ├── scripts/              # setup, monitor, backup, manage, deploy
│       ├── RELATORIO_CLOUD_NATIVE.md
│       └── docs/                 # Este pacote de documentação
└── src/Entrega 2/
    ├── maya-rpg-api/             # Código do backend (espelho do que está em Cloud Native)
    └── mobile/                   # Código do app Android
```

E, fora do repositório acadêmico, a pasta de evidências:

```text
Imagens/
├── cloud-native/   # 25 prints validados em 11/05/2026
├── mobile/         # 17 prints validados em 11/05/2026
└── postman-api/    # 12 prints validados em 11/05/2026
```

---

## 3. Responsabilidades Documentadas

### 3.1 Programação Mobile (app Android — paciente)

| Requisito do PI (Entrega 2) | Implementação | Status | Evidência |
|---|---|---|---|
| Consumir API REST | Retrofit 2 + Gson | OK | README mobile, build sucesso |
| Tratamento de JSON | Gson | OK | README mobile |
| Armazenamento local com SQLite | Room (tabela `exercise_sessions`) | OK | README mobile, VALIDACAO_FINAL |
| Autenticação | JWT (login por e-mail ou CPF) | OK | README mobile |
| Check-in de exercício | `exerciseId`, `painLevel` 0–10, `notes`, `executedAt` | OK | README mobile |
| Nível de dor 0–10 | Slider Material | OK | README mobile |
| Observações no check-in | Campo de texto | OK | README mobile |
| Histórico/evolução | Tela de evolução com MPAndroidChart | OK | README mobile |
| Sincronização offline | WorkManager (`SyncWorker`) | OK | README mobile |
| Notificações/lembretes | FCM + `ReminderWorker` integrados no código | **Parcial** | Implementação presente, sem print de notificação real no dispositivo até esta versão da entrega |
| Aceite LGPD | `LgpdConsentActivity` + endpoint `/api/auth/accept-lgpd` | OK | Código mobile + Swagger (print 13) |
| Múltiplas Activities + Intents | Estrutura de navegação | OK | README mobile |
| Fragment real | `ExercisePlanActivity` | OK | README mobile |
| ConstraintLayout em todos os layouts | XMLs padronizados | OK | README mobile |
| TextView, ImageView, Button | Componentes presentes | OK | README mobile |
| Identidade visual da Clínica | Cores e logo aplicados | OK | README mobile |

Validação fora do sandbox em 10/05/2026: `gradlew.bat :app:testDebugUnitTest` e `gradlew.bat :app:assembleDebug` finalizaram com código 0.

### 3.2 Cloud Native (backend containerizado)

| Requisito do PI (Entrega 2) | Artefato (caminho real) | Print de evidência |
|---|---|---|
| Dockerfile do backend | `../Dockerfile` | `Imagens/cloud-native/07-arquivos-docker.png`, `08-docker-compose-build.png` |
| Dockerfile do banco | `../Dockerfile.db` | `06-docker-compose-config-db.png`, `08-docker-compose-build.png` |
| Docker Compose com API + banco | `../docker-compose.yml` | `05-docker-compose-config-api.png`, `06-docker-compose-config-db.png`, `09-docker-compose-up-healthy.png`, `10-docker-compose-ps.png` |
| Volume persistente | `pg_data` (nomeado) | `14-volume-ls-pg-isready.png` |
| Variáveis de ambiente | `../.env.example` + `environment:` no Compose | `01-env-configurado.png` |
| Script de deploy automatizado | `../scripts/deploy.sh` | `20-deploy-sh-inicio.png` → `24-deploy-sh-healthy.png` |
| Demonstração do sistema rodando em containers | `compose ps`, Docker Desktop, Swagger | `10-docker-compose-ps.png`, `11-docker-desktop-container.png`, `12-docker-desktop-logs.png`, `13-swagger.png` |
| Documentação de build/execução | Este doc + `02-cloud-native-e-automacao.md` | — |
| Relatório (vantagens, ambiente tradicional × containerizado, volumes/persistência) | `../RELATORIO_CLOUD_NATIVE.md` | — |
| Script de monitoramento (CPU/memória/disco/logs) | `../scripts/monitor_system.sh` | `18-monitor-system-sh.png` |
| Script de backup | `../scripts/backup_db.sh` | `16-backup-db-sh.png`, `17-backup-arquivo-gerado.png` |
| Gerenciamento de processos | `../scripts/manage_services.sh` | `19-manage-services-sh.png` |
| Pipes/redirect/variáveis/cron/permissões | Scripts + Seção 8 do Relatório | Visíveis em prints 18, 19, 20–24 |

---

## 4. Como executar o backend containerizado

A partir da pasta com `docker-compose.yml` (`Documentos/Entrega2/Sistemas Operacionais e Arquiteturas Cloud Native/`):

**Linux / WSL / Git Bash:**

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
```

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
docker compose up --build -d
docker compose ps
```

Swagger: `http://localhost:3000/api/docs` (ver `13-swagger.png`).

Para subir via script automatizado:

```bash
./scripts/deploy.sh
# rollback:
./scripts/deploy.sh --rollback
```

---

## 5. Como executar o mobile

```bash
cd src/Entrega\ 2/mobile
./gradlew :app:assembleDebug
```

Windows:

```powershell
.\gradlew.bat :app:assembleDebug
```

URL da API consumida pelo app: `https://maya-rpg-api-1t7v.onrender.com/api/` (produção). Para apontar para o backend local, ajustar `API_BASE_URL` em `app/build.gradle.kts`:

| Ambiente | URL |
|---|---|
| Emulador Android | `http://10.0.2.2:3000/api/` |
| Dispositivo físico | `http://<IP_DA_MAQUINA>:3000/api/` |

---

## 6. Comandos de validação

| Validação | Comando | Print |
|---|---|---|
| Lint da API | `npm run lint` | `02-npm-lint.png` |
| Build da API | `npm run build` | `03-npm-build.png` |
| Testes unitários da API | `npm test -- --runInBand` | `04-npm-test-23-passing.png` (6 suites, 23 testes PASS) |
| Validação do Compose | `docker compose config` | `05-` e `06-docker-compose-config-*.png` |
| Build das imagens | `docker compose build` | `08-docker-compose-build.png` |
| Containers ativos | `docker compose ps` | `10-docker-compose-ps.png` |
| Healthcheck do banco | `docker compose exec db pg_isready -U maya_user -d maya_rpg` | `14-volume-ls-pg-isready.png` |
| Volume persistente | `docker volume ls` | `14-volume-ls-pg-isready.png` |
| Bind mounts dentro do container | `docker compose exec api ls -la /app/uploads /app/logs` | `15-uploads-logs.png` |
| Backup do banco | `./scripts/backup_db.sh` | `16-backup-db-sh.png`, `17-backup-arquivo-gerado.png` |
| Monitoramento | `./scripts/monitor_system.sh 5 15` | `18-monitor-system-sh.png` |
| Gerenciamento de serviços | `./scripts/manage_services.sh status` / `restart` | `19-manage-services-sh.png` |
| Deploy automatizado | `./scripts/deploy.sh` | `20-` a `24-deploy-sh-*.png` |
| Teste de carga | `k6 run test/load/load-test.js` | `25-k6-load-test.png` |

---

## 7. Resultado do teste de carga (k6) — real

Execução em 11/05/2026. Print: `Imagens/cloud-native/25-k6-load-test.png`.

| Métrica | Valor | Threshold | Resultado |
|---|---|---|---|
| `http_req_duration` p(95) | **2.42 ms** | `< 500 ms` | ✅ |
| `http_req_failed` | **0.00%** | `< 1%` | ✅ |
| Checks succeeded | **5451 / 5451** | — | ✅ |
| Iterations | 1817 (15.07/s) | — | — |
| VUs max | 20 | — | — |
| Duração | 2m30s (3 stages com graceful ramp-down) | — | — |

---

## 8. Status consolidado

| Área | Situação | Observação |
|---|:---:|---|
| API containerizada (Compose, volume, healthchecks, scripts) | ✅ | Validado por 25 prints reais |
| Build/lint/testes da API | ✅ | 23/23 testes PASS |
| Teste de carga (k6) | ✅ | p95=2.42ms, 0% falha |
| Mobile: build e features principais | ✅ | Build OK fora do sandbox (10/05/2026) |
| Mobile: notificações FCM/ReminderWorker | ⚠️ Parcial | Código presente, sem print de notificação real no dispositivo até esta versão |
| Mobile: evidências visuais (telas) | ✅ | 17 prints em `Imagens/mobile/` — fluxo completo do paciente |
| Postman/API client (prints) | ✅ | 12 prints em `Imagens/postman-api/` — fluxo completo da API |

---

## 9. Evidências visuais

Índice completo em [`../../../../Imagens/README.md`](../../../../Imagens/README.md). Guia visual ilustrado com cada etapa + print: [00-guia-ilustrado.md](00-guia-ilustrado.md).

### 9.1 `Imagens/cloud-native/` — 25 prints

```
01-env-configurado.png            14-volume-ls-pg-isready.png
02-npm-lint.png                   15-uploads-logs.png
03-npm-build.png                  16-backup-db-sh.png
04-npm-test-23-passing.png        17-backup-arquivo-gerado.png
05-docker-compose-config-api.png  18-monitor-system-sh.png
06-docker-compose-config-db.png   19-manage-services-sh.png
07-arquivos-docker.png            20-deploy-sh-inicio.png
08-docker-compose-build.png       21-deploy-sh-npm-ci-1.png
09-docker-compose-up-healthy.png  22-deploy-sh-npm-ci-2.png
10-docker-compose-ps.png          23-deploy-sh-build.png
11-docker-desktop-container.png   24-deploy-sh-healthy.png
12-docker-desktop-logs.png        25-k6-load-test.png
13-swagger.png
```

### 9.2 `Imagens/mobile/` — 17 prints

| # | Arquivo | Evidência |
|---:|---|---|
| 1 | `01-build-android-studio-successful.png` | BUILD SUCCESSFUL — assembleDebug, 31s |
| 2 | `02-splash-bem-vindo.png` | Splash screen |
| 3 | `03-login-vazio.png` | Tela de login (campos vazios) |
| 4 | `04-login-preenchido.png` | Tela de login preenchida |
| 5 | `05-primeiro-acesso-criar-senha.png` | Primeiro Acesso — criar senha |
| 6 | `06-lgpd-termo-aceitar.png` | Termo LGPD — aguardando aceite |
| 7 | `07-lgpd-salvando.png` | Termo LGPD — aceito, salvando |
| 8 | `08-fcm-permission-dialog.png` | Diálogo FCM: "Allow notifications?" |
| 9 | `09-home-dashboard.png` | Home — dashboard do paciente |
| 10 | `10-minha-evolucao-grafico.png` | Minha Evolução — gráfico de dor |
| 11 | `11-plano-exercicios-lista.png` | Plano de exercícios — lista |
| 12 | `12-configuracoes.png` | Configurações — conta e preferências |
| 13 | `13-configuracoes-sair-confirmacao.png` | Confirmação de logout |
| 14 | `14-editar-perfil.png` | Editar Perfil |
| 15 | `15-agendar-sessao-calendario.png` | Agendar Sessão — calendário |
| 16 | `16-mensagens.png` | Mensagens |
| 17 | `17-minha-agenda.png` | Minha Agenda |

### 9.3 `Imagens/postman-api/` — 12 prints

| # | Arquivo | Endpoint | Status |
|---:|---|---|:---:|
| 1 | `01-admin-login-201-token.png` | `POST /api/auth/login` (admin) | 201 |
| 2 | `02-auth-me-200-admin.png` | `GET /api/auth/me` | 200 |
| 3 | `03-post-patients-201.png` | `POST /api/patients` | 201 |
| 4 | `04-post-exercises-201.png` | `POST /api/exercises` | 201 |
| 5 | `05-patient-login-201-primeiro-acesso.png` | `POST /api/auth/login` (paciente, CPF) | 201 |
| 6 | `06-auth-change-password-201.png` | `POST /api/auth/change-password` | 201 |
| 7 | `07-patient-login-201-token.png` | `POST /api/auth/login` (nova senha) | 201 |
| 8 | `08-accept-lgpd-201.png` | `POST /api/auth/accept-lgpd` | 201 |
| 9 | `09-post-prescriptions-201.png` | `POST /api/prescriptions` | 201 |
| 10 | `10-get-prescriptions-me-full-200.png` | `GET /api/prescriptions/me/full` | 200 |
| 11 | `11-post-check-ins-201.png` | `POST /api/check-ins` | 201 |
| 12 | `12-get-check-ins-history-200.png` | `GET /api/check-ins/my-history` | 200 |

---

## 10. Observações importantes

- `.env` **não é versionado**. Apenas `.env.example` é entregue.
- `node_modules/`, `dist/`, `logs/`, `uploads/`, `backups/` são gerados em runtime e não compõem a entrega.
- A solução é descrita como **pronta para demonstração acadêmica em ambiente local containerizado**, não como "pronta para produção".
- As métricas do k6 são reais (print 25), não estimadas.
- O status `Parcial` em notificações reflete que a implementação existe no código mobile (FCM + `ReminderWorker`), mas a entrega ainda não anexou print de notificação real no dispositivo.

---

## 11. Conclusão

A entrega individual cobre Programação Mobile e Cloud Native conforme o PI 3ADS 2026 da Clínica Maya. As evidências estão completas: 25 prints em `Imagens/cloud-native/` documentam a infraestrutura Docker, scripts Bash, persistência, healthchecks e teste de carga (p95=2.42ms, 0% falha, 5451/5451 checks); 17 prints em `Imagens/mobile/` cobrem o fluxo completo do paciente no app Android (splash → login → LGPD → FCM → home → exercícios → evolução); e 12 prints em `Imagens/postman-api/` documentam o fluxo completo da API (criação de dados → primeiro acesso → LGPD → prescrição → check-in → histórico). Total: 54 prints validados em 11/05/2026.

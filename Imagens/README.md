# Evidências Visuais — Entrega 2 (Maya RPG)

Prints e evidências da Entrega 2, organizados por área.

## Estrutura

```
Imagens/
├── cloud-native/   # 25 prints: Docker, scripts Bash, k6, build, testes da API
├── mobile/         # 17 prints: app Android (splash → login → LGPD → home → exercícios → evolução)
└── postman-api/    # 12 prints: fluxo completo da API via Postman (admin → paciente → check-in)
```

---

## cloud-native/ — 25 prints (validados em 11/05/2026)

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
| 25 | `25-k6-load-test.png` | `k6 run test/load/load-test.js` — p95=2.42ms, 0% falha, 5451/5451 checks |

---

## mobile/ — 17 prints (validados em 11/05/2026)

Fluxo do paciente: build → splash → login → primeiro acesso → LGPD → FCM → home → exercícios → evolução → configurações → agenda.

| # | Arquivo | Tela / Evidência |
|---:|---|---|
| 1 | `01-build-android-studio-successful.png` | Android Studio — BUILD SUCCESSFUL (assembleDebug, 31s) |
| 2 | `02-splash-bem-vindo.png` | Tela de splash — logo Maya Yamamoto RPG + "Bem-Vindo" |
| 3 | `03-login-vazio.png` | Tela de login (campos vazios) |
| 4 | `04-login-preenchido.png` | Tela de login preenchida (andre@gmail.com + senha) |
| 5 | `05-primeiro-acesso-criar-senha.png` | Primeiro Acesso — criação de nova senha |
| 6 | `06-lgpd-termo-aceitar.png` | Termo de uso e LGPD (checkbox desmarcado, "Aceitar e continuar") |
| 7 | `07-lgpd-salvando.png` | Termo de uso e LGPD (checkbox marcado, "Salvando...") |
| 8 | `08-fcm-permission-dialog.png` | Diálogo do Android: "Allow Maya RPG to send you notifications?" |
| 9 | `09-home-dashboard.png` | Home — Evolução Semanal + planos de exercícios + agenda da semana |
| 10 | `10-minha-evolucao-grafico.png` | Minha Evolução — gráfico Nível de Dor, tabs Melhora / Frequência |
| 11 | `11-plano-exercicios-lista.png` | Bem-Vindo ao Seu Plano de Exercícios (lista com busca) |
| 12 | `12-configuracoes.png` | Configurações — Conta (Editar Perfil, Segurança, Privacidade) + Preferências |
| 13 | `13-configuracoes-sair-confirmacao.png` | Diálogo de confirmação de logout |
| 14 | `14-editar-perfil.png` | Editar Perfil — dados pessoais + Minha Saúde (Notificações, Idioma, Tema) |
| 15 | `15-agendar-sessao-calendario.png` | Agendar Sessão — calendário May 2026 + horários disponíveis |
| 16 | `16-mensagens.png` | Tela de Mensagens (suas conversas) |
| 17 | `17-minha-agenda.png` | Minha Agenda — tabs Todos / Próximos / Histórico |

---

## postman-api/ — 12 prints (validados em 11/05/2026)

Fluxo completo: login admin → criar dados → login paciente (primeiro acesso) → LGPD → prescrição → check-in → histórico.

| # | Arquivo | Endpoint | Status | Evidência |
|---:|---|---|:---:|---|
| 1 | `01-admin-login-201-token.png` | `POST /api/auth/login` | 201 | Login admin@mayarpg.com → accessToken + role: ADMIN |
| 2 | `02-auth-me-200-admin.png` | `GET /api/auth/me` | 200 | Perfil do usuário autenticado (ADMIN) |
| 3 | `03-post-patients-201.png` | `POST /api/patients` | 201 | Criação de paciente "Paciente Print" |
| 4 | `04-post-exercises-201.png` | `POST /api/exercises` | 201 | Criação de exercício "Alongamento Cervical" |
| 5 | `05-patient-login-201-primeiro-acesso.png` | `POST /api/auth/login` | 201 | Login paciente (CPF como senha, isFirstAccess: true) |
| 6 | `06-auth-change-password-201.png` | `POST /api/auth/change-password` | 201 | "Senha alterada com sucesso" |
| 7 | `07-patient-login-201-token.png` | `POST /api/auth/login` | 201 | Login paciente com nova senha → token JWT |
| 8 | `08-accept-lgpd-201.png` | `POST /api/auth/accept-lgpd` | 201 | "Termo LGPD aceito" + lgpdAcceptedAt |
| 9 | `09-post-prescriptions-201.png` | `POST /api/prescriptions` | 201 | Prescrição "Entrega 2 - Teste" criada |
| 10 | `10-get-prescriptions-me-full-200.png` | `GET /api/prescriptions/me/full` | 200 | Plano completo do paciente com exercícios |
| 11 | `11-post-check-ins-201.png` | `POST /api/check-ins` | 201 | Check-in criado (painLevel: 3, notes: "Teste Entrega 2") |
| 12 | `12-get-check-ins-history-200.png` | `GET /api/check-ins/my-history` | 200 | Histórico retornando registros do paciente |

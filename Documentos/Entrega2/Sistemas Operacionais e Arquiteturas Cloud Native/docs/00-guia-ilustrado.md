# Guia Ilustrado de Demonstração — Entrega 2

> **Projeto:** Maya Fisioterapia/RPG · PI 3ADS FECAP 2026
> **Escopo individual:** Mobile Android + Cloud Native
> **Validado em:** 11/05/2026 — ambiente local containerizado

Este documento é um roteiro visual onde cada etapa é seguida imediatamente pela captura de tela do resultado real. Ideal para demonstração ao avaliador ou para reproduzir o ambiente do zero.

---

## Parte 1 — App Android

### 1.1 Build do aplicativo

```bash
# No diretório src/Entrega 2/mobile/
.\gradlew.bat :app:assembleDebug
```

**Resultado:** Android Studio — BUILD SUCCESSFUL em 31s, 37 tarefas executadas.

![Build assembleDebug — BUILD SUCCESSFUL](../../../../Imagens/mobile/01-build-android-studio-successful.png)

---

### 1.2 Splash screen

Ao abrir o app no dispositivo ou emulador:

![Splash screen — logo Maya Yamamoto RPG](../../../../Imagens/mobile/02-splash-bem-vindo.png)

---

### 1.3 Tela de Login

Login por e-mail ou CPF. No primeiro acesso, a senha padrão é o CPF (apenas números).

**Campos vazios:**

![Tela de login — campos vazios](../../../../Imagens/mobile/03-login-vazio.png)

**Campos preenchidos:**

![Tela de login — preenchida com credenciais](../../../../Imagens/mobile/04-login-preenchido.png)

---

### 1.4 Primeiro Acesso — criar nova senha

No primeiro acesso, o app exige a criação de uma senha pessoal:

![Primeiro Acesso — criar nova senha](../../../../Imagens/mobile/05-primeiro-acesso-criar-senha.png)

---

### 1.5 Aceite de LGPD

Exibido obrigatoriamente no primeiro acesso. O paciente lê os termos e confirma o aceite.

**Aguardando confirmação (checkbox desmarcado):**

![Termo de uso e LGPD — aguardando aceite](../../../../Imagens/mobile/06-lgpd-termo-aceitar.png)

**Aceite confirmado ("Salvando..."):**

![Termo de uso e LGPD — aceito, salvando](../../../../Imagens/mobile/07-lgpd-salvando.png)

---

### 1.6 Permissão de Notificações (FCM)

O Android exibe o diálogo nativo de permissão ao iniciar o app pela primeira vez:

![Diálogo de permissão FCM — "Allow Maya RPG to send you notifications?"](../../../../Imagens/mobile/08-fcm-permission-dialog.png)

---

### 1.7 Home — Dashboard do Paciente

Após o login, o paciente acessa o dashboard com sua evolução semanal, planos de exercícios e agenda:

![Home — Evolução Semanal, planos e agenda da semana](../../../../Imagens/mobile/09-home-dashboard.png)

---

### 1.8 Plano de Exercícios

Tela de listagem do plano prescrito pela profissional, com busca:

![Plano de Exercícios — lista](../../../../Imagens/mobile/11-plano-exercicios-lista.png)

---

### 1.9 Minha Evolução — Gráfico

Histórico de evolução do paciente com gráfico de Nível de Dor, Melhora e Frequência:

![Minha Evolução — gráfico nível de dor](../../../../Imagens/mobile/10-minha-evolucao-grafico.png)

---

### 1.10 Agendar Sessão — Calendário

O paciente pode agendar sessões diretamente pelo app:

![Agendar Sessão — calendário May 2026 e horários](../../../../Imagens/mobile/15-agendar-sessao-calendario.png)

---

### 1.11 Mensagens

Tela de mensagens/conversas com a equipe clínica:

![Mensagens — suas conversas](../../../../Imagens/mobile/16-mensagens.png)

---

### 1.12 Minha Agenda

Agenda pessoal com tabs Todos / Próximos / Histórico:

![Minha Agenda — tabs de agendamentos](../../../../Imagens/mobile/17-minha-agenda.png)

---

### 1.13 Configurações

Conta (Editar Perfil, Segurança, Privacidade, Excluir) e Preferências (Notificações, Idioma, Tema):

![Configurações — conta e preferências](../../../../Imagens/mobile/12-configuracoes.png)

**Confirmação de logout:**

![Confirmação de sair da conta](../../../../Imagens/mobile/13-configuracoes-sair-confirmacao.png)

---

### 1.14 Editar Perfil

Dados pessoais e configurações de saúde/notificações:

![Editar Perfil — dados pessoais e Minha Saúde](../../../../Imagens/mobile/14-editar-perfil.png)

---

## Parte 2 — API REST via Postman

Fluxo completo de demonstração: admin cria dados → paciente faz primeiro acesso → aceita LGPD → recebe prescrição → registra check-in → consulta histórico.

### 2.1 Login do Administrador

```
POST http://localhost:3000/api/auth/login
{
  "identifier": "admin@mayarpg.com",
  "password": "Admin123456"
}
```

**Resultado:** `201 Created` — accessToken JWT + role: ADMIN.

![POST /api/auth/login — admin, 201 Created + token](../../../../Imagens/postman-api/01-admin-login-201-token.png)

---

### 2.2 Verificar Usuário Autenticado

```
GET http://localhost:3000/api/auth/me
Authorization: Bearer <accessToken>
```

**Resultado:** `200 OK` — perfil completo do admin.

![GET /api/auth/me — 200 OK, role ADMIN](../../../../Imagens/postman-api/02-auth-me-200-admin.png)

---

### 2.3 Criar Paciente

```
POST http://localhost:3000/api/patients
{
  "fullName": "Paciente Print",
  "email": "paciente.print@teste.com",
  "cpf": "12345678901",
  "status": "ACTIVE"
}
```

**Resultado:** `201 Created` — paciente criado com ID.

![POST /api/patients — 201 Created](../../../../Imagens/postman-api/03-post-patients-201.png)

---

### 2.4 Criar Exercício

```
POST http://localhost:3000/api/exercises
{
  "title": "Alongamento Cervical",
  "description": "Exercício de alongamento para região cervical.",
  "category": "STRETCHING",
  "tags": ["RPG", "alongamento"]
}
```

**Resultado:** `201 Created` — exercício com ID, tags e timestamps.

![POST /api/exercises — 201 Created](../../../../Imagens/postman-api/04-post-exercises-201.png)

---

### 2.5 Login do Paciente (Primeiro Acesso)

```
POST http://localhost:3000/api/auth/login
{
  "identifier": "paciente.print@teste.com",
  "password": "12345678901"   // CPF como senha padrão
}
```

**Resultado:** `201 Created` — token retornado, `isFirstAccess: true`.

![POST /api/auth/login — paciente, primeiro acesso](../../../../Imagens/postman-api/05-patient-login-201-primeiro-acesso.png)

---

### 2.6 Trocar Senha no Primeiro Acesso

```
POST http://localhost:3000/api/auth/change-password
Authorization: Bearer <accessToken>
{
  "newPassword": "Paciente123456"
}
```

**Resultado:** `201 Created` — "Senha alterada com sucesso".

![POST /api/auth/change-password — 201 "Senha alterada com sucesso"](../../../../Imagens/postman-api/06-auth-change-password-201.png)

---

### 2.7 Login do Paciente com Nova Senha

```
POST http://localhost:3000/api/auth/login
{
  "identifier": "paciente.print@teste.com",
  "password": "Paciente123456"
}
```

**Resultado:** `201 Created` — novo accessToken, `isFirstAccess: false`.

![POST /api/auth/login — paciente, nova senha, token](../../../../Imagens/postman-api/07-patient-login-201-token.png)

---

### 2.8 Aceitar Termo de LGPD

```
POST http://localhost:3000/api/auth/accept-lgpd
Authorization: Bearer <accessToken do paciente>
```

**Resultado:** `201 Created` — "Termo LGPD aceito" + `lgpdAcceptedAt`.

![POST /api/auth/accept-lgpd — 201 "Termo LGPD aceito"](../../../../Imagens/postman-api/08-accept-lgpd-201.png)

---

### 2.9 Criar Prescrição de Exercícios

```
POST http://localhost:3000/api/prescriptions
Authorization: Bearer <accessToken admin/profissional>
{
  "title": "Prescrição Entrega 2 - Teste",
  "patientId": "<id do paciente>",
  "exercises": [{
    "exerciseId": "<id do exercício>",
    "sets": 3,
    "repetitions": 10,
    "frequency": "Diário"
  }],
  "startDate": "2026-05-11"
}
```

**Resultado:** `201 Created` — prescrição criada com ID e todos os dados.

![POST /api/prescriptions — 201 Created](../../../../Imagens/postman-api/09-post-prescriptions-201.png)

---

### 2.10 Consultar Plano Completo do Paciente

```
GET http://localhost:3000/api/prescriptions/me/full
Authorization: Bearer <accessToken do paciente>
```

**Resultado:** `200 OK` — plano completo com título, exercícios, séries e frequência.

![GET /api/prescriptions/me/full — 200 OK, plano completo](../../../../Imagens/postman-api/10-get-prescriptions-me-full-200.png)

---

### 2.11 Registrar Check-in

```
POST http://localhost:3000/api/check-ins
Authorization: Bearer <accessToken do paciente>
{
  "prescriptionId": "<id da prescrição>",
  "exerciseId": "<id do exercício>",
  "painLevel": 3,
  "notes": "Teste de check-in realizado pela documentação da Entrega 2.",
  "isCompleted": true,
  "executedAt": "2026-05-11T19:30:00.000Z"
}
```

**Resultado:** `201 Created` — check-in gravado com ID, patientId, painLevel e timestamps.

![POST /api/check-ins — 201 Created](../../../../Imagens/postman-api/11-post-check-ins-201.png)

---

### 2.12 Consultar Histórico de Check-ins

```
GET http://localhost:3000/api/check-ins/my-history
Authorization: Bearer <accessToken do paciente>
```

**Resultado:** `200 OK` — array com registros do paciente, incluindo dados da prescrição.

![GET /api/check-ins/my-history — 200 OK, histórico](../../../../Imagens/postman-api/12-get-check-ins-history-200.png)

---

## Parte 3 — Backend e Cloud Native

### 3.1 Configuração do ambiente (.env)

```bash
cp .env.example .env
# Editar com as variáveis reais (DB, JWT_SECRET, etc.)
```

![.env configurado com todas as variáveis](../../../../Imagens/cloud-native/01-env-configurado.png)

---

### 3.2 Qualidade de código — Lint

```bash
npm run lint
```

![npm run lint — sem erros](../../../../Imagens/cloud-native/02-npm-lint.png)

---

### 3.3 Build da aplicação

```bash
npm run build
```

![npm run build — nest build concluído](../../../../Imagens/cloud-native/03-npm-build.png)

---

### 3.4 Testes unitários

```bash
npm test -- --runInBand
```

**Resultado:** 6 suites, 23 testes, 100% PASS em 3.028s.

![npm test — 6 suites, 23/23 PASS](../../../../Imagens/cloud-native/04-npm-test-23-passing.png)

---

### 3.5 Validação do Docker Compose

```bash
docker compose config
```

**Bloco api:**

![docker compose config — bloco api](../../../../Imagens/cloud-native/05-docker-compose-config-api.png)

**Bloco db + rede + volume:**

![docker compose config — bloco db, rede, volume pg_data](../../../../Imagens/cloud-native/06-docker-compose-config-db.png)

---

### 3.6 Arquivos Docker no diretório

```bash
ls -la Dockerfile Dockerfile.db docker-compose.yml
```

![Arquivos Docker presentes no diretório](../../../../Imagens/cloud-native/07-arquivos-docker.png)

---

### 3.7 Build das imagens

```bash
docker compose build
```

![docker compose build — db + api concluídos](../../../../Imagens/cloud-native/08-docker-compose-build.png)

---

### 3.8 Subir os containers

```bash
docker compose up --build -d
```

**Containers iniciados como Healthy:**

![docker compose up — containers Healthy/Started](../../../../Imagens/cloud-native/09-docker-compose-up-healthy.png)

---

### 3.9 Verificar status dos containers

```bash
docker compose ps
```

**API e DB em execução e healthy:**

![docker compose ps — API e DB Up (healthy)](../../../../Imagens/cloud-native/10-docker-compose-ps.png)

---

### 3.10 Docker Desktop

Container `maya-rpg-api` em execução:

![Docker Desktop — container em execução](../../../../Imagens/cloud-native/11-docker-desktop-container.png)

Logs da API no Docker Desktop:

![Docker Desktop — logs da API](../../../../Imagens/cloud-native/12-docker-desktop-logs.png)

---

### 3.11 Swagger UI

Acesse em: `http://localhost:3000/api/docs`

![Swagger UI — todos os endpoints documentados](../../../../Imagens/cloud-native/13-swagger.png)

---

### 3.12 Volume persistente e healthcheck do banco

```bash
docker volume ls
docker exec maya-rpg-db pg_isready -U postgres
```

![Volume pg_data + pg_isready accepting connections](../../../../Imagens/cloud-native/14-volume-ls-pg-isready.png)

---

### 3.13 Bind mounts (uploads e logs)

```bash
docker exec maya-rpg-api ls -la /app/uploads /app/logs
```

![Bind mounts /app/uploads e /app/logs](../../../../Imagens/cloud-native/15-uploads-logs.png)

---

### 3.14 Script de backup do banco

```bash
./scripts/backup_db.sh
```

**Execução do script:**

![backup_db.sh executado](../../../../Imagens/cloud-native/16-backup-db-sh.png)

**Arquivo .sql gerado em `backups/`:**

![Arquivo backup_20260511_125410.sql gerado](../../../../Imagens/cloud-native/17-backup-arquivo-gerado.png)

---

### 3.15 Script de monitoramento

```bash
./scripts/monitor_system.sh
```

Coleta CPU, memória, disco e status dos containers:

![monitor_system.sh — métricas coletadas](../../../../Imagens/cloud-native/18-monitor-system-sh.png)

---

### 3.16 Script de gerenciamento de serviços

```bash
./scripts/manage_services.sh status
./scripts/manage_services.sh restart
```

![manage_services.sh — status e restart](../../../../Imagens/cloud-native/19-manage-services-sh.png)

---

### 3.17 Deploy automatizado

```bash
./scripts/deploy.sh
```

**Etapa inicial — tag de rollback + início do build:**

![deploy.sh — início, rollback tag](../../../../Imagens/cloud-native/20-deploy-sh-inicio.png)

**npm ci — parte 1:**

![deploy.sh — npm ci parte 1](../../../../Imagens/cloud-native/21-deploy-sh-npm-ci-1.png)

**npm ci — parte 2 (audit):**

![deploy.sh — npm ci parte 2](../../../../Imagens/cloud-native/22-deploy-sh-npm-ci-2.png)

**Exportação da imagem + backup pré-deploy:**

![deploy.sh — exportação da imagem e backup](../../../../Imagens/cloud-native/23-deploy-sh-build.png)

**Migrações aplicadas, containers healthy, deploy concluído:**

![deploy.sh — containers healthy, deploy OK](../../../../Imagens/cloud-native/24-deploy-sh-healthy.png)

---

### 3.18 Teste de carga com k6

```bash
k6 run test/load/load-test.js
```

Configuração: 3 stages, 20 VUs máx, 2m30s.
Thresholds: `p(95) < 500ms`, `http_req_failed < 1%`.

| Métrica | Valor | Threshold | Resultado |
|---|---|---|:---:|
| `http_req_duration` p(95) | **2.42 ms** | `< 500 ms` | ✅ |
| `http_req_failed` | **0.00%** | `< 1%` | ✅ |
| Checks succeeded | **5451 / 5451** | — | ✅ |
| Iterations | 1817 (15.07/s) | — | — |

![k6 load test — p95=2.42ms, 0% falha, 5451/5451 checks](../../../../Imagens/cloud-native/25-k6-load-test.png)

---

## Resumo de evidências

| Área | Prints | Status |
|---|:---:|:---:|
| Cloud Native (build, Docker, scripts, k6) | 25 | ✅ Completo |
| Mobile Android (fluxo do paciente) | 17 | ✅ Completo |
| API via Postman (fluxo completo) | 12 | ✅ Completo |
| **Total** | **54** | **✅** |

# Maya RPG API

Backend REST da solução Clínica Maya RPG para integrar o painel web profissional/admin, o aplicativo mobile do paciente e o banco de dados.

## Stack

- NestJS + TypeScript
- TypeORM + PostgreSQL
- JWT, refresh token e hash de senhas com bcrypt
- Guards globais de autenticação, perfis e rate limit
- Swagger em `/api/docs`

> Observação: a API mantida é a implementação NestJS em `src/*.ts`. O esqueleto Spring Boot/Maven legado foi removido para evitar duplicidade de stack e arquivos gerados versionados.

## Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

Para testar a entrega passo a passo e tirar prints, use o [guia de testes da entrega](guia-testes-entrega.md).

Validação local:

```bash
npm run build
npm test -- --runInBand
```

## Módulos Principais

- `auth`: login, refresh, logout, recuperação de senha, criação de staff e aceite LGPD.
- `patients`: CRUD de pacientes, vínculo com usuário paciente e status ativo/inativo/pendente.
- `exercises`: banco de exercícios com tags, mídia, vídeo e instruções.
- `prescriptions`: planos prescritos por paciente, com bloqueio se LGPD estiver pendente.
- `check-ins`: registro e sincronização de execuções pelo paciente.
- `exercise-executions`: alias REST para o web consultar histórico de check-ins por paciente.
- `medical-records`: prontuário eletrônico e histórico clínico.
- `users`: gestão admin de usuários profissionais/admins.
- `upload`: upload único e múltiplo de mídias.
- `dashboard`: indicadores simples e evolução de dor.
- `me/lgpd`: exportação e anonimização de dados do usuário autenticado.

## Contratos Usados Pelo Web E Mobile

### Autenticação

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/recover-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `GET /api/auth/lgpd-policy`
- `POST /api/auth/accept-lgpd`
- `PATCH /api/auth/fcm-token`

O aceite em `/auth/accept-lgpd` atualiza o usuário autenticado e, quando existir vínculo, sincroniza `Patient.lgpdConsentAt`.

### Pacientes, Prontuários E Prescrições

- `GET /api/patients?page=&pageSize=&search=&status=`
- `POST /api/patients`
- `PATCH /api/patients/:id`
- `GET /api/medical-records/patient/:patientId`
- `POST /api/medical-records`
- `GET /api/prescriptions/my`
- `GET /api/prescriptions/patient/:patientId`
- `POST /api/prescriptions`
- `PATCH /api/prescriptions/:id/deactivate`

Prescrições só podem ser criadas para pacientes com LGPD aceita.

### Exercícios E Execuções

- `GET /api/exercises`
- `GET /api/exercises/:id`
- `POST /api/check-ins`
- `POST /api/check-ins/sync`
- `GET /api/check-ins/my-history`
- `GET /api/exercise-executions/patient/:patientId?page=&pageSize=`

O app mobile deve enviar `prescriptionId`, `exerciseId`, `painLevel` de 0 a 10, `executedAt`, `notes` opcional e `isCompleted` opcional. A API valida se o exercício pertence à prescrição do paciente.

### Usuários E Uploads

- `GET /api/users?page=&pageSize=&role=&isActive=` somente `ADMIN`
- `PATCH /api/users/:id/status` somente `ADMIN`
- `POST /api/upload`
- `POST /api/upload/multiple`

Uploads aceitam imagens e vídeos comuns. O endpoint múltiplo retorna `{ urls: string[] }` para compatibilidade com o web.

## Dados Demo

Para criar dados reais de apresentação em ambiente de desenvolvimento:

```bash
SEED_DEMO_DATA=true npm run start:dev
```

Isso cria admin/profissional, pacientes, exercícios, prescrição, prontuário e check-ins demo quando ainda não existirem.

Antes de deploy em produção, aplique:

```bash
psql "$DATABASE_URL" -f scripts/migrations/2026-05-02_add_exercise_id_to_check_ins.sql
```

O roteiro completo está em [`final-demo-roteiro.md`](final-demo-roteiro.md).

O checklist de aderência ao PDF do Projeto Interdisciplinar está em [`pi-entrega-checklist.md`](pi-entrega-checklist.md).

## Segurança E LGPD

- Todas as rotas exigem JWT por padrão, exceto as marcadas como públicas.
- Senhas são armazenadas com hash.
- Dados sensíveis são filtrados em logs de exceção.
- O catálogo de exercícios requer usuário autenticado.
- `synchronize` do TypeORM fica ativo apenas fora de produção.
- `.env` é ignorado pelo Git; não versionar credenciais reais.

## Commits Sugeridos

- `test: fix dashboard service specs`
- `feat: add admin users management endpoints`
- `feat: expose exercise execution history endpoints`
- `fix: enforce lgpd consent rules in api`
- `feat: support multiple media uploads`
- `chore: harden api config and route access`
- `docs: document maya rpg api contracts`

## Infra / Scripts

Esta seção descreve os principais scripts em `scripts/` e exemplos de uso.

- Tornar scripts executáveis:

```bash
chmod +x scripts/*.sh
```

- Subir infraestrutura com Docker Compose:

```bash
cp .env.example .env    # editar .env com valores reais (não comitar)
docker compose build
docker compose up --build -d
docker compose ps
docker compose logs -f api
```

- Backup do banco (gera arquivo em `backups/`):

```bash
./scripts/backup_db.sh
```

- Monitor do sistema (exemplo: coleta a cada 5s por 30s):

```bash
./scripts/monitor_system.sh 5 30
```

- Gerenciamento de serviços (menu interativo ou comandos diretos):

```bash
./scripts/manage_services.sh up
./scripts/manage_services.sh down
./scripts/manage_services.sh status
./scripts/manage_services.sh logs
```

- Deploy automatizado:

```bash
./scripts/deploy.sh
# rollback
./scripts/deploy.sh --rollback
```

- Agendamento via cron (exemplo):

```cron
# Monitor a cada 5 minutos (append logs)
*/5 * * * * /path/to/workspace/maya-rpg-api/scripts/monitor_system.sh 5 30 >> /var/log/maya-rpg/monitor.log 2>&1

# Backup diario as 02:00
0 2 * * * cd /path/to/workspace/maya-rpg-api && ./scripts/backup_db.sh >> /var/log/maya-rpg/backup.log 2>&1
```

Lembre-se de ajustar caminhos, permissões e configurar o arquivo `.env` com variáveis sensíveis como `JWT_SECRET`, `DB_PASSWORD`, `DB_USER`, `DB_NAME` antes de subir os serviços.

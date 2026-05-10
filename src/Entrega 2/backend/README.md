<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

<br/>

# 🔧 Maya RPG API
### Backend REST da Clínica Maya

*Clínica Maya Yoshiko Yamamoto — PI 3ADS FECAP 2026*

</div>

---

## 📖 Sobre

Backend REST que integra o **painel web** (profissional/admin), o **aplicativo mobile** (paciente) e o **banco de dados** da Clínica Maya. Centraliza autenticação, dados clínicos, prescrições, check-ins e infraestrutura containerizada.

> A implementação mantida é a API NestJS em `src/*.ts`. O esqueleto Spring Boot/Maven foi removido para eliminar duplicidade de stack.

---

## 🛠️ Stack de Tecnologias

| Categoria | Tecnologia | Função |
|-----------|-----------|--------|
| ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) | NestJS + TypeScript | Framework e linguagem principal |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white) | TypeORM + PostgreSQL | ORM e banco de dados |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | JWT + bcrypt | Autenticação e hash de senhas |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) | Docker + Compose | Containerização e orquestração |
| 📖 | Swagger (`/api/docs`) | Documentação automática da API |
| 🛡️ | Guards + Rate Limiting | Segurança e controle de acesso |

---

## 🚀 Setup Local

```bash
npm install
cp .env.example .env    # preencher as variáveis necessárias
npm run start:dev
```

### Validação

```bash
npm run build
npm test -- --runInBand
```

> Validação realizada em **10/05/2026**:
> - `npm run build` → ✅ OK
> - `npm test -- --runInBand` → ✅ 6 suites · 23 testes
> - `docker compose config` → ✅ OK (serviços `api` e `db`, volume `pg_data`, healthchecks e variáveis resolvidas)

---

## 🧩 Módulos da API

| Módulo | Responsabilidade |
|--------|-----------------|
| `auth` | Login, refresh, logout, recuperação de senha, criação de staff e aceite LGPD |
| `patients` | CRUD de pacientes, vínculo com usuário e status ativo/inativo/pendente |
| `exercises` | Banco de exercícios com tags, mídia, vídeo e instruções |
| `prescriptions` | Planos prescritos por paciente (bloqueados se LGPD pendente) |
| `check-ins` | Registro e sincronização de execuções pelo app mobile |
| `exercise-executions` | Alias REST para o web consultar histórico de check-ins por paciente |
| `medical-records` | Prontuário eletrônico e histórico clínico |
| `users` | Gestão admin de usuários profissionais/admins |
| `upload` | Upload único e múltiplo de mídias |
| `dashboard` | Indicadores simples e evolução de dor |
| `me/lgpd` | Exportação e anonimização de dados do usuário autenticado |

---

## 🔗 Contratos REST

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/login` | Login com e-mail e senha |
| `POST` | `/api/auth/refresh` | Renova o access token |
| `POST` | `/api/auth/logout` | Encerra a sessão |
| `POST` | `/api/auth/recover-password` | Solicita recuperação de senha |
| `POST` | `/api/auth/reset-password` | Redefine a senha |
| `GET` | `/api/auth/me` | Dados do usuário autenticado |
| `GET` | `/api/auth/lgpd-policy` | Texto da política LGPD |
| `POST` | `/api/auth/accept-lgpd` | Registra aceite — sincroniza `Patient.lgpdConsentAt` |
| `PATCH` | `/api/auth/fcm-token` | Atualiza token FCM do dispositivo |

### Pacientes, Prontuários e Prescrições

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/patients` | Lista pacientes (`page`, `pageSize`, `search`, `status`) |
| `POST` | `/api/patients` | Cria paciente |
| `PATCH` | `/api/patients/:id` | Atualiza paciente |
| `GET` | `/api/medical-records/patient/:patientId` | Histórico clínico |
| `POST` | `/api/medical-records` | Cria entrada no prontuário |
| `GET` | `/api/prescriptions/my` | Prescrições do paciente autenticado |
| `GET` | `/api/prescriptions/patient/:patientId` | Prescrições por paciente (staff) |
| `POST` | `/api/prescriptions` | Cria prescrição (requer LGPD aceita) |
| `PATCH` | `/api/prescriptions/:id/deactivate` | Desativa uma prescrição |

### Exercícios, Check-ins e Execuções

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/exercises` | Lista exercícios |
| `GET` | `/api/exercises/:id` | Detalhe de um exercício |
| `POST` | `/api/check-ins` | Registra check-in (online) |
| `POST` | `/api/check-ins/sync` | Sincroniza check-ins offline (em lote) |
| `GET` | `/api/check-ins/my-history` | Histórico de check-ins do paciente |
| `GET` | `/api/exercise-executions/patient/:patientId` | Histórico por paciente (`page`, `pageSize`) |

**Payload esperado pelo mobile:**

```json
{
  "prescriptionId": "uuid-da-prescricao",
  "exerciseId":     "uuid-do-exercicio",
  "painLevel":      4,
  "executedAt":     "2026-05-02T12:00:00.000Z",
  "notes":          "Executei sem dor aguda",
  "isCompleted":    true
}
```

> A API valida se o exercício pertence à prescrição ativa do paciente.

### Usuários e Uploads

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/users` | Lista usuários — somente `ADMIN` |
| `PATCH` | `/api/users/:id/status` | Ativa/inativa usuário — somente `ADMIN` |
| `POST` | `/api/upload` | Upload único de mídia |
| `POST` | `/api/upload/multiple` | Upload múltiplo — retorna `{ urls: string[] }` |

---

## 🌱 Dados Demo

Para popular o banco com dados de demonstração em desenvolvimento:

```bash
SEED_DEMO_DATA=true npm run start:dev
```

Cria admin, profissional, pacientes, exercícios, prescrição, prontuário e check-ins de exemplo (apenas se ainda não existirem).

---

## 🐳 Docker e Infraestrutura

### Subir o ambiente containerizado

```bash
cp .env.example .env
docker compose build
docker compose up --build -d
docker compose ps               # verificar status dos containers
docker compose logs -f api      # acompanhar logs da API
```

### Arquitetura dos containers

```
┌─────────────────────────────────────────┐
│            docker-compose.yml           │
│                                         │
│  ┌──────────────┐    ┌───────────────┐  │
│  │   container  │    │   container   │  │
│  │     api      │───▶│      db       │  │
│  │  (NestJS)    │    │ (PostgreSQL)  │  │
│  │  porta 3000  │    │   porta 5432  │  │
│  └──────────────┘    └───────┬───────┘  │
│                              │          │
│                       ┌──────▼──────┐   │
│                       │  volume     │   │
│                       │  pg_data    │   │
│                       └─────────────┘   │
└─────────────────────────────────────────┘
```

### Scripts de automação

```bash
chmod +x scripts/*.sh
```

| Script | Função |
|--------|--------|
| `setup_env.sh` | Prepara o ambiente de desenvolvimento |
| `monitor_system.sh` | Monitora CPU, memória, disco e logs |
| `backup_db.sh` | Gera backup do banco (saída em `backups/`) |
| `manage_services.sh` | Inicia, para, consulta status e reinicia serviços |
| `deploy.sh` | Deploy automatizado com build, backup, migrações, healthcheck e rollback |

**Exemplos de uso:**

```bash
./scripts/manage_services.sh up
./scripts/manage_services.sh status
./scripts/backup_db.sh
./scripts/monitor_system.sh 5 30    # coleta a cada 5s por 30s
./scripts/deploy.sh
./scripts/deploy.sh --rollback
```

**Agendamento com cron:**

```cron
# Monitoramento a cada 5 minutos
*/5 * * * * /caminho/para/maya-rpg-api/scripts/monitor_system.sh 5 30 >> /var/log/maya-rpg/monitor.log 2>&1

# Backup diário às 02:00
0 2 * * * cd /caminho/para/maya-rpg-api && ./scripts/backup_db.sh >> /var/log/maya-rpg/backup.log 2>&1
```

### Migração necessária antes do deploy em produção

```bash
psql "$DATABASE_URL" -f scripts/migrations/2026-05-02_add_exercise_id_to_check_ins.sql
```

---

## ☁️ Aderência Cloud Native — Entrega 2

| Requisito | Artefato | Status |
|-----------|----------|:------:|
| Dockerfile da API | `Dockerfile` (Node 20 Alpine — build + runtime) | ✅ |
| Dockerfile do banco | `Dockerfile.db` (PostgreSQL 16 Alpine) | ✅ |
| Orquestração API + BD | `docker-compose.yml` com serviços `api` e `db` | ✅ |
| Volume persistente | Volume nomeado `pg_data` | ✅ |
| Variáveis de ambiente | `.env.example`, `.env` e bloco `environment` no Compose | ✅ |
| Script de deploy | `scripts/deploy.sh` | ✅ |
| Scripts Linux obrigatórios | `setup_env.sh`, `monitor_system.sh`, `backup_db.sh`, `manage_services.sh` | ✅ |

---

## 🔒 Segurança e LGPD

- Todas as rotas exigem JWT por padrão; exceções são marcadas explicitamente como públicas.
- Senhas armazenadas com hash (bcrypt).
- Dados sensíveis são filtrados nos logs de exceção.
- O catálogo de exercícios requer usuário autenticado.
- `synchronize` do TypeORM ativo **apenas fora de produção**.
- `.env` ignorado pelo Git — nunca versionar credenciais reais.
- Prescrições só podem ser criadas para pacientes com LGPD aceita.

---

## 📚 Documentação Adicional

| Documento | Link |
|-----------|------|
| 🎬 Roteiro de Demonstração | [ROTEIRO_DEMONSTRACAO.md](../../Documentos/Entrega2/ProgramacaoMobile/ROTEIRO_DEMONSTRACAO.md) |
| 📋 Requisitos Implementados | [REQUISITOS_IMPLEMENTADOS.md](../../Documentos/Entrega2/ProgramacaoMobile/REQUISITOS_IMPLEMENTADOS.md) |
| ☁️ Relatório Cloud Native | [RELATORIO_CLOUD_NATIVE.md](../../Documentos/Entrega2/SistemaOperacional/RELATORIO_CLOUD_NATIVE.md) |

---

<div align="center">

**Equipe TechCare** · FECAP — Centro Universitário · ADS 2026

</div>

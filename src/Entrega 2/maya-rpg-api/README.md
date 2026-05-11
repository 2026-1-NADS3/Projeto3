<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

<br/>

# Maya RPG API
### Backend REST da Clínica Maya

*Clínica Maya Yoshiko Yamamoto · PI 3ADS · FECAP 2026*

</div>

---

## Sobre

API REST em NestJS para gerenciamento clínico de RPG (Reeducação Postural Global). Atende o app Android (mobile) e o painel web, com autenticação JWT, LGPD, PostgreSQL e infraestrutura containerizada.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | NestJS (Node 20) |
| Linguagem | TypeScript |
| Banco | PostgreSQL 16 (TypeORM) |
| Auth | JWT + bcrypt + RBAC (Admin / Profissional / Paciente) |
| Containerização | Docker (multi-stage) + Docker Compose |
| Docs | Swagger em `/api/docs` |
| Testes | Jest (unitários) + Supertest (e2e) |
| Carga | k6 |

---

## Início Rápido

```bash
# 1. Configurar variáveis de ambiente
cp .env.example .env

# 2. Subir API + banco em containers
docker compose up --build -d

# 3. Verificar containers
docker compose ps
```

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
docker compose up --build -d
docker compose ps
```

Swagger disponível em `http://localhost:3000/api/docs`

---

## Módulos da API

| Módulo | Endpoints principais |
|--------|---------------------|
| `auth` | Login, refresh token, primeiro acesso, LGPD, troca de senha |
| `patients` | CRUD de pacientes |
| `exercises` | Banco de exercícios com mídia |
| `prescriptions` | Prescrição de planos por paciente |
| `check-ins` | Registro de execução com nível de dor + sync offline |
| `dashboard` | Indicadores e métricas clínicas |
| `medical-records` | Prontuário eletrônico |
| `appointments` | Agendamento de sessões |
| `users` | Gestão de usuários e perfis |
| `upload` | Upload de mídia (imagens/vídeos de exercícios) |
| `chat` | Mensagens entre profissional e paciente |
| `notifications` | Notificações internas |
| `payments` | Integração Mercado Pago (webhook) |

---

## Scripts de Infraestrutura

```bash
./scripts/setup_env.sh          # verifica dependências do ambiente
./scripts/monitor_system.sh     # CPU, memória, disco e status dos containers
./scripts/backup_db.sh          # pg_dump via docker exec → backups/
./scripts/manage_services.sh    # up | down | status | restart | logs | watch
./scripts/deploy.sh             # deploy automatizado com rollback
```

Migrações SQL em `scripts/migrations/`.

---

## Validação e Testes

```bash
npm run lint                    # ESLint — 0 erros
npm run build                   # TypeScript compile
npm test -- --runInBand         # 6 suites · 23 testes PASS
npm run test:e2e                # Testes de integração e2e
k6 run test/load/load-test.js   # Teste de carga
```

**Resultado real (11/05/2026):**

| Validação | Resultado |
|-----------|:---------:|
| `npm run lint` | ✅ 0 erros |
| `npm run build` | ✅ OK |
| `npm test -- --runInBand` | ✅ 23/23 PASS |
| `docker compose config` | ✅ OK |
| Containers healthy | ✅ API + DB |
| k6 p(95) | ✅ 2.42 ms (< 500 ms) |
| k6 taxa de falha | ✅ 0.00% (< 1%) |
| k6 checks | ✅ 5451/5451 |

---

## Infraestrutura Docker

```
┌─────────────────────────────────────────────────┐
│                  maya-network                   │
│                                                 │
│  ┌──────────────────┐   ┌─────────────────────┐ │
│  │   api (NestJS)   │   │    db (Postgres 16)  │ │
│  │  Node 20-alpine  │──▶│  postgres:16-alpine  │ │
│  │  usuário não-root│   │  pg_isready health   │ │
│  │  curl healthcheck│   │  volume: pg_data     │ │
│  └──────────────────┘   └─────────────────────┘ │
│       :3000                                     │
└─────────────────────────────────────────────────┘

Bind mounts: ./uploads:/app/uploads  ./logs:/app/logs
```

---

## Segurança

- JWT com refresh token e rotação por perfil
- bcrypt para senhas
- Guards/roles: `ADMIN`, `PROFESSIONAL`, `PATIENT`
- LGPD: aceite obrigatório antes de prescrições
- `.env` fora do Git — apenas `.env.example` versionado
- Dockerfile com usuário não-root (`appuser`)

---

## Evidências Visuais

25 prints em [`Imagens/cloud-native/`](../../../Imagens/cloud-native/) — validados em 11/05/2026.  
12 prints da API via Postman em [`Imagens/postman-api/`](../../../Imagens/postman-api/).

Guia ilustrado completo: [`docs/00-guia-ilustrado.md`](../../Documentos/Entrega2/Sistemas%20Operacionais%20e%20Arquiteturas%20Cloud%20Native/docs/00-guia-ilustrado.md)

---

<div align="center">

**Equipe TechCare** · FECAP — Centro Universitário · ADS 2026

</div>

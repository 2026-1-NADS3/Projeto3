<div align="center">

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Bash](https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnubash&logoColor=white)
![k6](https://img.shields.io/badge/k6-7D64FF?style=for-the-badge&logo=k6&logoColor=white)

<br/>

# Cloud Native — Entrega 2
### Sistemas Operacionais e Arquiteturas Cloud Native

*Clínica Maya Yoshiko Yamamoto · PI 3ADS · FECAP 2026*

</div>

---

## O que está nesta pasta

Artefatos da disciplina **Sistemas Operacionais e Arquiteturas Cloud Native** — infraestrutura containerizada da API Maya RPG:

```
Sistemas Operacionais e Arquiteturas Cloud Native/
│
├── Dockerfile              API NestJS (multi-stage, Node 20-alpine, não-root)
├── Dockerfile.db           PostgreSQL 16-alpine
├── docker-compose.yml      API + DB + rede + volume persistente + healthchecks
├── .env.example            Modelo de variáveis de ambiente
│
├── scripts/
│   ├── setup_env.sh        Verificação automatizada de dependências
│   ├── monitor_system.sh   CPU, memória, disco e status dos containers
│   ├── backup_db.sh        pg_dump via docker exec → backups/
│   ├── manage_services.sh  up | down | status | restart | logs | watch
│   ├── deploy.sh           Deploy automatizado com rollback
│   └── migrations/         Scripts SQL de migração
│
├── src/                    Código-fonte da API NestJS
├── test/                   Testes unitários, e2e e load (k6)
│
├── RELATORIO_CLOUD_NATIVE.md   Relatório técnico completo
└── docs/
    ├── 00-guia-ilustrado.md        Cada etapa + print real
    ├── 01-entrega-2-mobile-e-cloud.md  Visão geral e status consolidado
    ├── 02-cloud-native-e-automacao.md  Docker, Compose, volumes, scripts
    └── 03-testes-e-evidencias.md       Testes, k6 e índice de prints
```

---

## Execução Rápida

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

Swagger: `http://localhost:3000/api/docs`

---

## Scripts de Automação

```bash
./scripts/setup_env.sh              # verifica dependências
./scripts/monitor_system.sh 5 15   # coleta métricas a cada 5s por 15s
./scripts/backup_db.sh              # gera backup em backups/
./scripts/manage_services.sh status # status dos containers
./scripts/deploy.sh                 # deploy completo
./scripts/deploy.sh --rollback      # rollback para versão anterior
```

---

## Resultados de Validação

| Validação | Resultado |
|-----------|:---------:|
| `npm run lint` | ✅ 0 erros |
| `npm run build` | ✅ OK |
| `npm test -- --runInBand` | ✅ 23/23 PASS |
| `docker compose config` | ✅ OK |
| Containers healthy | ✅ API + DB |
| k6 p(95) | ✅ 2.42 ms |
| k6 taxa de falha | ✅ 0.00% |
| k6 checks | ✅ 5451/5451 |

Validado em **11/05/2026**. Evidências: 25 prints em [`Imagens/cloud-native/`](../../../Imagens/cloud-native/).

---

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [RELATORIO_CLOUD_NATIVE.md](RELATORIO_CLOUD_NATIVE.md) | Relatório técnico completo — Docker, scripts, conceitos Linux |
| [docs/00-guia-ilustrado.md](docs/00-guia-ilustrado.md) | Guia visual — cada comando seguido do print real |
| [docs/01-entrega-2-mobile-e-cloud.md](docs/01-entrega-2-mobile-e-cloud.md) | Visão geral da Entrega 2 (Mobile + Cloud Native) |
| [docs/02-cloud-native-e-automacao.md](docs/02-cloud-native-e-automacao.md) | Docker, Compose, volumes e scripts Bash |
| [docs/03-testes-e-evidencias.md](docs/03-testes-e-evidencias.md) | Testes unitários, e2e, k6 e índice dos 54 prints |

---

<div align="center">

**Equipe TechCare** · FECAP — Centro Universitário · ADS 2026

</div>

# Testes, Qualidade e Evidências da Entrega

> **Projeto:** Maya Fisioterapia/RPG
> **Objetivo:** apresentar comandos de validação, testes automatizados, teste de carga, prints e critérios de qualidade da Entrega 2.
> **Validação técnica:** 11/05/2026 — ambiente local containerizado
> **Evidências:** [`imagens-maya/`](../../../../imagens-maya/)

---

## 1. Objetivo do Documento

Reúne, num único lugar, tudo o que o avaliador precisa para verificar a entrega:

- comandos de instalação, build, lint;
- testes unitários e e2e;
- teste de carga com k6 (resultado real);
- teste de sistema/aceitação;
- critérios de qualidade conforme ISO/IEC 25010;
- índice de prints já anexados e lista do que ainda falta capturar.

---

## 2. Validação Rápida

Backend (na pasta com `package.json`):

```bash
npm install
npm run lint
npm run build
npm test -- --runInBand
npm run test:e2e
```

Backend via Docker:

```bash
docker compose config
docker compose up --build -d
docker compose ps
```

Teste de carga:

```bash
k6 run test/load/load-test.js
```

Mobile (em `src/Entrega 2/mobile/`):

```bash
./gradlew :app:assembleDebug
```

Windows:

```powershell
.\gradlew.bat :app:assembleDebug
```

---

## 3. Testes Unitários — resultado real

| Arquivo | Finalidade |
|---|---|
| `src/auth/auth.service.spec.ts` | Regras de autenticação |
| `src/patients/patients.service.spec.ts` | Regras de pacientes |
| `src/check-ins/check-ins.service.spec.ts` | Regras de check-in |
| `src/dashboard/dashboard.service.spec.ts` | Indicadores de dashboard |
| `src/common/lgpd/lgpd.service.spec.ts` | Funções de LGPD |
| `src/app.controller.spec.ts` | Controller raiz |

Comando:

```bash
npm test -- --runInBand
```

**Resultado obtido em 11/05/2026 (print `imagens-maya/cloud-native/04-npm-test-23-passing.png`):**

```text
Test Suites: 6 passed, 6 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        3.028 s
```

---

## 4. Testes de Integração / E2E

| Arquivo | Finalidade |
|---|---|
| `test/app.e2e-spec.ts` | Inicialização da aplicação e endpoint base |
| `test/dashboard.e2e-spec.ts` | Endpoints de dashboard |
| `test/acceptance.e2e-spec.ts` | Fluxo de aceitação |

Comando:

```bash
npm run test:e2e
```

Print recomendado: terminal com suítes passando, sem erros de conexão com o banco e tempo total visível. Pendente nesta entrega — usar o mesmo padrão do print `04-npm-test-23-passing.png`.

---

## 5. Teste de Carga com k6 — resultado real

Arquivo: `test/load/load-test.js`. Comando:

```bash
k6 run test/load/load-test.js
```

Configuração:

- 3 stages com graceful ramp-down;
- até 20 VUs;
- duração ≈ 2m30s;
- thresholds:
  - `http_req_duration: ['p(95)<500']`
  - `http_req_failed: ['rate<0.01']`

**Resultado obtido em 11/05/2026 (print `imagens-maya/cloud-native/25-k6-load-test.png`):**

| Métrica | Valor | Threshold | Resultado |
|---|---|---|---|
| `http_req_duration` p(95) | **2.42 ms** | `< 500 ms` | ✅ |
| `http_req_failed` | **0.00%** | `< 1%` | ✅ |
| Checks succeeded | **5451 / 5451 (100%)** | — | ✅ |
| Iterations | 1817 (15.07/s) | — | — |
| VUs máx | 20 | — | — |
| Data received | 6.5 MB (54 kB/s) | — | — |
| Data sent | 1.2 MB (10 kB/s) | — | — |

Cenários validados:

- `login responde 401 ou 429`
- `check-in responde 401, 403 ou 429`
- `historico responde 401, 403 ou 429`

> Os retornos 401/403 são esperados porque o teste de carga não envia token válido — o objetivo é medir o comportamento do gateway de autenticação sob carga.

### Relatório do teste de carga

| Campo | Valor |
|---|---|
| Data da execução | 11/05/2026 |
| Ambiente | Local — Windows 11 + Docker Desktop (API e DB containerizados) |
| Comando | `k6 run test/load/load-test.js` |
| Usuários virtuais (máx) | 20 |
| Duração | 2m30s (3 stages) |
| p(95) | 2.42 ms |
| Taxa de falha | 0.00% |
| Resultado | ✅ Aprovado em ambos os thresholds |
| Observações | Cenários validam o comportamento do gateway de autenticação sob carga (respostas 401/403/429 esperadas) |

---

## 6. Teste de Sistema / Aceitação

Arquivo: `test/acceptance.e2e-spec.ts`. Objetivos:

- validar fluxo integrado da API;
- verificar funcionamento conjunto das funcionalidades principais;
- gerar evidência de comportamento do sistema como um todo.

Fluxos demonstráveis no Swagger ou via Postman:

| Fluxo | Endpoint(s) | Evidência |
|---|---|---|
| Login | `POST /api/auth/login` | Print Swagger ou Postman retornando token JWT |
| Consulta de exercícios | `GET /api/exercises` | Print retornando lista |
| Check-in | `POST /api/check-ins` | Print do registro criado (status 201) |
| Histórico | `GET /api/check-ins/me` (ou similar) | Print retornando registros |
| Dashboard | `GET /api/dashboard/...` | Print dos indicadores |

Status atual: implementado no código (`test/acceptance.e2e-spec.ts`). Prints via Postman/Swagger são pendentes (Seção 9.3).

---

## 7. Qualidade de Software — ISO/IEC 25010

| Característica | Aplicação no projeto | Evidência |
|---|---|---|
| Adequação funcional | Endpoints e telas cobrem autenticação, pacientes, prescrições, check-ins, histórico e indicadores | `13-swagger.png` (Swagger expondo todos os grupos) |
| Eficiência de desempenho | Paginação, teste de carga com thresholds (p95 < 500ms) | `25-k6-load-test.png` (p95 = 2.42 ms) |
| Compatibilidade | API REST consumida por mobile e web | README mobile, `13-swagger.png` |
| Usabilidade | Swagger documenta a API; mobile tem fluxo direto para o paciente | `13-swagger.png`, README mobile |
| Confiabilidade | Healthchecks, Docker Compose, scripts de restart, testes automatizados | `09-`, `10-`, `19-manage-services-sh.png`, `04-npm-test-23-passing.png` |
| Segurança | JWT, bcrypt, guards/roles, LGPD, `.env` fora do Git | Código backend, `01-env-configurado.png` |
| Manutenibilidade | Organização por módulos NestJS, testes, lint | `02-npm-lint.png`, `03-npm-build.png` |
| Portabilidade | Dockerfile e Compose permitem execução em diferentes máquinas | Prints 05–10 |

Processo de qualidade aplicado:

```text
Requisitos → Implementação → Lint → Build → Testes → Docker → Carga → Evidências → Entrega
```

---

## 8. Guia de Prints — Backend / Cloud Native

Já anexados em `imagens-maya/cloud-native/` (25 prints validados em 11/05/2026):

| Nº | Evidência | Print |
|---:|---|---|
| 1 | `.env` configurado | `01-env-configurado.png` |
| 2 | Lint sem erro | `02-npm-lint.png` |
| 3 | Build concluído | `03-npm-build.png` |
| 4 | Testes unitários passando (23/23) | `04-npm-test-23-passing.png` |
| 5 | `docker compose config` (api) | `05-docker-compose-config-api.png` |
| 6 | `docker compose config` (db) | `06-docker-compose-config-db.png` |
| 7 | Arquivos Docker no diretório | `07-arquivos-docker.png` |
| 8 | `docker compose build` | `08-docker-compose-build.png` |
| 9 | `docker compose up -d` healthy | `09-docker-compose-up-healthy.png` |
| 10 | `docker compose ps` healthy | `10-docker-compose-ps.png` |
| 11 | Docker Desktop — container ativo | `11-docker-desktop-container.png` |
| 12 | Docker Desktop — logs da API | `12-docker-desktop-logs.png` |
| 13 | Swagger aberto | `13-swagger.png` |
| 14 | Volume `pg_data` + `pg_isready` | `14-volume-ls-pg-isready.png` |
| 15 | Bind mounts `/app/uploads` e `/app/logs` | `15-uploads-logs.png` |
| 16 | `backup_db.sh` executado | `16-backup-db-sh.png` |
| 17 | Arquivo `.sql` em `backups/` | `17-backup-arquivo-gerado.png` |
| 18 | `monitor_system.sh` rodando | `18-monitor-system-sh.png` |
| 19 | `manage_services.sh` status + restart | `19-manage-services-sh.png` |
| 20–24 | `deploy.sh` (5 etapas) | `20-` a `24-deploy-sh-*.png` |
| 25 | k6 load test | `25-k6-load-test.png` |

---

## 9. Prints pendentes

### 9.1 Backend / API — opcional

| Print sugerido | Comando para gerar |
|---|---|
| Testes e2e passando | `npm run test:e2e` (com print do terminal mostrando suites passando) |

### 9.2 Mobile — `imagens-maya/mobile/` (pendente)

| Print sugerido | Como gerar |
|---|---|
| `01-build-assembledebug.png` | `gradlew.bat :app:assembleDebug` → BUILD SUCCESSFUL |
| `02-tela-login.png` | App aberto na tela de login |
| `03-tela-lgpd.png` | Tela de aceite LGPD no primeiro acesso |
| `04-tela-exercicios.png` | Lista do plano de exercícios |
| `05-tela-detalhe-exercicio.png` | Detalhe (Fragment) |
| `06-tela-checkin.png` | Slider de dor 0–10 + observações |
| `07-tela-historico.png` | Histórico/evolução com gráfico |
| `08-notificacao-fcm.png` | Notificação push no dispositivo |

### 9.3 Postman / API client — `imagens-maya/postman-api/` (pendente)

| Print sugerido | Endpoint |
|---|---|
| `01-login-200.png` | `POST /api/auth/login` retornando token JWT |
| `02-me-200.png` | `GET /api/auth/me` autenticado |
| `03-exercises-200.png` | `GET /api/exercises` retornando lista |
| `04-checkin-201.png` | `POST /api/check-ins` criando registro |
| `05-dashboard-200.png` | `GET /api/dashboard/...` indicadores |

---

## 10. Checklist Final Antes de Entregar

```bash
git status --short
```

Não enviar:

```text
.env
node_modules/
dist/
logs/
uploads/
backups/
```

Devem estar presentes:

```text
Dockerfile
Dockerfile.db
docker-compose.yml
.env.example
scripts/*.sh
scripts/migrations/*.sql
RELATORIO_CLOUD_NATIVE.md
docs/01-entrega-2-mobile-e-cloud.md
docs/02-cloud-native-e-automacao.md
docs/03-testes-e-evidencias.md
imagens-maya/cloud-native/*.png (25 prints)
imagens-maya/README.md
```

---

## 11. Sugestão de Organização para Anexos

```text
imagens-maya/
├── cloud-native/           # 25 prints (já anexados)
│   ├── 01-env-configurado.png
│   ├── ...
│   └── 25-k6-load-test.png
├── mobile/                 # 8 prints sugeridos (pendente)
│   ├── 01-build-assembledebug.png
│   ├── ...
│   └── 08-notificacao-fcm.png
└── postman-api/            # 5 prints sugeridos (pendente)
    ├── 01-login-200.png
    ├── ...
    └── 05-dashboard-200.png
```

---

## 12. Conclusão

A entrega tem evidência real e mensurável da parte Cloud Native: 25 prints cobrindo build, testes unitários (23/23 PASS), Compose configurado, containers healthy, persistência via volume nomeado, scripts de automação executados e teste de carga com p95 de 2.42ms e 0% de falha. As pendências (prints do mobile e do Postman) estão listadas com a forma exata de gerá-las — basta executar os comandos da Seção 9 e salvar os PNGs nas pastas correspondentes.

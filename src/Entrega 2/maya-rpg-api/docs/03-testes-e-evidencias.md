# Testes, Qualidade e Evidências da Entrega

> **Projeto:** Maya Fisioterapia/RPG  
> **Objetivo:** orientar a validação da entrega por meio de comandos, testes automatizados, teste de carga, prints e critérios de qualidade.

---

## 1. Objetivo do Documento

Este documento serve como guia para validar a entrega antes do envio ao professor.

Ele reúne:

- comandos de instalação e build;
- testes unitários;
- testes de integração/e2e;
- teste de carga com k6;
- teste de sistema/aceitação;
- critérios de qualidade com base na ISO/IEC 25010;
- lista de prints recomendados para anexar.

---

## 2. Validação Rápida

No backend:

```bash
npm install
npm run lint
npm run build
npm test -- --runInBand
npm run test:e2e
```

Com Docker:

```bash
docker compose config
docker compose up --build -d
docker compose ps
```

Com k6, se instalado:

```bash
k6 run test/load/load-test.js
```

No mobile:

```bash
./gradlew :app:assembleDebug
```

No Windows:

```powershell
.\gradlew.bat :app:assembleDebug
```

---

## 3. Testes Unitários

Os testes unitários validam regras específicas da aplicação de forma isolada.

Comando:

```bash
npm test -- --runInBand
```

Exemplos de arquivos de teste:

| Arquivo | Finalidade |
|---|---|
| `src/auth/auth.service.spec.ts` | Valida regras de autenticação. |
| `src/patients/patients.service.spec.ts` | Valida regras de pacientes. |
| `src/check-ins/check-ins.service.spec.ts` | Valida check-ins de exercícios. |
| `src/dashboard/dashboard.service.spec.ts` | Valida indicadores do dashboard. |
| `src/common/lgpd/lgpd.service.spec.ts` | Valida funções relacionadas à LGPD. |

Resultado esperado, conforme validação anterior do projeto:

```text
Test Suites: 6 passed, 6 total
Tests: 23 passed, 23 total
```

> Ao anexar o print, use o resultado real obtido no seu terminal.

---

## 4. Testes de Integração/E2E

Os testes de integração/e2e validam o comportamento da API com mais componentes envolvidos.

Comando:

```bash
npm run test:e2e
```

Arquivos principais:

| Arquivo | Finalidade |
|---|---|
| `test/app.e2e-spec.ts` | Verifica inicialização da aplicação e endpoint base. |
| `test/dashboard.e2e-spec.ts` | Valida endpoints de dashboard. |
| `test/acceptance.e2e-spec.ts` | Simula fluxo de aceitação do sistema. |

Print recomendado:

- terminal com suites e testes passando;
- nenhum erro de conexão com banco;
- tempo total da execução visível.

---

## 5. Teste de Carga com k6

Arquivo principal:

```text
test/load/load-test.js
```

Comando:

```bash
k6 run test/load/load-test.js
```

O teste de carga avalia a resposta da API sob múltiplas requisições simuladas.

Critérios configurados:

```js
http_req_duration: ['p(95)<500']
http_req_failed: ['rate<0.01']
```

Observação importante:

> O relatório de carga deve ser preenchido somente com resultados reais obtidos após a execução. Não inserir métricas inventadas ou estimadas.

---

## 6. Plano de Execução do Teste de Carga

Antes de rodar:

```bash
docker compose up --build -d
docker compose ps
```

Depois executar:

```bash
k6 run test/load/load-test.js
```

Registrar no relatório:

| Campo | Preencher com |
|---|---|
| Data da execução | Data real do teste. |
| Ambiente | Local, Docker, Render ou outro. |
| Comando usado | Comando exato executado. |
| Usuários virtuais | Valor exibido/configurado pelo k6. |
| Duração | Tempo total do teste. |
| p95 | Valor final exibido pelo k6. |
| Taxa de falha | Valor final exibido pelo k6. |
| Resultado | Aprovado ou reprovado conforme thresholds. |
| Observações | Erros, limitações ou ajustes necessários. |

Modelo para preencher:

```text
Data da execução: ____/____/______
Ambiente: _________________________
Comando: k6 run test/load/load-test.js
Resultado geral: __________________
p95: ______________________________
Taxa de falha: _____________________
Observações: _______________________
```

---

## 7. Teste de Sistema/Aceitação

O teste de aceitação verifica se o sistema atende ao fluxo esperado pelo usuário final.

Arquivo:

```text
test/acceptance.e2e-spec.ts
```

Objetivos:

- validar fluxo integrado da API;
- verificar se funcionalidades principais funcionam em conjunto;
- fornecer evidência de comportamento do sistema como um todo.

Exemplos de fluxos que podem ser demonstrados:

| Fluxo | Evidência |
|---|---|
| Login | Token ou resposta de autenticação no Swagger/API. |
| Consulta de exercícios | Endpoint retornando lista ou detalhe. |
| Check-in de exercício | Registro criado com dor, observação e conclusão. |
| Histórico | Consulta retornando registros anteriores. |
| Dashboard/indicadores | Endpoint respondendo com dados agregados. |

---

## 8. Qualidade de Software — ISO/IEC 25010

A ISO/IEC 25010 define características de qualidade de produto de software. Abaixo está o mapeamento aplicado ao projeto.

| Característica | Aplicação no projeto |
|---|---|
| Adequação funcional | Endpoints e telas cobrem autenticação, pacientes, prescrições, check-ins, histórico e indicadores. |
| Eficiência de desempenho | Uso de paginação, teste de carga e thresholds no k6. |
| Compatibilidade | API REST consumida por mobile e web. |
| Usabilidade | Swagger facilita teste da API; mobile apresenta fluxo direto para o paciente. |
| Confiabilidade | Healthchecks, Docker Compose, scripts de restart e testes automatizados. |
| Segurança | JWT, bcrypt, guards/roles, LGPD e `.env` fora do Git. |
| Manutenibilidade | Organização por módulos, services, controllers, entities e testes. |
| Portabilidade | Dockerfile e Docker Compose permitem execução em diferentes máquinas. |

Processo de qualidade utilizado:

```text
Requisitos -> Implementação -> Lint -> Build -> Testes -> Docker -> Evidências -> Entrega
```

---

## 9. Guia de Prints para Anexar

### 9.1 Prints do Backend/API

| Nº | Evidência | Comando/Tela |
|---:|---|---|
| 1 | Instalação concluída | `npm install` |
| 2 | Lint sem erro bloqueante | `npm run lint` |
| 3 | Build concluído | `npm run build` |
| 4 | Testes unitários passando | `npm test -- --runInBand` |
| 5 | Testes e2e passando | `npm run test:e2e` |
| 6 | Swagger aberto | `http://localhost:3000/api/docs` |

---

### 9.2 Prints de Docker/Cloud Native

| Nº | Evidência | Comando/Tela |
|---:|---|---|
| 1 | Configuração do Compose válida | `docker compose config` |
| 2 | Build das imagens | `docker compose build` |
| 3 | Containers rodando | `docker compose ps` |
| 4 | Logs da API | `docker compose logs api --tail=80` |
| 5 | Banco saudável | `docker compose exec db pg_isready -U maya_user -d maya_rpg` |
| 6 | Volume persistente | `docker volume ls` |
| 7 | Backup criado | pasta `backups/` após `backup_db.sh` |
| 8 | Monitoramento gerado | pasta `logs/monitor/` após `monitor_system.sh` |

---

### 9.3 Prints do Mobile

| Nº | Evidência | Tela/Comando |
|---:|---|---|
| 1 | Build do aplicativo | `./gradlew :app:assembleDebug` |
| 2 | Tela de login | Aplicativo aberto. |
| 3 | Tela de exercícios/prescrições | Plano do paciente. |
| 4 | Tela de check-in | Registro de dor, observação e execução. |
| 5 | Histórico/evolução | Lista/gráfico de registros anteriores. |
| 6 | Integração com API | Dados reais carregados da API, se possível. |

---

### 9.4 Print do Teste de Carga

| Evidência | O que deve aparecer |
|---|---|
| Execução do k6 | Comando `k6 run test/load/load-test.js`. |
| Métricas finais | `http_req_duration`, `http_req_failed`, checks e thresholds. |
| Resultado | Se passou ou falhou, com base no terminal real. |

---

## 10. Checklist Final Antes de Entregar

Antes de anexar ou subir no GitHub, conferir:

```bash
git status --short
```

Arquivos que **não devem** ser enviados:

```text
.env
node_modules/
dist/
logs/
uploads/
backups/
```

Arquivos que devem estar presentes:

```text
Dockerfile
Dockerfile.db
docker-compose.yml
.env.example
scripts/*.sh
docs/01-entrega-2-mobile-e-cloud.md
docs/02-cloud-native-e-automacao.md
docs/03-testes-e-evidencias.md
```

---

## 11. Sugestão de Organização para Anexos

```text
anexos/
├── 01-mobile-build.png
├── 02-mobile-login.png
├── 03-mobile-exercicios.png
├── 04-mobile-checkin.png
├── 05-mobile-historico.png
├── 06-backend-build.png
├── 07-testes-unitarios.png
├── 08-testes-e2e.png
├── 09-docker-compose-ps.png
├── 10-swagger.png
├── 11-volume-postgres.png
├── 12-backup-db.png
├── 13-monitoramento.png
└── 14-k6-load-test.png
```

---

## 12. Conclusão

Com os testes, comandos e prints deste documento, a entrega fica mais fácil de verificar por qualquer pessoa, mesmo que ela não conheça previamente o projeto.

A validação deve priorizar evidências reais: terminal, containers em execução, Swagger aberto, aplicativo compilado e telas principais do fluxo mobile.

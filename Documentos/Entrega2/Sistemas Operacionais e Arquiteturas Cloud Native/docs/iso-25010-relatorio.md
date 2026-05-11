# Relatorio de Qualidade de Software - ISO/IEC 25010

## Maya RPG API — Aplicacao da Norma ISO/IEC 25010 no Processo de Desenvolvimento

### 1. Introducao

A norma ISO/IEC 25010 (SQuaRE — Software product Quality Requirements and Evaluation) define o modelo de qualidade de produto de software com oito caracteristicas principais. Este relatorio descreve como cada caracteristica e aplicada no desenvolvimento da API Maya RPG.

### 2. Caracteristicas de Qualidade e Aplicacao

#### 2.1 Adequacao Funcicional (Functional Suitability)
**Definicao**: Grau em que o produto oferece funcoes que atendem as necessidades declaradas e implicitas quando usadas em condicoes especificadas.

**Aplicacao no projeto**:
- Todos os requisitos funcionais foram implementados: gestao de pacientes, prescricoes, check-ins, prontuarios, agendamentos, chat e dashboard.
- O teste de aceitacao (`test/acceptance.spec.ts`) valida o fluxo completo do paciente, garantindo que o sistema atende ao cenario principal de uso.
- A cobertura de endpoints Swagger em `/api/docs` permite verificacao funcional continua.

#### 2.2 Eficiencia de Desempenho (Performance Efficiency)
**Definicao**: Grau em que o desempenho do software, em relacao ao uso de recursos, atende requisitos em condicoes especificadas.

**Aplicacao no projeto**:
- **Paginacao**: Todos os endpoints de listagem implementam paginacao (patients, exercises, prescriptions, check-ins, appointments, medical-records, chat, notifications) para evitar carregamento desnecessario de dados.
- **Teste de carga**: `test/load/k6-load-test.js` define thresholds de p95 < 500ms e taxa de falha < 1%.
- **Rate limiting**: `ThrottlerModule` com limite global de 60 req/min e limites especificos para login (5/min) e recuperacao de senha (3/min).
- **Query otimizada**: Pain evolution usa query com selecao de colunas especificas (`select`), evitando `SELECT *`.

#### 2.3 Compatibilidade (Compatibility)
**Definicao**: Grau em que o produto pode trocar informacoes com outros produtos e funcionar em ambientes especificados.

**Aplicacao no projeto**:
- **API REST padrao**: Contratos JSON com DTOs validados via `class-validator`.
- **CORS configuravel**: Via variavel de ambiente `CORS_ORIGINS`, suportando multiplas origens (web, mobile).
- **Containerizacao**: Docker e Docker Compose garantem reprodutibilidade entre ambientes de desenvolvimento, staging e producao.
- **Swagger/OpenAPI**: Documentacao automatica dos contratos em `/api/docs`.

#### 2.4 Usabilidade (Usability)
**Definicao**: Grau em que o produto pode ser compreendido, aprendido e operado por usuarios especificos.

**Aplicacao no projeto**:
- **Mensagens de erro claras**: Excecoes com mensagens em portugues acessivel ao profissional de saude.
- **Validacao de entrada**: `ValidationPipe` com `whitelist` e `forbidNonWhitelisted` garante feedback imediato sobre campos invalidos.
- **Documentacao interativa**: Swagger UI permite teste e exploracao da API sem conhecimento tecnico profundo.

#### 2.5 Confiabilidade (Reliability)
**Definicao**: Grau em que o produto mantem nivel especificado de desempenho quando usado em condicoes especificadas.

**Aplicacao no projeto**:
- **Health checks**: Docker Compose com health check no banco (`pg_isready`) e na API (`wget`), garantindo que dependencias estao prontas antes de iniciar servicos.
- **Restart automatico**: `restart: always` no Docker Compose e script `manage_services.sh` com watchdog que detecta falhas e reinicia servicos.
- **Deploy com rollback**: `deploy.sh` salva imagens anteriores e executa rollback automatico em caso de falha.
- **Backup automatico**: `backup_db.sh` com retencao configuravel e `deploy.sh` executa backup pre-deploy.
- **Audit logging**: `AuditInterceptor` global registra todas as requisicoes para rastreabilidade.

#### 2.6 Seguranca (Security)
**Definicao**: Grau em que o produto protege informacoes e dados de partes nao autorizadas.

**Aplicacao no projeto**:
- **Autenticacao robusta**: JWT com access token (15min) + refresh token rotativo (7 dias) com SHA-256 hash.
- **Senhas com hash**: bcrypt com salt rounds 10.
- **Guards globais**: `JwtAuthGuard` e `RolesGuard` (secure-by-default: nega acesso se sem `@Roles()`).
- **Rate limiting**: Protecao contra brute-force em login e recuperacao de senha.
- **LGPD**: Aceite obrigatorio, exportacao de dados, anonimizacao, bloqueio de prescricao sem consentimento.
- **Webhook HMAC**: Verificacao de assinatura do Mercado Pago.
- **Helmet**: Headers de seguranca HTTP aplicados globalmente.

#### 2.7 Manutenibilidade (Maintainability)
**Definicao**: Grau em que o produto pode ser modificado por mantenedores especificos.

**Aplicacao no projeto**:
- **Arquitetura em camadas**: Modulos NestJS com separacao controller/service/entity/DTO.
- **Guards e interceptors globais**: Reduzem codigo repetitivo e centralizam cross-cutting concerns.
- **Docker**: Ambiente reprodutivel elimina "works on my machine".
- **Migrations SQL**: Scripts versionados em `scripts/migrations/`.
- **Lint e formatacao**: ESLint + Prettier com configuracao padronizada.
- **Testes automatizados**: Unitarios e E2E facilitam refactoring seguro.

#### 2.8 Portabilidade (Portability)
**Definicao**: Grau em que o produto pode ser transferido de um ambiente para outro.

**Aplicacao no projeto**:
- **Containerizacao**: Dockerfile multi-stage com `node:20-alpine`, portavel para qualquer host com Docker.
- **Variaveis de ambiente**: Toda configuracao externa (banco, JWT, CORS, SMTP, FCM) via `.env`, sem hardcoded values.
- **Deploy scripts**: Automatizam o ciclo de build, deploy e rollback em qualquer ambiente.
- **PostgreSQL**: Banco padrao de mercado, suportado por todos os provedores cloud.

### 3. Processo de Qualidade

O processo de qualidade segue o ciclo:

```
Requisitos -> Implementacao -> Testes (unitarios + integracao + carga + aceitacao) -> Deploy (com health check e rollback) -> Monitoramento
```

- **Requisitos**: Mapeados no checklist `pi-entrega-checklist.md`.
- **Implementacao**: Code review e padroes de projeto (Guard, Interceptor, DTO).
- **Testes**: Unitarios (Jest), E2E (Supertest), Carga (k6), Aceitacao (fluxo completo).
- **Deploy**: Docker com health check e rollback automatico.
- **Monitoramento**: `monitor_system.sh` coleta metricas de CPU, memoria e disco.

### 4. Conclusao

A aplicacao da norma ISO/IEC 25010 no projeto Maya RPG garante que as decisoes arquiteturais e de implementacao sao rastreaveis para atributos de qualidade especificos. Cada caracteristica da norma e enderecada por mecanismos concretos no codigo, na infraestrutura e nos testes, demonstrando conformidade sistematica com boas praticas de engenharia de software.

# Checklist de Aderencia ao Projeto Interdisciplinar

Fonte: `PI_3ADS_202601_Maya_Fisioterapia_Versao1.pdf`

Este documento resume onde cada requisito da entrega aparece nos tres projetos Maya RPG.

## Fluxo Principal Validavel

1. Profissional/admin acessa o modulo web.
2. Profissional cadastra paciente e prontuario.
3. Paciente acessa o app mobile.
4. Paciente aceita termos/LGPD no primeiro acesso.
5. Profissional cadastra exercicios com midia e prescreve rotina.
6. Paciente visualiza o plano no app.
7. Paciente registra check-in por exercicio com dor de 0 a 10 e observacao.
8. App salva localmente em Room/SQLite e sincroniza com a API.
9. Web exibe historico/evolucao real do paciente.

## Mobile - Programacao Mobile

Projeto: `MayaRPG-mobile`

| Requisito | Situacao | Evidencia |
| --- | --- | --- |
| Duas ou mais telas | OK | `LoginActivity`, `HomeActivity`, `ExercisePlanActivity`, `ExerciseDetailActivity`, `EvolutionActivity`, `ProfileActivity` |
| Funcao principal Entrega 1: visualizar plano | OK | `ExercisePlanActivity`, `ExerciseListFragment`, `ExerciseDetailActivity` |
| Videos e/ou sequencia de imagens | OK | `ExerciseMediaActivity`, `ExerciseImagesAdapter`, modelo `Exercise` |
| Orientacoes e frequencia | OK | `Prescription.PrescriptionExercise`, cards de exercicios e detalhe |
| Multiplas Activities | OK | Declaradas no `AndroidManifest.xml` |
| Intents explicitas/implicitas | OK | Navegacao entre telas e `Intent.ACTION_VIEW` para video |
| Fragments | OK | `ExerciseListFragment` |
| ConstraintLayout | OK | Todas as telas principais em `app/src/main/res/layout/activity_*.xml` usam root `ConstraintLayout` |
| TextView, ImageView e Button | OK | Presentes nos layouts principais |
| API REST e JSON | OK | Retrofit/Gson em `ApiService` e `RetrofitClient` |
| Autenticacao | OK | Login, token Bearer, recuperacao e troca de senha |
| SQLite/cache local | OK | Room em `AppDatabase`, `CachedPrescription`, `ExerciseSession` |
| Check-in por exercicio | OK | `CheckInRequest.exerciseId`, `ExerciseDetailActivity`, `SyncWorker` |
| Nivel de dor 0 a 10 | OK | UI de dor e validacao antes do envio |
| Historico de evolucao | OK | `EvolutionActivity` consome API e cache local |
| Sincronizacao com backend | OK | `SyncWorker`, `/check-ins/sync` |
| Notificacoes/lembretes | OK | `ReminderWorker`, `NotificationHelper`, `MayaFirebaseMessagingService` |
| Identidade visual Maya | OK | Paleta, logos e assets em `res/drawable` e `res/values/colors.xml` |

Validacao:

```bash
cd MayaRPG-mobile
./gradlew :app:assembleDebug
```

## Web - Modulo Profissional/Admin

Projeto: `maya-rpg-web`

| Requisito | Situacao | Evidencia |
| --- | --- | --- |
| Gestao de pacientes CRUD | OK | `features/patients` |
| Busca, filtros e status | OK | `patient-list` |
| Prontuario eletronico | OK | `features/medical-records`, detalhe do paciente |
| Banco de exercicios | OK | `features/exercises` |
| Tags e midia | OK | formulario/listagem de exercicios e upload multiplo |
| Rotinas/planos e prescricoes | OK | `features/prescriptions` |
| Frequencia e orientacoes | OK | `prescription-form` |
| Painel de indicadores | OK | `features/dashboard` |
| Usuarios e permissoes | OK | `features/users`, guards de auth/role |
| LGPD no web | OK | status de consentimento e bloqueio de prescricao sem aceite |
| Integracao API real | OK | `environment.apiUrl` aponta para API Render |

Validacao:

```bash
cd maya-rpg-web
npm run build
npm test -- --watch=false
```

## API, Banco e Integracao

Projeto: `maya-rpg-api`

| Requisito | Situacao | Evidencia |
| --- | --- | --- |
| API REST | OK | NestJS controllers em `src/*/*.controller.ts` |
| Banco PostgreSQL | OK | TypeORM + `docker-compose.yml` |
| Autenticacao segura | OK | JWT, refresh token, guards globais |
| Senhas com hash | OK | bcrypt em `AuthService` |
| Controle por perfil | OK | `RolesGuard`, `UserRole` |
| Persistencia de dados | OK | TypeORM repositories/entities |
| Paginacao | OK | pacientes, exercicios, prescricoes, usuarios e execucoes |
| Check-ins/sync | OK | `check-ins`, `exercise-executions` |
| LGPD | OK | aceite, exportacao/anonimizacao e bloqueio de prescricao |
| Upload de midias | OK | `POST /upload`, `POST /upload/multiple` |
| Usuarios admin/profissional | OK | `users` module |
| Swagger | OK | `/api/docs` |
| Migration de producao | OK | `scripts/migrations/2026-05-02_add_exercise_id_to_check_ins.sql` |
| Dados demo | OK | `SEED_DEMO_DATA=true npm run start:dev` |

Validacao:

```bash
cd maya-rpg-api
npm run build
npm test -- --runInBand
npm run test:e2e
```

## Cloud Native

Projeto principal: `maya-rpg-api`

| Requisito | Situacao | Evidencia |
| --- | --- | --- |
| Dockerfile da API | OK | `Dockerfile` |
| Dockerfile do banco | OK | `Dockerfile.db` |
| Docker Compose API + BD | OK | `docker-compose.yml` |
| Variaveis de ambiente | OK | `.env.example` |
| Volume persistente | OK | `docker-compose.yml` |
| Script de setup | OK | `scripts/setup_env.sh` |
| Script de backup | OK | `scripts/backup_db.sh` |
| Script de gerenciamento | OK | `scripts/manage_services.sh` |
| Teste/carga | OK | `test/load/load-test.js`, `test/load/k6-load-test.js` |

Comandos:

```bash
cd maya-rpg-api
bash scripts/setup_env.sh
docker compose up -d
bash scripts/manage_services.sh
bash scripts/backup_db.sh
```

## Testes e Qualidade

| Requisito | Situacao | Evidencia |
| --- | --- | --- |
| 4 testes unitarios | OK | `dashboard.service.spec.ts`, `lgpd.service.spec.ts`, `app.controller.spec.ts` |
| 2 testes de integracao | OK | `test/app.e2e-spec.ts`, `test/dashboard.e2e-spec.ts` |
| Teste de carga | OK | `test/load/load-test.js`, `test/load/k6-load-test.js` |
| Teste de aceitacao | OK | roteiro em `final-demo-roteiro.md` |
| Qualidade ISO 25010 | Pendente documental | Criar relatorio curto em `DOCUMENTOS` para anexar na entrega |

## UX

Itens do PDF que devem existir como material de entrega, normalmente em `DOCUMENTOS` ou no Figma:

- Persona.
- Mapa de jornada.
- Minimo de 5 user stories.
- Wireframe de baixa fidelidade.
- HEART Framework com uma metrica para H, E, A, R e T.
- Prototipo de alta fidelidade com identidade visual.
- Banner e pitch de 4 minutos.

O codigo ja reflete a identidade visual, mas esses artefatos de UX devem ser enviados como documentos/prototipo para a avaliacao.

## Pontos de Atencao Antes do Push/Entrega

- Aplicar a migration em producao antes ou junto do deploy da API.
- Confirmar que `DATABASE_URL`, `JWT_SECRET` e demais variaveis estao configuradas no Render.
- Confirmar que o web publicado na Vercel aponta para `https://maya-rpg-api-1t7v.onrender.com/api`.
- Rodar o fluxo demo completo com dados reais antes da apresentacao.
- Manter credenciais reais fora do Git.

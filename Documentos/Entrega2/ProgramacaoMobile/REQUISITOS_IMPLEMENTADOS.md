
# Requisitos Implementados - Entrega 2

Este documento resume a aderência da solução aos requisitos consolidados do PI 3ADS 2026 da Clínica Maya.

## Categorias

### Escopo principal desta entrega:

- Mobile Android
- Cloud Native / Linux

### Contexto do projeto integrado:

- Web
- Backend/API funcional
- UX
- Testes/Qualidade
- Documento de extensão
- Pitch/Banner

> Observação: os itens listados em "Contexto do projeto integrado" fazem parte do conjunto integrado do projeto e são apresentados como apoio à demonstração; não removi ou alterei esses artefatos, apenas os categorizo como contexto quando não representam a responsabilidade individual direta.

## Legenda de status

- OK: requisito atendido e validado por evidência objetiva.
- Validado: requisito confirmado por build, teste, execução ou artefato verificável.
- Documentado: requisito descrito e vinculado aos artefatos do projeto.
- Parcial / melhoria futura: existe implementação parcial, dependência ou necessidade de refinamento.

## Mobile

| Requisito | Implementação | Evidência / arquivo | Status |
|---|---|---|---|
| Cadastro e autenticação | Login com JWT e recuperação de acesso | README do mobile e fluxos de autenticação | OK |
| Acesso ao plano de exercícios | Tela de plano consumindo dados reais da API | README do mobile | Validado |
| Exercícios com mídia | Suporte a vídeo e/ou sequência de imagens no plano | README do mobile | Documentado |
| Orientações e frequência | Exibição das instruções definidas pela profissional | Fluxo do plano de exercícios no mobile | Documentado |
| Registro de execução/check-in | Check-in por exercício com persistência local e sincronização | README do mobile e fluxo do app | OK |
| Nível de dor 0 a 10 | Slider de dor validado no fluxo do paciente | Status validado do mobile | OK |
| Observações | Campo de texto para observações do check-in | Fluxo de check-in e histórico | OK |
| Histórico/evolução | Tela de evolução com registros e acompanhamento | README do mobile | OK |
| Notificações/lembretes | FCM e ReminderWorker para avisos | Status validado do mobile | OK |
| Aceite LGPD | Tela real de consentimento e integração com o backend | `mobile/app/src/main/java/com/maya/rpg/ui/auth/LgpdConsentActivity.java` e `mobile/app/src/main/res/layout/activity_lgpd_consent.xml` | OK |
| Duas ou mais telas | Estrutura de navegação com várias telas | Status validado do mobile | OK |
| Múltiplas Activities | Estrutura com Activities distintas | Status validado do mobile | OK |
| Intents | Uso de Intents no fluxo do aplicativo | Status validado do mobile | OK |
| Fragments reais | Fragment real em ExercisePlanActivity | Status validado do mobile | OK |
| ConstraintLayout | Layouts baseados em ConstraintLayout | Status validado do mobile | OK |
| TextView, ImageView e Button | Componentes presentes na interface | Status validado do mobile | OK |
| SQLite/Room | Persistência local validada | Status validado do mobile | OK |
| JSON/Gson | Serialização e desserialização REST | Status validado do mobile | OK |
| API REST/Retrofit | Integração com o backend via Retrofit | README do mobile | OK |
| Gráfico/indicador | Visualização de evolução simples | Status validado do mobile | OK |

## Web

| Requisito | Implementação | Evidência / arquivo | Status |
|---|---|---|---|
| Gestão de pacientes | CRUD com busca, filtros e status | README do web | OK |
| Prontuário eletrônico | Observações clínicas e histórico por paciente | README do web | OK |
| Banco de exercícios | Título, descrição, tags e mídia | README do web | OK |
| Organização em rotinas/planos | Prescrições e estrutura de plano | README do web | Documentado |
| Prescrição de plano ao paciente | Associação de frequência e orientações | README do web | OK |
| Indicadores simples | Dashboard com métricas e visão geral | README do web | OK |
| Gestão de usuários e permissões | Perfis Admin e Profissional | README do web | OK |
| Integração com API | Consumo dos endpoints do backend | README do web e status validado | OK |
| Módulo complementar | Web mantido como painel do profissional/admin | Status validado do web | OK |

## Backend, API e Banco

| Requisito | Implementação | Evidência / arquivo | Status |
|---|---|---|---|
| Autenticação | JWT, refresh token e proteção por perfil | README da API | OK |
| Persistência | PostgreSQL com TypeORM | README da API e docker-compose.yml | OK |
| Integração mobile/web | Contratos REST para ambos os clientes | README da API | OK |
| Swagger | Documentação em /api/docs | README da API e status validado | OK |
| Dockerfile da API | Imagem do backend mantida | Status validado da API | OK |
| Dockerfile.db | Artefato acadêmico mantido | Status validado da API | OK |
| docker-compose.yml | API + DB com volume persistente | Status validado da API | OK |
| Scripts | Automação em Shell mantida | Pasta scripts da API | OK |

## Cloud Native e Linux

| Requisito | Implementação | Evidência / arquivo | Status |
|---|---|---|---|
| Scripts Shell e Bash | Setup, monitoramento, backup, gerenciamento e deploy | Pasta scripts da API | OK |
| Setup de ambiente | Automatização para ambiente de desenvolvimento | scripts/setup_env.sh | OK |
| Monitoramento | Monitoramento de sistema e logs | scripts/monitor_system.sh | OK |
| Backup | Backup do banco de desenvolvimento | scripts/backup_db.sh | OK |
| Gerenciamento de processos | Iniciar, parar, status e restart | scripts/manage_services.sh | OK |
| Deploy automatizado | Execução orientada por Docker | scripts/deploy.sh | OK |
| Pipes e redirecionamento | Documentado no relatório cloud native | `../SistemaOperacional/RELATORIO_CLOUD_NATIVE.md` | Documentado |
| Variáveis de ambiente | Uso de .env e .env.example | Status validado da API | OK |
| Cron jobs e permissões | Documentados como parte do relatório | `../SistemaOperacional/RELATORIO_CLOUD_NATIVE.md` | Documentado |
| Containerização | API e banco rodando em containers | docker-compose e validação validada | OK |
| Volume persistente | pg_data e volumes de uploads/logs | docker-compose.yml | OK |

## DevOps, Testes e Qualidade

| Requisito | Implementação | Evidência / arquivo | Status |
|---|---|---|---|
| Testes unitários | Base documental cobre 4 testes unitários | `../TesteQualidadeSoftware/Qualidade e Testes de Software (DevOps) - Grupo TechCare .pdf` | Documentado |
| Testes de integração | Base documental cobre 2 testes de integração | `../TesteQualidadeSoftware/Qualidade e Testes de Software (DevOps) - Grupo TechCare .pdf` | Documentado |
| Teste de carga | load-test.js mantido como evidência | Status validado da API | OK |
| Teste de aceitação | Teste de aceitação documentado com roteiro manual do fluxo principal | `../TesteQualidadeSoftware/Qualidade e Testes de Software (DevOps) - Grupo TechCare .pdf` | Documentado |
| Processo de qualidade | Documentado com ISO/IEC 25010 | `../TesteQualidadeSoftware/Qualidade e Testes de Software (DevOps) - Grupo TechCare .pdf` | Documentado |
| Build e validação | Backend, mobile e web validados | Status geral da entrega | Validado |

## UX da Entrega 2

| Requisito | Implementação | Evidência / arquivo | Status |
|---|---|---|---|
| HEART Framework | Métricas para H, E, A, R e T | `../UserExperienceDigital/Relátorio da Segunda Entrega UX.pdf` | Documentado |
| Protótipo de alta fidelidade | Interface planejada para mobile e web | `../UserExperienceDigital/Relátorio da Segunda Entrega UX.pdf` | Documentado |
| Identidade visual | Aplicação da identidade da Clínica Maya | README do web e README do mobile | OK |
| Componentes consistentes | Estrutura visual coerente entre telas | Documentação UX | OK |
| Navegação funcional | Fluxos de navegação dos módulos | README do mobile e README do web | OK |
| Relação com a Entrega 1 | Evolução da base anterior | `../UserExperienceDigital/Relátorio da Segunda Entrega UX.pdf` | Documentado |

## Banner e Pitch

| Requisito | Implementação | Evidência / arquivo | Status |
|---|---|---|---|
| Banner | Roteiro e suporte de apresentação | `../../Banner/Banner_FECAP_ADS3_TECHCARE.pptx.pdf` | Documentado |
| Pitch de 4 minutos | Estrutura de fala objetiva e cronológica | `ROTEIRO_DEMONSTRACAO.md` | OK |
| Critérios de apresentação | Criatividade, impacto social, tempo e embasamento | `../../Banner/Banner_FECAP_ADS3_TECHCARE.pptx.pdf` | Documentado |

## Observações finais

- O requisito de integração entre mobile, web e backend está atendido por contratos REST e pelos testes validados.
- O web permanece como módulo complementar.
- A documentação final deve refletir apenas o que foi validado no projeto.

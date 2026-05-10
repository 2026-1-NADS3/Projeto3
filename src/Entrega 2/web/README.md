# Maya RPG Web — Painel do Profissional

Sistema web para acompanhamento de pacientes de Reeducação Postural Global (RPG) da Clínica Maya Yoshiko Yamamoto.

## Projeto Interdisciplinar — FECAP 3º Semestre ADS 2026

### Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Roteamento:** TanStack Router
- **Estado e dados:** TanStack Query + services HTTP com Axios
- **Interface:** Tailwind CSS 4, Radix UI e componentes reutilizáveis em `src/components`
- **Backend:** API REST NestJS (`maya-rpg-api`)
- **Banco de Dados:** PostgreSQL

### Pré-requisitos

- Node.js 22+
- npm 10+

### Setup

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd maya-rpg-web

# 2. Instale as dependências
npm install

# 3. Rode o backend local em http://localhost:3000/api
# Consulte o README do repositório maya-rpg-api

# 4. Rode o servidor de desenvolvimento
npm run dev

# 5. Acesse no navegador
# http://localhost:5173
```

Por padrão, `src/lib/env.ts` usa `http://localhost:3000/api` em desenvolvimento.
Em build de produção, o web aponta para a API hospedada no Render.

### Extensões VS Code recomendadas

Ao abrir o projeto no VS Code, ele vai sugerir automaticamente as extensões. Aceite a instalação de todas:

- Prettier
- ESLint
- GitLens
- EditorConfig
- Code Spell Checker (PT-BR)

### Estrutura de pastas

```text
src/
├── components/            # Shell da aplicação e componentes de UI
│   └── ui/                # Componentes base reutilizáveis
├── contexts/              # Contextos React, incluindo autenticação
├── hooks/                 # Hooks compartilhados
├── lib/                   # Utilitários, ambiente e helpers de formulário
├── routes/                # Rotas TanStack Router
│   ├── auth/              # Login, cadastro e recuperação de senha
│   ├── pacientes*         # CRUD e detalhe de pacientes
│   ├── exercicios*        # Banco de exercícios
│   ├── prescricoes*       # Prescrições por paciente
│   ├── prontuarios        # Prontuário eletrônico
│   ├── agenda             # Agenda complementar
│   └── usuarios           # Gestão de usuários
├── services/              # Integração com API REST
├── types/                 # Tipos, entidades e enums do domínio
├── main.tsx               # Entrada React
└── router.tsx             # Configuração do roteador
```

### Padrões do projeto

- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`)
- **Branches:** `main` (produção), `develop` (integração), `feature/*` (funcionalidades)
- **Código:** componentes React, rotas por arquivo e services concretos para API REST

### Fluxo de Dados

O fluxo principal agora é simples:

```text
Rotas e componentes -> services em src/services -> ApiService/Axios -> API REST
```

Não há mais `InjectionToken` ou interfaces de repository para recursos com uma única implementação. Isso reduz indireção sem remover a separação entre telas, tipos compartilhados e acesso HTTP.

### Dados Reais e Fallbacks

- Dados clínicos e operacionais principais vêm da API REST: pacientes, prontuários, exercícios, prescrições, execuções/check-ins, dashboard e usuários.
- Preferências de interface, como tema e informações locais de configuração, continuam em `localStorage`.
- Agenda/consultas não usam mais fallback silencioso em `localStorage`; se a API falhar, a tela mostra erro para evitar confundir dado local com dado persistido.
- Fontes externas do Google não são baixadas no build. O app usa uma pilha segura de fontes do sistema para manter `npm run build` funcionando offline/CI.

### Git Flow

```bash
# Criar branch develop
git checkout -b develop

# Criar feature branch
git checkout -b feature/nome-da-feature develop

# Ao finalizar, merge na develop
git checkout develop
git merge feature/nome-da-feature
```

### Cronograma (alinhado ao PI)

| Semanas | Entrega                           |
| ------- | --------------------------------- |
| 1-2     | Scaffold + Core + Design system   |
| 3-4     | Auth + CRUD Pacientes             |
| 5-6     | Banco de Exercícios + Prescrições |
| 7-8     | Prontuário + Dashboard            |
| 9-10    | Integração com API + testes       |
| 11-12   | Ajustes de UX + documentação      |
| 13      | Entrega final + apresentação      |

## Alinhamento com o Projeto Interdisciplinar

Este repositório representa o **Módulo Web — Profissional/Admin** da solução Clínica Maya RPG. O aplicativo Android/mobile do paciente e o backend/API são projetos separados.

### Cobertura do módulo web

| Requisito do PDF                                                   | Implementação no web                                                        | Status                                  |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------- | --------------------------------------- |
| Gestão de pacientes com CRUD, busca, filtros e status              | `src/routes/pacientes*` + `patientService`                                  | Completo                                |
| Prontuário eletrônico com observações e histórico por paciente     | `src/routes/prontuarios.tsx` + detalhe do paciente                          | Completo                                |
| Banco de exercícios com título, descrição, tags e mídia            | `src/routes/exercicios*` + `mediaService`                                   | Completo                                |
| Prescrição de exercícios por paciente com frequência e orientações | `src/routes/prescricoes*` + `prescriptionService`                           | Completo                                |
| Painel de acompanhamento com indicadores simples                   | `src/routes/index.tsx` + `dashboardService`                                 | Completo, depende da API                |
| Gestão de usuários e permissões Admin/Profissional                 | `src/routes/usuarios.tsx` + controles de autenticação                       | Completo, depende da API                |
| LGPD/consentimento antes de prescrição                             | Bloqueio em detalhe do paciente e formulário de prescrição                  | Completo                                |
| Rotinas/planos organizados                                         | Prescrição agrupa exercícios e parâmetros do plano                          | Parcial, sem entidade própria de rotina |
| Avaliação funcional                                                | Campos clínicos no prontuário: dor, mobilidade, postura e plano terapêutico | Parcial, sem tela dedicada              |
| Agenda/lembretes                                                   | `src/routes/agenda.tsx` e endpoints de consultas                            | Opcional/Extensão                       |

### Contratos REST integrados

Além dos endpoints já consumidos por autenticação, pacientes, exercícios, prescrições, prontuários e dashboard, o web usa estes contratos alinhados com a API:

| Recurso                     | Endpoint                                                         | Uso no web                                                                         |
| --------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Execuções/check-ins         | `GET /exercise-executions/patient/:patientId?page=1&pageSize=20` | Histórico de exercícios executados, dor e observações na aba Evolução do paciente. |
| Desativar prescrição        | `PATCH /prescriptions/:id/deactivate`                            | Encerrar plano ativo para que o paciente não veja mais no app.                     |
| Listar usuários             | `GET /users?page=1&pageSize=50`                                  | Gestão administrativa de profissionais e admins.                                   |
| Status de usuário           | `PATCH /users/:id/status`                                        | Ativar/inativar usuário staff.                                                     |
| Consultas/agenda (opcional) | `GET /appointments?startDate=&endDate=`                          | Exibição complementar no dashboard e calendário quando a API disponibiliza agenda. |
| Criar consulta (opcional)   | `POST /appointments`                                             | Agenda semanal do painel profissional.                                             |
| Satisfação (opcional)       | `GET /appointments/satisfaction`                                 | Indicador simples complementar quando houver avaliações de atendimento.            |

### Integração ponta a ponta

- **Mobile Android:** consome prescrições reais, salva check-ins por exercício no Room e sincroniza com `/check-ins/sync`.
- **Backend/API:** protege rotas por JWT/perfil, persiste dados clínicos, aplica LGPD e expõe `/exercise-executions/patient/:patientId`.
- **Web:** mostra prescrições, bloqueia plano sem LGPD e exibe evolução/check-ins reais na aba do paciente.

Para dados demo, rode a API com `SEED_DEMO_DATA=true` e consulte o roteiro em `../../Documentos/Entrega2/ProgramacaoMobile/ROTEIRO_DEMONSTRACAO.md`.

### Validação local

```bash
npm run build
npm run lint
```

Validações esperadas:

- build de produção pelo Vite.
- lint com ESLint/Prettier.
- integração com os contratos REST do backend.

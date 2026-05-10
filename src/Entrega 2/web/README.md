<div align="center">

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

<br/>

# 🌐 Maya RPG Web
### Painel do Profissional e Admin

*Clínica Maya Yoshiko Yamamoto — PI 3ADS FECAP 2026*

</div>

---

## 📖 Sobre

Painel web para acompanhamento de pacientes de **Reeducação Postural Global (RPG)** da Clínica Maya Yoshiko Yamamoto.

> Este módulo é o **painel do profissional/admin**. O app mobile do paciente e o backend API estão em módulos separados.

---

## 🛠️ Stack de Tecnologias

| Categoria | Tecnologia | Função |
|-----------|-----------|--------|
| ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black) | React 19 + TypeScript | Framework frontend e linguagem |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Vite | Build tool e servidor de desenvolvimento |
| 🔀 | TanStack Router | Roteamento tipado |
| 🔄 | TanStack Query | Cache e sincronização de dados com a API |
| ![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Tailwind CSS 4 + Radix UI | Estilização e componentes acessíveis |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | Axios | Camada HTTP para consumo da API REST |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white) | PostgreSQL (via API) | Banco de dados |

---

## 📋 Pré-requisitos

- Node.js 22+
- npm 10+
- Backend rodando em `http://localhost:3000/api` (veja o [README da API](../backend/README.md))

---

## 🚀 Setup

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd maya-rpg-web

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
# Acesse http://localhost:5173
```

Em desenvolvimento, `src/lib/env.ts` aponta para `http://localhost:3000/api`.  
Em produção, o web aponta para a API hospedada no Render.

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | Verificação de padronização |

> Validação em **10/05/2026**: `npm run build` OK · `npm run lint` OK (0 erros, 8 avisos de Fast Refresh).
>
> ⚠️ O build emitiu aviso de bundle acima de 500 kB — melhoria futura com code splitting, sem impacto na entrega.

---

## 📂 Estrutura de Pastas

```
src/
│
├── 📁 components/         # Shell da aplicação e componentes de UI
│   └── 📁 ui/             # Componentes base reutilizáveis
│
├── 📁 contexts/           # Contextos React (autenticação, etc.)
├── 📁 hooks/              # Hooks compartilhados
├── 📁 lib/                # Utilitários, env e helpers de formulário
│
├── 📁 routes/
│   ├── 📁 auth/           # Login, cadastro e recuperação de senha
│   ├── 📁 pacientes*/     # CRUD e detalhe de pacientes
│   ├── 📁 exercicios*/    # Banco de exercícios
│   ├── 📁 prescricoes*/   # Prescrições por paciente
│   ├── 📁 prontuarios/    # Prontuário eletrônico
│   ├── 📁 agenda/         # Agenda (complementar)
│   └── 📁 usuarios/       # Gestão de usuários
│
├── 📁 services/           # Integração com a API REST
├── 📁 types/              # Tipos, entidades e enums do domínio
├── main.tsx               # Entrada React
└── router.tsx             # Configuração do roteador
```

---

## ✅ Funcionalidades Implementadas

| Funcionalidade | Implementação | Status |
|----------------|--------------|:------:|
| Gestão de pacientes (CRUD, busca, filtros, status) | `routes/pacientes*` + `patientService` | ✅ |
| Prontuário eletrônico com histórico | `routes/prontuarios.tsx` + detalhe do paciente | ✅ |
| Banco de exercícios (título, descrição, tags, mídia) | `routes/exercicios*` + `mediaService` | ✅ |
| Prescrição de exercícios por paciente | `routes/prescricoes*` + `prescriptionService` | ✅ |
| Painel com indicadores | `routes/index.tsx` + `dashboardService` | ✅ |
| Gestão de usuários e permissões (Admin/Profissional) | `routes/usuarios.tsx` + controles de auth | ✅ |
| Bloqueio LGPD antes de prescrição | Detalhe do paciente + formulário de prescrição | ✅ |
| Histórico de check-ins na aba Evolução | `GET /exercise-executions/patient/:patientId` | ✅ |
| Desativar prescrição ativa | `PATCH /prescriptions/:id/deactivate` | ✅ |
| Agenda/lembretes | `routes/agenda.tsx` | 🔄 Opcional |
| Avaliação funcional dedicada | Campos no prontuário | 🔄 Parcial |
| Rotinas como entidade própria | Via prescrição | 🔄 Parcial |

---

## 🔄 Fluxo de Dados

```
Rotas / Componentes
       │
       ▼
 src/services/          ◀── TanStack Query (cache + refetch)
       │
       ▼
   Axios (HTTP)
       │
       ▼
   API REST (NestJS)    ──▶  PostgreSQL
```

Não há camada de repositórios ou `InjectionToken` para recursos com uma única implementação — menos indireção, sem perder separação de responsabilidades.

### Fontes de dados e fallbacks

- **Dados clínicos:** sempre da API REST (pacientes, prontuários, exercícios, prescrições, check-ins, dashboard, usuários).
- **Preferências de UI:** `localStorage` (tema, configurações locais).
- **Agenda:** exibe erro explícito se a API falhar — sem fallback silencioso.
- **Fontes:** pilha de fontes do sistema (sem download do Google Fonts), garantindo build offline e em CI.

---

## 🔗 Integração Ponta a Ponta

```
┌──────────────────────────────────────────────────────────┐
│                    SOLUÇÃO INTEGRADA                     │
│                                                          │
│  📱 Mobile Android                                       │
│  └── Consome prescrições reais                           │
│  └── Salva check-ins no Room (offline)                   │
│  └── Sincroniza com /check-ins/sync                      │
│                   │                                      │
│                   ▼                                      │
│  🔧 Backend / API (NestJS)                               │
│  └── Protege rotas por JWT e perfil                      │
│  └── Persiste dados clínicos no PostgreSQL               │
│  └── Aplica regras de LGPD                               │
│  └── Expõe /exercise-executions/patient/:id              │
│                   │                                      │
│                   ▼                                      │
│  🌐 Web (este módulo)                                    │
│  └── Exibe prescrições e dados do paciente               │
│  └── Bloqueia plano sem LGPD aceita                      │
│  └── Mostra evolução e check-ins reais na aba Evolução   │
└──────────────────────────────────────────────────────────┘
```

Para dados demo, inicie a API com `SEED_DEMO_DATA=true`.

---

## 🔀 Git Flow

```bash
# Branch de integração
git checkout -b develop

# Feature branch
git checkout -b feature/nome-da-feature develop

# Merge ao finalizar
git checkout develop
git merge feature/nome-da-feature
```

**Padrão de commits:** Conventional Commits — `feat:`, `fix:`, `docs:`, `refactor:`, `test:`

---

## 💻 Extensões Recomendadas (VS Code)

O projeto inclui configuração de extensões recomendadas. Ao abrir no VS Code, aceite a instalação de:

- **Prettier** — formatação automática
- **ESLint** — análise estática
- **GitLens** — histórico e blame inline
- **EditorConfig** — consistência de estilo
- **Code Spell Checker (PT-BR)** — correção ortográfica

---

## 📚 Documentação Adicional

| Documento | Link |
|-----------|------|
| 📋 Requisitos Implementados | [REQUISITOS_IMPLEMENTADOS.md](../../Documentos/Entrega2/ProgramacaoMobile/REQUISITOS_IMPLEMENTADOS.md) |
| 🎬 Roteiro de Demonstração | [ROTEIRO_DEMONSTRACAO.md](../../Documentos/Entrega2/ProgramacaoMobile/ROTEIRO_DEMONSTRACAO.md) |

---

<div align="center">

**Equipe TechCare** · FECAP — Centro Universitário · ADS 2026

</div>

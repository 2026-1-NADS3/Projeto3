<div align="center">

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TanStack](https://img.shields.io/badge/TanStack-FF4154?style=for-the-badge&logoColor=white)

<br/>

# Maya RPG Web
### Painel do Profissional e Admin

*Clínica Maya Yoshiko Yamamoto · PI 3ADS · FECAP 2026*

> Módulo complementar do projeto integrado — painel para a fisioterapeuta gerenciar pacientes, prescrições e evolução clínica.

</div>

---

## Stack

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| Framework | React 19 + TypeScript | UI e linguagem |
| Build | Vite | Dev server e bundler |
| Roteamento | TanStack Router | Rotas tipadas |
| Cache/fetch | TanStack Query | Sincronização com a API |
| Estilo | Tailwind CSS 4 + Radix UI | Design system acessível |
| HTTP | Axios | Consumo da API REST |

---

## Setup

```bash
npm install
npm run dev         # http://localhost:5173
```

Requer backend rodando em `http://localhost:3000/api` — veja [`maya-rpg-api/README.md`](../maya-rpg-api/README.md).

### Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |

**Validação (10/05/2026):** `npm run build` ✅ · `npm run lint` ✅ (0 erros, 8 avisos de Fast Refresh)

> O build emitiu aviso de bundle acima de 500 kB — melhoria futura com code splitting, sem impacto na entrega.

---

## Estrutura

```
src/
├── components/        Shell da aplicação + 50+ componentes UI (shadcn/Radix)
├── contexts/          Autenticação global
├── hooks/             Hooks compartilhados
├── lib/               Utilitários e helpers
├── routes/
│   ├── auth/          Login, recuperação de senha
│   ├── pacientes*/    CRUD e detalhe de pacientes
│   ├── exercicios*/   Banco de exercícios
│   ├── prescricoes*/  Prescrições por paciente
│   ├── prontuarios/   Prontuário eletrônico
│   ├── agenda/        Agendamento
│   └── usuarios/      Gestão de usuários
├── services/          14 serviços de integração com a API
└── types/             Tipos, entidades e enums do domínio
```

---

## Funcionalidades

| Funcionalidade | Status |
|----------------|:------:|
| Gestão de pacientes (CRUD, busca, filtros, status) | ✅ |
| Prontuário eletrônico com histórico | ✅ |
| Banco de exercícios (título, descrição, tags, mídia) | ✅ |
| Prescrição de exercícios ao paciente | ✅ |
| Painel com indicadores (dashboard) | ✅ |
| Gestão de usuários e permissões (Admin / Profissional) | ✅ |
| Bloqueio de prescrição sem LGPD aceita | ✅ |
| Histórico de check-ins na aba Evolução | ✅ |
| Desativar prescrição ativa | ✅ |
| Agenda / lembretes | 🔄 Opcional |

---

## Fluxo de Dados

```
Rotas / Componentes
       │
       ▼
 src/services/      ◀── TanStack Query (cache + refetch automático)
       │
       ▼
   Axios (HTTP)
       │
       ▼
   API REST (NestJS) ──▶ PostgreSQL
```

---

## Integração com os Outros Módulos

```
📱 App Mobile (Android)
└── Paciente registra check-ins e dor
           │
           ▼
🔧 Backend API (NestJS)       ◀── 🌐 Este painel (Web)
└── Persiste dados clínicos        └── Profissional visualiza evolução
└── Aplica regras LGPD              └── Prescreve exercícios
└── Expõe endpoints REST            └── Gerencia pacientes
```

Para dados de demonstração: iniciar a API com `SEED_DEMO_DATA=true`.

---

<div align="center">

**Equipe TechCare** · FECAP — Centro Universitário · ADS 2026

</div>

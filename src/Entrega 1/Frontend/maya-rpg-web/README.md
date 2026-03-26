# Maya RPG Web — Painel do Profissional

Sistema web para acompanhamento de pacientes de Reeducação Postural Global (RPG) da Clínica Maya Yoshiko Yamamoto.

## Projeto Interdisciplinar — FECAP 3º Semestre ADS 2026

### Stack

- **Frontend:** Angular 19 + TypeScript
- **Arquitetura:** Clean Architecture (Core → Data → Features → Shared)
- **Estilos:** SCSS com design system baseado na identidade visual da clínica
- **Backend:** API REST (desenvolvido por outra equipe)
- **Banco de Dados:** PostgreSQL (recomendado)

### Pré-requisitos

- Node.js 22+
- npm 10+
- Angular CLI (`npm install -g @angular/cli`)

### Setup

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd maya-rpg-web

# 2. Instale as dependências
npm install

# 3. Rode o servidor de desenvolvimento
ng serve

# 4. Acesse no navegador
# http://localhost:4200
```

### Extensões VS Code recomendadas

Ao abrir o projeto no VS Code, ele vai sugerir automaticamente as extensões. Aceite a instalação de todas:

- Angular Language Service
- Prettier
- ESLint
- GitLens
- EditorConfig
- Code Spell Checker (PT-BR)

### Estrutura de pastas

```
src/app/
├── core/                  # Domínio puro (sem dependência de framework)
│   ├── entities/          # Interfaces das entidades
│   ├── enums/             # Enumerações do domínio
│   ├── interfaces/        # Ports (contratos dos repositórios)
│   ├── tokens/            # Injection tokens para DI
│   └── utils/             # Funções utilitárias puras
├── data/                  # Infraestrutura (implementações concretas)
│   ├── interceptors/      # HTTP interceptors (auth, error)
│   ├── mappers/           # DTO ↔ Entity mappers
│   ├── repositories/      # Implementações dos repositórios
│   └── services/          # API service, token storage
├── features/              # Módulos de funcionalidade (lazy-loaded)
│   ├── auth/              # Login, recuperação de senha
│   ├── dashboard/         # Painel de indicadores
│   ├── patients/          # CRUD de pacientes
│   ├── exercises/         # Banco de exercícios
│   ├── prescriptions/     # Prescrições por paciente
│   └── medical-records/   # Prontuário eletrônico
└── shared/                # Componentes e estilos reutilizáveis
    ├── components/        # UI components genéricos
    ├── directives/        # Diretivas customizadas
    ├── layout/            # Sidebar, Header, MainLayout
    ├── pipes/             # Pipes customizados
    ├── styles/            # Design tokens, mixins SCSS
    └── validators/        # Validadores de formulário
```

### Padrões do projeto

- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`)
- **Branches:** `main` (produção), `develop` (integração), `feature/*` (funcionalidades)
- **Código:** Clean Code, Clean Architecture, Dependency Injection via tokens

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

| Semanas | Entrega |
|---------|---------|
| 1-2     | Scaffold + Core + Design system |
| 3-4     | Auth + CRUD Pacientes |
| 5-6     | Banco de Exercícios + Prescrições |
| 7-8     | Prontuário + Dashboard |
| 9-10    | Integração com API + testes |
| 11-12   | Ajustes de UX + documentação |
| 13      | Entrega final + apresentação |

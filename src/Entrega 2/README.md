<div align="center">

<img src="https://img.shields.io/badge/FECAP-ADS%203º%20Semestre-0057A8?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/Projeto%20Interdisciplinar-Entrega%202-00B37E?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/Status-Validado%20✓-22c55e?style=for-the-badge&logoColor=white" />

<br/><br/>

# 🏥 Clínica Maya Yoshiko Yamamoto
### Sistema Integrado de Fisioterapia RPG

*Projeto Interdisciplinar — 3º Semestre de Análise e Desenvolvimento de Sistemas*  
*FECAP · 2026 · Equipe TechCare*

</div>

---

## 📋 Sobre o Projeto

O **Maya RPG** é uma solução digital completa para clínicas de Reeducação Postural Global (RPG). O sistema conecta profissionais de saúde e pacientes em um fluxo clínico integrado, do cadastro à evolução terapêutica.

### Fluxo principal

```
┌──────────────┬──────────────┬──────────────┬───────────────────┐
│  1. Cadastro │ 2. Prescrição│  3. Execução │   4. Evolução     │
├──────────────┼──────────────┼──────────────┼───────────────────┤
│ Profissional │ Profissional │   Paciente   │  Profissional     │
│  cadastra    │  prescreve   │  realiza os  │  acompanha pelo   │
│  paciente e  │  exercícios  │  exercícios  │  painel web e     │
│  prontuário  │  com mídia   │  e registra  │  ajusta conduta   │
│              │  e instruções│  dor (0–10)  │                   │
└──────────────┴──────────────┴──────────────┴───────────────────┘
```

---

## 🗂️ Estrutura do Repositório

```
PIFisioterapiaMayaRPG/
│
├── 📁 backend/              # API REST — NestJS + PostgreSQL
├── 📁 mobile/               # App Android do paciente
├── 📁 web/                  # Painel web do profissional/admin
│
└── 📁 Documentos/
    └── Entrega2/
        ├── ProgramacaoMobile/
        │   ├── REQUISITOS_IMPLEMENTADOS.md
        │   ├── ROTEIRO_DEMONSTRACAO.md
        │   ├── AMBIENTE_SETUP.md
        │   └── VALIDACAO_FINAL.md
        └── SistemaOperacional/
            └── RELATORIO_CLOUD_NATIVE.md
```

---

## 🧩 Módulos

| Módulo | Tecnologias | Descrição | README |
|:------:|:-----------:|-----------|:------:|
| 🔧 **Backend** | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) | API REST, autenticação, banco de dados e infraestrutura | [📄 Ver](backend/README.md) |
| 📱 **Mobile** | ![Android](https://img.shields.io/badge/Android-34A853?style=flat&logo=android&logoColor=white) ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black) | App do paciente — plano, check-in e evolução | [📄 Ver](mobile/README.md) |
| 🌐 **Web** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Painel do profissional e admin | [📄 Ver](web/README.md) |

---

## ✅ Status de Validação

> Validação realizada em **10/05/2026**

| Módulo | Comando | Resultado |
|--------|---------|:---------:|
| Backend — build | `npm run build` | ✅ OK |
| Backend — testes | `npm test -- --runInBand` | ✅ 6 suites · 23 testes |
| Backend — Docker | `docker compose config` | ✅ OK |
| Mobile — testes | `gradlew.bat :app:testDebugUnitTest` | ✅ OK |
| Mobile — build | `gradlew.bat :app:assembleDebug` | ✅ OK |
| Web — build | `npm run build` | ✅ OK |
| Web — lint | `npm run lint` | ✅ 0 erros · 8 avisos |

> **⚠️ Nota sobre sandbox:** Os comandos Gradle e o build web falharam dentro do sandbox do Codex por restrições de rede e acesso a diretórios do usuário. Ambos passaram normalmente fora do sandbox.

---

## 🚀 Início Rápido

### 🔧 Backend

```bash
cd backend
cp .env.example .env        # preencher as variáveis necessárias
npm ci
docker compose up --build -d
docker compose ps           # confirmar que api e db estão healthy
```

📖 Swagger disponível em `http://localhost:3000/api/docs`

### 📱 Mobile

```bash
# 1. Abrir a pasta mobile/ no Android Studio
# 2. Confirmar que google-services.json está em mobile/app/
cd mobile
gradlew.bat :app:assembleDebug
```

### 🌐 Web

```bash
cd web
npm install
npm run dev                 # http://localhost:5173
```

---

## 📚 Documentação Complementar

| Documento | Descrição |
|-----------|-----------|
| [📋 Requisitos Implementados](Documentos/Entrega2/ProgramacaoMobile/REQUISITOS_IMPLEMENTADOS.md) | Checklist completo de aderência ao PDF do PI |
| [🎬 Roteiro de Demonstração](Documentos/Entrega2/ProgramacaoMobile/ROTEIRO_DEMONSTRACAO.md) | Passo a passo para a apresentação acadêmica |
| [⚙️ Setup de Ambiente](Documentos/Entrega2/ProgramacaoMobile/AMBIENTE_SETUP.md) | Pré-requisitos e comandos de configuração |
| [🔍 Validação Final](Documentos/Entrega2/ProgramacaoMobile/VALIDACAO_FINAL.md) | Evidências de validação técnica |
| [☁️ Relatório Cloud Native](Documentos/Entrega2/SistemaOperacional/RELATORIO_CLOUD_NATIVE.md) | Docker, scripts Linux e infraestrutura |

---

## ⚠️ Observações Importantes

- O arquivo `.env` **não deve** ser versionado — use `.env.example` como base.
- Não versionar `node_modules`, `dist`, `build`, `logs` ou backups gerados.
- O `google-services.json` é configuração cliente do Firebase — **não** contém chaves privadas de servidor.
- O `npm audit` da API apontou vulnerabilidades; `npm audit fix` foi omitido intencionalmente para não quebrar dependências antes da entrega.

---

<div align="center">

**Equipe TechCare** · FECAP — Centro Universitário · ADS 2026

</div>

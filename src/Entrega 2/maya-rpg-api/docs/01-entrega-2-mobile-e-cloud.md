# Entrega 2 — Programação Mobile e Cloud Native

> **Projeto:** Maya Fisioterapia/RPG  
> **Curso:** Projeto Interdisciplinar — 3º ADS — 2026  
> **Escopo deste pacote:** Programação Mobile + Cloud Native  
> **Finalidade:** apresentar, de forma objetiva, o que foi implementado, como executar e quais evidências devem ser anexadas.

---

## 1. Visão Geral

O projeto **Maya Fisioterapia/RPG** tem como objetivo apoiar o acompanhamento fisioterapêutico de pacientes por meio de uma solução integrada entre aplicativo mobile, API backend, banco de dados e infraestrutura containerizada.

Nesta entrega, o foco está em duas frentes principais:

| Frente | Objetivo |
|---|---|
| **Programação Mobile** | Disponibilizar funcionalidades do aplicativo do paciente, como autenticação, visualização do plano de exercícios, check-in, histórico de evolução e integração com a API. |
| **Cloud Native** | Preparar a API e o banco de dados para execução em ambiente containerizado com Docker, Docker Compose, variáveis de ambiente, volumes persistentes e scripts de automação. |

---

## 2. Escopo da Entrega

Esta documentação considera principalmente os seguintes projetos:

```text
PIFisioterapiaMayaRPG-Entrega2/
├── backend/          # API NestJS + PostgreSQL + Docker
├── mobile/           # Aplicativo Android do paciente
└── docs/             # Documentação consolidada da entrega
```

> Observação: módulos Web, UX, dashboard e demais entregas podem existir no projeto geral, mas **não são o foco principal deste pacote**, pois ficaram sob responsabilidade de outros integrantes.

---

## 3. Responsabilidades Documentadas

### 3.1 Programação Mobile

A parte mobile contempla funcionalidades voltadas ao paciente, com foco no acompanhamento dos exercícios prescritos pelo profissional.

Principais pontos atendidos:

| Requisito | Evidência esperada |
|---|---|
| Autenticação do paciente | Tela de login conectada à API. |
| Consumo da API REST | Classes de serviço/API no aplicativo. |
| Visualização do plano de exercícios | Tela listando prescrições e exercícios atribuídos ao paciente. |
| Check-in de exercício | Registro de execução, dor, observações e status de conclusão. |
| Histórico/evolução | Tela com registros anteriores e dados salvos/localizados. |
| Armazenamento local | Uso de persistência local/cache quando aplicável. |
| Notificações/lembretes | Estrutura de lembretes ou integração preparada, quando implementada. |
| Identidade visual | Uso de cores, logo e elementos visuais da clínica Maya. |

---

### 3.2 Cloud Native

A parte Cloud Native contempla a preparação do backend e do banco para execução de forma isolada, reproduzível e automatizada.

Principais pontos atendidos:

| Requisito | Arquivo/Evidência |
|---|---|
| Dockerfile do backend | `backend/Dockerfile` |
| Dockerfile do banco | `backend/Dockerfile.db` |
| Docker Compose com API + banco | `backend/docker-compose.yml` |
| Volume persistente do PostgreSQL | Volume `pg_data` no Compose |
| Variáveis de ambiente | `backend/.env.example` |
| Script de deploy | `backend/scripts/deploy.sh` |
| Scripts Bash/Linux | `backend/scripts/*.sh` |
| Healthcheck da API e banco | `docker compose ps` e logs dos containers |
| Documentação de execução | `02-cloud-native-e-automacao.md` |

---

## 4. Estrutura Recomendada dos Documentos

A documentação foi consolidada em apenas três arquivos para evitar repetição e facilitar a leitura pelo professor:

| Documento | Finalidade |
|---|---|
| `01-entrega-2-mobile-e-cloud.md` | Documento principal da entrega, com visão geral, escopo e requisitos atendidos. |
| `02-cloud-native-e-automacao.md` | Relatório técnico da infraestrutura Docker, Compose, volumes, variáveis e scripts. |
| `03-testes-e-evidencias.md` | Guia de validação, comandos, testes e prints para anexar na entrega. |

---

## 5. Como Executar o Backend Containerizado

No diretório do backend:

```bash
cd backend
cp .env.example .env
```

No Windows PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
```

Depois, subir a aplicação:

```bash
docker compose up --build -d
```

Verificar os containers:

```bash
docker compose ps
```

Acessar a documentação da API:

```text
http://localhost:3000/api/docs
```

---

## 6. Como Validar o Mobile

No diretório do aplicativo mobile:

```bash
cd mobile
./gradlew :app:assembleDebug
```

No Windows, caso esteja usando o terminal padrão:

```powershell
cd mobile
.\gradlew.bat :app:assembleDebug
```

Evidências recomendadas:

- print do build finalizado com sucesso;
- print da tela de login;
- print da tela de exercícios/prescrições;
- print do check-in de exercício;
- print do histórico/evolução;
- print do aplicativo consumindo dados da API, se demonstrável.

---

## 7. Requisitos Atendidos por Área

### 7.1 Mobile

| Item | Situação | Observação |
|---|---:|---|
| Aplicativo do paciente | Atendido | Estrutura Android voltada ao usuário/paciente. |
| Integração com backend | Atendido | Consumo da API REST. |
| Check-in de exercícios | Atendido | Registro de execução, dor e observações. |
| Histórico de evolução | Atendido | Visualização de registros anteriores. |
| Persistência local/cache | Atendido/Parcial | Conforme implementação atual do app. |
| Notificações/lembretes | Atendido/Parcial | Depende da configuração final do app/dispositivo. |

### 7.2 Cloud Native

| Item | Situação | Observação |
|---|---:|---|
| Dockerfile backend | Atendido | Build multi-stage com Node.js 20. |
| Dockerfile banco | Atendido | Base PostgreSQL 16 Alpine. |
| Docker Compose | Atendido | API + banco + rede + volume. |
| Variáveis de ambiente | Atendido | `.env.example` como modelo seguro. |
| Volume persistente | Atendido | Volume para dados do PostgreSQL. |
| Scripts Bash/Linux | Atendido | Setup, monitoramento, backup, gerenciamento e deploy. |
| Healthchecks | Atendido | Banco e API verificados pelo Compose/scripts. |

---

## 8. Evidências que Devem Ser Anexadas

Para facilitar a correção, recomenda-se anexar prints dos seguintes pontos:

| Evidência | O que mostrar |
|---|---|
| Build do mobile | Terminal com `assembleDebug` concluído. |
| Telas principais do mobile | Login, exercícios, check-in e histórico. |
| Build do backend | `npm run build` ou build via Docker Compose. |
| Testes automatizados | Resultado de `npm test` e/ou `npm run test:e2e`. |
| Docker Compose rodando | `docker compose ps` com API e banco ativos. |
| Swagger aberto | Página `http://localhost:3000/api/docs`. |
| Volume do banco | `docker volume ls` ou evidência de persistência. |
| Scripts Bash | Execução de backup, monitoramento ou gerenciamento. |
| Teste de carga | Resultado final do k6, se executado. |

---

## 9. Observações Importantes

- O arquivo `.env` **não deve ser enviado ao GitHub**.
- A pasta `node_modules/` **não deve ser anexada**.
- Pastas de runtime como `dist/`, `logs/`, `uploads/` e `backups/` devem ser anexadas apenas se o professor pedir evidências específicas.
- Resultados de teste de carga devem ser preenchidos somente após execução real.
- A documentação evita afirmar que o sistema está “pronto para produção”; o correto é apresentar como **pronto para demonstração acadêmica em ambiente local containerizado**.

---

## 10. Conclusão

A Entrega 2 demonstra a integração entre aplicativo mobile e backend, além da preparação da infraestrutura Cloud Native com containers, persistência, variáveis de ambiente e automação via scripts Bash/Linux.

A organização em três documentos facilita a leitura, reduz redundâncias e permite que o professor identifique rapidamente:

1. **o que foi entregue**;
2. **como executar**;
3. **como validar com prints e testes**.

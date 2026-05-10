# Ambiente de Setup - Entrega 2

Este documento resume os pré-requisitos e os comandos essenciais para executar os três módulos da solução.

## Pré-requisitos

- Node 20 ou superior.
- Docker Desktop instalado e aberto no Windows.
- Java instalado e configurado.
- Android Studio para o mobile.
- npm disponível no terminal.
- Gradle wrapper presente no projeto mobile.

## Estrutura dos módulos

- backend: API NestJS com PostgreSQL e Swagger.
- mobile: aplicativo Android do paciente.
- web: módulo complementar para o profissional e o admin.

## Backend

### Pré-requisitos específicos

- Node 20+.
- npm.
- Docker Desktop.
- Arquivo .env criado a partir de .env.example.

### Comandos principais

1. Instalar dependências:
   - npm ci

2. Validar build:
   - npm run build

3. Validar testes:
   - npm test -- --runInBand

4. Subir containers:
   - docker compose up --build -d

5. Verificar containers:
   - docker compose ps

### Observações do backend

- O arquivo .env não deve ser enviado para o Git.
- O arquivo .env.example deve ser usado como base para configuração local.
- A documentação Swagger fica disponível em /api/docs.
- O backend deve rodar com API e banco em containers quando a demonstração exigir ambiente local containerizado.

## Mobile

### Pré-requisitos específicos

- Java instalado.
- Android Studio aberto ou configurado.
- Gradle wrapper disponível no projeto.
- Arquivo google-services.json presente no módulo mobile para suporte a Firebase e FCM.

### Comandos principais

No Windows, usar o wrapper do Gradle com o terminal do projeto mobile:

- gradlew.bat clean
- gradlew.bat :app:assembleDebug
- gradlew.bat test

### Observações do mobile

- O arquivo google-services.json é o arquivo de configuração cliente do Firebase/FCM necessário para notificações no Android. Não representa chave privada de servidor.
- O app consome a API REST do backend.
- O fluxo validado inclui login, plano de exercícios, check-in, dor, histórico e notificações.

## Web

### Pré-requisitos específicos

- Node 20 ou superior.
- npm instalado.
- Projeto web configurado como módulo complementar.

### Comandos principais

1. Instalar dependências:
   - npm install

2. Validar build:
   - npm run build

3. Validar lint quando necessário:
   - npm run lint

### Observações do web

- O lint apresenta pendência de Prettier e CRLF legado, sem impacto na validação do build.
- O módulo web integra com o backend e não deve ser tratado como projeto isolado.

## Observações de ambiente

- Docker Desktop deve estar aberto no Windows antes de executar os comandos de container.
- Os scripts .sh da API devem ser executados em Git Bash, WSL ou ambiente Linux.
- O arquivo .env não deve ser copiado para a entrega.
- O arquivo .env.example deve acompanhar a documentação e servir como referência para o setup local.

## Resumo do fluxo de validação

1. Backend: npm ci, build, testes e Docker.
2. Mobile: build e testes via Gradle wrapper.
3. Web: install, build e lint quando necessário.
4. Demonstração final: verificar containers saudáveis e navegação entre os módulos.
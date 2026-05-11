# Relatório Cloud Native e Linux

> Documento principal da entrega individual de Cloud Native/Infraestrutura com Linux. Cobre Dockerfile, docker-compose, scripts, setup, monitoramento, backup, gerenciamento de processos e demais tópicos operacionais validados nesta entrega.

## 1. Visão geral

A solução foi organizada para funcionar em ambiente local containerizado, com backend, banco de dados e suporte a automação por scripts Shell/Bash.

O objetivo é demonstrar uma arquitetura replicável, com persistência, parâmetros de ambiente e separação entre aplicação e infraestrutura.

## 2. Docker no backend

### Dockerfile da API

O backend possui Dockerfile próprio para construir a imagem da API NestJS.

Pontos relevantes:

- uso de imagem base Node;
- etapa de build separada da etapa de runtime;
- instalação de dependências no build;
- execução da aplicação em container isolado.

### Dockerfile.db

O banco possui Dockerfile próprio mantido como artefato acadêmico da entrega.

O docker-compose.yml utiliza a imagem oficial do PostgreSQL para execução local, enquanto o Dockerfile.db permanece documentado como artefato acadêmico da entrega.

Mesmo quando o ambiente usa imagem pronta do PostgreSQL no compose, o arquivo é mantido como evidência do requisito acadêmico.

### Validação em 10/05/2026

- `docker compose config` executado com sucesso.
- A configuração resolvida contém `api` e `db`, rede `maya-network`, volume `pg_data`, bind mounts para `uploads` e `logs`, healthcheck da API em `/api/docs` e healthcheck do PostgreSQL via `pg_isready`.
- O Docker emitiu aviso de acesso ao arquivo local `C:\Users\nelso\.docker\config.json` no sandbox, sem impedir a validação do Compose.

## 3. Docker Compose

O docker-compose.yml organiza:

- API;
- banco de dados;
- rede interna;
- dependências entre serviços;
- variáveis de ambiente;
- volume persistente.

### Volume persistente

O volume pg_data garante a persistência dos dados do banco entre reinicializações.

### Volumes de uploads e logs

O compose também prevê volumes para:

- uploads;
- logs.

Isso separa dados gerados em runtime do código-fonte.

## 4. Variáveis de ambiente

A aplicação usa variáveis de ambiente para:

- host do banco;
- porta;
- usuário;
- senha;
- nome do banco;
- secret JWT;
- CORS;
- porta da API.

Boas práticas adotadas:

- .env não deve ser enviado ao Git;
- .env.example deve servir como base;
- cada ambiente pode ajustar suas variáveis sem alterar o código.

## 5. Healthcheck

O ambiente containerizado valida a API por healthcheck em /api/docs.

Isso permite confirmar:

- API ativa;
- documentação disponível;
- dependência entre serviços funcionando.

## 6. Scripts Shell e Bash

A API contém scripts para automação.

Scripts mantidos:

- setup_env.sh
- monitor_system.sh
- backup_db.sh
- manage_services.sh
- deploy.sh

### Função de cada script

- setup_env.sh: prepara o ambiente.
- monitor_system.sh: monitora CPU, memória, disco e logs.
- backup_db.sh: gera backup do banco de desenvolvimento.
- manage_services.sh: inicia, para, consulta status e reinicia serviços.
- deploy.sh: automatiza o fluxo de deploy com Docker.

## 7. Matriz de aderência ao PDF

| Exigência da Entrega 2 | Arquivo / evidência | Aderência |
| --- | --- | --- |
| Containerizar a API REST | `src/Entrega 2/backend/Dockerfile` | Atendido |
| Preparar banco em container | `src/Entrega 2/backend/Dockerfile.db` e serviço `db` no Compose | Atendido |
| Orquestrar API + BD | `src/Entrega 2/backend/docker-compose.yml` | Atendido |
| Volume persistente | volume nomeado `pg_data` | Atendido |
| Variáveis de ambiente | `.env.example`, `.env` local e bloco `environment` do Compose | Atendido |
| Script de deploy automatizado | `scripts/deploy.sh` | Atendido |
| Setup de ambiente | `scripts/setup_env.sh` | Atendido |
| Monitoramento de CPU/memória/disco/logs | `scripts/monitor_system.sh` | Atendido |
| Backup de banco | `scripts/backup_db.sh` | Atendido |
| Gerenciamento de processos | `scripts/manage_services.sh` | Atendido |
| Demonstração de pipes/redirecionamento/env/cron/permissões | scripts e exemplos de cron no README do backend | Atendido |

## 8. Recursos de Shell documentados

A documentação da solução contempla:

- pipes;
- redirecionamento;
- variáveis de ambiente;
- cron jobs;
- permissões de execução.

Esses recursos demonstram uso prático de Linux e automação de tarefas.

## 9. Estratégia de persistência

### Ambiente tradicional

- dependência maior de instalação local;
- maior chance de divergência entre máquinas;
- configuração manual mais longa.

### Ambiente containerizado

- configuração reproduzível;
- isolamento entre serviços;
- ambiente previsível para demonstração;
- menor risco de incompatibilidade entre versões.

## 10. Vantagens da containerização

- instalação mais controlada;
- facilidade para replicar o ambiente;
- separação entre app e banco;
- persistência via volumes;
- maior previsibilidade na demonstração;
- menor acoplamento ao sistema operacional local.

## 11. Como os scripts ajudam o ciclo de desenvolvimento

Os scripts reduzem tarefas manuais e ajudam em:

- preparação do ambiente;
- monitoramento;
- backup;
- execução e restart dos serviços;
- padronização da rotina local.

Isso melhora a manutenção do projeto e a reprodutibilidade da entrega.

## 12. Conclusão

A solução backend foi estruturada para funcionar em ambiente local containerizado, com API, banco, persistência, automação e documentação compatíveis com a Entrega 2.

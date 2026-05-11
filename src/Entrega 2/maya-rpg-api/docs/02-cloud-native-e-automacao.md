# Cloud Native, Docker e Automação Linux/Bash

> **Projeto:** Maya Fisioterapia/RPG — Backend/API  
> **Objetivo:** documentar a containerização da API, banco PostgreSQL, volumes, variáveis de ambiente e scripts de automação exigidos na entrega.

---

## 1. Objetivo Técnico

A infraestrutura Cloud Native foi preparada para permitir que a API e o banco de dados sejam executados em containers, reduzindo dependências manuais da máquina local e facilitando a demonstração acadêmica.

A solução utiliza:

- Dockerfile para o backend;
- Dockerfile para o banco PostgreSQL;
- Docker Compose para orquestração;
- volume persistente para o banco;
- variáveis de ambiente;
- scripts Shell/Bash para setup, monitoramento, backup, gerenciamento e deploy.

---

## 2. Arquivos da Infraestrutura

| Arquivo | Função |
|---|---|
| `Dockerfile` | Cria a imagem da API NestJS. |
| `Dockerfile.db` | Cria/define a imagem do banco PostgreSQL. |
| `docker-compose.yml` | Sobe API + banco + rede + volumes. |
| `.env.example` | Modelo de configuração por variáveis de ambiente. |
| `scripts/setup_env.sh` | Verifica dependências do ambiente. |
| `scripts/monitor_system.sh` | Coleta métricas de CPU, memória, disco e containers. |
| `scripts/backup_db.sh` | Gera backup do banco PostgreSQL. |
| `scripts/manage_services.sh` | Gerencia start, stop, status, logs e restart. |
| `scripts/deploy.sh` | Automatiza build, backup, subida dos containers e healthcheck. |

---

## 3. Backend em Container

O backend utiliza um Dockerfile com build em etapas, separando a fase de compilação da fase de execução.

Fluxo esperado:

```text
Instalar dependências -> Compilar aplicação -> Copiar dist -> Rodar em modo produção
```

Principais características:

| Item | Descrição |
|---|---|
| Base | Node.js 20 Alpine |
| Aplicação | API NestJS |
| Porta | `3000` |
| Execução | `npm run start:prod` |
| Segurança | Uso de usuário não-root dentro do container |
| Healthcheck | `curl` instalado para validação da API |
| Diretórios persistentes | `/app/uploads` e `/app/logs` |

---

## 4. Banco PostgreSQL em Container

O banco utiliza PostgreSQL 16 Alpine.

Configuração base:

```dockerfile
FROM postgres:16-alpine
ENV POSTGRES_DB=maya_rpg
ENV POSTGRES_USER=maya_user
ENV POSTGRES_PASSWORD=maya_pass
EXPOSE 5432
```

No ambiente real de execução, esses valores devem ser controlados pelo `.env` e pelo `docker-compose.yml`, evitando credenciais fixas no código.

---

## 5. Docker Compose

O `docker-compose.yml` organiza os serviços necessários para a aplicação funcionar localmente.

Serviços principais:

| Serviço | Função |
|---|---|
| `db` | Banco PostgreSQL. |
| `api` | Backend NestJS. |

Recursos usados:

- rede interna Docker para comunicação entre API e banco;
- `depends_on` para aguardar o banco estar saudável;
- healthcheck do banco com `pg_isready`;
- healthcheck da API apontando para a documentação/rota disponível;
- volume persistente para dados do PostgreSQL;
- bind mounts para logs e uploads.

---

## 6. Variáveis de Ambiente

O projeto usa `.env.example` como modelo de configuração.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=maya_user
DB_PASSWORD=
DB_NAME=maya_rpg
JWT_SECRET=your_jwt_secret_here
CORS_ORIGINS=http://localhost:4200,http://localhost:3000
PORT=3000
NODE_ENV=development
```

Durante a execução via Docker Compose, o host do banco deve ser o nome do serviço:

```env
DB_HOST=db
```

Boas práticas:

- não versionar `.env`;
- manter `.env.example` sem senhas reais;
- usar `JWT_SECRET` forte;
- separar configurações locais e de produção.

---

## 7. Volumes e Persistência

Containers são descartáveis. Por isso, dados importantes precisam estar em volumes.

| Volume/Pasta | Uso |
|---|---|
| `pg_data:/var/lib/postgresql/data` | Mantém os dados do PostgreSQL mesmo se o container for recriado. |
| `./uploads:/app/uploads` | Mantém arquivos enviados pela aplicação. |
| `./logs:/app/logs` | Mantém logs gerados pela API. |
| `./backups` | Armazena dumps criados pelo script de backup. |

Sem volume, os dados gravados dentro de containers poderiam ser perdidos ao recriar o ambiente.

---

## 8. Ambiente Tradicional vs Containerizado

| Critério | Ambiente tradicional | Ambiente containerizado |
|---|---|---|
| Instalação | Node, PostgreSQL e dependências instalados manualmente. | Imagens Docker definem o ambiente. |
| Reprodutibilidade | Pode variar de computador para computador. | Mesmo Compose sobe os mesmos serviços. |
| Configuração | Depende da máquina local. | Centralizada no `.env` e Compose. |
| Isolamento | Serviços compartilham diretamente o sistema operacional. | Serviços isolados por containers e rede Docker. |
| Persistência | Depende de instalação local do banco. | Volumes explícitos. |
| Deploy | Mais sujeito a passos manuais. | Automatizado por script. |

---

## 9. Comandos Principais

### 9.1 Preparar ambiente

```bash
cp .env.example .env
chmod +x scripts/*.sh
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

---

### 9.2 Validar configuração do Compose

```bash
docker compose config
```

Esse comando ajuda a verificar se o arquivo `docker-compose.yml` está válido.

---

### 9.3 Construir imagens

```bash
docker compose build
```

---

### 9.4 Subir containers

```bash
docker compose up --build -d
```

---

### 9.5 Verificar status

```bash
docker compose ps
```

O ideal é que API e banco apareçam como `Up` ou `healthy`.

---

### 9.6 Ver logs da API

```bash
docker compose logs api --tail=80
```

---

### 9.7 Acessar Swagger

```text
http://localhost:3000/api/docs
```

---

### 9.8 Parar ambiente

```bash
docker compose down
```

Para remover também o volume do banco:

```bash
docker compose down -v
```

> Use `down -v` apenas quando não precisar mais dos dados locais.

---

## 10. Scripts de Automação

### 10.1 `setup_env.sh`

Verifica se o ambiente possui as dependências necessárias.

Valida:

- Docker;
- Docker Compose;
- Node.js 20+;
- npm;
- arquivo `.env`;
- dependências do projeto.

Uso:

```bash
./scripts/setup_env.sh
```

No Windows com Git Bash:

```bash
bash scripts/setup_env.sh
```

---

### 10.2 `monitor_system.sh`

Coleta métricas do ambiente e registra logs.

Métricas observadas:

- CPU;
- memória;
- disco;
- containers Docker.

Uso:

```bash
./scripts/monitor_system.sh 5 30
```

Esse exemplo coleta dados a cada 5 segundos durante 30 segundos.

Saída esperada:

```text
logs/monitor/metrics_YYYYMMDD_HHMMSS.log
```

---

### 10.3 `backup_db.sh`

Executa backup do banco PostgreSQL rodando no Docker Compose.

Uso:

```bash
./scripts/backup_db.sh
```

Saída esperada:

```text
backups/backup_YYYYMMDD_HHMMSS.sql
```

Variáveis relevantes:

```bash
BACKUP_RETENTION_DAYS=7
POSTGRES_USER=maya_user
POSTGRES_DB=maya_rpg
```

---

### 10.4 `manage_services.sh`

Gerencia os containers da aplicação.

Comandos disponíveis:

```bash
./scripts/manage_services.sh up
./scripts/manage_services.sh down
./scripts/manage_services.sh status
./scripts/manage_services.sh logs
./scripts/manage_services.sh restart
./scripts/manage_services.sh watch
```

O modo `watch` monitora a aplicação e tenta reiniciar os serviços em caso de falhas consecutivas.

---

### 10.5 `deploy.sh`

Automatiza o processo de deploy local/containerizado.

Etapas executadas:

1. verifica Docker e Docker Compose;
2. salva referência de imagens para possível rollback;
3. executa build;
4. executa backup pré-deploy;
5. aplica migrações, se existirem;
6. sobe os containers;
7. executa healthcheck.

Uso:

```bash
./scripts/deploy.sh
```

Rollback:

```bash
./scripts/deploy.sh --rollback
```

---

## 11. Conceitos Linux/Bash Demonstrados

| Conceito exigido | Evidência nos scripts |
|---|---|
| Variáveis | `DEPLOY_ENV`, `API_URL`, `BACKUP_RETENTION_DAYS`, `HEALTH_TIMEOUT` |
| Condicionais | Uso de `if` e `case` |
| Funções | `check_health`, `restart_with_healthcheck`, `save_current_images` |
| Pipes | Uso com `grep`, `awk`, `tail`, `tee` |
| Redirecionamento | `>`, `>>`, `2>&1` |
| Logs | `logs/deploy.log`, `logs/monitor/*.log` |
| Permissões | `chmod +x scripts/*.sh` |
| Cron | Exemplos de agendamento abaixo |

---

## 12. Exemplos de Cron

Backup diário às 02:00:

```cron
0 2 * * * cd /path/to/maya-rpg-api && ./scripts/backup_db.sh >> /var/log/maya-rpg/backup.log 2>&1
```

Monitoramento a cada 5 minutos:

```cron
*/5 * * * * cd /path/to/maya-rpg-api && ./scripts/monitor_system.sh 5 30 >> /var/log/maya-rpg/monitor.log 2>&1
```

---

## 13. Prints Recomendados para Cloud Native

| Print | Comando/Tela |
|---|---|
| Arquivos Docker | Mostrar `Dockerfile`, `Dockerfile.db` e `docker-compose.yml`. |
| Configuração válida | `docker compose config`. |
| Build das imagens | `docker compose build`. |
| Containers rodando | `docker compose ps`. |
| Logs da API | `docker compose logs api --tail=80`. |
| Swagger aberto | `http://localhost:3000/api/docs`. |
| Volume persistente | `docker volume ls`. |
| Banco saudável | `docker compose exec db pg_isready -U maya_user -d maya_rpg`. |
| Backup criado | Pasta `backups/` após `backup_db.sh`. |
| Monitoramento | Pasta `logs/monitor/` após `monitor_system.sh`. |
| Deploy automatizado | Resultado do `deploy.sh`. |

---

## 14. Conclusão

A infraestrutura Cloud Native permite executar a API e o banco em ambiente local containerizado, com persistência, configuração externa, healthchecks e automações de apoio.

Essa estrutura melhora a reprodutibilidade da entrega, facilita a demonstração acadêmica e reduz problemas comuns de ambiente, como diferenças de versão entre máquinas.

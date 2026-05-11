# 🚀 Quick Start - Maya RPG API com Docker Compose

## Setup Rápido (5 minutos)

### 1️⃣ Pré-requisitos
Certifique-se de ter instalado:
- Docker 29.4+ ([download](https://www.docker.com))
- Docker Compose v5.1+ (incluído no Docker Desktop)

Verificar:
```bash
docker --version
docker compose version
```

### 2️⃣ Clonar e configurar
```bash
git clone https://seu-repo/maya-rpg-api.git
cd maya-rpg-api

# Copiar exemplo de variáveis de ambiente
cp .env.example .env

# ⚠️ IMPORTANTE: Editar .env com valores reais
#   - DB_PASSWORD: defina uma senha forte
#   - JWT_SECRET: gere um segredo aleatório
# Exemplo de JWT_SECRET seguro:
#   openssl rand -base64 32

# Dar permissão de execução aos scripts
chmod +x scripts/*.sh
```

### 3️⃣ Subir a infraestrutura
```bash
# Build das imagens (primeira vez)
docker compose build

# Subir containers em background
docker compose up --build -d

# Aguardar ~10s para inicialização completa
```

### 4️⃣ Validar que está rodando
```bash
# Verificar status dos containers
docker compose ps

# Verificar logs da API
docker compose logs -f api

# Teste do endpoint (deve retornar 200)
curl http://localhost:3000/api/docs
```

✅ **Pronto!** A API está acessível em:
- **API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs
- **Database:** localhost:5432

---

## 🛠️ Comandos Úteis

### Gerenciar Containers
```bash
# Subir tudo
docker compose up -d

# Descer tudo
docker compose down

# Ver status
docker compose ps

# Ver logs em tempo real (Ctrl+C para sair)
docker compose logs -f api
docker compose logs -f db

# Restart
docker compose restart api
```

### Scripts de Automação
```bash
# Backup do banco de dados
./scripts/backup_db.sh
# Gera arquivo em: backups/backup_YYYYMMDD_HHMMSS.sql

# Monitorar sistema (5s intervalo, 30s duração)
./scripts/monitor_system.sh 5 30
# Gera logs em: logs/monitor/metrics_*.log

# Gerenciador interativo
./scripts/manage_services.sh
# Opções: up, down, status, logs, restart

# Deploy automatizado
./scripts/deploy.sh
# Com rollback: ./scripts/deploy.sh --rollback

# Verificar dependências
./scripts/setup_env.sh
```

### Database
```bash
# Acessar console do PostgreSQL
docker compose exec db psql -U maya_user -d maya_rpg

# Listar backups disponíveis
ls -lh backups/

# Restaurar backup
docker compose exec -T db psql -U maya_user maya_rpg < backups/backup_20260509_000000.sql
```

### Logs e Troubleshooting
```bash
# Ver logs de erro completos
docker compose logs api | grep ERROR

# Inspecionar container da API
docker compose exec api sh

# Verificar volumes (persistência)
docker compose exec api ls -la /app/uploads/
docker compose exec api ls -la /app/logs/

# Health status detalhado
docker compose exec db pg_isready -U maya_user
```

---

## 📅 Agendar Tarefas (Cron)

### Linux/Mac: editar crontab
```bash
crontab -e
```

### Copiar exemplos para seu crontab:
```cron
# Monitor a cada 5 minutos
*/5 * * * * cd /path/to/maya-rpg-api && ./scripts/monitor_system.sh 5 30 >> /var/log/maya-rpg/monitor.log 2>&1

# Backup diário às 02:00
0 2 * * * cd /path/to/maya-rpg-api && ./scripts/backup_db.sh >> /var/log/maya-rpg/backup.log 2>&1

# Deploy automático a cada 6 horas
0 */6 * * * cd /path/to/maya-rpg-api && ./scripts/deploy.sh >> /var/log/maya-rpg/deploy.log 2>&1
```

---

## 🔒 Segurança - Checklist

- [ ] `.env` criado a partir de `.env.example`
- [ ] `.env` NÃO está commitado no Git
- [ ] `JWT_SECRET` configurado com valor forte
- [ ] `DB_PASSWORD` configurado com valor forte
- [ ] Arquivo `.gitignore` inclui `.env`
- [ ] Scripts com permissão `chmod +x` (ls -la scripts/)
- [ ] Em ambientes de produção real: usar Docker secrets ao invés de .env

---

## 📊 Estrutura dos Volumes

```
projeto/
├── backups/                   # Dumps do PostgreSQL
│   └── backup_YYYYMMDD_HHMMSS.sql
├── logs/
│   └── monitor/              # Logs de monitoramento
│       └── metrics_*.log
├── uploads/                  # Uploads de usuários (persistido)
└── docker-compose.yml        # Orquestra db + api
```

---

## 🐛 Troubleshooting

### Erro: "API não responde"
```bash
# 1. Verificar se container está rodando
docker compose ps

# 2. Ver logs da API
docker compose logs api

# 3. Verificar se porta 3000 não está em uso
lsof -i :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows
```

### Erro: "Banco de dados não conecta"
```bash
# 1. Verificar se PostgreSQL container está healthy
docker compose ps db

# 2. Testar conexão diretamente
docker compose exec db psql -U maya_user -d maya_rpg -c "SELECT 1"

# 3. Verificar arquivo .env
cat .env | grep DB_
```

### Erro: "Permissão negada nos scripts"
```bash
# Dar permissão de execução
chmod +x scripts/*.sh

# Verificar
ls -la scripts/
```

---

## 📚 Documentação Completa

Para análise detalhada de requisitos Cloud Native:
👉 [Relatório Completo de Conformidade](RELATORIO_CLOUD_NATIVE.md)

---

## 🆘 Suporte

Se encontrar problemas:
1. Consulte os logs: `docker compose logs -f api`
2. Verifique o `.env`: `cat .env`
3. Rode setup: `./scripts/setup_env.sh`
4. Restart completo: `docker compose down -v && docker compose up --build -d`

---

**Última atualização:** 9 de maio de 2026  
**Versão:** 1.0 - Cloud Native Ready

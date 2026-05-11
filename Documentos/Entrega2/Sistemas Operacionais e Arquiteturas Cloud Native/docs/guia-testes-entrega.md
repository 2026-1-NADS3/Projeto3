# Guia de Testes e Prints da Entrega Cloud Native

Este roteiro foi feito para validar a entrega em ordem e gerar prints claros para anexar no trabalho.

## 1. Preparar a Pasta

Abra o terminal na raiz do projeto:

```bash
cd maya-rpg-api
```

Confirme que a pasta está limpa de artefatos gerados:

```bash
dir
```

No print, devem aparecer arquivos como `Dockerfile`, `Dockerfile.db`, `docker-compose.yml`, `package.json`, `src`, `scripts`, `docs` e `test`. Não precisa aparecer `node_modules`, `dist`, `logs`, `uploads` ou `.env`.

## 2. Instalar Dependências

```bash
npm install
```

Print sugerido: terminal mostrando instalação concluída sem erro.

## 3. Criar o Arquivo de Ambiente

No PowerShell:

```powershell
Copy-Item .env.example .env
```

No Git Bash ou Linux:

```bash
cp .env.example .env
```

Edite o `.env` e garanta estes valores para teste local:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=maya_user
DB_PASSWORD=maya_pass
DB_NAME=maya_rpg
JWT_SECRET=test_jwt_secret_123456789
NODE_ENV=development
PORT=3000
```

Print sugerido: `.env.example` aberto ou terminal mostrando o comando de cópia. Não tire print exibindo segredos reais.

## 4. Validar Código Local

```bash
npm run format
npm run lint
npm run build
npm test -- --runInBand
```

Prints sugeridos:
- `npm run lint` sem erros.
- `npm run build` concluído.
- `npm test -- --runInBand` mostrando `6 passed` e `23 passed`.

## 5. Validar Docker Compose

Abra o Docker Desktop antes desta etapa.

```bash
docker compose config
```

Print sugerido: saída mostrando os serviços `api` e `db`.

Confira os arquivos obrigatórios:

```bash
dir Dockerfile Dockerfile.db docker-compose.yml
```

Print sugerido: os três arquivos listados.

## 6. Construir as Imagens

```bash
docker compose build
```

Print sugerido: build finalizado para `maya-rpg-api` e `maya-rpg-db`.

## 7. Subir API e Banco em Containers

```bash
docker compose up -d
```

Depois:

```bash
docker compose ps
```

Print sugerido: containers `maya-rpg-api` e `maya-rpg-db` com status `Up` ou `healthy`.

## 8. Ver Logs da API

```bash
docker compose logs api --tail=80
```

Print sugerido: logs do NestJS iniciando e mensagem da API rodando.

## 9. Abrir Swagger

Acesse no navegador:

```text
http://localhost:3000/api/docs
```

Print sugerido: página do Swagger aberta com o título da API.

## 10. Demonstrar Persistência

Veja os volumes:

```bash
docker volume ls
docker compose exec db pg_isready -U maya_user -d maya_rpg
```

Print sugerido: volume `pg_data` e banco respondendo.

Também confira pastas persistentes da API:

```bash
docker compose exec api ls -la /app/uploads
docker compose exec api ls -la /app/logs
```

## 11. Testar Backup

No Git Bash ou WSL:

```bash
./scripts/backup_db.sh
```

No PowerShell, se estiver usando Git Bash instalado:

```powershell
bash ./scripts/backup_db.sh
```

Depois liste:

```bash
dir backups
```

Print sugerido: arquivo `backup_YYYYMMDD_HHMMSS.sql` criado.

## 12. Testar Monitoramento

```bash
bash ./scripts/monitor_system.sh 5 15
```

Depois:

```bash
dir logs
```

Print sugerido: log de métricas criado em `logs/monitor`.

## 13. Testar Script de Gerenciamento

```bash
bash ./scripts/manage_services.sh status
bash ./scripts/manage_services.sh restart
```

Print sugerido: status dos containers e restart com healthcheck.

## 14. Testar Deploy Automatizado

```bash
bash ./scripts/deploy.sh
```

Print sugerido: etapas de build, backup, subida dos containers e healthcheck concluídas.

Se o deploy falhar porque a API demora a subir, rode:

```bash
docker compose logs api --tail=100
```

## 15. Teste de Carga com k6

Instale o k6 se necessário. Com a API rodando:

```bash
k6 run test/load/load-test.js
```

Print sugerido: resumo final do k6 com métricas de requisição.

## 16. Encerrar Ambiente

Para parar containers mantendo o volume do banco:

```bash
docker compose down
```

Para limpar também o volume do banco depois da demonstração:

```bash
docker compose down -v
```

Use `down -v` apenas quando não precisar mais dos dados locais.

## Checklist de Prints

- Estrutura da pasta sem `node_modules` e sem `.env`.
- `npm install` concluído.
- `npm run lint` sem erro.
- `npm run build` concluído.
- `npm test -- --runInBand` com 23 testes passando.
- `docker compose config` com serviços `api` e `db`.
- `docker compose build` concluído.
- `docker compose ps` com API e banco rodando.
- Swagger em `http://localhost:3000/api/docs`.
- Volume persistente e `pg_isready`.
- Backup criado em `backups`.
- Monitoramento criando log em `logs`.
- Deploy automatizado concluído.

## Antes de Enviar ao GitHub

Confira:

```bash
git status --short
```

Arquivos que não devem ser enviados:
- `.env`
- `node_modules/`
- `dist/`
- `logs/`
- `uploads/`
- `backups/`

Se esses arquivos aparecerem, confira o `.gitignore` antes de subir.

# Validação Final - Entrega 2

## Status geral

A solução foi validada para demonstração acadêmica em ambiente local containerizado.

## Escopo validado diretamente

- Mobile: build OK, 15 testes OK, dor 0–10, Fragment real, ConstraintLayout, Room, Retrofit, SyncWorker, FCM/ReminderWorker.
- Cloud/API containerizada: `npm ci` OK, build OK, 23 testes OK, Docker Compose OK, API e DB healthy, `/api/docs` OK, scripts mantidos (setup, monitoramento, backup, manage_services, deploy).

O módulo Web é apresentado como módulo complementar validado por build e não representa o escopo principal individual.

## Backend / API

- npm ci OK.
- npm run build OK.
- npm test OK, com 6 suites e 23 testes.
- docker compose config OK.
- docker compose up --build -d OK.
- API healthy.
- DB healthy.
- Swagger em /api/docs OK.

### Observações da API

- Dockerfile mantido.
- Dockerfile.db mantido.
- docker-compose.yml mantido.
- scripts/ mantido.
- load-test.js mantido.
- k6-load-test.js removido.
- .env está no .gitignore.
- .env.example mantido.

## Mobile

- build OK.
- 15 testes OK.
- API REST/Retrofit OK.
- JSON/Gson OK.
- SQLite/Room OK.
- autenticação JWT OK.
- FCM/ReminderWorker OK.
- check-in OK.
- dor 0–10 via Slider OK.
- histórico/evolução OK.
- gráfico/indicador OK.
- Fragment real em ExercisePlanActivity OK.
- ConstraintLayout OK.

### Observação do mobile

- O arquivo google-services.json é o arquivo de configuração cliente do Firebase/FCM necessário para notificações no Android. Não representa chave privada de servidor.

## Web

- módulo complementar.
- npm install OK.
- npm run build OK.
- lint com pendência de Prettier/CRLF legado.
- rotas, services e integração com API mantidos.
- src/environments e src/assets/images/login removidos por estarem vazios.

## Segurança e entrega

- .env não foi enviado.
- node_modules, dist e build não foram enviados.
- backups e artefatos gerados não foram enviados.
- o npm audit da API apontou vulnerabilidades, mas npm audit fix não foi executado para evitar quebra de dependências antes da entrega.

## Conclusão

O projeto está pronto para demonstração acadêmica da Entrega 2 em ambiente local containerizado.
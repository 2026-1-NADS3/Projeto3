# Validação Final - Entrega 2

## Status geral

A solução foi validada para demonstração acadêmica em ambiente local containerizado.

Validação técnica atualizada em 10/05/2026.

## Escopo validado diretamente

- Mobile: build debug OK, testes unitários OK, dor 0–10, Fragment real, ConstraintLayout, Room, Retrofit, SyncWorker, FCM/ReminderWorker.
- Cloud/API containerizada: build OK, 23 testes OK, Docker Compose config OK, healthchecks documentados para API e DB, scripts mantidos (setup, monitoramento, backup, manage_services, deploy).

O módulo Web é apresentado como módulo complementar validado por build e não representa o escopo principal individual.

## Backend / API

- `npm run build` OK.
- `npm test -- --runInBand` OK, com 6 suites e 23 testes.
- `docker compose config` OK.
- `docker compose up --build -d` permanece como fluxo documentado de demonstração.
- API healthy, DB healthy e Swagger em `/api/docs` quando os containers estão em execução.

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

- `gradlew.bat :app:testDebugUnitTest` OK.
- `gradlew.bat :app:assembleDebug` OK.
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
- dependências locais presentes.
- `npm run build` OK fora do sandbox; no sandbox houve bloqueio de acesso do Vite/esbuild a diretórios do usuário.
- `npm run lint` OK, com 8 warnings de Fast Refresh e 0 erros.
- rotas, services e integração com API mantidos.
- src/environments e src/assets/images/login removidos por estarem vazios.

### Observações de validação

- O build web emitiu aviso de chunk JavaScript acima de 500 kB; é melhoria futura, não erro de entrega.
- Os comandos Gradle falharam inicialmente no sandbox por bloqueio de rede ao baixar a distribuição (`Permission denied: getsockopt`) e passaram quando reexecutados fora do sandbox.
- O `docker compose config` validou serviços `api` e `db`, rede interna, volume persistente `pg_data`, healthchecks e variáveis de ambiente.

## Segurança e entrega

- .env não foi enviado.
- node_modules, dist e build não estão versionados para envio.
- backups e artefatos gerados não foram enviados.
- o npm audit da API apontou vulnerabilidades, mas npm audit fix não foi executado para evitar quebra de dependências antes da entrega.

## Conclusão

O projeto está pronto para demonstração acadêmica da Entrega 2 em ambiente local containerizado.

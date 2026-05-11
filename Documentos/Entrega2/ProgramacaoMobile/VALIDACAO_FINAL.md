# Validação Final - Entrega 2

## Status geral

A solução foi validada para demonstração acadêmica em ambiente local containerizado.

Validação técnica atualizada em 11/05/2026. Evidências em `imagens-maya/`.

## Escopo validado diretamente

- **Mobile:** build debug OK, testes unitários OK, dor 0–10, Fragment real, ConstraintLayout, Room, Retrofit, SyncWorker. FCM integrado e diálogo de permissão exibido no dispositivo real (`Imagens/mobile/08-fcm-permission-dialog.png`). ReminderWorker registrado no código (sem print de lembrete disparado).
- **Cloud/API containerizada:** build OK, 23 testes OK (`imagens-maya/cloud-native/04-npm-test-23-passing.png`), `docker compose config` OK, healthchecks documentados para API e DB, scripts mantidos (setup, monitoramento, backup, manage_services, deploy) — todos com prints de execução real.
- **Teste de carga (k6):** executado com p95 = 2.42 ms, 0.00% falha, 5451/5451 checks (`imagens-maya/cloud-native/25-k6-load-test.png`).

O módulo Web é apresentado como módulo complementar validado por build e não representa o escopo principal individual.

## Backend / API

- `npm run lint` OK (`imagens-maya/cloud-native/02-npm-lint.png`).
- `npm run build` OK (`imagens-maya/cloud-native/03-npm-build.png`).
- `npm test -- --runInBand` OK, com 6 suítes e 23 testes PASS em 3.028s (`imagens-maya/cloud-native/04-npm-test-23-passing.png`).
- `docker compose config` OK (`imagens-maya/cloud-native/05-` e `06-docker-compose-config-*.png`).
- `docker compose build` OK (`imagens-maya/cloud-native/08-docker-compose-build.png`).
- `docker compose up --build -d` com containers `Healthy` (`imagens-maya/cloud-native/09-docker-compose-up-healthy.png`).
- API healthy, DB healthy, Swagger em `/api/docs` (`imagens-maya/cloud-native/10-`, `11-`, `12-`, `13-swagger.png`).

### Observações da API

- Dockerfile mantido.
- Dockerfile.db mantido.
- docker-compose.yml mantido.
- scripts/ mantido (5 scripts com prints de execução real).
- load-test.js mantido e executado com resultado real registrado.
- .env está no .gitignore.
- .env.example mantido.

## Mobile

- `gradlew.bat :app:testDebugUnitTest` OK (validado fora do sandbox em 10/05/2026).
- `gradlew.bat :app:assembleDebug` OK (validado fora do sandbox em 10/05/2026).
- API REST/Retrofit OK.
- JSON/Gson OK.
- SQLite/Room OK.
- autenticação JWT OK.
- FCM/ReminderWorker integrados no código — status Parcial até que print de notificação real seja anexado.
- check-in OK.
- dor 0–10 via Slider OK.
- histórico/evolução OK.
- gráfico/indicador OK.
- Fragment real em ExercisePlanActivity OK.
- ConstraintLayout OK.

### Observação do mobile

- O arquivo `google-services.json` é o arquivo de configuração cliente do Firebase/FCM necessário para notificações no Android. Não representa chave privada de servidor.
- Prints do mobile estão pendentes em `imagens-maya/mobile/` — lista completa em `Sistemas Operacionais e Arquiteturas Cloud Native/docs/03-testes-e-evidencias.md`, Seção 9.2.

## Cloud Native

- Dockerfile (multi-stage, Node 20-alpine, usuário não-root, curl para healthcheck): OK.
- Dockerfile.db (postgres:16-alpine): OK.
- docker-compose.yml (API + DB + rede `maya-network` + volume `pg_data` + bind mounts uploads/logs + healthchecks): OK.
- Variáveis de ambiente (`.env.example` completo, `.env` real evidenciado em `imagens-maya/cloud-native/01-env-configurado.png`): OK.
- Scripts (`setup_env.sh`, `monitor_system.sh`, `backup_db.sh`, `manage_services.sh`, `deploy.sh`): OK.
  - `setup_env.sh` é script de **verificação automatizada** de dependências (não de instalação). Decisão documentada em `RELATORIO_CLOUD_NATIVE.md` Seção 6.1.
- Backup do banco executado com sucesso: arquivo `backup_20260511_125410.sql` em `backups/` (`imagens-maya/cloud-native/16-` e `17-`).
- Monitoramento executado: log em `logs/monitor/metrics_20260511_125456.log` (`imagens-maya/cloud-native/18-monitor-system-sh.png`).
- Deploy automatizado executado de ponta a ponta: 5 prints sequenciais (`imagens-maya/cloud-native/20-` a `24-`).

## Web

- módulo complementar.
- dependências locais presentes.
- `npm run build` OK fora do sandbox; no sandbox houve bloqueio de acesso do Vite/esbuild a diretórios do usuário.
- `npm run lint` OK, com 8 warnings de Fast Refresh e 0 erros.
- rotas, services e integração com API mantidos.

### Observações de validação

- O build web emitiu aviso de chunk JavaScript acima de 500 kB; é melhoria futura, não erro de entrega.
- Os comandos Gradle falharam inicialmente no sandbox por bloqueio de rede ao baixar a distribuição (`Permission denied: getsockopt`) e passaram quando reexecutados fora do sandbox.
- O `docker compose config` validou serviços `api` e `db`, rede interna, volume persistente `pg_data`, healthchecks e variáveis de ambiente.

## Teste de carga (k6) — resultado real

Execução em 11/05/2026 (`imagens-maya/cloud-native/25-k6-load-test.png`):

| Métrica | Valor | Threshold | Resultado |
|---|---|---|---|
| `http_req_duration` p(95) | 2.42 ms | < 500 ms | ✅ |
| `http_req_failed` | 0.00% | < 1% | ✅ |
| Checks succeeded | 5451 / 5451 | — | ✅ |
| Iterations | 1817 (15.07/s) | — | — |
| VUs máx | 20 | — | — |
| Duração | 2m30s | — | — |

## Segurança e entrega

- .env não foi enviado.
- node_modules, dist e build não estão versionados para envio.
- backups e artefatos gerados não foram enviados.
- o npm audit da API apontou vulnerabilidades, mas npm audit fix não foi executado para evitar quebra de dependências antes da entrega.

## Pendências de evidências

- Print do `npm run test:e2e` (opcional — testes unitários já cobertos por 23/23 PASS).

## Conclusão

O projeto está pronto para demonstração acadêmica da Entrega 2 em ambiente local containerizado. As evidências visuais estão completas: 25 prints em `Imagens/cloud-native/` (Cloud Native), 17 prints em `Imagens/mobile/` (fluxo completo do paciente no app Android) e 12 prints em `Imagens/postman-api/` (fluxo completo da API). Total: 54 prints validados em 11/05/2026. Guia ilustrado em `Sistemas Operacionais e Arquiteturas Cloud Native/docs/00-guia-ilustrado.md`.

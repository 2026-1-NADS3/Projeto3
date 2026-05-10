# PIFisioterapiaMayaRPG - Entrega 2

## Escopo individual desta entrega

Esta entrega está organizada dentro do projeto integrado Clínica Maya. Neste semestre, minha responsabilidade direta foi a implementação e validação dos blocos de Programação Mobile e Cloud Native/Infraestrutura com Linux. Os módulos Web, UX, Testes/Qualidade e demais artefatos aparecem como contexto do projeto interdisciplinar e apoio à demonstração, mas não representam o escopo principal da minha entrega individual.

## Visão geral

Este repositório reúne a solução integrada da Clínica Maya para a Entrega 2 do PI 3ADS 2026.

O projeto é composto por:

- backend: [maya-rpg-api](backend)
- mobile: [MayaRPG-mobile](mobile)
- web: [maya-rpg-web](web), módulo complementar

A solução cobre o fluxo principal da clínica:

1. O profissional cadastra paciente, avaliação e prontuário.
2. O profissional prescreve exercícios com mídia, frequência e orientações.
3. O paciente acessa o plano no aplicativo mobile.
4. O paciente registra execução, dor de 0 a 10 e observações.
5. O profissional acompanha a evolução e ajusta a conduta.

O conjunto está preparado para demonstração acadêmica em ambiente local containerizado.

## Estrutura do repositório

- backend: API NestJS com autenticação, prescrições, check-ins, prontuário, upload e Swagger.
- mobile: aplicativo Android do paciente com consumo de API REST, Room, sincronização, notificações e evolução.
- web: módulo complementar para profissional e admin com pacientes, exercícios, prescrições, prontuário e dashboard.
- docs: documentação final da Entrega 2.

## Backend

O backend centraliza os dados clínicos e expõe os contratos consumidos pelo mobile e pelo web.

Status validado:

- npm ci OK.
- npm run build OK.
- npm test OK, com 6 suites e 23 testes.
- docker compose config OK.
- docker compose up --build -d OK.
- API healthy.
- DB healthy.
- Swagger em /api/docs OK.

Artefatos mantidos:

- Dockerfile.
- Dockerfile.db.
- docker-compose.yml.
- scripts/.
- load-test.js.
- .env.example.

Como rodar o backend:

1. Criar o arquivo .env a partir de .env.example.
2. Instalar dependências com npm ci.
3. Subir a API em modo local ou via Docker.
4. Acessar a documentação em /api/docs.

## Mobile

O aplicativo Android foi validado com:

- build OK.
- 15 testes OK.
- API REST/Retrofit OK.
- JSON/Gson OK.
- SQLite/Room OK.
- autenticação JWT OK.
- FCM/ReminderWorker OK.
- check-in OK.
- dor de 0 a 10 via Slider OK.
- histórico/evolução OK.
- gráfico/indicador OK.
- Fragment real em ExercisePlanActivity OK.
- ConstraintLayout OK.

O arquivo google-services.json é o arquivo de configuração cliente do Firebase/FCM necessário para notificações no Android. Não representa chave privada de servidor.

Como rodar o mobile:

1. Abrir o projeto no Android Studio.
2. Garantir que o arquivo google-services.json esteja presente.
3. Executar o build e os testes do Gradle.
4. Configurar a API base de acordo com o ambiente local ou containerizado.

## Web

O web atua como módulo complementar para o profissional e o admin.

Status validado:

- npm install OK.
- npm run build OK.
- lint com pendência de Prettier/CRLF legado.
- rotas, services e integração com a API mantidos.
- src/environments/ e src/assets/images/login/ removidos por estarem vazios.

Cobertura funcional do web:

- gestão de pacientes.
- prontuário eletrônico.
- banco de exercícios.
- prescrições.
- painel com indicadores.
- permissões por perfil.

Como rodar o web:

1. Instalar dependências com npm install.
2. Executar npm run build.
3. Executar npm run lint quando for necessário avaliar a pendência de formatação.

## Documentação

- [REQUISITOS_IMPLEMENTADOS.md](docs/REQUISITOS_IMPLEMENTADOS.md)
- [ROTEIRO_DEMONSTRACAO.md](docs/ROTEIRO_DEMONSTRACAO.md)
- [AMBIENTE_SETUP.md](docs/AMBIENTE_SETUP.md)
- [RELATORIO_CLOUD_NATIVE.md](docs/RELATORIO_CLOUD_NATIVE.md)
- [TESTES_E_QUALIDADE.md](docs/TESTES_E_QUALIDADE.md)
- [UX_HEART_E_PROTOTIPO.md](docs/UX_HEART_E_PROTOTIPO.md)
- [DOCUMENTO_EXTENSAO_COM_EMPRESA.md](docs/DOCUMENTO_EXTENSAO_COM_EMPRESA.md)
- [VALIDACAO_FINAL.md](docs/VALIDACAO_FINAL.md)
- [ROTEIRO_PITCH_BANNER.md](docs/ROTEIRO_PITCH_BANNER.md)

## Observações importantes

- O arquivo .env não deve ser enviado para o Git; use sempre .env.example como base.
- Não copiar node_modules, dist, build, logs, backups ou artefatos gerados.
- O objetivo é manter um pacote limpo, enxuto e revisável.
- A entrega final deve ser apresentada como pronta para demonstração acadêmica em ambiente local containerizado.

## Resumo da entrega

- Mobile validado com build e testes.
- API validada com build, testes, Docker e Swagger.
- Web validado com build, mantendo-se como módulo complementar.
- Documentação final organizada para apoiar a demonstração e a avaliação acadêmica.
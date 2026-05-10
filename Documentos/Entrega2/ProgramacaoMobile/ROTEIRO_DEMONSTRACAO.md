# Roteiro de Demonstração - Entrega 2

## Prioridade de Demonstração

Priorizar a demonstração nos seguintes itens (escopo individual):

- app mobile (fluxo do paciente)
- plano de exercícios
- check-in
- registro de dor 0–10
- histórico e evolução clínica
- notificações e lembretes (FCM/ReminderWorker)
- backend em Docker (API containerizada)
- containers healthy e scripts de infraestrutura (setup, monitoramento, backup, gerenciamento)

O módulo web aparece como módulo complementar do projeto integrado e é exibido apenas como apoio à demonstração.

## Objetivo

Este roteiro organiza a demonstração acadêmica da solução Clínica Maya em ambiente local containerizado.

## 1. Subir o backend com Docker

1. Abrir o Docker Desktop.
2. Entrar na pasta do backend.
3. Executar a subida dos containers.
4. Aguardar a inicialização completa da API e do banco.
5. Confirmar que os containers estão healthy.

Pontos a mostrar:

- API no container.
- Banco PostgreSQL no container.
- Persistência e ambiente local funcionando.

## 2. Abrir o Swagger

1. Acessar a API.
2. Abrir a documentação em /api/docs.
3. Mostrar os principais grupos de endpoints:
   - autenticação
   - pacientes
   - exercícios
   - prescrições
   - check-ins
   - prontuário
   - usuários
   - upload

## 3. Rodar os testes da API

1. Executar os testes do backend.
2. Mostrar o resultado validado de 6 suites e 23 testes.
3. Destacar que a API foi validada antes da demonstração.

## 4. Mostrar scripts de infraestrutura

1. Apresentar os scripts Shell/Bash mantidos na API.
2. Explicar o papel de cada script no ciclo de desenvolvimento.
3. Destacar que setup, monitoramento, backup, gerenciamento e deploy são automatizados.

Scripts a citar:

- setup_env.sh: prepara o ambiente.
- monitor_system.sh: monitora CPU, memória, disco e logs.
- backup_db.sh: gera backup do banco de desenvolvimento.
- manage_services.sh: inicia, para, consulta status e reinicia serviços.
- deploy.sh: automatiza o fluxo de deploy com Docker.

## 5. Abrir o mobile

1. Executar o app Android.
2. Fazer login com usuário de demonstração.
3. Mostrar o fluxo de aceite LGPD quando aplicável.
4. Entrar na tela inicial do paciente.

## 6. Mostrar o plano de exercícios

1. Abrir a tela do plano de exercícios.
2. Mostrar os dados vindos da API REST.
3. Destacar que o app consome JSON via Retrofit.
4. Mostrar imagens, vídeos ou referência visual do exercício, quando disponível.

## 7. Mostrar o detalhe do exercício

1. Abrir a tela de detalhe.
2. Mostrar orientação, frequência e descrição.
3. Mostrar o uso de Fragment real em ExercisePlanActivity.

## 8. Realizar check-in

1. Selecionar o exercício executado.
2. Informar a dor de 0 a 10.
3. Adicionar observações.
4. Confirmar o envio do check-in.
5. Mostrar a persistência local com Room e a sincronização com a API.

## 9. Mostrar histórico e evolução

1. Abrir a tela de histórico.
2. Mostrar os registros anteriores.
3. Destacar a evolução clínica e o gráfico ou indicador simples.
4. Relacionar com o acompanhamento do profissional.

## 10. Mostrar notificações e lembretes

1. Exibir o suporte a notificações do app.
2. Explicar o uso de FCM e ReminderWorker.
3. Mostrar como os lembretes apoiam a adesão ao plano.

## 11. Abrir o web

1. Abrir o módulo web.
2. Entrar no dashboard.
3. Mostrar pacientes, exercícios, prescrições e prontuário.
4. Destacar que o web é um módulo complementar do projeto integrado.

## 12. Mostrar containers e validação final

1. Mostrar os containers healthy.
2. Exibir o build e os testes já validados.
3. Reforçar que a solução foi validada em ambiente local containerizado.

## Fechamento

A demonstração deve reforçar o fluxo integrado:

- profissional cadastra e acompanha;
- paciente executa e registra;
- backend centraliza e sincroniza;
- web complementa o acompanhamento clínico;
- mobile sustenta o uso do paciente.
# Roteiro De Demonstração Final

1. Entrar no web como admin/profissional.
2. Cadastrar ou abrir o paciente demo `Ana Silva Demo`.
3. Confirmar status LGPD como aceito.
4. Cadastrar exercícios com imagem/vídeo ou usar os exercícios demo.
5. Criar a prescrição `Plano RPG Lombar Inicial`.
6. Entrar no mobile com o paciente.
7. Visualizar o plano vindo da API.
8. Abrir um exercício com mídia.
9. Registrar check-in selecionando o exercício, dor 0 a 10 e observação.
10. Deixar o WorkManager sincronizar ou abrir o app com internet.
11. Voltar ao web e abrir a aba Evolução do paciente.
12. Mostrar o check-in real em `/exercise-executions/patient/:patientId`.

## Contas Demo

Quando `SEED_DEMO_DATA=true`:

- Admin padrão: `teste@mayarpg.com` / `senhaSuperSegura123`
- Profissional demo: `maya.profissional@mayarpg.com` / `senhaSuperSegura123`
- Paciente com LGPD: `ana.silva.demo@mayarpg.com` / `11122233344`
- Paciente pendente LGPD: `bruno.costa.demo@mayarpg.com` / `22233344455`

## Validações

```bash
# API
npm run build
npm test -- --runInBand

# Web
npm run build
npm test -- --watch=false

# Mobile
./gradlew :app:assembleDebug
```

<div align="center">

![Android](https://img.shields.io/badge/Android-34A853?style=for-the-badge&logo=android&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Room](https://img.shields.io/badge/Room-4285F4?style=for-the-badge&logo=android&logoColor=white)

<br/>

# Programação Mobile — Entrega 2
### Maya RPG · Clínica Maya Yoshiko Yamamoto

*PI 3ADS · FECAP 2026 · Equipe TechCare*

</div>

---

## Sobre

App Android para pacientes da Clínica Maya RPG. O app conecta o paciente ao seu plano de fisioterapia: visualiza exercícios prescritos, registra execuções com nível de dor e acompanha a própria evolução — com suporte offline via Room/SQLite.

Código-fonte: [`src/Entrega 2/mobile/`](../../../src/Entrega%202/mobile/)

---

## Stack

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| Linguagem | Java (Android SDK) | Principal |
| HTTP | Retrofit 2 + Gson | Consumo da API REST |
| Persistência local | Room (SQLite) | Cache offline e histórico |
| Notificações | Firebase Cloud Messaging | Push notifications |
| Background | WorkManager | Sync offline + lembretes |
| Gráficos | MPAndroidChart | Evolução da dor |
| Layouts | ConstraintLayout | Todos os XMLs de interface |
| Auth | JWT | Login por e-mail ou CPF |

---

## Requisitos Implementados

| Requisito | Evidência | Status |
|-----------|-----------|:------:|
| Consumo de API REST via Retrofit + Gson | Build OK + telas funcionando | ✅ |
| Autenticação JWT (e-mail ou CPF) | `ui/auth/LoginActivity.java` | ✅ |
| Persistência offline com Room (SQLite) | `db/` — tabela `exercise_sessions` | ✅ |
| Check-in por exercício com `exerciseId` | `ui/exercises/CheckInActivity.java` | ✅ |
| Nível de dor 0–10 via Slider | Layout + `CheckInActivity` | ✅ |
| Campo de observações no check-in | Formulário de check-in | ✅ |
| Sincronização automática ao reconectar | `worker/SyncWorker.java` | ✅ |
| Histórico e evolução do paciente | `ui/evolution/` | ✅ |
| Gráfico de progresso (MPAndroidChart) | `10-minha-evolucao-grafico.png` | ✅ |
| Aceite de LGPD integrado ao fluxo | `ui/auth/LgpdConsentActivity.java` | ✅ |
| Fragment real em `ExercisePlanActivity` | `ui/exercises/ExercisePlanActivity.java` | ✅ |
| Múltiplas Activities + Intents | Estrutura de navegação completa | ✅ |
| Layouts 100% ConstraintLayout | `res/layout/*.xml` | ✅ |
| TextView, ImageView e Button | Presentes em todas as telas | ✅ |
| Push notifications FCM | `fcm/` — diálogo de permissão exibido no device | ⚠️ Parcial |
| Lembretes locais (WorkManager) | `worker/ReminderWorker.java` | ⚠️ Parcial |

> **Parcial** = implementação presente no código. Evidência disponível: diálogo de permissão FCM exibido no dispositivo real (`Imagens/mobile/08-fcm-permission-dialog.png`). Print de notificação push recebida não anexado.

---

## Fluxo do Paciente

```
[Splash] → [Login] → [Aceite LGPD] → [Home / Dashboard]
                                              │
                     ┌────────────────────────┼───────────────────┐
                     ▼                        ▼                   ▼
           [Plano de Exercícios]      [Realizar Check-in]    [Minha Evolução]
            lista + mídia              exercício + dor         gráfico + histórico
                                        0–10 + notas
                                              │
                              ┌───────────────┴───────────────┐
                              │         Offline?               │
                              ▼                               ▼
                       [Salva no Room]            [Sync ao reconectar]
```

1. **Login** — e-mail cadastrado. No primeiro acesso a senha é o CPF (só números).
2. **Aceite LGPD** — obrigatório no primeiro acesso.
3. **Plano** — carrega da API; sem internet usa o último cache do Room.
4. **Check-in** — seleciona exercício → ajusta slider de dor → adiciona nota → confirma.
5. **Evolução** — gráfico de dor por sessão + histórico completo.

---

## Setup e Build

### Pré-requisitos

- Java (JDK 17+)
- Android Studio (SDK configurado)
- `google-services.json` em `app/` (configuração cliente Firebase — não é chave privada)
- Backend rodando (local ou Render)

### Comandos

```powershell
# Build do APK de debug
.\gradlew.bat :app:assembleDebug

# Testes unitários
.\gradlew.bat :app:testDebugUnitTest
```

Validado em **10/05/2026** — ambos finalizaram com código 0 fora do sandbox.

> No sandbox do Codex os comandos Gradle falham por bloqueio de rede ao baixar a distribuição (`Permission denied: getsockopt`). Executar fora do sandbox resolve.

### URL da API

Configurada em `app/build.gradle.kts`:

| Ambiente | URL |
|----------|-----|
| Produção (Render) | `https://maya-rpg-api-1t7v.onrender.com/api/` |
| Emulador Android | `http://10.0.2.2:3000/api/` |
| Dispositivo físico | `http://<IP_DA_MAQUINA>:3000/api/` |

---

## Contrato de Check-in

```json
{
  "prescriptionId": "uuid-da-prescricao",
  "exerciseId":     "uuid-do-exercicio",
  "painLevel":      4,
  "notes":          "Executei sem dor aguda",
  "executedAt":     "2026-05-02T12:00:00.000Z"
}
```

Endpoint online: `POST /api/check-ins`  
Sincronização em lote (offline): `POST /api/check-ins/sync`

---

## Evidências Visuais

17 prints do fluxo completo em [`Imagens/mobile/`](../../../Imagens/mobile/):

| # | Arquivo | Tela |
|--:|---------|------|
| 1 | `01-build-android-studio-successful.png` | BUILD SUCCESSFUL — assembleDebug |
| 2 | `02-splash-bem-vindo.png` | Splash screen |
| 3 | `03-login-vazio.png` | Login (campos vazios) |
| 4 | `04-login-preenchido.png` | Login preenchido |
| 5 | `05-primeiro-acesso-criar-senha.png` | Primeiro acesso — criar senha |
| 6 | `06-lgpd-termo-aceitar.png` | Termo LGPD — aguardando aceite |
| 7 | `07-lgpd-salvando.png` | Termo LGPD — aceito e salvando |
| 8 | `08-fcm-permission-dialog.png` | Diálogo nativo FCM de permissão |
| 9 | `09-home-dashboard.png` | Home — dashboard do paciente |
| 10 | `10-minha-evolucao-grafico.png` | Minha Evolução — gráfico MPAndroidChart |
| 11 | `11-plano-exercicios-lista.png` | Plano de exercícios — lista |
| 12 | `12-configuracoes.png` | Configurações |
| 13 | `13-configuracoes-sair-confirmacao.png` | Confirmação de logout |
| 14 | `14-editar-perfil.png` | Editar perfil |
| 15 | `15-agendar-sessao-calendario.png` | Agendar sessão — calendário |
| 16 | `16-mensagens.png` | Mensagens |
| 17 | `17-minha-agenda.png` | Minha agenda |

Guia ilustrado completo (cada etapa + print): [`docs/00-guia-ilustrado.md`](../Sistemas%20Operacionais%20e%20Arquiteturas%20Cloud%20Native/docs/00-guia-ilustrado.md)

---

## Roteiro de Demonstração

**Sequência recomendada para apresentação:**

1. Mostrar `01-build-android-studio-successful.png` — BUILD SUCCESSFUL
2. Iniciar o app no dispositivo/emulador → splash → tela de login
3. Login com e-mail do paciente de demo (primeiro acesso: senha = CPF)
4. Mostrar tela de criação de nova senha (`05-primeiro-acesso-criar-senha.png`)
5. Aceitar o termo LGPD (`06` e `07`)
6. Diálogo FCM de permissão de notificações (`08`)
7. Home com dashboard do paciente (`09`)
8. Abrir "Plano de Exercícios" → mostrar lista vinda da API via Retrofit (`11`)
9. Realizar check-in: selecionar exercício → slider de dor → confirmar
10. Abrir "Minha Evolução" → gráfico MPAndroidChart (`10`)
11. Mostrar Configurações, Editar Perfil e Agenda (`12`–`17`)
12. Demonstrar offline: desativar rede → fazer check-in → reativar → mostrar sync

---

<div align="center">

**Equipe TechCare** · FECAP — Centro Universitário · ADS 2026

</div>

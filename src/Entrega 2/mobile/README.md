<div align="center">

![Android](https://img.shields.io/badge/Android-34A853?style=for-the-badge&logo=android&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![SQLite](https://img.shields.io/badge/Room%2FSQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![WorkManager](https://img.shields.io/badge/WorkManager-4285F4?style=for-the-badge&logo=android&logoColor=white)

<br/>

# Maya RPG Mobile
### App Android do Paciente

*Clínica Maya Yoshiko Yamamoto · PI 3ADS · FECAP 2026*

</div>

---

## O que é

App Android para pacientes de RPG (Reeducação Postural Global). Conecta ao backend Maya RPG via API REST e permite:

- Visualizar o plano de exercícios prescrito pela fisioterapeuta
- Registrar check-ins com nível de dor (0–10) e observações
- Acompanhar a evolução com gráfico histórico
- Funcionar offline — dados salvos no Room e sincronizados ao reconectar

---

## Estrutura do Código

```
app/src/main/java/com/maya/rpg/
│
├── api/            Retrofit client, ApiService, TokenManager (JWT)
├── db/             Room: Database, DAOs, Entidades
├── fcm/            Firebase Cloud Messaging
├── model/          POJOs para requests/responses da API
│
├── ui/
│   ├── auth/       Login, primeiro acesso, LGPD
│   ├── home/       Dashboard do paciente
│   ├── exercises/  Lista do plano + check-in
│   ├── evolution/  Gráfico e histórico de dor
│   └── splash/     Tela de abertura
│
├── worker/         SyncWorker (sync offline), ReminderWorker (lembretes)
├── notifications/  Helpers para notificações locais
└── MayaApplication.java
```

---

## Build e Testes

```powershell
# Build APK debug
.\gradlew.bat :app:assembleDebug

# Testes unitários
.\gradlew.bat :app:testDebugUnitTest
```

**Resultado (10/05/2026):** ambos finalizaram com código 0 fora do sandbox.

Testes presentes em `app/src/test/`:

| Arquivo | Cobre |
|---------|-------|
| `TokenManagerTest.java` | Lógica de tokens JWT |
| `SyncWorkerLogicTest.java` | Decisão de sincronização |
| `ExerciseSessionDaoTest.java` | Operações Room/DAO |
| `ModelContractTest.java` | Contrato dos modelos de API |

---

## Requisitos da Entrega 2

| Requisito | Arquivo principal | Status |
|-----------|------------------|:------:|
| API REST via Retrofit + Gson | `api/ApiService.java` | ✅ |
| Autenticação JWT | `api/TokenManager.java` | ✅ |
| Room (SQLite) offline | `db/` | ✅ |
| Check-in com `exerciseId` | `ui/exercises/CheckInActivity.java` | ✅ |
| Slider de dor 0–10 | Layout + CheckInActivity | ✅ |
| Observações no check-in | Formulário de check-in | ✅ |
| Sync automático (WorkManager) | `worker/SyncWorker.java` | ✅ |
| Histórico e evolução | `ui/evolution/` | ✅ |
| Gráfico MPAndroidChart | EvolutionFragment | ✅ |
| Aceite LGPD | `ui/auth/LgpdConsentActivity.java` | ✅ |
| Fragment real | `ExercisePlanActivity` → Fragment | ✅ |
| Múltiplas Activities + Intents | Toda a navegação | ✅ |
| ConstraintLayout | `res/layout/*.xml` | ✅ |
| TextView, ImageView, Button | Todas as telas | ✅ |
| FCM push notifications | `fcm/` — permissão exibida no device | ⚠️ Parcial |
| Lembretes WorkManager | `worker/ReminderWorker.java` | ⚠️ Parcial |

---

## Configuração da API

Definida em `app/build.gradle.kts`:

```kotlin
buildConfigField("String", "API_BASE_URL", "\"https://maya-rpg-api-1t7v.onrender.com/api/\"")
```

| Ambiente | URL |
|----------|-----|
| Produção | `https://maya-rpg-api-1t7v.onrender.com/api/` |
| Emulador | `http://10.0.2.2:3000/api/` |
| Dispositivo físico | `http://<IP_DA_MAQUINA>:3000/api/` |

> `google-services.json` deve estar em `app/`. É o arquivo de configuração **cliente** do Firebase — não contém chaves privadas de servidor.

---

## Credenciais de Teste

Ative o seed de dados com `SEED_DEMO_DATA=true` no `.env` do backend antes de subir os containers.

| E-mail | Senha (primeiro acesso: CPF) | Perfil |
|--------|------------------------------|--------|
| `ana.silva.demo@mayarpg.com` | `11122233344` | **PACIENTE** (use no app mobile) |
| `bruno.costa.demo@mayarpg.com` | `22233344455` | PACIENTE |
| `maya.profissional@mayarpg.com` | `senhaSuperSegura123` | PROFISSIONAL |

> No primeiro acesso o app solicita criação de nova senha — basta redefinir após o login inicial.  
> O admin é configurado via variáveis `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` no `.env`.

---

## Contrato de Check-in

```json
POST /api/check-ins
{
  "prescriptionId": "uuid",
  "exerciseId":     "uuid",
  "painLevel":      4,
  "notes":          "Executei sem dor aguda",
  "executedAt":     "2026-05-02T12:00:00.000Z"
}
```

Sincronização em lote (offline): `POST /api/check-ins/sync`

---

## Evidências Visuais

17 prints em [`Imagens/mobile/`](../../../Imagens/mobile/) — fluxo completo validado em 11/05/2026.

Guia ilustrado com cada tela + print real: [`docs/00-guia-ilustrado.md`](../../Documentos/Entrega2/Sistemas%20Operacionais%20e%20Arquiteturas%20Cloud%20Native/docs/00-guia-ilustrado.md)

---

<div align="center">

**Equipe TechCare** · FECAP — Centro Universitário · ADS 2026

</div>

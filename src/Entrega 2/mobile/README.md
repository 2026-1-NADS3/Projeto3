<div align="center">

![Android](https://img.shields.io/badge/Android-34A853?style=for-the-badge&logo=android&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

<br/>

# 📱 Maya RPG Mobile
### Aplicativo Android do Paciente

*Clínica Maya Yoshiko Yamamoto — PI 3ADS FECAP 2026*

</div>

---

## 📖 Sobre

Aplicativo Android desenvolvido para a **Clínica Maya Yoshiko Yamamoto** como parte do Projeto Interdisciplinar do 3º Semestre de ADS (FECAP, 2026).

Permite que pacientes **visualizem seus planos de exercícios**, **registrem execuções (check-in)** com nível de dor, e **acompanhem sua evolução** ao longo do tratamento.

---

## 🛠️ Stack de Tecnologias

| Categoria | Tecnologia | Função |
|-----------|-----------|--------|
| ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white) | Java (Android SDK) | Linguagem principal |
| ![Retrofit](https://img.shields.io/badge/Retrofit-48B983?style=flat&logoColor=white) | Retrofit 2 | Consumo da API REST / JSON |
| ![SQLite](https://img.shields.io/badge/Room%20%2F%20SQLite-003B57?style=flat&logo=sqlite&logoColor=white) | Room + SQLite | Persistência local e cache offline |
| ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black) | Firebase Cloud Messaging | Push notifications |
| ⚙️ | WorkManager | Sincronização em segundo plano e lembretes |
| 📊 | MPAndroidChart | Gráficos de evolução da dor |
| 🧩 | ConstraintLayout | Todos os layouts de interface |

---

## 📂 Estrutura do Projeto

```
app/src/main/java/com/maya/rpg/
│
├── 📁 api/             # Retrofit, interface da API e gestão de tokens JWT
├── 📁 db/              # Room: Database, DAOs e Entidades
├── 📁 fcm/             # Firebase Cloud Messaging
├── 📁 model/           # POJOs para requisições e respostas da API
│
├── 📁 ui/
│   ├── 📁 auth/        # Login e recuperação de senha
│   ├── 📁 home/        # Dashboard principal do paciente
│   ├── 📁 exercises/   # Listagem e check-in de exercícios
│   ├── 📁 evolution/   # Gráficos e histórico de progresso
│   └── 📁 splash/      # Tela de abertura
│
├── 📁 worker/          # WorkManager — sincronização offline
├── 📁 notifications/   # Helpers para notificações locais
└── MayaApplication.java

app/src/main/res/
├── 📁 layout/          # XMLs de interface (ConstraintLayout)
├── 📁 drawable/        # Ícones, backgrounds e recursos visuais
├── 📁 values/          # Cores, strings e temas
└── 📁 menu/            # Menus de navegação
```

---

## ✅ Requisitos Implementados — Entrega 2

| Requisito | Status |
|-----------|:------:|
| Consumo de API REST via Retrofit + JSON/Gson | ✅ |
| Autenticação JWT (login por e-mail ou CPF) | ✅ |
| Persistência offline com Room (SQLite) | ✅ |
| Check-in por exercício com `exerciseId` | ✅ |
| Nível de dor 0–10 via Slider | ✅ |
| Campo de observações no check-in | ✅ |
| Sincronização automática ao reconectar (WorkManager) | ✅ |
| Histórico e evolução do paciente | ✅ |
| Gráfico de progresso (MPAndroidChart) | ✅ |
| Push notifications (FCM) | ⚠️ Parcial — código integrado, sem print de notificação real no dispositivo |
| Lembretes locais (WorkManager) | ⚠️ Parcial — `ReminderWorker` registrado, sem print de lembrete disparado |
| Aceite de LGPD integrado ao fluxo de autenticação | ✅ |
| Fragment real em `ExercisePlanActivity` | ✅ |
| Múltiplas Activities com Intents | ✅ |
| Layouts 100% em ConstraintLayout | ✅ |
| TextView, ImageView e Button | ✅ |

---

## ⚙️ Configuração

### Pré-requisitos

- Java instalado e configurado
- Android Studio com SDK configurado
- `google-services.json` presente em `app/`
- Backend rodando localmente ou em produção

> ℹ️ O `google-services.json` é o arquivo de configuração **cliente** do Firebase/FCM. Não contém chaves privadas de servidor.

### URL da API

Configurada em `app/build.gradle.kts`:

```groovy
buildConfigField(
    "String",
    "API_BASE_URL",
    "\"https://maya-rpg-api-1t7v.onrender.com/api/\""
)
```

Para testes locais, substitua pela URL adequada:

| Ambiente | URL |
|----------|-----|
| Emulador Android | `http://10.0.2.2:3000/api/` |
| Dispositivo físico | `http://<IP_DA_MAQUINA>:3000/api/` |

### Build e testes

```bash
gradlew.bat :app:assembleDebug
gradlew.bat :app:testDebugUnitTest
```

Ambos os comandos finalizaram com código 0. Validado em **10/05/2026**.

> ⚠️ No sandbox do Codex, o Gradle falhou ao baixar a distribuição por bloqueio de rede (`Permission denied: getsockopt`). Reexecutado fora do sandbox, testes e build passaram normalmente.

---

## 📱 Fluxo de Uso

```
┌─────────────────────────────────────────────────────────────┐
│                      FLUXO DO PACIENTE                      │
│                                                             │
│  [Login]──▶[Aceite LGPD]──▶[Home / Dashboard]              │
│                                   │                         │
│              ┌────────────────────┼──────────────────┐      │
│              ▼                    ▼                  ▼      │
│       [Meus Exercícios]    [Realizar Check-in]  [Evolução]  │
│        (lista + mídia)     (exercício + dor     (gráfico +  │
│                             0–10 + notas)       histórico)  │
│                                   │                         │
│                    ┌──────────────┴──────────────┐          │
│                    │         Sem internet?        │          │
│                    ▼                             ▼          │
│             [Salva no Room]          [Sync automático       │
│                                       ao reconectar]        │
└─────────────────────────────────────────────────────────────┘
```

1. **Login** — informe o e-mail cadastrado. No primeiro acesso, a senha é o CPF (apenas números).
2. **Aceite LGPD** — exibido no primeiro acesso; obrigatório para prosseguir.
3. **Plano de exercícios** — toque em "Meus Exercícios" na Home. Sem internet, carrega o último cache salvo.
4. **Check-in:**
   - Selecione o exercício realizado.
   - Ajuste o slider para o **nível de dor** (0–10).
   - Adicione uma observação (opcional) e toque em **Registrar Treino**.
   - Offline: salva localmente e sincroniza ao reconectar.
5. **Histórico** — toque em "Minha Evolução" para ver o gráfico de dor e as sessões concluídas.

---

## 🔗 Contrato de Check-in

Enviado para `POST /api/check-ins` (online) ou `POST /api/check-ins/sync` (sincronização em lote):

```json
{
  "prescriptionId": "uuid-da-prescricao",
  "exerciseId":     "uuid-do-exercicio",
  "painLevel":      4,
  "notes":          "Executei sem dor aguda",
  "executedAt":     "2026-05-02T12:00:00.000Z"
}
```

A sessão é armazenada localmente na tabela `exercise_sessions` (Room/SQLite) e sincronizada com o backend quando há conexão disponível.

---

## 📚 Documentação Adicional

| Documento | Link |
|-----------|------|
| 📋 Requisitos Implementados | [REQUISITOS_IMPLEMENTADOS.md](../../../Documentos/Entrega2/ProgramacaoMobile/REQUISITOS_IMPLEMENTADOS.md) |
| 🎬 Roteiro de Demonstração | [ROTEIRO_DEMONSTRACAO.md](../../../Documentos/Entrega2/ProgramacaoMobile/ROTEIRO_DEMONSTRACAO.md) |
| ⚙️ Setup de Ambiente | [AMBIENTE_SETUP.md](../../../Documentos/Entrega2/ProgramacaoMobile/AMBIENTE_SETUP.md) |
| 🔍 Validação Final | [VALIDACAO_FINAL.md](../../../Documentos/Entrega2/ProgramacaoMobile/VALIDACAO_FINAL.md) |
| ☁️ Documento principal da Entrega 2 | [01-entrega-2-mobile-e-cloud.md](../../../Documentos/Entrega2/Sistemas%20Operacionais%20e%20Arquiteturas%20Cloud%20Native/docs/01-entrega-2-mobile-e-cloud.md) |

---

## 📸 Evidências visuais

Prints da Entrega 2 organizados em `imagens-maya/`:

- `imagens-maya/cloud-native/` — **25 prints anexados** (build, lint, testes 23/23 PASS, Docker, scripts, k6 com p95=2.42ms).
- `imagens-maya/mobile/` — **pendente**. Prints recomendados:
  - `01-build-assembledebug.png` — terminal com BUILD SUCCESSFUL
  - `02-tela-login.png`, `03-tela-lgpd.png`
  - `04-tela-exercicios.png`, `05-tela-detalhe-exercicio.png`
  - `06-tela-checkin.png` (slider de dor 0–10)
  - `07-tela-historico.png` (gráfico de evolução)
  - `08-notificacao-fcm.png` (push real no dispositivo)
- `imagens-maya/postman-api/` — **pendente**. Prints recomendados de `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/exercises`, `POST /api/check-ins`, `GET /api/dashboard/...`.

---

<div align="center">

**Equipe TechCare** · FECAP — Centro Universitário · ADS 2026

</div>

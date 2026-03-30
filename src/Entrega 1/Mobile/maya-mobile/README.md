# MayaRPG 🏥🕹️

Aplicativo Android desenvolvido em Java para gerenciamento de pacientes, unindo conceitos de gamificação (RPG) com acompanhamento de saúde/rotina.

## 🚀 Tecnologias Utilizadas

* **Linguagem:** Java
* **Android SDK:** (Versão mínima definida no build.gradle)
* **Comunicação HTTP:** Retrofit 2 & OkHttp
* **Arquitetura:** Baseada em separação de responsabilidades (UI, Model, API)

## 📁 Estrutura do Projeto

O código-fonte está organizado em pacotes lógicos para facilitar a manutenção e escalabilidade:

```text
com.maya.rpg
│
├── api/               # Configuração do Retrofit, endpoints (ApiService) e TokenManager
├── model/             # Classes de dados (Entities, Requests e Responses)
└── ui/                # Telas (Activities/Fragments) e Adapters divididos por funcionalidade
    ├── auth/          # Login e Cadastro (LoginActivity, RegisterActivity)
    ├── home/          # Dashboard principal após autenticação
    ├── patients/      # Listagem, detalhes e adapter de pacientes
    └── splash/        # Tela inicial de carregamento (SplashActivity)
```

## ⚙️ Configuração e Instalação

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/ReisDevv/MayaRPG.git](https://github.com/ReisDevv/MayaRPG.git)
    ```
2.  Abra o projeto no **Android Studio**.
3.  Aguarde o Gradle sincronizar as dependências (`build.gradle.kts`).
4.  Configure a URL base da API no `RetrofitClient.java`.
5.  Compile e execute em um emulador ou dispositivo físico.

## 🤝 Padrão de Commits

Este projeto segue a especificação do [Conventional Commits](https://www.conventionalcommits.org/).
Exemplos utilizados:
* `feat:` Adição de novas funcionalidades (ex: telas, integração de API).
* `chore:` Atualizações de build, configurações de IDE, `.gitignore` e ajustes que não alteram código de produção.
* `docs:` Atualização de documentação (como este arquivo).
* `fix:` Correção de bugs.
# Plano de Execução do Teste de Carga (k6)

**Data de Planejamento:** 11 de Maio de 2026
**Repositório:** `maya-rpg-api`
**Ferramenta Mapeada:** k6

---

## 1. Pré-requisitos
Para a execução adequada deste teste de carga, garanta que:
1. O *daemon* do Docker esteja rodando.
2. O banco de dados e a API estejam online através do comando:
   ```bash
   docker compose up -d
   ```
3. A ferramenta `k6` esteja instalada na máquina hospedeira ou rodando via container Docker.

## 2. Comando de Acionamento
Estando na raiz do projeto, execute o script do k6:
```bash
k6 run test/load/load-test.js
```

## 3. Configuração do Teste (VUs e Duração)
O script `test/load/load-test.js` foi configurado para simular o comportamento de múltiplos usuários concorrentes (`VUs - Virtual Users`) em 3 estágios (Ramp-up, Plateau, Ramp-down), durando um total de **2 minutos**:

| Estágio | Duração | Alvo de VUs |
| :--- | :--- | :--- |
| **Ramp-up** | 30 segundos | 0 → 20 VUs |
| **Plateau** | 1 minuto | 20 VUs constantes |
| **Ramp-down**| 30 segundos | 20 → 0 VUs |

## 4. Endpoints Testados
Durante cada iteração (sessão de usuário simulada), a ferramenta k6 executará o seguinte fluxo:
1.  **`POST /api/auth/login`**: Autenticação com credenciais mockadas para estresse (`stress-test@example.com`).
2.  **`POST /api/check-ins`**: Registro de uma execução de exercício simulada (Payload contendo `prescriptionId`, `painLevel`, `notes`).
3.  **`GET /api/check-ins/my-history`**: Recuperação do histórico de exercícios do paciente.

## 5. Thresholds (Limites de Aceite Esperados)
O sistema deve apresentar estabilidade frente à carga e atingir as seguintes metas:
*   `http_req_duration`: 95% das requisições devem ser resolvidas em menos de **500ms** (`p(95) < 500`).
*   `http_req_failed`: A taxa de falhas (erros 5xx ou 4xx inesperados) deve ser menor que **1%** (`rate < 0.01`).

---

## 6. Resultados (A Preencher)
*Cole abaixo a saída do terminal (stdout) após executar o k6 contra a API em execução:*

```text
[ COLE A SAÍDA REAL DO K6 AQUI ]
```

### Validação dos Thresholds Pós-Execução
*   **Duração p(95):** [ Informar milissegundos obtidos ]
*   **Taxa de Falhas:** [ Informar porcentagem de falhas obtidas ]
*   **Status de Aceite:** [ PASSOU / NÃO PASSOU ]
*   **Conclusão Final:** [ Inserir avaliação final de estabilidade e considerações ]

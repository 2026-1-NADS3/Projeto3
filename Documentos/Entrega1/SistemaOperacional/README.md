## **Documentação do Projeto: Automação de Infraestrutura e Monitoramento**

###### Este projeto contém scripts de automação em Shell Script (Bash) desenvolvidos para um ambiente Linux (Ubuntu Server). O objetivo é garantir a disponibilidade e realizar o backup de uma aplicação backend construída em NestJS com banco de dados PostgreSQL.





##### **Scripts Desenvolvidos**

* &nbsp;gerenciar.sh: Inicia, para, reinicia e monitora a saúde do backend e do banco de dados.
* &nbsp;monitoramento.sh: Coleta métricas de hardware (CPU, RAM, Disco) e gera alertas.
* &nbsp;backup.sh: Realiza o dump do banco de dados e compacta o código-fonte.



##### **Visão Geral dos Conceitos Aplicados**

Os scripts utilizam recursos avançados do Shell Scripting para garantir eficiência e robustez:



* Pipes (|): Utilizados para filtrar saídas de comandos complexos (top, df, awk).



* Redirecionamentos (>, >>, 2>): Empregados para gestão de logs e captura de erros.



* Estruturas de Controle: Uso de case, if/else e laços while para lógica de monitoramento contínuo.



* Gestão de Processos: Monitoramento via PID (Process ID) para evitar duplicidade de execução.



##### **Detalhamento dos Scripts**

###### 1\. Gerenciamento de Serviços (gerenciar.sh)

Objetivo: Atuar como o "orquestrador" do ambiente, controlando a inicialização e parada segura dos componentes.



Principais Funcionalidades:

Verificação de dependência: O app só inicia se o PostgreSQL estiver acessível.

Gestão de PID: Evita que múltiplos processos do NestJS sejam abertos na mesma porta.

Modo Monitor: Verifica a cada 10 segundos se o app caiu e tenta reiniciá-lo automaticamente até 3 vezes.



**Como usar:**

Bash

./gerenciar.sh start   # Inicia os serviços

./gerenciar.sh status  # Mostra CPU e Memória consumida pelo App

./gerenciar.sh monitor # Mantém o App vivo automaticamente



###### **2. Monitoramento de Hardware (monitoramento.sh)**

Objetivo: Monitorar a saúde do servidor e gerar alertas visuais e em log quando os recursos atingem níveis críticos.



Métricas Coletadas:



CPU: Extraído via top, calculando o uso real subtraindo o tempo ocioso (idle).

Memória: Calculado via free (Razão entre memória usada e total).

Disco: Verificação da partição raiz via df.



**Como usar:**

Bash

./monitoramento.sh           # Coleta métrica pontual

./monitoramento.sh continuo  # Monitoramento em tempo real (loop de 30s)

./monitoramento.sh relatorio # Resumo de alertas e total de registros



###### 3\. Backup e Manutenção (backup.sh)

Objetivo: Garantir a continuidade do negócio através de backups redundantes (Código + Banco) e limpeza automática.



Estratégia de Backup:

Banco de Dados: Utiliza pg\_dump com compressão gzip em tempo real via pipe.

Código-Fonte: Compactação tar.gz da pasta do projeto NestJS.

Autolimpeza: Função que remove automaticamente arquivos com mais de 7 dias para evitar lotação do disco.



**Como usar:**

Bash

./backup.sh        # Executa backup completo e limpeza

./backup.sh limpar # Remove apenas arquivos antigos (> 7 dias)



##### **Automação com Cron Job**

Para que o sistema seja autogerenciável, as seguintes tarefas foram planejadas para o crontab -e:



Bash

\# Monitoramento de hardware que roda automático todo dia às 8h (Gera histórico de performance)

0 8 \* \* \* /home/usuario/monitoramento.sh >> ~/logs/monitoramento.log 2>\&1



\# Backup completo e limpeza de disco todos os dias às 02:00 AM

0 2 \* \* \* /home/usuario/backup.sh >> ~/logs/backup.log 2>\&1



Embora o agendamento pudesse ser automatizado via script usando o comando crontab -, optei pela configuração manual via crontab -e. Isso segue as boas práticas de administração de sistemas, garantindo que o controle de tarefas agendadas permaneça centralizado e visível ao administrador do sistema.



##### **Como Executar os Testes**



* Dar permissão de execução:

Bash

chmod +x \*.sh



* Verificar status atual do hardware:

Bash

./monitorar\_sistema.sh status



* Simular um backup manual:

Bash

./backup\_sistema.sh



###### Estrutura de Diretórios Esperada

Os scripts criam automaticamente a seguinte árvore caso não exista:



~/logs/: Centraliza arquivos .log, .pid e histórico de erros.



~/backups/: Armazena os arquivos .sql.gz e .tar.gz.


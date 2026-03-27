#!/bin/bash
#gerenciar.sh
#===============================================================================
#Gerencia o backend NestJS e verifica o PostgreSql

#Uso:
# ./gerenciar.sh start
# ./gerenciar.sh stop
# ./gerenciar.sh restart
# ./gerenciar.sh status
# ./gerenciar.sh monitor
#================================================================================

#Variaveis de ambiente
APP_DIR="$HOME/projeto"
APP_PORT="3000"
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"

LOG_DIR="$HOME/logs"
PID_FILE="$LOG_DIR/app.pid"

#FUNÇÕES====================
mkdir -p "$LOG_DIR"

log() {
	echo "[$(date '+%d/%m/%Y %H:%M:%S')] $1" | tee -a "$LOG_DIR/app.log"
}

app_rodando() {

[ -f "$PID_FILE" ] && kill -0 "$(cat  "$PID_FILE")" 2>/dev/null
}

postgres_ok() {
  pg_isready -h "$DB_HOST" -P "$DB_PORT" -U "$DB_USER" &>/dev/null
}

#=========================================================================
#AÇÕES
#=========================================================================

iniciar() {
	log "Iniciando servições...."

	if ! postgres_ok; then 
	log "[ERRO] PostgresSQL não está acessível em $DB_HOST:$DB_PORT"
	log "........... Verifique se o banco está ligado e tente novamente."
	exit 1 
	fi
	log "[OK] PostgreSQL Acessível."


	if app_rodando;then
	log  "[AVISO] App está rodando (PID: $(cat"$PID_FILE"))"
	return
	fi


	cd "$APP_DIR" || { log "[ERRO] Pasta $APP_DIR não encontrada."; exit 1;}
	nohup npm rum start:prod >> "$LOG_DIR/app.log" 2>> "$LOG_DIR/erro.log" & echo $! >"$PID_FILE"

	log "[OK] NestJS Iniciando (PID: $(cat $PID_FILE)) na porta $APP_PORT"
}

parar() {
	log "Parando servições....."

	if ! app_rodando; then 
	log "[AVISO] App não estava rodando."
	return 
	fi

	kill "$(cat $PID_FILE)" && rm -f "$PID_FILE"
	log "[OK] NestJS encerrado."

}

reiniciar() {
	log "Reiniciando servições...."
	parar
	sleep 2
	iniciar
}
status() {
echo ""
echo "==============STATUS DOS SERVIÇOS=================="

if app_rodando; then
echo "  NestJS: RODANDO (PID: $(cat $PID_FILE))"
ps -p "$(cat "$PID_FILE")" -o %cpu,%mem --no-headers  | awk '{print " CPU: " $1 "% | Memória:" $2 "%"}'
else 
echo " NestJS: PARADO"
fi

if postgres_ok; then 
echo " PostgreSQL: RODANDO ($DB_HOST:$DB_PORT)"
else
echo " PostgreSQL: PARADO ou INACESSÍVEL"
fi

echo "====================================================================="
echo ""

}


monitor() {
	log"Modo monitor ativo. Verificando a cada 10 segundos..."
	local tentativas=0

	while true; do 
	if ! app_rodando; then 
	log "[ALERTA] APP CAIU!!! Tentando reiniciar..... ($tentativas/3)"
	if [ $tentativas -lt 3 ]; then 
	iniciar
	((tentativas++))
	else 
	log "[CRÍTICO] App não conseguiu reiniciar após 3 tentativas. Necessario verificar manualmente."
	exit 1
	fi
	else
	tentativas=0 
	fi
	sleep 10
	done
}

#==================================================
#LEITURA DO COMANDO
#==================================================
case "$1" in 
	start) iniciar ;;
	stop) parar ;;
	restart) reiniciar ;;
	status) status ;;
	monitor) monitor ;;
	*)
	echo "Uso: $0 {start|stop|restart|status|monitor}"
	exit 1 
	;;
esac

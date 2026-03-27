#!/bin/bash
#=========================================
#monitoramento.sh
#Coleta métricas de hardware  e  gera logs
#
#USO:
# ./monitoramento.sh 
# ./monitoramento.sh continuo
#============================================================================

#----------------------------------------------------------------------------
#VARIÁVEIS
#----------------------------------------------------------------------------
LOG_DIR="$HOME/logs"
LOG_FILE="$LOG_DIR/monitoramento.log"

#limites
LIMITE_CPU=80
LIMITE_RAM=80
LIMITE_DISCO=90

mkdir -p "LOG_DIR"

#-------------------------------------------------------------------------
#FUNÇÕES DE COLETAS
#-------------------------------------------------------------------------

coletar_cpu() {
	echo $(top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}' | cut -d',' -f1 | cut -d'.' -f1) 
}

coletar_memoria(){
	echo $(free | grep Mem | awk '{print int($3/$2 * 100.0)}')
}

coletar_disco(){
	echo $(df -h / | awk 'NR==2 {print $5'} | tr -d '%') 
}

#função principal

coletar_metricas() {
	local timestamp
	timestamp=$(date '+%d/%m/%Y %H:%M:%S')

	local cpu
	cpu=$(coletar_cpu)

	local memoria
	memoria=$(coletar_memoria)

	local disco
	disco=$(coletar_disco)

local linha="[$timestamp] | CPU: ${cpu}% | Memória: ${memoria}% | Disco: ${disco}%"


local alertas=""
	[ "$cpu"  -ge "$LIMITE_CPU" ] && alertas="$alertas [ALERTA: CPU ALTA!!]" 
	[ "$memoria"  -ge "$LIMITE_RAM" ]&& alertas="$alertas [ALERTA: MEMÓRIA ALTA!!]"
	[ "$disco"  -ge "$LIMITE_DISCO" ] && alertas="$alertas [ALERTA: DISCO QUASE CHEIO!!]"

	echo "$linha$alertas" | tee -a "$LOG_FILE"
}


modo_continuo() {
	echo "Monitoramento continuo ativo. Coletando a cada 30 s... (Ctrl+C para sair)"
	echo "Logs salvos em: $LOG_FILE"
	echo ""

	while true; do
	coletar_metricas
	sleep 30
	done
}

mostrar_relatorio() {
	if [ ! -f "$LOG_FILE" ]; then
	echo "Nenhum log encontrado ainda. Rode o script primeiro."
	return
	fi

	echo ""
	echo "================== RELATÓRIOS DE MONITORAMENTO ===================="
	echo "Arquivo: $LOG_FILE"
	echo "Total de registros: $(wc -l < "$LOG_FILE")"
	echo ""
	echo "Últimas 5 medições:"
	tail -5 "$LOG_FILE" | cat
	echo ""
	echo "Ocorrências de alertas:"
	grep -c "ALERTA" "$LOG_FILE" 2>/dev/null || echo "Nenhum alerta registrado."
	echo "========================================================================"
	echo ""
}


case "$1" in
	continuo)
	modo_continuo
	;;
	relatorio)
	mostrar_relatorio
	;;
	*)

	echo ""
	echo "============ MONITORAMENTO DO SISTEMA =================="
	coletar_metricas
	echo "Log salvo em: $LOG_FILE"
	echo ""
	echo "Outros modos:"
	echo " ./monitoramento.sh continuo "
	echo " ./monitoramento.sh relatorio "
	echo "==========================================================================="
	;;
esac

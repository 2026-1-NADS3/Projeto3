#!/bin/bash
#=================================================================
#backup.sh
#Faz o backup do código- fonte do projeto e do banco de dados PostgreSQL

#USO
# ./backup.sh
# ./backup.sh codigo 
# ./backup.sh banco
# ./backup.sh limpar

PROJETO_DIR="$HOME/projeto"
BACKUP_DIR="$HOME/backups"
LOG_DIR="$HOME/logs"

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="appdb"
DB_USER="postgres"

DIAS_MANTER=7

mkdir -p "$BACKUP_DIR"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')

log() {
	echo "[$(date '+%d/%m/%Y %H:%M:%S')] $1" | tee -a "$LOG_DIR/backup.log"
}


backup_codigo() {
	local arquivo="$BACKUP_DIR/codigo_$TIMESTAMP.tar.gz"

	log "Iniciando backup do código em: $PROJETO_DIR"

	if [ ! -d "$PROJETO_DIR" ]; then 
	log "[ERRO] Pasta do projeto não encontrada: $PROJETO_DIR"
	return 1
	fi

	tar -czf "$arquivo" -C "$(dirname "$PROJETO_DIR")" "$(basename "$PROJETO_DIR")" \ 2>> "$LOG_DIR/backup.log"

	if [ $? -eq 0 ]; then
	local tamanho
	tamanho=$(du -sh "$arquivo" | cut -f1)
	log "[OK] Backup do código salvo: $(basename "$arquivo") ($tamanho)"
	else
	log "[ERRO] Falha ao fazer backup do código ."
	return 1
	fi
}

backup_banco() {
	local arquivo="$BACKUP_DIR/banco_$TIMESTAMP.sql.gz"

	log "Iniciando backup do banco: $DB_NAME"

	pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" 2>> "$LOG_DIR/backup.log" | gzip > "$arquivo"

	if [ $? -eq 0 ]; then
	local tamanho
	tamanho=$(du -sh "$arquivo" | cut -f1)
	log "[OK] Backup do banco de dados salvo: $(basename "$arquivo") ($tamanho)"
	else 
	log "[ERRO] Falha ao fazer backup do banco."
	rm -f "$arquivo"
	return 1
	fi
}

limpar_antigos() {
	log "Removendo backups com mais de $DIAS_MANTER dias..."

local removidos
removidos=$(find "$BACKUP_DIR" \( -name "*.tar.gz" -o -name "*.sql.gz" \) -mtime+"$DIAS_MANTER" 2>/dev/null | wc -l)

find "$BACKUP_DIR" \( -name "*.tar.gz" -o -name "*.sql.gz" \) \ -mtime +"$DIAS_MANTER" -delete 2>> "$LOG_DIR/backup.log"

log "[OK] $removidos arquivo(s) antigo(s) removido(s)." 
}

#-------------------------------------------------------------------------------------------
	case "$1" in 
	codigo)
	log "==================BACKUP DO CÓDIGO====================" 
	backup_codigo
	;;
	banco)
	log "==================BACKUP DO BANCO======================"
	backup_banco
		;;
	limpar)
	log "================LIMPEZA DE BACKUPS====================="
	limpar_antigos
	;;
	*)

	log "========================-BACKUP COMPLETO-========================="
	backup_codigo
	backup_banco
	limpar_antigos
	log "========================BACKUP CONCLUÍDO=========================="
	;;
esac


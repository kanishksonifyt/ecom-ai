#!/bin/bash

# Local Database Configuration
LOCAL_DB_NAME="kanishk"
LOCAL_DB_URL="postgres://postgres:988716@localhost:5432/$LOCAL_DB_NAME"

# Server Database Configuration
SERVER_DB_NAME="medusa-store"
SERVER_DB_URL="postgres://postgres:PWISYOYOfytteam@2024@localhost:5432/$SERVER_DB_NAME"

# Parse database URL to extract credentials
parse_db_url() {
  local DB_URL=$1
  echo $(echo "$DB_URL" | sed -E 's/postgres:\/\/(.*):(.*)@(.*):([0-9]*)\/(.*)/\1 \2 \3 \4 \5/')
}

# Extract local database details
read LOCAL_USER LOCAL_PASS LOCAL_HOST LOCAL_PORT LOCAL_NAME <<<$(parse_db_url "$LOCAL_DB_URL")

# Extract server database details
read SERVER_USER SERVER_PASS SERVER_HOST SERVER_PORT SERVER_NAME <<<$(parse_db_url "$SERVER_DB_URL")

# Operation type and file (if any)
OPERATION=$1
FILE=$2

# Timestamp for backup files
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Backup function
backup_db() {
  local DB_USER=$1
  local DB_PASS=$2
  local DB_HOST=$3
  local DB_PORT=$4
  local DB_NAME=$5
  local BACKUP_FILE="backup_${DB_NAME}_${TIMESTAMP}.dump"

  PGPASSWORD=$DB_PASS pg_dump -U $DB_USER -h $DB_HOST -p $DB_PORT -Fc $DB_NAME -f $BACKUP_FILE

  if [ $? -eq 0 ]; then
    echo "Backup successful! File: $BACKUP_FILE"
  else
    echo "Backup failed!"
    exit 1
  fi
}

# Restore function
restore_db() {
  local DB_USER=$1
  local DB_PASS=$2
  local DB_HOST=$3
  local DB_PORT=$4
  local DB_NAME=$5

  if [ -z "$FILE" ]; then
    echo "Error: Please provide a backup file to restore."
    exit 1
  fi

  PGPASSWORD=$DB_PASS pg_restore -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME --clean --no-owner --if-exists $FILE

  if [ $? -eq 0 ]; then
    echo "Restore successful!"
  else
    echo "Restore failed!"
    exit 1
  fi
}

# Main operation handling
case $OPERATION in
  backup-local)
    backup_db $LOCAL_USER $LOCAL_PASS $LOCAL_HOST $LOCAL_PORT $LOCAL_NAME
    ;;
  backup-server)
    backup_db $SERVER_USER $SERVER_PASS $SERVER_HOST $SERVER_PORT $SERVER_NAME
    ;;
  restore-local)
    restore_db $LOCAL_USER $LOCAL_PASS $LOCAL_HOST $LOCAL_PORT $LOCAL_NAME
    ;;
  restore-server)
    restore_db $SERVER_USER $SERVER_PASS $SERVER_HOST $SERVER_PORT $SERVER_NAME
    ;;
  *)
    echo "Usage: $0 {backup-local|backup-server|restore-local|restore-server} [file]"
    echo "Example for local backup: $0 backup-local"
    echo "Example for server restore: $0 restore-server backup_file.dump"
    ;;
esac

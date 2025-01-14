# Database Backup and Restore Script

This script provides an easy way to back up and restore databases for local and server environments. It supports PostgreSQL databases and operates using the credentials and details directly provided in the script.

---

## Features
- **Backup Local Database**: Create a dump file of the local database.
- **Backup Server Database**: Create a dump file of the server database.
- **Restore to Local Database**: Restore a database dump file to the local database.
- **Restore to Server Database**: Restore a database dump file to the server database.

---

## Prerequisites
1. Ensure you have PostgreSQL installed and configured.
2. Update the database details directly in the script for both local and server configurations.
3. Make sure `pg_dump` and `pg_restore` commands are available in your environment.

---

## Setup
1. Clone or download the script to your local machine.
2. Make the script executable:
   ```bash
   chmod +x db_backup_restore.sh

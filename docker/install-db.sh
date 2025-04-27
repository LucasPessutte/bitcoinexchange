docker exec -d platform_postgres bash -c "chmod +x /database/restore.sh"
docker exec -u postgres -d platform_postgres bash -c "./database/restore.sh"
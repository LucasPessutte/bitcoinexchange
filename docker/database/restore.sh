export PGPASSWORD=docker
dropdb -f local_platform
createdb local_platform
pg_restore -v -U postgres -h localhost -d local_platform /database/database.dump

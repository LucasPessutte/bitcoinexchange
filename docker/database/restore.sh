export PGPASSWORD=docker
dropdb -U postgres -f local_platform
createdb -U postgres local_platform
pg_restore -v -U postgres -h localhost -d local_platform /database/database.dump

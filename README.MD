# Bitcoin Exchange Platform 🪙🚀

This project is a Bitcoin exchange simulation platform, featuring a buy and sell order system, WebSocket integration, and data persistence using PostgreSQL.
---

## 📚 Technologies used

- **Node.js 16** → (Backend Express)
- **PostgreSQL 13** → (Database)
- **Redis 7** → (Queue and cache management)
- **Socket.io** → (WebSocket for real-time updates)
- **Docker and Docker Compose** → (Service containerization)
- **Sequelize ORM** → (Data modeling in PostgreSQL)

---

## 🧩 Folder Structure

- **backend/** → Backend code (Node.js + Express + Sequelize)
- **frontend/** → Frontend code (React)
- **database/** → SQL scripts for database creation/restoration
- **docker/** → Additional Docker configurations
- **docker-compose.yml** → Container orchestration

---

# ✅ Prerequisites

- Docker installed
- Docker Compose installed
- Access to the ports:
  - **3000**: Frontend
  - **3001**: Backend
  - **9022**: Banco de Dados PostgreSQL
  - **6379**: Redis


# To install

All of the below commands need to run in the docker's folder.

1) docker-compose up -d
2) chmod +x install.sh install-db.sh
3) ./install-db.sh
4) ./install.sh

> ⚠️ **Important for Windows users:**  
> If you are using Windows, you must run the `.sh` scripts (like `chmod +x install.sh install-db.sh` and `install.sh` and `install-db.sh`) inside a **Git Bash** terminal to avoid compatibility issues.

# Starting the backend

Open a new tab on the terminal and run the command below: 

docker exec -it platform_backend bash -c "cd /platform_backend && npm install && npm start"

The backend of the web application will run on the port 80 

http://localhost:3001

# Starting the worker
Open a new tab on the terminal and run the command below:

docker exec -it platform_backend bash -c "cd /platform_backend && npm run worker"

# Starting the frontend
Open a new tab on the terminal and run the command below:

docker exec -it platform_frontend bash -c "cd /platform_frontend && npm install && npm start"

The frontend of the web application will run on the port 3000 

http://localhost:3000

# To uninstall
docker-compose down

**Important:**  
The project includes a PostgreSQL `.dump` file to automate database creation.  
If needed, you can manually generate a `.sql` structure using `pg_dump` with the `--schema-only` flag.

Example to manually generate a `.sql`:
```bash
docker exec -it platform_postgres bash
pg_dump -U postgres --schema-only local_platform > /database/database_structure.sql
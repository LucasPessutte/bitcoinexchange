echo "Installing..."
cp ../backend/src/config/config.js_sample ../backend/src/config/config.js
cp ../frontend/src/config/config.js_sample ../frontend/src/config/config.js
docker exec -d platform_frontend bash -c "rm -rf /platform_frontend/node_modules"
docker exec -d platform_backend bash -c "rm -rf /platform_backend/node_modules"
echo "Done"
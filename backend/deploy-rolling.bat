@echo off
setlocal

echo [1/6] Actualizando codigo...
git pull || goto :error

echo [2/6] Generando imagen API...
docker build . -t api:latest || goto :error

echo [3/6] Actualizando api1 (sin bajar nginx ni api2)...
docker compose up -d --no-deps api1 || goto :error
timeout /t 8 /nobreak >nul

echo [4/6] Actualizando api2 (sin bajar nginx ni api1)...
docker compose up -d --no-deps api2 || goto :error
timeout /t 8 /nobreak >nul

echo [5/6] Ejecutando migraciones...
docker compose exec -T api1 php artisan migrate --force || goto :error

echo [6/6] Listo.
echo Deploy rolling completado.
exit /b 0

:error
echo Deploy abortado. Revisar logs/comandos anteriores.
exit /b 1

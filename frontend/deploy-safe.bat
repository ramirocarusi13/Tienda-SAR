@echo off
setlocal

echo [1/7] Actualizando codigo...
git pull || goto :error

echo [2/7] Generando imagen frontend...
docker build . -t front-main:latest || goto :error

echo [3/7] Levantando canario en puerto 8002...
docker rm -f front-main-next >nul 2>&1
docker run -d --restart unless-stopped --name front-main-next -p 8002:80 front-main:latest || goto :error
timeout /t 6 /nobreak >nul

echo [4/7] Verificando canario...
docker ps --filter "name=front-main-next" --filter "status=running" | findstr "front-main-next" >nul || goto :error

echo [5/7] Reemplazando contenedor productivo (corte minimo)...
docker stop front-main >nul 2>&1
docker rm front-main >nul 2>&1
docker run -d --restart unless-stopped --name front-main -p 8001:80 front-main:latest || goto :error
timeout /t 4 /nobreak >nul

echo [6/7] Limpieza de canario...
docker stop front-main-next >nul 2>&1
docker rm front-main-next >nul 2>&1

echo [7/7] Listo.
echo Deploy frontend completado.
exit /b 0

:error
echo Deploy frontend abortado. Revisar estado de front-main-next/front-main.
exit /b 1

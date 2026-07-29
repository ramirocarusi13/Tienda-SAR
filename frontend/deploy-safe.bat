@echo off
setlocal

echo [1/7] Actualizando codigo...
git pull --autostash || goto :error

echo [2/7] Generando imagen frontend...
docker build . -t sar-tienda-frontend:latest || goto :error

echo [3/7] Levantando canario en puerto 8008...
docker rm -f tienda-frontend-next >nul 2>&1
docker run -d --restart unless-stopped --name tienda-frontend-next -p 8008:80 sar-tienda-frontend:latest || goto :error
timeout /t 6 /nobreak >nul

echo [4/7] Verificando canario...
docker ps --filter "name=tienda-frontend-next" --filter "status=running" | findstr "tienda-frontend-next" >nul || goto :error

echo [5/7] Reemplazando contenedor productivo (corte minimo)...
docker stop tienda-frontend >nul 2>&1
docker rm tienda-frontend >nul 2>&1
docker run -d --restart unless-stopped --name tienda-frontend -p 8007:80 sar-tienda-frontend:latest || goto :error
timeout /t 4 /nobreak >nul

echo [6/7] Limpieza de canario...
docker stop tienda-frontend-next >nul 2>&1
docker rm tienda-frontend-next >nul 2>&1

echo [7/7] Listo.
echo Deploy frontend completado.
echo Frontend Tienda: http://192.168.8.16:8007
exit /b 0

:error
echo Deploy frontend abortado. Revisar estado de tienda-frontend-next/tienda-frontend.
exit /b 1

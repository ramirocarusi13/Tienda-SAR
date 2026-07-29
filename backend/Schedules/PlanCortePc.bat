@echo off
REM Configuración del endpoint
SET URL=http://192.168.8.16:4555/api/pc/ejecutar_plan_auto

curl -X GET %URL%

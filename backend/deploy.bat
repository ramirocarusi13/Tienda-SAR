git pull --autostash
docker build . -t sar-tienda-api:latest && docker compose up --build -d
pause

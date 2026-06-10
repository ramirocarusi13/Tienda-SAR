git pull
docker build . -t api && docker compose down && docker compose up --build -d
pause
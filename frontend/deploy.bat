git pull --autostash
docker build . -t sar-tienda-frontend:latest && docker stop tienda-frontend & docker rm tienda-frontend & docker run -d --restart unless-stopped --name tienda-frontend -p 8007:80 sar-tienda-frontend:latest
pause

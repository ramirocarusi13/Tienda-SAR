git pull
docker build . -t front-main:latest && docker stop front-main & docker rm front-main & docker run -d --restart unless-stopped --name front-main -p 8001:80 front-main:latest
pause
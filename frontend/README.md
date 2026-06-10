# Docker Build image

docker build . -t "image_name"

# Actualizar imagen

docker stop nombre_contenedor
docker run -d --name nombre_contenedor -p 5175:80 nombre_imagen

## En una linea
docker stop nombre_old && docker run -d --name nombre_nuevo -p 5175:80 nombre_imagen && docker rm nombre_old

# GitLab

docker run -p 8000:80 -v ./gitlab/config:/etc/gitlab -v ./gitlab/data:/var/opt/gitlab gitlab/gitlab-ce
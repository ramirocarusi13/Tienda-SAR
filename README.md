# SAR Tienda

Repositorio separado para el modulo Tienda, con backend Laravel y frontend React/Vite.

## Estructura

- `backend`: API Laravel copiada desde `api` y acotada en `routes/api.php` a endpoints de tienda y dependencias directas.
- `frontend`: app React copiada desde `frontend` con router reducido al modulo Tienda.

## Endpoints principales

- `POST /api/login`
- `POST /api/auth/validar_usuario`
- `GET /api/fallastienda`
- `GET /api/linea/{linea}/modelos`
- `POST /api/tienda/pedido`
- `GET /api/tienda/pedidos`
- `POST /api/tienda/ingreso`
- `POST /api/tienda/egreso`
- `POST /api/stock/piezasTienda`
- `POST /api/import/tiendalayout`

## Levantar local

Backend:

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan passport:install
php artisan serve --port=8000
```

Frontend:

```bash
cd frontend
pnpm install
copy .env.example .env
pnpm dev
```

Los repos originales `../api` y `../frontend` no fueron modificados para esta separacion.

## Docker separado

La Tienda se puede levantar en contenedores propios sin tocar los servicios principales (`api-*` ni `front-main`):

```bash
docker compose up --build -d
```

Contenedores y puertos por defecto:

- `tienda-api-nginx`: `http://192.168.8.16:4555`
- `tienda-api1`: `4557`
- `tienda-api2`: `4558`
- `tienda-frontend`: `http://192.168.8.16:8007`

Para cambiar puertos o URLs de build del frontend, copiar `.env.docker.example` a `.env` en la raiz del repo y ajustar los valores.

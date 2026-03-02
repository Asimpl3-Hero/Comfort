# Comfort Frontend

React + Vite frontend for Comfort checkout flow.

## Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Default backend URL in local dev:

```env
VITE_API_BASE_URL="http://localhost:3000"
VITE_COP_TO_USD_RATE="4000"
VITE_WOMPI_BASE_URL="https://api-sandbox.co.uat.wompi.dev/v1"
VITE_WOMPI_PUBLIC_KEY="pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
```

## Run locally

```bash
npm install
npm run dev
```

## Run with Docker

This frontend container expects the backend container `comfort-api` reachable on the Docker network `dokploy-network`.

1. Ensure backend is up first:

```bash
cd C:\Programacion\Nest.js\Comfort-Api
docker compose up -d
```

2. Ensure the shared network exists (only needed in local environments):

```bash
docker network create dokploy-network
```

3. Start frontend container:

```bash
cd C:\Programacion\React\Comfort
docker compose up --build -d
```

4. Open:

- Frontend: `http://localhost:5173`
- Backend proxied through frontend container at `/api/*`

## Notes

- Frontend no longer uses local product mocks.
- Product/order fetches always go to backend API.

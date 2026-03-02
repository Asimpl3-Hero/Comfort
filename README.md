# Comfort Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Vitest-6E9F18)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

Frontend de **Comfort** construido con React + Vite.  
Incluye catálogo de productos, carrito, checkout y conexión con backend + pasarela de pago.

## ✨ Funcionalidades
- 🛍️ Listado de productos desde API
- 🛒 Carrito con estado global (Redux)
- 💳 Flujo de checkout integrado con pasarela de pago
- 🌐 i18n (ES/EN)
- 📱 UI responsive

## ⚙️ Variables de entorno
Crea `.env` a partir de `.env.example`.

```bash
cp .env.example .env
```

Variables principales:

```env
VITE_API_BASE_URL="/api"
VITE_COP_TO_USD_RATE="4000"
VITE_WOMPI_BASE_URL="https://api-sandbox.co.uat.wompi.dev/v1"
VITE_WOMPI_PUBLIC_KEY="pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
```

## 🐳 Levantar con Docker
1. Levanta primero el backend.
```bash
cd C:\Programacion\Nest.js\Comfort-Api
docker compose up -d
```

2. (Solo local) crea red compartida si no existe.
```bash
docker network create dokploy-network
```

3. Levanta frontend.
```bash
cd C:\Programacion\React\Comfort
docker compose up --build -d
```

4. Abre:
- Frontend (Local): `http://localhost:5173`
- Frontend (Producción): `https://comfort.ondeploy.store`

## 🧪 Pruebas unitarias
Ejecutar toda la suite:

```bash
npm run test
```

Ejecutar cobertura:

```bash
npm run test:cov
```

Cobertura total actual del frontend (Vitest + V8):
- ✅ Statements: **96.15%**
- ✅ Branches: **80.39%**
- ✅ Functions: **94.94%**
- ✅ Lines: **96.30%**

## 🚀 Scripts útiles
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

# AGENTS.md

<!-- Instrucciones para agentes de OpenCode: contexto específico del repositorio para evitar errores comunes. -->

## Estructura
- `backend/` - API de Express.js, CommonJS, puerto 5000
- `frontend/` - React + Vite + Tailwind CSS, módulos ES

## Comandos
- Backend: `cd backend && npm run dev` (usa nodemon), `npm start` (producción)
- Frontend: `cd frontend && npm run dev` (servidor de desarrollo Vite)
- Sembrar base de datos: `cd backend && node seed.js`

## Base de datos
- MongoDB local: `mongodb://localhost:27017/ecommerce_ropa`
- El servicio MongoDB debe estar en ejecución (Windows: `Get-Service MongoDB`)
- Configuración en `backend/.env`

## Arquitectura del Backend
- Punto de entrada: `server.js` → `config/db.js` (conexión con mongoose)
- Rutas: `/api/users`, `/api/products`, `/api/orders`
- Autenticación: JWT mediante `jsonwebtoken`, contraseñas hasheadas con `bcryptjs`

## Frontend
- React Router v7 (no v6, ojo con diferencias de API entre versiones)
- Contextos: `AuthContext`, `CartContext` en `src/context/`
- Llamadas a la API: `src/utils/api.js` (axios)
- Tailwind CSS v4 con el plugin `@tailwindcss/vite` (no el plugin clásico de Tailwind)

## Notas
- No hay framework de pruebas configurado
- No hay linter ni verificación de tipos en el backend
- El frontend usa el nuevo formato `eslint.config.js` (no `.eslintrc.*`)

# CabConnect - MERN Cab Booking App

CabConnect is a MERN stack application for employee cab booking and admin-driven cab area management.

## Tech Stack

- Frontend: React, React Router, Axios, Vite
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Auth: JWT + bcrypt

## Project Structure

```text
cab-booking-app/
├── frontend/
│   ├── public/assets/branding/
│   └── src/{components,pages,context,hooks,utils,assets}
├── backend/          ← CabConnect API (use this with the frontend)
│   └── src/{config,controllers,models,routes,middleware}
├── server/           ← older TypeScript API (different routes / port; not used by CabConnect UI)
└── README.md
```

## Features

- Employee signup/login and JWT auth
- Instant cab booking form with validation
- Booking history endpoint for user
- Admin area creation endpoint
- Area list displayed on the home page

## Branding Assets

Generated in `frontend/public/assets/branding/`:

- `logo.svg`
- `favicon.svg` (32x32)
- `hero-map.svg`

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/areas`
- `POST /api/areas` (admin token required)
- `POST /api/booking` (auth required)
- `GET /api/booking/user/:id` (auth required)

## Installation

### Recommended: one command (backend + frontend)

From the **`cab-booking-app`** folder (repo root for this app):

```bash
cd backend
cp .env.example .env
# Edit backend/.env if needed (MONGODB_URI, JWT_SECRET)
npm install
cd ..
npm install
npm run dev
```

This starts **Express on port 5000** and **Vite on 5173** together. Open **`http://localhost:5173`**.

### Manual: two terminals

**Terminal A — backend**

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Default API: `http://localhost:5000`

**Terminal B — frontend**

```bash
cd frontend
npm install
npm run dev
# or: npm start
```

Open **`http://localhost:5173`**. In dev, the browser calls **`/api` on Vite**, which **proxies** to **`http://127.0.0.1:5000`**. If you only start Vite without the backend, login will fail until `backend` is running.

### Troubleshooting login

1. **Start both processes** — from `cab-booking-app` run **`npm run dev`** (after `npm install` in this folder), or keep **`backend`** (`npm start`) and **`frontend`** (`npm run dev`) running at the same time.
2. **Use the `backend/` API**, not `server/`. CabConnect uses **`POST /api/auth/login`** and **`backend/.env`** (`MONGODB_URI`).
3. **Seed users**: `cd backend && npm run seed` — then **`alice@cabconnect.demo`** / **`Password123!`** (capital **P**, ends with **`!`**).
4. After a successful login you are redirected **home** and the nav shows your **name** and **Log out**. If nothing changes, open DevTools → **Network** → `login` and check status (**200** vs **401** / failed).
5. Restart **`backend`** after editing **`JWT_SECRET`** or **`MONGODB_URI`**.

Default frontend URL: `http://localhost:5173`

## Screenshots

Add screenshots in your repo and update these links:

- Home page: `docs/screenshots/home.png`
- Booking form: `docs/screenshots/booking.png`
- Login page: `docs/screenshots/login.png`
- Admin page: `docs/screenshots/admin.png`

## Testing

- Frontend build: `npm run build` (in `frontend`)
- Backend module smoke test: load controllers/routes using `node -e`

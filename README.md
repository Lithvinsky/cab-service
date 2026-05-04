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
├── backend/
│   └── src/{config,controllers,models,routes,middleware}
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

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Default backend URL: `http://localhost:5000`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

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

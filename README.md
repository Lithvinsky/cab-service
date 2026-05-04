# Corporate Cab Booking

Production-oriented full-stack app for internal employee cab booking and transport-team administration.

## Structure

```
cab-booking-app/
├── client/     # React 18 + TypeScript + Vite, MUI, Redux Toolkit, Axios, Recharts
├── server/     # Express + TypeScript + MongoDB (Mongoose)
└── README.md
```

## Features

- **Employees:** register (corporate email only), login, book cabs by date/time slot/route, list and cancel bookings (cutoff before service day).
- **Admins:** CRUD cabs, drivers, routes; view/filter all bookings; reassign bookings to another cab; analytics (bookings per day, utilization per cab, cancellations).
- **Allocation:** On booking, system assigns an active cab on the same route with free capacity for that date/slot; otherwise booking stays `PENDING` until an admin reassigns.

## Prerequisites

- Node.js 18+
- MongoDB 6+

## Quick start

### 1. Server

```bash
cd server
cp .env.example .env
# Edit .env: MONGO_URI, JWT_SECRET (and CORPORATE_EMAIL_DOMAIN if not using company.com)
npm install
npm run seed    # creates admin@company.com, alice, bob, sample fleet + bookings (Password123!)
npm run dev     # http://localhost:4000
```

### 2. Client

```bash
cd client
npm install
npm run dev     # http://localhost:5173 — proxies /api to :4000
```

Open http://localhost:5173 — log in with seed users or register a new **employee** (`*@<CORPORATE_EMAIL_DOMAIN>`).

## Environment variables

### `server/.env`

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | Mongo connection string |
| `JWT_SECRET` | Strong secret for JWT |
| `JWT_EXPIRES_IN` | Optional, default `7d` |
| `PORT` | Optional, default `4000` |
| `CORPORATE_EMAIL_DOMAIN` | Signups must use `*@domain` (default `company.com`) |
| `CLIENT_ORIGIN` | CORS origin(s), comma-separated (default `http://localhost:5173`) |
| `CANCEL_CUTOFF_HOURS_BEFORE_DAY` | Employee cancel window (hours before midnight of trip day), default `2` |

### `client/.env` (production)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Public API base URL (no trailing slash). Empty in dev (use Vite proxy). |

## API (summary)

All JSON responses: `{ success, data?, message?, errors? }`.

- `POST /api/auth/register` — employee only  
- `POST /api/auth/login`  
- `GET /api/auth/me` — Bearer JWT  
- `GET /api/users` — admin, filters: `role`, `email`, `department`  
- `GET|POST|PUT|DELETE` `/api/drivers`, `/api/routes` — read for any logged-in user; writes admin  
- `GET|POST|PUT|DELETE` `/api/cabs` — same pattern  
- `POST /api/bookings` — employee creates booking (auto allocation)  
- `GET /api/bookings/my` — employee  
- `GET /api/bookings` — admin, query: `from`, `to`, `route`, `cab`, `employee`, `status`  
- `PUT /api/bookings/:id/cancel` — owner or admin  
- `PUT /api/bookings/:id/reassign` — admin, body `{ cabId }`  
- `GET /api/analytics/summary?from=&to=` — admin  

## Scripts

| Command | Location | Purpose |
|---------|----------|---------|
| `npm run dev` | server | `tsx watch` API |
| `npm run build` / `npm start` | server | Compile / run `dist` |
| `npm run seed` | server | Seed demo data |
| `npm run dev` | client | Vite dev |
| `npm run build` | client | Production bundle in `client/dist` |

## Assumptions (defaults)

- Time slots: `MORNING`, `EVENING` (fixed enum; extend in code if needed).
- **Utilization %** (admin analytics): for each cab, `bookings / (number of distinct date+slot trips × capacity)` capped at 100%. Documented so product can refine later.
- **Registration:** only `EMPLOYEE` via API; **admin** accounts are created via seed or direct DB.

## License

Use and modify per your organization.

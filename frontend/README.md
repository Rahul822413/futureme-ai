# FutureMe AI – Personal Future Simulation Engine

FutureMe AI is a full-stack, futuristic AI-assisted decision support system that allows users to simulate their future trajectories based on their current skills, habits, and specific life choices.

![FutureMe AI](https://via.placeholder.com/1200x600.png?text=FutureMe+AI+-+Personal+Future+Simulation)

## Features
- **3D Animated UI:** React Three Fiber landing page with holographic globe and glassmorphism.
- **Robust Simulation Engine:** Mathematically calculates skill, consistency, career readiness, and risk scores.
- **Triple Scenario Generation:** Produces Optimistic, Realistic, and Risk scenarios for any decision.
- **Dynamic Charts:** Built with Recharts (Line charts for growth projection, Radar charts for profile balance).
- **PDF & CSV Export:** Backend generation of professional printable PDF reports.
- **Admin Dashboard:** Monitor platform usage, simulation stats, and high-risk users.

## Tech Stack
### Frontend
- React 18 + Vite
- Tailwind CSS + PostCSS
- Framer Motion (Animations)
- Three.js + React Three Fiber (3D Elements)
- Recharts (Data Visualization)
- Axios & React Router

### Backend
- Node.js + Express
- SQLite (via `better-sqlite3` - zero config, runs locally)
- JWT Authentication + bcryptjs
- PDFKit (PDF generation)

## Project Structure
```
futureme-ai/
├── frontend/             # React Vite Application
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/        # 7 Complete Pages
│   │   ├── services/     # Axios API Client
│   │   ├── context/      # Auth Context
│   │   ├── styles/       # Tailwind & Global CSS
│   │   └── App.jsx
│   └── package.json
└── backend/              # Node.js Express Application
    ├── config/           # Database setup (SQLite)
    ├── controllers/      # 5 Core Controllers
    ├── middleware/       # Auth & Admin checks
    ├── models/           # (Handled via SQLite schema)
    ├── routes/           # 5 API Routes
    ├── simulationEngine/ # 5 Core Logic Engines
    ├── reports/          # Report generators
    └── server.js         # Entry point
```

## Installation and Running

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*The backend runs on `http://localhost:5000`.*
*The SQLite database (`futureme.db`) will be automatically created and seeded with demo accounts on the first run.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`.*

## Demo Accounts
The system automatically creates these accounts when the backend starts:

**Student / User Account:**
- **Email:** student@futureme.ai
- **Password:** student123

**Admin Account:**
- **Email:** admin@futureme.ai
- **Password:** admin123

## API Routes
- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Profile:** `POST /api/profile/create`, `GET /api/profile/:userId`, `PUT /api/profile/update/:userId`
- **Simulation:** `POST /api/simulation/generate`, `GET /api/simulation/history/:userId`, `GET /api/simulation/:id`
- **Reports:** `GET /api/report/download/pdf/:simulationId`, `GET /api/report/download/csv/:simulationId`
- **Admin:** `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/simulations`

## Academic / Interdisciplinary Use Case
This project is an excellent interdisciplinary demonstration combining:
- **Computer Science:** Full-stack development, database architecture, authentication, robust API design.
- **Data Science & AI:** Weighted heuristic models, predictive growth algorithms, risk analysis.
- **Design & HCI:** 3D interfaces, micro-interactions, data visualization, and glassmorphism.
- **Psychology/Behavioral Science:** Habit tracking, scenario planning, and consistency metrics.

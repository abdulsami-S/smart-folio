# Sami's 3D Personal Portfolio & CMS

A complete, production-grade, full-stack 3D personal portfolio with a secure backend, an admin CMS dashboard, JWT authentication, and modern 3D web graphics.

## Architecture

- **Frontend**: React + Vite + Three.js + GSAP + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT (Two-Token Strategy with HttpOnly cookies) + bcryptjs

## Prerequisites

- Node.js 18+
- MongoDB running locally on default port (27017)

## Installation & Setup

### 1. Backend

Navigate to the backend directory, install dependencies, seed the database, and start the server.

```bash
cd backend
npm install

# Seed the database with initial portfolio data and admin credentials
node scripts/seed.js

# Start the development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend

Navigate to the frontend directory, install dependencies, and start the dev server.

```bash
cd frontend
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## URLs & Access

- **Public Portfolio**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

### Default Admin Credentials

- **Username**: `sami`
- **Password**: `sami@admin2027`

## Security Notes

- **Access Token**: Stored strictly in React memory (useState) to prevent XSS attacks.
- **Refresh Token**: Stored in a secure, `httpOnly`, `sameSite=strict` cookie to prevent JS access and CSRF attacks.
- **Password**: Hashed using `bcryptjs` with 12 salt rounds before storing in MongoDB.
- **Secrets**: Ensure `JWT_SECRET` and `REFRESH_SECRET` in `backend/.env` are changed to cryptographically strong values before deploying to production.

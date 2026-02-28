# Task Management API

Ecode Technical Test

## Quick Start

1. Copy environment file:
   - `cp .env.example .env`
2. Set your MongoDB and JWT secrets in `.env`
3. Install dependencies:
   - `npm install`
4. Run development server:
   - `npm run dev`

## Scripts

- `npm run dev` - start in watch mode
- `npm run build` - compile TypeScript to `dist/`
- `npm run start` - run compiled server

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout` (Bearer token)
- `POST /api/auth/refresh`
- `GET /health`

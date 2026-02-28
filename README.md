# Task Management API

Ecode Technical Test - Task Management API

## Features

- Autentikasi JWT (access + refresh token)
- CRUD tugas dengan filter dan pengurutan
- Pengingat tenggat via email menggunakan Resend + cron job
- Dokumentasi Swagger UI

## Tech Stack

- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- Zod (validasi request)
- JWT (autentikasi)
- Resend (pengingat email)
- node-cron (jadwal job)
- Swagger (dokumentasi OpenAPI)

## Setup dan Jalankan Project

1. Clone repository:

```bash
git clone https://github.com/RenoAji/task-management
cd task-management
```

2. Install dependency:

```bash
npm install
```

3. Buat file environment:

```bash
cp .env.example .env
```

4. Isi nilai penting di `.env`:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `RESEND_API_KEY`

5. Pastikan MongoDB berjalan.

6. Jalankan service:

```bash
npm run dev
```

Jika berhasil, service berjalan di `http://localhost:3000` (atau sesuai `PORT` di `.env`).

7. Verifikasi endpoint dasar:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok" }
```

## Environment Variables

- `NODE_ENV` - mode aplikasi (`development` | `test` | `production`), default: `development`
- `PORT` - port server, default: `3000`
- `MONGODB_URI` - koneksi MongoDB (wajib)
- `JWT_ACCESS_SECRET` - secret untuk access token (wajib)
- `JWT_REFRESH_SECRET` - secret untuk refresh token (wajib)
- `JWT_ACCESS_EXPIRES_IN` - masa berlaku access token, default: `15m`
- `JWT_REFRESH_EXPIRES_IN` - masa berlaku refresh token, default: `7d`
- `RESEND_API_KEY` - API key Resend untuk email reminder (wajib)
- `CRON_SCHEDULE` - jadwal cron pengingat email, default: `0 * * * *` (setiap jam)

Contoh isi `.env` ada di `.env.example`.

## Cara Mendapatkan API Key Resend

1. Login ke `https://resend.com`.
2. Buka menu **API Keys** lalu buat key baru.
3. Salin key tersebut dan isi `RESEND_API_KEY` di `.env`.

## Dokumentasi API

- Swagger UI: `http://localhost:3000/api/docs`
- Health check: `GET /health`

## Endpoint Utama

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Script

- `npm run dev` - jalankan mode watch (development)
- `npm run build` - kompilasi TypeScript ke `dist/`
- `npm run start` - jalankan server hasil kompilasi

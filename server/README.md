# SkillSwap Backend

Node.js + Express + MySQL REST API for SkillSwap.

## Setup

1. Install Node.js 20+ and MySQL.
2. In this `server` folder:

```bash
npm install
cp .env.example .env     # Windows PowerShell: Copy-Item .env.example .env
```

3. Edit `.env`: set `JWT_SECRET` (a long random string) and `DB_ROOT_PASSWORD` (your MySQL root password, empty on Mac Homebrew).
4. Create the database and sample data, then start the server:

```bash
npm run db:reset
npm run dev
```

The API runs on http://localhost:4000. Check http://localhost:4000/api/health.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the server (restarts when you save) |
| `npm start` | Start the server |
| `npm run db:schema` | Drop and recreate the database and tables |
| `npm run db:seed` | Insert sample data |
| `npm run db:reset` | `db:schema` then `db:seed` |

## Demo accounts

All sample users use `password123` (admin: `admin123`):
`ayesha@skillswap.com`, `tanvir@skillswap.com`, `nusrat@skillswap.com`, `mehedi@skillswap.com`, `admin@skillswap.com`.

## Folder structure

```
config/        env and database connection
database/      schema.sql, seed data, setup scripts
middleware/    auth, validation, error handler
routes/        URL definitions
controllers/   read the request, call a service, send the response
services/      business logic and database queries
validators/    input rules (express-validator)
utils/         helpers (errors, tokens, upload, transactions)
uploads/       recording files (not in Git)
```

## API

Send the token on protected routes: `Authorization: Bearer <token>`.
Errors look like `{ "message": "..." }`.

| Method | URL | Login | Description |
|---|---|---|---|
| GET | `/api/health` | no | Server and database check |
| POST | `/api/auth/register` | no | Create an account |
| POST | `/api/auth/login` | no | Log in, get a token |
| GET | `/api/auth/me` | yes | Current user |
| GET | `/api/skills`, `/api/skills/categories` | no | Skill list |
| GET | `/api/users`, `/api/users/:id` | yes | Users |
| PATCH | `/api/users/me` | yes | Update profile and skills |
| GET | `/api/matches` | yes | Mutual and one-way matches |
| GET | `/api/notifications` | yes | Notifications and unread count |
| PATCH | `/api/notifications/:id/read`, `/read-all` | yes | Mark as read |
| GET, POST | `/api/requests` | yes | List and send swap requests |
| PATCH | `/api/requests/:id` | yes | `accept`, `decline` or `cancel` |
| GET, POST | `/api/sessions` | yes | List and schedule sessions |
| PATCH | `/api/sessions/:id` | yes | `complete` or `cancel` |
| POST | `/api/reviews` | yes | Learner reviews the teacher |
| GET | `/api/reviews/user/:userId`, `/session/:sessionId` | yes | Reviews |
| GET, POST | `/api/projects` | yes | List and create projects |
| GET, PUT, DELETE | `/api/projects/:id` | yes | Project details, edit, delete |
| POST | `/api/projects/:id/like` | yes | Toggle like |
| POST, DELETE | `/api/projects/:id/comments[/:commentId]` | yes | Comments |
| POST, DELETE | `/api/projects/:id/members[/:userId]` | yes | Team members |
| POST, DELETE | `/api/projects/:id/contributions[/:contributionId]` | yes | Contribution tracker |
| GET, POST | `/api/recordings` | yes | List and upload (form field `video`) |
| GET | `/api/recordings/:id/file` | yes | Stream the video |
| DELETE | `/api/recordings/:id` | yes | Delete a recording |
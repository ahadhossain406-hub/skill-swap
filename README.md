
# SkillSwap

> **Learn One Skill, Teach Another.**

SkillSwap is a community-based platform where people exchange skills instead of paying for tutoring. For example, a user who can teach Photoshop and wants to learn Web Development is matched with a user who can teach Web Development and wants to learn Photoshop. They send a swap request, schedule sessions, meet online, record the session and review each other.

**Live demo:** [Add after deployment] &nbsp;|&nbsp; **Repository:** https://github.com/ahadhossain406-hub/skill-swap

University Software Engineering Design Capstone Project · Daffodil International University · Supervisor: [MD. Sohel Arman] 

## Contents

- [Project status](#project-status)
- [Features](#features)
- [Technology stack](#technology-stack)
- [Team and contributions](#team-and-contributions)
- [Getting started](#getting-started)
- [Demo accounts](#demo-accounts)
- [Project structure](#project-structure)
- [Documentation](#documentation)
- [Known limitations](#known-limitations)
- [Tools and acknowledgements](#tools-and-acknowledgements)

## Project status

| Part | Description | Status |
|---|---|---|
| **Part 1** | Interactive frontend prototype (React and Tailwind CSS, mock data) | Done |
| **Part 2** | Backend and database (Node.js, Express, MySQL, JWT, bcrypt, REST API) | Done |
| **Part 3** | Connect frontend and backend, testing and deployment | In progress |

At the moment the frontend still uses mock data stored in the browser. Part 3 replaces it with the real API.

## Features

**Accounts and skills**
- Register and log in (bcrypt password hashing, JWT)
- Profile with skills to teach (with level) and skills to learn
- Explore users with search, category and level filters and sorting
- Mutual match algorithm with a match score

**Exchange**
- Swap requests: send, accept, decline and cancel
- Sessions (online or in person): schedule, complete and cancel
- Live session room: camera, microphone, screen sharing and recording
- Recordings library: play, download and delete
- Reviews and star ratings after completed sessions
- Notifications with unread count
- Dashboard with statistics and charts (Recharts)

**Projects and teamwork**
- Project showcase: create, edit, delete, like and comment
- Team members with roles
- Contribution tracker: hours logged by each member, percentage chart and activity timeline

## Technology stack

| Area | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Lucide React, Recharts |
| Backend | Node.js, Express.js, express-validator, multer |
| Database | MySQL (15 tables) |
| Authentication | JWT and bcrypt |
| Tools | Git and GitHub, VS Code, Thunder Client |

## Team and contributions

### Team

| Member | Student ID | GitHub |
|---|---|---|
| MD. Ahad Hossain | [232-35-406] | [@ahadhossain406-hub] |
| Zisan Ahmed | [232-35-007] | [@zisanX007] |

### Contribution by part

| Part | Work | Contributor | Status |
|---|---|---|---|
| **Planning** | Idea, feature plan, technology stack, folder structure | MD. Ahad Hossain and Zisan Ahmed | Done |
| **Part 1: Frontend** | All screens and features: landing, register and login, profile and skills, explore, matching, swap requests, sessions, live session room and recording, recordings, reviews, notifications, projects, team and contribution tracker, dashboard | MD. Ahad Hossain | Done |
| **Part 2a: Backend setup and database** | Express server setup, MySQL connection, database schema (15 tables), sample data with bcrypt hashing | MD. Ahad Hossain | Done |
| **Part 2b: REST API** | Authentication, users, skills, matching, swap requests, sessions, reviews, notifications, projects, team, contributions, recording upload, validation and error handling, API README | Zisan Ahmed | Done |
| **Documentation** | SRS, system design (use case, class, activity, sequence, state and ER diagrams), README, development journal | MD. Ahad Hossain and Zisan Ahmed | Done |
| **Part 3: Integration and deployment** | Connect the frontend to the API, real-time video, testing, deployment | MD. Ahad Hossain and Zisan Ahmed | In progress |

### Contribution summary

| Member | Overall contribution |
|---|---|
| MD. Ahad Hossain | [60] % |
| Zisan Ahmed | [40] % |

The commit history shows who did what: see **Insights → Contributors** on GitHub, or run `git shortlog -sn --all`.

### How we worked together

- One GitHub repository, two collaborators.
- The backend was written on separate branches (`backend-auth`, `backend-requests`, `backend-projects`). Each branch was merged into `main` with a pull request that was reviewed by the other member.
- Day-by-day work is recorded in [docs/JOURNAL.md](docs/JOURNAL.md) (also kept in Notion).

## Getting started

**You need:** Node.js 20 or later, MySQL 8 or later, Git.

### 1. Clone the repository

```bash
git clone https://github.com/ahadhossain406-hub/skill-swap
cd [repository]
```

### 2. Run the frontend

```bash
npm install
npm run dev
```

Open http://localhost:5173 (Google Chrome is recommended for the session room).

### 3. Run the backend

```bash
cd server
npm install
cp .env.example .env
```

On Windows PowerShell use `Copy-Item .env.example .env` instead of `cp`.

Open `server/.env` and set:

- `JWT_SECRET`: a long random string. You can create one with `node -p "require('crypto').randomBytes(48).toString('hex')"`
- `DB_ROOT_PASSWORD`: your MySQL root password. It is empty for Homebrew MySQL on macOS.

Then create the database with sample data and start the server:

```bash
npm run db:reset
npm run dev
```

The API runs on http://localhost:4000. Open http://localhost:4000/api/health to check it. The full API list is in [server/README.md](server/README.md).

## Demo accounts

All sample users use the password `password123`.

| Email | Notes |
|---|---|
| ayesha@skillswap.com | Teaches Photoshop and Illustrator. Wants to learn Web Development and Python. |
| tanvir@skillswap.com | Mutual match with Ayesha (75 %) |
| mehedi@skillswap.com | Mutual match with Ayesha (50 %) |
| nusrat@skillswap.com | English and IELTS teacher |

To reset the sample data of the backend, run `npm run db:reset` inside the `server` folder.

## Project structure

```text
skill-swap-react/
├── src/                  Frontend
│   ├── pages/            One file per screen
│   ├── components/       Reusable components (common, layout, sessions, projects, ...)
│   ├── context/          Auth, Skills, Requests, Sessions, Notifications, Toast
│   ├── services/         Data access layer (browser storage now, REST API in Part 3)
│   ├── hooks/            useUsers, useLocalMedia, useRecorder
│   ├── data/             Mock data
│   └── utils/            Matching algorithm, date helpers, constants
├── server/               Backend
│   ├── routes/           URL definitions
│   ├── controllers/      Read the request, send the response
│   ├── services/         Business rules and database queries
│   ├── validators/       Input rules
│   ├── middleware/       Authentication, validation, error handler
│   ├── database/         schema.sql, seed data
│   └── utils/            Helpers (errors, tokens, upload, transactions)
└── docs/                 SRS, system design, journal
```

## Documentation

| Document | Description |
|---|---|
| [docs/SRS.md](docs/SRS.md) | Software Requirements Specification: requirements, use case descriptions, business rules, traceability matrix |
| [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md) | Architecture, use case, class, ER, activity, sequence and state diagrams |
| [docs/JOURNAL.md](docs/JOURNAL.md) | Development journal: what each member did on each day |
| [server/README.md](server/README.md) | Backend setup and the list of API endpoints |

## Known limitations

- The frontend uses mock data until Part 3 connects it to the API.
- The session room shows the user's own camera, microphone and screen sharing and records them. Real-time video between the two people is added in Part 3 (Jitsi).
- Recordings are saved on the server disk. Free hosting plans can delete these files when the server restarts.
- The administrator role exists in the database, but no administrator features are included in this release.

## Tools and acknowledgements

- An AI assistant (Claude, by Anthropic) was used for guidance, code suggestions and drafts of the documents. The team ran, tested and reviewed the result.
- Libraries: React, Tailwind CSS, Lucide React, Recharts, Express, mysql2, bcrypt, jsonwebtoken, multer.


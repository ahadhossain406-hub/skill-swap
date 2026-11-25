# Development Journal

**Project:** SkillSwap – Community-Based Skill Exchange and Learning Platform
**Team:** MD. Ahad Hossain, Zisan Ahmed

This journal records what each team member did on each day. The same entries are kept in Notion. Evidence for each day (commits, pull requests and files) can be found in the Git history of this repository.

| Part | Dates | Main result |
|---|---|---|
| Planning | 17 Nov | Plan, technology stack, folder structure |
| Part 1: Frontend prototype | 17 to 22 Nov | Complete React interface with mock data |
| Part 2: Backend and database | 22 to 24 Nov | REST API and MySQL database |
| Documentation | 24 Nov | SRS, system design, README, journal |
| Part 3: Integration and deployment | From 25 Nov | In progress |

---

## Part 1: Frontend prototype

### Tuesday, 17 November 2026

**[MD. Ahad Hossain]**
- Discussed the project idea with the team and wrote the three-part plan: frontend prototype, backend and database, integration and deployment.
- Chose the technology stack, planned the folder structure and the feature list.
- Created the React project with Vite. Installed Tailwind CSS, React Router, Axios, Lucide React and Recharts.
- Created the folder structure and the first files: constants, the skill list, mock users and the browser-storage helper.

**Hours:** [2]

### Wednesday, 18 November 2026

**[MD. Ahad Hossain]**
- Built the landing page, the register and login pages with validation, protected routes and toast messages.
- Built the profile page: edit profile, add and remove skills to teach (with level) and skills to learn.
- Pushed the first version of the project to GitHub.

**Hours:** [3]

### Thursday, 19 November 2026

**[MD. Ahad Hossain]**
- Received feedback from the supervisor: add video sessions, session recordings, project sharing and contribution tracking. Updated the plan and the requirements.
- Built the Explore page (search, filters and sorting), the public profile page and the mutual match algorithm with a match score.
- Built swap requests: send, accept, decline and cancel, with a status filter and a pending badge.

**Hours:** [6]

### Friday, 20 November 2026

**[MD. Ahad Hossain]**
- Built session scheduling (online or in person) with upcoming, completed and cancelled lists.
- Built the live session room: camera, microphone, screen sharing and recording in the browser.
- Built the Recordings page: play, download and delete.

**Hours:** [5]

### Saturday, 21 November 2026

**[MD. Ahad Hossain]**
- Built the project showcase: create, edit, delete, like, comment, search and filters.
- Built project teams and the contribution tracker: hours per member, pie chart and activity timeline.
- Fixed a bug that made the whole app blank (an icon that no longer exists in the icon library).
- Started reviews, notifications and the dashboard.

**Hours:** [5]

### Sunday, 22 November 2026

**[MD. Ahad Hossain]**
- Finished reviews with star ratings, notifications with an unread count, the dashboard with two charts and the profile activity section. Fixed a missing file error. **Part 1 completed.**
- Installed MySQL on macOS.

**Hours:** [2]

---

## Part 2: Backend and database

### Sunday, 22 November 2026 (continued)

**[MD. Ahad Hossain]**
- Created the backend project: Express server, MySQL connection pool, environment settings and an error handler.
- Designed the database with 15 tables and wrote the schema file and the seed script (passwords hashed with bcrypt).
- Added a database setup script that works on both macOS and Windows.
- Added Zisan as a collaborator on GitHub.

**Hours:** [2]

### Monday, 23 November 2026

**Zisan Ahmed**
- Installed MySQL on Windows (reinstalled it after a root password problem), cloned the repository, set up the backend and created the database.
- Created the branch `backend-auth`. Built register and login (bcrypt and JWT), the authentication middleware, validation, and the users, skills and matching APIs. Tested every endpoint with Thunder Client.
- Opened the pull request for the authentication, users, skills and matching APIs.

**[MD. Ahad Hossain]**
- Reviewed and merged the pull request. Pulled the code and tested the API on macOS.

**Hours:** [4]

### Tuesday, 24 November 2026

**Zisan Ahmed**
- Branch `backend-requests`: built the notifications, swap requests, sessions and reviews APIs. Tested them and opened a pull request.
- Branch `backend-projects`: built the projects, comments, team members, contribution tracker and recording upload (multer) APIs, and the backend README. Opened a pull request.

**[MD. Ahad Hossain]**
- Reviewed and merged the pull requests and tested the API on macOS. **Part 2 completed.**
- Wrote the SRS and the system design document (use case, class, activity, sequence, state and ER diagrams).
- Wrote the project README with the contribution table and this journal.

**Hours:** [5]

---

## Part 3: Integration and deployment

### Wednesday, 25 November 2026

- Show the work in class (frontend prototype, backend API, documents).

### Planned

| Task | Who |
|---|---|
| Axios setup and token handling in the frontend | [Ahad] |
| Replace the mock data services with real API calls | [Ahad] |
| Upload recordings to the server | [Ahad] |
| Real-time video with Jitsi (JaaS) | [Ahad] and Zisan |
| Full testing and bug fixing | [Ahad] and Zisan |
| Environment variables and deployment (frontend, backend, database) | [Ahad] and Zisan |
| Add the live link to the README and update the documents | [Ahad] |

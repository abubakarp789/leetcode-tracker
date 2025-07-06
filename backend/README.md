# LeetCode Tracker Backend

This is the backend for the LeetCode Tracker project. It provides a REST API to manage and serve LeetCode problem data, storing all data in a GitHub repository (no database required).

## Features
- REST API for problems and solution uploads
- Stores all data in a GitHub repo (`problems.json` and `solutions/`)
- Simple admin authentication for adding problems

## Requirements
- Node.js 18+
- A GitHub Personal Access Token (PAT) with repo access
- A GitHub repository to store your data

## Environment Variables
Create a `.env` file in the `backend/` directory with the following:

```
GITHUB_TOKEN=your_github_pat
GITHUB_REPO=yourusername/leetcode-tracker
ADMIN_PASSWORD=your_strong_password
```

- `GITHUB_TOKEN`: GitHub Personal Access Token (keep this secret!)
- `GITHUB_REPO`: Format is `username/repo-name`
- `ADMIN_PASSWORD`: Password for accessing the `/api/add` route

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   npm start
   ```
   The server runs on port 4000 by default.

## API Endpoints
- `GET /api/problems` — Get all problems
- `POST /api/add` — Add a new problem (admin only, requires basic auth and file upload)

## Deployment
- Deploy to Render, Railway, or any Node hosting
- Set environment variables in your hosting dashboard (do not commit `.env`)

## Security
- Never commit your `.env` file or GitHub token
- Only share the `/add` password with trusted users

---

For the full project (frontend + backend), see the main repo. 
# Expense Tracker Backend (Node.js + Express + Sequelize + MySQL)

Plain backend project — no React. Signup/login are simple HTML pages served
directly by Express, talking to the API with `fetch`.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your MySQL credentials:
   ```
   cp .env.example .env
   ```
   Make sure the database named in `DB_NAME` already exists in MySQL
   (create it once with `CREATE DATABASE expense_tracker;` in MySQL, Sequelize
   will create the tables for you on first run).

3. Start the server:
   ```
   npm start
   ```
   or with auto-restart during development:
   ```
   npm run dev
   ```

4. Open in the browser:
   - Signup: http://localhost:5000/signup.html
   - Login:  http://localhost:5000/login.html
   - Dashboard (after login): http://localhost:5000/dashboard.html

## How auth works

- Passwords are hashed with `bcryptjs` before being saved — the plain
  password is never stored.
- On signup/login, the server returns a JWT. The HTML pages save it in
  `localStorage` and send it as `Authorization: Bearer <token>` on every
  request to the expense endpoints.
- `middleware/authMiddleware.js` verifies the token and protects all
  `/api/expenses` routes.

## API

| Method | Route              | Auth required | Description         |
|--------|--------------------|----------------|----------------------|
| POST   | /api/auth/signup   | No             | Create account       |
| POST   | /api/auth/login    | No             | Login, get token     |
| GET    | /api/expenses       | Yes            | List your expenses   |
| POST   | /api/expenses       | Yes            | Add an expense       |
| PUT    | /api/expenses/:id   | Yes            | Update an expense    |
| DELETE | /api/expenses/:id   | Yes            | Delete an expense    |

## Project structure

```
expense-tracker-backend/
├── config/db.js              Sequelize + MySQL connection
├── models/User.js            User model
├── models/Expense.js         Expense model (belongs to User)
├── controllers/              signup/login + expense CRUD logic
├── middleware/authMiddleware.js   JWT verification
├── routes/                   authRoutes.js, expenseRoutes.js
├── public/                   signup.html, login.html, dashboard.html, style.css
├── server.js                 app entry point
└── .env.example
```

# Practical 7: Authentication and Middleware Pipeline

**Course:** ITUE301 – Advanced Web Development Frameworks  
**Department:** CSPIT - Information Technology | Semester: 5th  
**University:** CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY  
**Student ID / Roll No:** D25DIT090  
**GitHub Repository:** [https://github.com/Bhumi3009/D25DIT090_ITUE301_AWDF](https://github.com/Bhumi3009/D25DIT090_ITUE301_AWDF)

---

## 🎯 Practical Objective
To implement JWT-based authentication and input validation as part of the Express middleware pipeline, securing a full-stack Task Management application.

---

## 🏗️ Architecture & Request Flow

```
POST /auth/register ──► Validate Input ──► Hash Password (bcryptjs) ──► Save User ──► 201 Created (Token)
POST /auth/login    ──► Validate Input ──► Compare Password (bcryptjs) ──► Sign JWT ──► 200 OK (Token)

Protected Route Flow (e.g., GET /tasks, POST /tasks):
Client Request [Authorization: Bearer <token>]
       │
       ▼
[Logging Middleware] (Logs Method, URL, Timestamp)
       │
       ▼
[Content-Type Middleware] (Rejects non-JSON write requests)
       │
       ▼
[Auth Middleware] (Verifies JWT via jwt.verify, extracts user ID -> req.user)
       │
       ▼
[Validation Middleware] (Validates required fields before reaching DB)
       │
       ▼
Task Controller (CRUD operations bound to req.user.id)
       │
       ▼
[Global Error Handler] (Catches unhandled errors, returns structured JSON)
```

---

## 🚀 Features Implemented

1. **Secure Password Hashing:**
   - Passwords are salted and hashed using `bcryptjs` (salt rounds: 10) before saving to MongoDB.
   - Plain passwords are never persisted in the database.

2. **JWT Authentication:**
   - JSON Web Tokens are signed upon successful login/register using a secret stored in `.env`.
   - Token payload includes `{ id, email, name }` with a 1-hour expiration (`1h`).

3. **Authentication Middleware (`middleware/auth.js`):**
   - Intercepts requests on protected endpoints (`/tasks`, `/auth/me`).
   - Extracts and verifies token from `Authorization: Bearer <token>`.
   - Returns structured `401 Unauthorized` if token is missing, expired, or invalid.

4. **Input Validation Middleware (`middleware/validate.js`):**
   - Pre-controller middleware enforcing:
     * Full name required on registration.
     * Valid email regex format.
     * Minimum 6 characters for password.
     * Task title required and non-empty.
     * Task priority restricted to enum `['low', 'medium', 'high']`.

5. **Supplementary Problems Solved:**
   - **Supplementary 1 (`/auth/me`):** Protected endpoint returning current user details (excluding password) from the verified JWT.
   - **Supplementary 2 (Token Expiry Handling):** Frontend intercepts `401 Unauthorized` responses, auto-clears expired credentials, and redirects user to the Login page with a notice.
   - **Supplementary 3 (Logout Mechanism):** User profile header in Navbar with one-click Logout that clears `localStorage` and resets authenticated state.

---

## 📦 Project Setup and Execution

### 1. Prerequisites
- Node.js (v18+) and npm
- MongoDB running locally on `mongodb://localhost:27017` or MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🧪 Postman / cURL API Testing Guide

### 1. Register User
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bhumi","email":"bhumi@example.com","password":"password123"}'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bhumi@example.com","password":"password123"}'
```

### 3. Access Protected Tasks (with Token)
```bash
curl -X GET http://localhost:5000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 4. Create Task (Protected & Validated)
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete Practical 7","description":"Implemented JWT and middleware","priority":"high"}'
```

### 5. Verify Supplementary /me Endpoint
```bash
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 📋 Evaluation Rubrics Alignment (20 Marks)
| Criteria | Target | Implementation |
|---|---|---|
| **User Registration (3 marks)** | Accepts name, email, password; hashed with bcrypt before saving | `User.js`, `routes/auth.js`, bcryptjs salt rounds 10 |
| **JWT Login Flow (5 marks)** | Validates credentials, returns signed JWT with expiry | `routes/auth.js`, 1h expiry, tested & verified |
| **Auth Middleware (5 marks)** | Rejects invalid/missing tokens with 401; grants access on valid token | `middleware/auth.js`, `Bearer <token>` handling |
| **Input Validation (4 marks)** | At least 3 rules enforced; returns descriptive JSON | `middleware/validate.js` (name, email regex, min pass length, task title) |
| **Error Response Structure (3 marks)** | Consistent JSON with status codes; no stack traces exposed | Global error handler in `server.js` |
